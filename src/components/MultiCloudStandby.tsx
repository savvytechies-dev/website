import { DiagramSvg, Node, Cylinder, Connector, ConnLabel, tokens } from "./diagram/primitives";

const AWS = "#ff9900";
const AZURE = "#0078d4";
const GCP = "#ea4335";

function Region({ x, y, w, h, color, label, dashed = false }: { x: number; y: number; w: number; h: number; color: string; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#ffffff" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "7,5" : "7,5"} />
      <circle cx={x + 20} cy={y + 22} r="4" fill={color} />
      <text x={x + 32} y={y + 26} fontSize="12.5" fontWeight="700" fill={color} style={{ letterSpacing: "0.04em" }}>{label}</text>
    </g>
  );
}

export default function MultiCloudStandby() {
  return (
    <DiagramSvg title="Multi-cloud — premium options" viewBox="0 0 1200 720">
      <text x={600} y={62} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={tokens.fam.edge.ink}>
        Option A — cross-cloud warm standby (active-passive)
      </text>

      <Node x={440} y={76} w={320} h={50} fam="neutral" icon="globe" title="Route 53 — health-check failover" subtitle="latency routing · 60s TTL · promote standby on region loss" center />
      <Connector d="M520,126 L520,150 L300,150 L300,182" />
      <Connector d="M680,126 L680,150 L900,150 L900,182" dashed />

      {/* AWS — active */}
      <Region x={60} y={182} w={440} h={210} color={AWS} label="AWS · US-EAST-1 (ACTIVE)" />
      <Node x={90} y={222} w={380} h={44} fam="compute" icon="fargate" title="Keycloak (Fargate) — serving traffic" center />
      <Cylinder cx={280} cy={335} rx={175} fam="data" title="Aurora PostgreSQL — PRIMARY" subtitle="logical-replication PUBLICATION" />

      {/* Azure — warm standby */}
      <Region x={700} y={182} w={440} h={210} color={AZURE} label="AZURE · EAST US (WARM STANDBY)" dashed />
      <Node x={730} y={222} w={380} h={44} fam="neutral" icon="container" title="Keycloak (standby → promoted on failover)" center />
      <Cylinder cx={920} cy={335} rx={175} fam="data" title="Azure DB for PostgreSQL — SUBSCRIBER" subtitle="warm standby" />

      {/* Replication */}
      <Connector d="M472,300 L728,300" />
      <ConnLabel x={600} y={300} text="logical replication" />
      <text x={600} y={330} textAnchor="middle" fontSize="10" fill={tokens.muted}>over VPN / interconnect (or AWS DMS)</text>

      {/* Caption */}
      <rect x={120} y={410} width={960} height={60} rx="10" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1.25" />
      <text x={600} y={433} textAnchor="middle" fontSize="11.5" fill="#92400e">Native physical log shipping is impossible — Aurora's log-structured storage doesn't expose WAL.</text>
      <text x={600} y={455} textAnchor="middle" fontSize="11.5" fontWeight="700" fill="#92400e">Active-passive: RTO = standby promotion + replication catch-up · RPO = replication lag</text>

      {/* Option B */}
      <text x={600} y={512} textAnchor="middle" fontSize="13.5" fontWeight="700" fill={tokens.fam.serverless.ink}>
        Option B — YugabyteDB geo-distributed (active-active)
      </text>
      <rect x={180} y={526} width={840} height={128} rx="12" fill={tokens.fam.serverless.tint} stroke={tokens.fam.serverless.line} strokeWidth="1.25" />
      {[{ c: "AWS", col: AWS }, { c: "Azure", col: AZURE }, { c: "GCP", col: GCP }].map((cl, i) => (
        <g key={cl.c}>
          <rect x={220 + i * 260} y={548} width={220} height={42} rx="8" fill="#ffffff" stroke={tokens.fam.compute.line} strokeWidth="1.5" />
          <circle cx={240 + i * 260} cy={569} r="4" fill={cl.col} />
          <text x={330 + i * 260} y={573} textAnchor="middle" fontSize="12" fontWeight="600" fill={tokens.ink}>Keycloak — {cl.c}</text>
        </g>
      ))}
      <text x={600} y={618} textAnchor="middle" fontSize="11" fill={tokens.fam.serverless.ink}>one YugabyteDB cluster (Raft) spans clouds · no failover gap → the tier that backs 99.99%</text>
      <text x={600} y={638} textAnchor="middle" fontSize="10" fill={tokens.muted}>tradeoffs: gated DB migrations · cross-cloud egress cost · heavier ops · cell tagged capabilities:["multi-cloud"]</text>
    </DiagramSvg>
  );
}
