import { DiagramSvg, Lane, Node, Cylinder, Connector, ConnLabel, tokens } from "./diagram/primitives";

export default function DefaultArchitecture() {
  const control = [
    { title: "Provisioning API", icon: "api" as const },
    { title: "Billing / metering (Stripe)", icon: "billing" as const },
    { title: "AI-config service (Bedrock)", icon: "ai" as const },
    { title: "Analytics — Firehose → S3 → Athena", icon: "analytics" as const },
    { title: "Notifications (SES / SNS)", icon: "mail" as const },
    { title: "STS token-broker", icon: "token" as const },
    { title: "Tenant registry + placement", icon: "registry" as const },
  ];

  return (
    <DiagramSvg title="Default deployment — single region, multi-AZ" viewBox="0 0 1200 760">
      {/* Legend */}
      <g fontSize="11" fill={tokens.muted}>
        <circle cx="405" cy="56" r="4" fill={tokens.fam.compute.line} /><text x="415" y="60">Data plane</text>
        <circle cx="520" cy="56" r="4" fill={tokens.fam.serverless.line} /><text x="530" y="60">Control plane</text>
        <circle cx="655" cy="56" r="4" fill={tokens.fam.data.line} /><text x="665" y="60">Database</text>
      </g>

      {/* Ingress column */}
      <Node x={490} y={76} w={220} h={46} fam="neutral" icon="users" title="Users / SPAs / APIs" center />
      <Connector d="M600,122 L600,148" />
      <Node x={430} y={150} w={340} h={56} fam="edge" icon="cloudfront" title="CloudFront (edge)" subtitle="TLS · WAF / Shield · caches /resources/*" center />
      <Connector d="M600,206 L600,224 L360,224 L360,300" />

      {/* DATA PLANE region */}
      <Lane x="40" y="244" w="700" h="384" fam="compute" region />
      <g>
        <circle cx="60" cy="266" r="4" fill={tokens.fam.compute.line} />
        <text x="72" y="270" fontSize="12" fontWeight="700" fill={tokens.fam.compute.ink} style={{ letterSpacing: "0.06em" }}>DATA PLANE</text>
        <text x="164" y="270" fontSize="11" fill={tokens.muted}>· AWS us-east-1 · Fargate (Keycloak / Quarkus, autoscaled)</text>
      </g>

      <Node x={240} y={300} w={240} h={48} fam="edge" icon="alb" title="Regional ALB (L7)" center />
      <Connector d="M360,348 L360,362 L224,362 L224,392" />
      <Connector d="M360,348 L360,362 L556,362 L556,392" />

      {/* AZ sub-lanes */}
      <rect x="58" y="372" width="326" height="118" rx="9" fill="#ffffff" stroke={tokens.hair} strokeDasharray="4,3" />
      <text x="221" y="388" textAnchor="middle" fontSize="10.5" fill={tokens.muted}>Availability Zone 1</text>
      <rect x="396" y="372" width="326" height="118" rx="9" fill="#ffffff" stroke={tokens.hair} strokeDasharray="4,3" />
      <text x="559" y="388" textAnchor="middle" fontSize="10.5" fill={tokens.muted}>Availability Zone 2</text>

      {[{ x: 72, l: "KC task 1" }, { x: 222, l: "KC task 2" }, { x: 410, l: "KC task 3" }, { x: 560, l: "KC task n" }].map((t) => (
        <Node key={t.l} x={t.x} y={398} w={142} h={48} fam="compute" icon="fargate" title={t.l} />
      ))}

      <text x="390" y="478" textAnchor="middle" fontSize="10.5" fontWeight="600" fill={tokens.fam.compute.ink}>
        ◄── clustered via JDBC_PING · embedded Infinispan (in-region) ──►
      </text>

      {/* Aurora */}
      <Connector d="M390,490 L390,528" />
      <Cylinder cx={390} cy={558} rx={200} fam="data" title="Aurora PostgreSQL — Multi-AZ" subtitle="primary + synchronous replica · source of truth" />

      {/* CONTROL PLANE */}
      <Lane x="760" y="244" w="400" h="384" fam="serverless" />
      <g>
        <circle cx="780" cy="266" r="4" fill={tokens.fam.serverless.line} />
        <text x="792" y="270" fontSize="12" fontWeight="700" fill={tokens.fam.serverless.ink} style={{ letterSpacing: "0.06em" }}>CONTROL PLANE</text>
        <text x="912" y="270" fontSize="11" fill={tokens.muted}>· serverless (Lambda)</text>
      </g>
      {control.map((c, i) => (
        <Node key={c.title} x={780} y={294 + i * 46} w={360} h={40} fam="serverless" icon={c.icon} title={c.title} />
      ))}

      {/* Admin REST — control plane drives Keycloak */}
      <Connector d="M780,320 C620,326 540,320 482,318" dashed accent />
      <ConnLabel x="628" y="306" text="Admin REST API" accent />

      {/* SLA / scaling strip */}
      <Lane x="120" y="648" w="960" h="98" fam="neutral" />
      <text x="600" y="676" textAnchor="middle" fontSize="13" fontWeight="700" fill={tokens.body}>Scales two ways · availability by tier</text>
      <text x="330" y="702" textAnchor="middle" fontSize="11.5" fill={tokens.body}>Many tenants → add cells</text>
      <text x="330" y="719" textAnchor="middle" fontSize="10.5" fill={tokens.muted}>(cell = Fargate + DB + cache, N realms)</text>
      <text x="870" y="702" textAnchor="middle" fontSize="11.5" fill={tokens.body}>One huge realm → dedicated Fargate</text>
      <text x="870" y="719" textAnchor="middle" fontSize="10.5" fill={tokens.muted}>sized by login rate (~1 vCPU / 15 logins/s)</text>
      <text x="600" y="736" textAnchor="middle" fontSize="10.5" fill={tokens.muted}>99.9% single-region · 99.95% multi-region active-passive · 99.99% active-active multi-cloud (backed after production maturity)</text>
    </DiagramSvg>
  );
}
