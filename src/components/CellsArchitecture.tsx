import { DiagramSvg, Lane, Node, Connector, tokens, type Fam } from "./diagram/primitives";

function TierCard({ x, fam, title, bullets, note }: { x: number; fam: Fam; title: string; bullets: string[]; note: string }) {
  const c = tokens.fam[fam];
  const w = 310;
  return (
    <g filter="url(#dg-shadow)">
      <rect x={x} y={468} width={w} height={214} rx="10" fill="#ffffff" stroke={c.line} strokeWidth="1.5" />
      <path d={`M ${x} 478 a10 10 0 0 1 10 -10 h ${w - 20} a10 10 0 0 1 10 10 v 24 h -${w} Z`} fill={c.tint} />
      <text x={x + w / 2} y={491} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ink}>{title}</text>
      {bullets.map((b, j) => (
        <g key={b}>
          <circle cx={x + 24} cy={534 + j * 32} r="2.5" fill={c.line} />
          <text x={x + 36} y={538 + j * 32} fontSize="11.5" fill={tokens.body}>{b}</text>
        </g>
      ))}
      <text x={x + w / 2} y={662} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={tokens.muted}>{note}</text>
    </g>
  );
}

export default function CellsArchitecture() {
  const cells = [{ x: 48, t: "Pooled cell A" }, { x: 424, t: "Pooled cell B" }];
  return (
    <DiagramSvg title="Cell-based multi-tenancy" viewBox="0 0 1200 720">
      {/* Edge + control */}
      <Node x={380} y={62} w={440} h={52} fam="edge" icon="cloudfront" title="CloudFront + edge router" subtitle="resolve tenant → cell (host / path / custom domain)" center />
      <Node x={352} y={128} w={236} h={46} fam="serverless" icon="registry" title="Tenant registry" center />
      <Node x={612} y={128} w={236} h={46} fam="serverless" icon="api" title="Placement engine" center />

      <Connector d="M540,174 L540,196 L223,196 L223,232" />
      <Connector d="M600,174 L600,232" />
      <Connector d="M660,174 L660,196 L976,196 L976,232" />

      {/* Pooled cells */}
      {cells.map((c) => (
        <g key={c.t}>
          <Lane x={c.x} y={232} w={350} h={172} fam="compute" label={c.t} />
          <text x={c.x + 175} y={256} textAnchor="middle" fontSize="10.5" fill={tokens.muted}>up to N realms</text>
          <Node x={c.x + 20} y={272} w={310} h={44} fam="compute" icon="container" title="Keycloak cluster" subtitle="Fargate · multi-AZ" />
          <Node x={c.x + 20} y={326} w={148} h={48} fam="data" icon="aurora" title="Aurora" subtitle="cell database" />
          <Node x={c.x + 182} y={326} w={148} h={48} fam="serverless" icon="container" title="Infinispan" subtitle="in-region cache" />
        </g>
      ))}

      {/* Dedicated silo */}
      <Lane x={800} y={232} w={352} h={172} fam="neutral" label="Dedicated silo · Enterprise" />
      <Node x={820} y={272} w={312} h={44} fam="neutral" icon="fargate" title="Tenant's own Keycloak + own DB" />
      <text x={976} y={344} textAnchor="middle" fontSize="11" fill={tokens.body}>strongest isolation · own keys / upgrades</text>
      <text x={976} y={366} textAnchor="middle" fontSize="11" fill={tokens.body}>optional multi-cloud (Yugabyte) cell</text>

      {/* Isolation tiers */}
      <Lane x={90} y={420} w={1020} h={284} fam="neutral" />
      <text x={600} y={448} textAnchor="middle" fontSize="14" fontWeight="700" fill={tokens.body}>Three isolation tiers — used together, not either/or</text>
      <TierCard x={120} fam="edge" title="Organizations" bullets={["Org inside a shared realm", "Highest density", "Many small B2B tenants"]} note="density ▲ · isolation ▽" />
      <TierCard x={445} fam="serverless" title="Realm-per-tenant (pooled)" bullets={["A realm on a shared cluster", "Strong isolation, own keys", "The standard tier"]} note="balanced" />
      <TierCard x={770} fam="data" title="Instance-per-tenant (silo)" bullets={["Dedicated Keycloak + DB", "Strongest isolation", "Enterprise / regulated"]} note="density ▽ · isolation ▲" />
    </DiagramSvg>
  );
}
