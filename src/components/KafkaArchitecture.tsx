export default function KafkaArchitecture() {
  return (
    <svg
      viewBox="0 0 1200 900"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="purpleGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#4f46e5', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="pinkGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#ec4899', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#db2777', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Title */}
      <text x="600" y="40" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1f2937">
        Multi-Region Kafka Cluster Architecture
      </text>

      {/* Producers */}
      <g filter="url(#shadow)">
        <rect x="50" y="100" width="200" height="300" rx="8" fill="#fdf4ff" stroke="#d946ef" strokeWidth="2"/>
        <text x="150" y="130" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#a21caf">
          Producers
        </text>

        <rect x="70" y="150" width="160" height="50" rx="6" fill="url(#pinkGrad)"/>
        <text x="150" y="170" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">App Services</text>
        <text x="150" y="188" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Transactional events</text>

        <rect x="70" y="215" width="160" height="50" rx="6" fill="url(#pinkGrad)"/>
        <text x="150" y="235" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">CDC Connectors</text>
        <text x="150" y="253" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Database changes</text>

        <rect x="70" y="280" width="160" height="50" rx="6" fill="url(#pinkGrad)"/>
        <text x="150" y="300" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">IoT Devices</text>
        <text x="150" y="318" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Telemetry data</text>

        <rect x="70" y="345" width="160" height="50" rx="6" fill="url(#pinkGrad)"/>
        <text x="150" y="365" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">Log Collectors</text>
        <text x="150" y="383" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Application logs</text>
      </g>

      {/* Arrows */}
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
        </marker>
      </defs>
      <path d="M 250 175 L 300 175" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow2)"/>
      <path d="M 250 240 L 300 240" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow2)"/>
      <path d="M 250 305 L 300 305" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow2)"/>
      <path d="M 250 370 L 300 370" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow2)"/>

      {/* Kafka Cluster - Region 1 */}
      <g filter="url(#shadow)">
        <rect x="300" y="100" width="280" height="300" rx="8" fill="#fff" stroke="#ff9900" strokeWidth="3"/>
        <text x="440" y="130" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#ff9900">
          Region 1: US-EAST (AWS)
        </text>

        {/* Brokers */}
        <rect x="320" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="360" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 1</text>
        <text x="360" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Leader</text>
        <ellipse cx="360" cy="210" rx="25" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
        <text x="360" y="213" textAnchor="middle" fontSize="8" fill="#92400e">P0</text>
        <ellipse cx="360" cy="230" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="360" y="233" textAnchor="middle" fontSize="8" fill="#991b1b">R1</text>

        <rect x="410" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="450" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 2</text>
        <text x="450" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Follower</text>
        <ellipse cx="450" cy="210" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="450" y="213" textAnchor="middle" fontSize="8" fill="#991b1b">R0</text>
        <ellipse cx="450" cy="230" rx="25" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
        <text x="450" y="233" textAnchor="middle" fontSize="8" fill="#92400e">P1</text>

        <rect x="500" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="540" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 3</text>
        <text x="540" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Follower</text>
        <ellipse cx="540" cy="210" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="540" y="213" textAnchor="middle" fontSize="8" fill="#991b1b">R1</text>
        <ellipse cx="540" cy="230" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="540" y="233" textAnchor="middle" fontSize="8" fill="#991b1b">R0</text>

        {/* ZooKeeper */}
        <rect x="320" y="270" width="240" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
        <text x="440" y="293" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e">
          ZooKeeper Ensemble
        </text>
        <text x="440" y="310" textAnchor="middle" fontSize="9" fill="#78350f">
          Metadata & Coordination
        </text>

        {/* Stats */}
        <text x="440" y="350" textAnchor="middle" fontSize="10" fill="#6b7280">
          Throughput: 500K msg/s
        </text>
        <text x="440" y="370" textAnchor="middle" fontSize="10" fill="#6b7280">
          Storage: 10TB
        </text>
      </g>

      {/* Kafka Cluster - Region 2 */}
      <g filter="url(#shadow)">
        <rect x="620" y="100" width="280" height="300" rx="8" fill="#fff" stroke="#0078d4" strokeWidth="3"/>
        <text x="760" y="130" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0078d4">
          Region 2: EU-WEST (Azure)
        </text>

        {/* Brokers */}
        <rect x="640" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="680" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 4</text>
        <text x="680" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Leader</text>
        <ellipse cx="680" cy="210" rx="25" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
        <text x="680" y="213" textAnchor="middle" fontSize="8" fill="#92400e">P2</text>
        <ellipse cx="680" cy="230" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="680" y="233" textAnchor="middle" fontSize="8" fill="#991b1b">R0</text>

        <rect x="730" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="770" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 5</text>
        <text x="770" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Follower</text>
        <ellipse cx="770" cy="210" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="770" y="213" textAnchor="middle" fontSize="8" fill="#991b1b">R2</text>
        <ellipse cx="770" cy="230" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="770" y="233" textAnchor="middle" fontSize="8" fill="#991b1b">R1</text>

        <rect x="820" y="150" width="80" height="100" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="2"/>
        <text x="860" y="170" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e40af">Broker 6</text>
        <text x="860" y="188" textAnchor="middle" fontSize="9" fill="#1e40af">Follower</text>
        <ellipse cx="860" cy="210" rx="25" ry="12" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="860" y="213" textAnchor="middle" fontSize="8" fill="#991b1b">R1</text>
        <ellipse cx="860" cy="230" rx="25" ry="12" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
        <text x="860" y="233" textAnchor="middle" fontSize="8" fill="#92400e">P3</text>

        {/* ZooKeeper */}
        <rect x="640" y="270" width="240" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
        <text x="760" y="293" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#92400e">
          ZooKeeper Ensemble
        </text>
        <text x="760" y="310" textAnchor="middle" fontSize="9" fill="#78350f">
          Metadata & Coordination
        </text>

        {/* Stats */}
        <text x="760" y="350" textAnchor="middle" fontSize="10" fill="#6b7280">
          Throughput: 500K msg/s
        </text>
        <text x="760" y="370" textAnchor="middle" fontSize="10" fill="#6b7280">
          Storage: 10TB
        </text>
      </g>

      {/* Cross-region replication */}
      <path d="M 580 250 L 620 250" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8,4" fill="none"/>
      <text x="600" y="245" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#7c3aed">
        MirrorMaker 2
      </text>

      {/* Schema Registry */}
      <g filter="url(#shadow)">
        <rect x="950" y="100" width="200" height="120" rx="8" fill="#f0fdfa" stroke="#14b8a6" strokeWidth="2"/>
        <text x="1050" y="130" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0f766e">
          Schema Registry
        </text>
        <text x="1050" y="155" textAnchor="middle" fontSize="11" fill="#115e59">
          Avro • Protobuf • JSON
        </text>
        <text x="1050" y="175" textAnchor="middle" fontSize="10" fill="#134e4a">
          Version Control
        </text>
        <text x="1050" y="193" textAnchor="middle" fontSize="10" fill="#134e4a">
          Compatibility Checks
        </text>
        <text x="1050" y="211" textAnchor="middle" fontSize="10" fill="#134e4a">
          Schema Evolution
        </text>
      </g>

      {/* Kafka Connect */}
      <g filter="url(#shadow)">
        <rect x="950" y="240" width="200" height="160" rx="8" fill="#fef2f2" stroke="#ef4444" strokeWidth="2"/>
        <text x="1050" y="270" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#b91c1c">
          Kafka Connect
        </text>

        <rect x="970" y="285" width="160" height="30" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="1050" y="305" textAnchor="middle" fontSize="10" fill="#991b1b">Source: PostgreSQL</text>

        <rect x="970" y="325" width="160" height="30" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="1050" y="345" textAnchor="middle" fontSize="10" fill="#991b1b">Source: MongoDB</text>

        <rect x="970" y="365" width="160" height="30" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="1050" y="385" textAnchor="middle" fontSize="10" fill="#991b1b">Sink: Elasticsearch</text>
      </g>

      {/* Stream Processing */}
      <g filter="url(#shadow)">
        <rect x="300" y="450" width="600" height="150" rx="8" fill="#faf5ff" stroke="#a855f7" strokeWidth="2"/>
        <text x="600" y="480" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#7e22ce">
          Stream Processing Layer
        </text>

        <rect x="330" y="500" width="180" height="80" rx="6" fill="url(#purpleGrad2)"/>
        <text x="420" y="525" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Kafka Streams
        </text>
        <text x="420" y="545" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Stateful processing
        </text>
        <text x="420" y="562" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Windowing • Joins
        </text>

        <rect x="530" y="500" width="180" height="80" rx="6" fill="url(#purpleGrad2)"/>
        <text x="620" y="525" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          ksqlDB
        </text>
        <text x="620" y="545" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          SQL for streams
        </text>
        <text x="620" y="562" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Real-time queries
        </text>

        <rect x="730" y="500" width="150" height="80" rx="6" fill="url(#purpleGrad2)"/>
        <text x="805" y="525" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Flink
        </text>
        <text x="805" y="545" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Complex CEP
        </text>
        <text x="805" y="562" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          ML inference
        </text>
      </g>

      {/* Consumers */}
      <g filter="url(#shadow)">
        <rect x="300" y="650" width="600" height="150" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
        <text x="600" y="680" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e40af">
          Consumer Applications
        </text>

        <rect x="330" y="700" width="120" height="70" rx="6" fill="url(#indigoGrad)"/>
        <text x="390" y="725" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Analytics</text>
        <text x="390" y="743" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Dashboards</text>
        <text x="390" y="758" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Reporting</text>

        <rect x="470" y="700" width="120" height="70" rx="6" fill="url(#indigoGrad)"/>
        <text x="530" y="725" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Data Lake</text>
        <text x="530" y="743" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">S3/ADLS</text>
        <text x="530" y="758" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Archival</text>

        <rect x="610" y="700" width="120" height="70" rx="6" fill="url(#indigoGrad)"/>
        <text x="670" y="725" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Microservices</text>
        <text x="670" y="743" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Event-driven</text>
        <text x="670" y="758" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Async</text>

        <rect x="750" y="700" width="120" height="70" rx="6" fill="url(#indigoGrad)"/>
        <text x="810" y="725" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">ML Training</text>
        <text x="810" y="743" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Feature store</text>
        <text x="810" y="758" textAnchor="middle" fontSize="9" fill="white" opacity="0.9">Online/Offline</text>
      </g>

      {/* AI Monitoring */}
      <g filter="url(#shadow)">
        <rect x="50" y="820" width="1100" height="60" rx="8" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2"/>
        <text x="600" y="845" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3730a3">
          🤖 AI-Powered Operations
        </text>
        <text x="600" y="865" textAnchor="middle" fontSize="11" fill="#4338ca">
          Auto-scaling • Partition rebalancing • Consumer lag prediction • Anomaly detection • Performance optimization
        </text>
      </g>

      {/* Legend */}
      <g>
        <text x="50" y="30" fontSize="12" fontWeight="bold" fill="#6b7280">Legend:</text>
        <ellipse cx="155" cy="26" rx="15" ry="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1"/>
        <text x="175" y="30" fontSize="10" fill="#6b7280">Partition Leader</text>

        <ellipse cx="300" cy="26" rx="15" ry="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="1"/>
        <text x="320" y="30" fontSize="10" fill="#6b7280">Partition Replica</text>

        <line x1="440" y1="26" x2="470" y2="26" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4,2"/>
        <text x="478" y="30" fontSize="10" fill="#6b7280">Cross-region replication</text>
      </g>
    </svg>
  );
}
