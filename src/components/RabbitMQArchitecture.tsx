import { DiagramSvg, Lane, Node, Connector, ConnLabel, tokens } from "./diagram/primitives";

// Honest, roadmap-framed picture of how we *would* run managed RabbitMQ —
// consistent with how we already run managed Keycloak: ECS Fargate, multi-AZ,
// single-region by default, cross-cloud as a premium active-passive option.
// No AI-autonomous ops. Clearly badged as ROADMAP / not yet GA.
export default function RabbitMQArchitecture() {
  const rowY = [196, 278, 360]; // shared top-Ys (h=64) → centers 228 / 310 / 392

  const producers = [
    { title: "Microservices", subtitle: "publish domain events", icon: "container" as const },
    { title: "API gateway", subtitle: "REST / GraphQL", icon: "api" as const },
    { title: "Web / app events", subtitle: "frontend telemetry", icon: "globe" as const },
  ];
  const brokers = [
    { title: "Broker 1", subtitle: "us-east-1a · Fargate" },
    { title: "Broker 2", subtitle: "us-east-1b · Fargate" },
    { title: "Broker 3", subtitle: "us-east-1c · Fargate" },
  ];
  const queues = [
    { title: "orders", subtitle: "quorum queue" },
    { title: "payments", subtitle: "quorum queue" },
    { title: "notifications", subtitle: "quorum queue" },
  ];
  const consumers = [
    { title: "Order processor", subtitle: "consumes orders", icon: "fargate" as const },
    { title: "Payment handler", subtitle: "consumes payments", icon: "billing" as const },
    { title: "Notification sender", subtitle: "consumes notifications", icon: "mail" as const },
  ];

  return (
    <DiagramSvg title="Managed RabbitMQ — on our roadmap" viewBox="0 0 1200 780">
      {/* ROADMAP badge pill (amber) */}
      <g>
        <rect x={506} y={48} width={188} height={22} rx={11} fill="#fffbeb" stroke="#f59e0b" strokeWidth={1.25} />
        <text x={600} y={63} textAnchor="middle" fontSize={11} fontWeight={700} fill="#92400e" style={{ letterSpacing: "0.08em" }}>
          ROADMAP · NOT YET GA
        </text>
      </g>

      {/* Producers lane (neutral) */}
      <Lane x={40} y={96} w={250} h={410} fam="neutral" label="Producers" />
      {producers.map((p, i) => (
        <Node key={p.title} x={60} y={rowY[i]} w={210} h={64} fam="neutral" icon={p.icon} title={p.title} subtitle={p.subtitle} />
      ))}

      {/* Producers → exchange (publish) */}
      <Connector d="M270,228 L336,288" />
      <Connector d="M270,310 L336,310" />
      <Connector d="M270,392 L336,332" />

      {/* AWS region (orange dashed) — multi-AZ Fargate cluster */}
      <Lane x={320} y={96} w={560} h={410} fam="neutral" region />
      <circle cx={340} cy={120} r={4} fill="#f59e0b" />
      <text x={352} y={124} fontSize={12} fontWeight={700} fill="#b45309" style={{ letterSpacing: "0.06em" }}>
        AWS REGION · MULTI-AZ
      </text>

      {/* Exchange (storage) */}
      <Node x={336} y={272} w={132} h={76} fam="storage" icon="stream" title="Exchange" subtitle="topic routing" center />

      {/* Broker cluster on Fargate (compute) — one per AZ */}
      {brokers.map((b, i) => (
        <Node key={b.title} x={488} y={rowY[i]} w={176} h={64} fam="compute" icon="container" title={b.title} subtitle={b.subtitle} />
      ))}

      {/* Intra-cluster quorum replication across AZs */}
      <line x1={480} y1={222} x2={480} y2={398} stroke={tokens.line} strokeWidth={1.5} strokeDasharray="5,4" />
      <ConnLabel x={576} y={182} text="quorum replication across AZs" />

      {/* Exchange → brokers */}
      <Connector d="M468,292 L488,228" />
      <Connector d="M468,310 L488,310" />
      <Connector d="M468,328 L488,392" />

      {/* Quorum queues (storage) */}
      {queues.map((q, i) => (
        <Node key={q.title} x={690} y={rowY[i]} w={160} h={64} fam="storage" icon="queue" title={q.title} subtitle={q.subtitle} />
      ))}

      {/* Brokers → queues */}
      <Connector d="M664,228 L690,228" />
      <Connector d="M664,310 L690,310" />
      <Connector d="M664,392 L690,392" />

      {/* Region caption */}
      <text x={600} y={472} textAnchor="middle" fontSize={11.5} fontWeight={600} fill={tokens.fam.compute.ink}>
        3-node cluster on Fargate · quorum queues · mirrored for HA
      </text>

      {/* Queues → consumers (consume) */}
      <Connector d="M850,228 L928,228" />
      <Connector d="M850,310 L928,310" />
      <Connector d="M850,392 L928,392" />

      {/* Consumers lane (neutral) */}
      <Lane x={910} y={96} w={250} h={410} fam="neutral" label="Consumers" />
      {consumers.map((c, i) => (
        <Node key={c.title} x={930} y={rowY[i]} w={210} h={64} fam="neutral" icon={c.icon} title={c.title} subtitle={c.subtitle} />
      ))}

      {/* Management strip (serverless) */}
      <Node
        x={40} y={530} w={1120} h={52} fam="serverless" icon="analytics" center
        title="Management UI & metrics"
        subtitle="queue depth · consumer lag · throughput"
      />

      {/* Managed-by strip (edge) */}
      <Node
        x={40} y={598} w={1120} h={56} fam="edge" icon="shield" center
        title="Managed by the SavvyTechies control plane"
        subtitle="provisioning · monitoring · autoscaling · backups"
      />

      {/* Bottom caption — honest tiering */}
      <text x={600} y={694} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={tokens.body}>
        Default: single-region multi-AZ. Premium: cross-region / cross-cloud active-passive via federation / shovel.
      </text>
      <text x={600} y={715} textAnchor="middle" fontSize={10.5} fill={tokens.muted}>
        Runs on ECS Fargate with quorum queues for HA. Cross-cloud is an opt-in premium tier — not the default.
      </text>
      <text x={600} y={735} textAnchor="middle" fontSize={10} fill={tokens.muted}>
        Roadmap item — managed RabbitMQ is not yet generally available.
      </text>
    </DiagramSvg>
  );
}
