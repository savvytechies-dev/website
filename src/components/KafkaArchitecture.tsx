import { DiagramSvg, Lane, Node, Connector, IconChip, tokens } from "./diagram/primitives";

// Partition markers encode data (leader vs. in-sync replica), so they keep a
// distinct pair of hues from the service-family palette.
const PART = {
  leader: { fill: "#fef3c7", line: "#f59e0b", ink: "#92400e" },
  replica: { fill: "#fee2e2", line: "#dc2626", ink: "#991b1b" },
} as const;

function PartChip({ x, y, label, leader }: { x: number; y: number; label: string; leader: boolean }) {
  const c = leader ? PART.leader : PART.replica;
  return (
    <g>
      <rect x={x} y={y} width={48} height={20} rx={6} fill={c.fill} stroke={c.line} strokeWidth={1} />
      <text x={x + 24} y={y + 14} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={c.ink}>{label}</text>
    </g>
  );
}

function Broker({ x, y, name, az, parts }: { x: number; y: number; name: string; az: string; parts: [string, string] }) {
  const c = tokens.fam.compute;
  const w = 118, h = 114;
  return (
    <g filter="url(#dg-shadow)">
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#ffffff" stroke={c.line} strokeWidth={1.5} />
      <IconChip x={x + 10} y={y + 10} fam="compute" name="container" />
      <text x={x + 46} y={y + 22} fontSize={11} fontWeight={700} fill={c.ink}>{name}</text>
      <text x={x + 46} y={y + 35} fontSize={8.5} fill={tokens.muted}>{az}</text>
      <PartChip x={x + 8} y={y + 50} label={parts[0]} leader={true} />
      <PartChip x={x + 62} y={y + 50} label={parts[1]} leader={false} />
      <text x={x + w / 2} y={y + 96} textAnchor="middle" fontSize={9} fill={tokens.muted}>ISR 3/3 · leader + replica</text>
    </g>
  );
}

export default function KafkaArchitecture() {
  const producers = [
    { title: "App services", subtitle: "transactional events", icon: "container" as const },
    { title: "CDC connectors", subtitle: "database changes", icon: "stream" as const },
    { title: "IoT / telemetry", subtitle: "device streams", icon: "globe" as const },
    { title: "Log collectors", subtitle: "app & infra logs", icon: "analytics" as const },
  ];

  const brokers = [
    { name: "Broker 1", az: "AZ 1 · Fargate", parts: ["P0", "R2"] as [string, string] },
    { name: "Broker 2", az: "AZ 2 · Fargate", parts: ["P1", "R0"] as [string, string] },
    { name: "Broker 3", az: "AZ 3 · Fargate", parts: ["P2", "R1"] as [string, string] },
  ];

  const consumers = [
    { title: "Analytics", subtitle: "dashboards · reporting", icon: "analytics" as const },
    { title: "Data lake (S3)", subtitle: "archival · batch", icon: "s3" as const },
    { title: "Microservices", subtitle: "event-driven · async", icon: "container" as const },
  ];

  return (
    <DiagramSvg title="Managed Kafka — on our roadmap" viewBox="0 0 1200 720">
      {/* ROADMAP badge near the title */}
      <g>
        <rect x={800} y={22} width={166} height={22} rx={11} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1} />
        <text x={883} y={37} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#92400e" style={{ letterSpacing: "0.04em" }}>
          ROADMAP · NOT YET GA
        </text>
      </g>

      {/* Legend */}
      <g fontSize={11} fill={tokens.muted}>
        <rect x={392} y={54} width={26} height={14} rx={5} fill={PART.leader.fill} stroke={PART.leader.line} />
        <text x={424} y={64}>Partition leader</text>
        <rect x={556} y={54} width={26} height={14} rx={5} fill={PART.replica.fill} stroke={PART.replica.line} />
        <text x={588} y={64}>In-sync replica</text>
      </g>

      {/* PRODUCERS */}
      <Lane x={40} y={84} w={210} h={296} fam="neutral" label="Producers" />
      {producers.map((p, i) => (
        <Node key={p.title} x={56} y={122 + i * 64} w={178} h={54} fam="neutral" icon={p.icon} title={p.title} subtitle={p.subtitle} />
      ))}
      {/* Producers -> cluster */}
      {[149, 213, 277, 341].map((cy) => (
        <Connector key={cy} d={`M250,${cy} L280,${cy}`} />
      ))}

      {/* AWS REGION — MULTI-AZ (orange dashed region look) */}
      <Lane x={280} y={84} w={560} h={296} fam="edge" label="AWS Region · Multi-AZ" region />
      {brokers.map((b, i) => (
        <Broker key={b.name} x={339 + i * 162} y={140} name={b.name} az={b.az} parts={b.parts} />
      ))}
      <Node x={339} y={266} w={442} h={42} fam="data" icon="registry" title="KRaft / ZooKeeper — metadata" subtitle="controller quorum · topic & partition state" />
      <text x={560} y={338} textAnchor="middle" fontSize={10.5} fontWeight={600} fill={tokens.fam.compute.ink}>
        brokers on Fargate · replicated partitions · in-sync replicas
      </text>

      {/* Cluster -> consumers */}
      {[152, 218, 284].map((cy) => (
        <Connector key={cy} d={`M840,${cy} L870,${cy}`} />
      ))}

      {/* CONSUMER GROUPS */}
      <Lane x={870} y={84} w={290} h={296} fam="neutral" label="Consumer groups" />
      {consumers.map((c, i) => (
        <Node key={c.title} x={886} y={126 + i * 70} w={258} h={56} fam="neutral" icon={c.icon} title={c.title} subtitle={c.subtitle} />
      ))}

      {/* OPTIONAL ADJUNCTS — serverless */}
      <Node x={290} y={402} w={262} h={64} fam="serverless" icon="registry" title="Schema Registry" subtitle="Avro / Protobuf · compatibility checks" />
      <Node x={568} y={402} w={262} h={64} fam="serverless" icon="stream" title="Kafka Connect" subtitle="source / sink connectors" />
      <Connector d="M421,402 L421,382" dashed accent />
      <Connector d="M699,402 L699,382" dashed accent />

      {/* MANAGED-BY STRIP — control plane */}
      <Lane x={40} y={498} w={1120} h={74} fam="serverless" />
      <text x={600} y={528} textAnchor="middle" fontSize={13.5} fontWeight={700} fill={tokens.fam.serverless.ink}>
        Managed by the SavvyTechies control plane
      </text>
      <text x={600} y={551} textAnchor="middle" fontSize={11.5} fill={tokens.body}>
        provisioning · metrics · lag-based autoscaling · backups
      </text>

      {/* Honest tiering caption */}
      <text x={600} y={614} textAnchor="middle" fontSize={12} fontWeight={700} fill={tokens.body}>
        Default: single-region multi-AZ. Premium: cross-region / cross-cloud active-passive replication via MirrorMaker 2.
      </text>
      <text x={600} y={636} textAnchor="middle" fontSize={10.5} fill={tokens.muted}>
        Planned to run on ECS Fargate — the same footprint as our managed Keycloak today. Data stays single-region unless you enable cross-cloud standby.
      </text>
      <text x={600} y={657} textAnchor="middle" fontSize={10} fill={tokens.muted}>
        Not yet generally available — shown to illustrate the target architecture, not a shipped product.
      </text>
    </DiagramSvg>
  );
}
