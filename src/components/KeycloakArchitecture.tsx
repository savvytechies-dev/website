import { DiagramSvg, Node, Cylinder, Connector, ConnLabel, tokens } from "./diagram/primitives";

const AWS = "#ff9900";
const STANDBY = "#0078d4"; // Azure / GCP passive target

function Region({ x, y, w, h, color, label, dashed = false }: { x: number; y: number; w: number; h: number; color: string; label: string; dashed?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="12" fill="#ffffff" stroke={color} strokeWidth="2" strokeDasharray="7,5" opacity={dashed ? 0.95 : 1} />
      <circle cx={x + 20} cy={y + 22} r="4" fill={color} />
      <text x={x + 32} y={y + 26} fontSize="12" fontWeight="700" fill={color} style={{ letterSpacing: "0.04em" }}>{label}</text>
    </g>
  );
}

export default function KeycloakArchitecture() {
  return (
    <DiagramSvg title="Managed Keycloak — HA & optional multi-cloud standby" viewBox="0 0 1200 620">
      {/* Ingress + failover */}
      <Node x={150} y={70} w={150} h={48} fam="neutral" icon="users" title="Users / apps" center />
      <Connector d="M300,94 L468,94" />
      <Node x={470} y={66} w={260} h={56} fam="edge" icon="globe" title="Route 53 — failover" subtitle="health-check · promote standby" center />
      <Connector d="M540,122 L540,140 L350,140 L350,168" />
      <Connector d="M660,122 L660,140 L920,140 L920,168" dashed />

      {/* AWS — ACTIVE */}
      <Region x={40} y={150} w={620} h={320} color={AWS} label="AWS · US-EAST-1 (ACTIVE)" />
      <Node x={250} y={172} w={200} h={42} fam="edge" icon="alb" title="Regional ALB (L7)" center />
      {[{ x: 60, z: "Availability Zone 1", n: [74, 214] }, { x: 358, z: "Availability Zone 2", n: [372, 512] }].map((az) => (
        <g key={az.z}>
          <rect x={az.x} y={230} width={292} height={104} rx="9" fill="#ffffff" stroke={tokens.hair} strokeDasharray="4,3" />
          <text x={az.x + 146} y={246} textAnchor="middle" fontSize="10" fill={tokens.muted}>{az.z}</text>
          {az.n.map((nx) => (
            <Node key={nx} x={nx} y={258} w={132} h={50} fam="compute" icon="container" title="Keycloak" subtitle="Quarkus · JVM" />
          ))}
        </g>
      ))}
      <text x={350} y={356} textAnchor="middle" fontSize="10" fontWeight="600" fill={tokens.fam.compute.ink}>◄ clustered · JDBC_PING · Infinispan cache ►</text>
      <Connector d="M350,366 L350,388" />
      <Cylinder cx={350} cy={420} rx={290} fam="data" title="Aurora PostgreSQL — PRIMARY" subtitle="Multi-AZ · logical-replication PUBLICATION" />

      {/* Standby — PASSIVE (Azure / GCP) */}
      <Region x={700} y={150} w={460} h={320} color={STANDBY} label="AZURE / GCP · WARM STANDBY (PASSIVE)" dashed />
      <Node x={730} y={210} w={400} h={44} fam="neutral" icon="container" title="Keycloak — standby (promoted on failover)" center />
      <text x={930} y={300} textAnchor="middle" fontSize="10.5" fill={tokens.muted}>same theme · same realms · idle until failover</text>
      <Cylinder cx={930} cy={420} rx={195} fam="data" title="Managed PostgreSQL — SUBSCRIBER" subtitle="warm standby" />

      {/* Logical replication AWS → standby */}
      <Connector d="M642,420 L726,420" />
      <ConnLabel x={684} y={402} text="logical replication" />
      <text x={684} y={440} textAnchor="middle" fontSize="9.5" fill={tokens.muted}>active → passive</text>

      {/* Honest tiering caption */}
      <text x={600} y={512} textAnchor="middle" fontSize="12" fontWeight="700" fill={tokens.body}>
        Default: single-region multi-AZ (99.9%) · Premium: cross-cloud active-passive warm standby (99.95%)
      </text>
      <text x={600} y={533} textAnchor="middle" fontSize="10.5" fill={tokens.muted}>
        Runs on ECS Fargate + Aurora + Infinispan. Data stays single-region unless you enable a cross-cloud standby.
      </text>
      <text x={600} y={555} textAnchor="middle" fontSize="10" fill={tokens.muted}>
        RTO = standby promotion + replication catch-up · RPO = replication lag · active-active (YugabyteDB) available as the 99.99% tier
      </text>
    </DiagramSvg>
  );
}
