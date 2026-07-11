export default function RabbitMQArchitecture() {
  return (
    <svg
      viewBox="0 0 1200 700"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#f97316', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="tealGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#14b8a6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#0d9488', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Title */}
      <text x="600" y="40" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1f2937">
        High-Availability RabbitMQ Cluster
      </text>

      {/* Producers Section */}
      <g filter="url(#shadow)">
        <rect x="50" y="100" width="200" height="400" rx="8" fill="#f0fdf4" stroke="#10b981" strokeWidth="2"/>
        <text x="150" y="130" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#059669">
          Producers
        </text>

        {/* Producer instances */}
        <rect x="70" y="150" width="160" height="60" rx="6" fill="url(#tealGrad)"/>
        <text x="150" y="175" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Microservice A
        </text>
        <text x="150" y="195" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Order Service
        </text>

        <rect x="70" y="230" width="160" height="60" rx="6" fill="url(#tealGrad)"/>
        <text x="150" y="255" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Microservice B
        </text>
        <text x="150" y="275" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Payment Service
        </text>

        <rect x="70" y="310" width="160" height="60" rx="6" fill="url(#tealGrad)"/>
        <text x="150" y="335" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          API Gateway
        </text>
        <text x="150" y="355" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          REST/GraphQL
        </text>

        <rect x="70" y="390" width="160" height="60" rx="6" fill="url(#tealGrad)"/>
        <text x="150" y="415" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Web Application
        </text>
        <text x="150" y="435" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Frontend Events
        </text>
      </g>

      {/* Arrows from producers to cluster */}
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
        </marker>
      </defs>
      <path d="M 250 180 L 330 240" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 250 260 L 330 280" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 250 340 L 330 320" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 250 420 L 330 360" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>

      {/* RabbitMQ Cluster */}
      <g filter="url(#shadow)">
        <rect x="330" y="150" width="540" height="400" rx="8" fill="#fff7ed" stroke="#ea580c" strokeWidth="3"/>
        <text x="600" y="180" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#c2410c">
          RabbitMQ Cluster (Multi-Cloud)
        </text>

        {/* Node 1 */}
        <g>
          <rect x="360" y="210" width="140" height="160" rx="6" fill="#fff" stroke="#f97316" strokeWidth="2"/>
          <text x="430" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ea580c">
            Node 1 (AWS)
          </text>
          <text x="430" y="255" textAnchor="middle" fontSize="11" fill="#9a3412">
            Leader
          </text>

          {/* Queue icons */}
          <rect x="370" y="270" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="430" y="290" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: orders</text>

          <rect x="370" y="310" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="430" y="330" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: payments</text>

          <text x="430" y="360" textAnchor="middle" fontSize="9" fill="#78716c">
            Mirror: ✓
          </text>
        </g>

        {/* Node 2 */}
        <g>
          <rect x="530" y="210" width="140" height="160" rx="6" fill="#fff" stroke="#f97316" strokeWidth="2"/>
          <text x="600" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ea580c">
            Node 2 (Azure)
          </text>
          <text x="600" y="255" textAnchor="middle" fontSize="11" fill="#9a3412">
            Follower
          </text>

          {/* Queue icons */}
          <rect x="540" y="270" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="600" y="290" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: orders</text>

          <rect x="540" y="310" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="600" y="330" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: payments</text>

          <text x="600" y="360" textAnchor="middle" fontSize="9" fill="#78716c">
            Mirror: ✓
          </text>
        </g>

        {/* Node 3 */}
        <g>
          <rect x="700" y="210" width="140" height="160" rx="6" fill="#fff" stroke="#f97316" strokeWidth="2"/>
          <text x="770" y="235" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ea580c">
            Node 3 (GCP)
          </text>
          <text x="770" y="255" textAnchor="middle" fontSize="11" fill="#9a3412">
            Follower
          </text>

          {/* Queue icons */}
          <rect x="710" y="270" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="770" y="290" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: orders</text>

          <rect x="710" y="310" width="120" height="30" rx="3" fill="#fed7aa" stroke="#f97316" strokeWidth="1"/>
          <text x="770" y="330" textAnchor="middle" fontSize="10" fill="#9a3412">Queue: payments</text>

          <text x="770" y="360" textAnchor="middle" fontSize="9" fill="#78716c">
            Mirror: ✓
          </text>
        </g>

        {/* Replication arrows between nodes */}
        <path d="M 500 300 L 530 300" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
        <path d="M 660 300 L 700 300" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
        <path d="M 530 320 L 500 320" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>
        <path d="M 700 320 L 660 320" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5" fill="none" markerEnd="url(#arrow)"/>

        {/* Management UI */}
        <rect x="360" y="400" width="480" height="50" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2"/>
        <text x="600" y="425" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#92400e">
          Management UI & Monitoring
        </text>
        <text x="600" y="442" textAnchor="middle" fontSize="10" fill="#78350f">
          Real-time metrics • Queue depth • Consumer lag • Throughput
        </text>

        {/* Cluster info */}
        <text x="600" y="485" textAnchor="middle" fontSize="11" fill="#78716c">
          Quorum Queues • Publisher Confirms • HA Policy: all
        </text>
      </g>

      {/* Consumers Section */}
      <g filter="url(#shadow)">
        <rect x="950" y="100" width="200" height="400" rx="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2"/>
        <text x="1050" y="130" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1e40af">
          Consumers
        </text>

        {/* Consumer instances */}
        <rect x="970" y="150" width="160" height="60" rx="6" fill="#3b82f6"/>
        <text x="1050" y="175" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Worker Pool 1
        </text>
        <text x="1050" y="195" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Order Processor
        </text>

        <rect x="970" y="230" width="160" height="60" rx="6" fill="#3b82f6"/>
        <text x="1050" y="255" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Worker Pool 2
        </text>
        <text x="1050" y="275" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Payment Handler
        </text>

        <rect x="970" y="310" width="160" height="60" rx="6" fill="#3b82f6"/>
        <text x="1050" y="335" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Email Service
        </text>
        <text x="1050" y="355" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Notification Sender
        </text>

        <rect x="970" y="390" width="160" height="60" rx="6" fill="#3b82f6"/>
        <text x="1050" y="415" textAnchor="middle" fontSize="13" fontWeight="bold" fill="white">
          Analytics
        </text>
        <text x="1050" y="435" textAnchor="middle" fontSize="10" fill="white" opacity="0.9">
          Event Aggregator
        </text>
      </g>

      {/* Arrows from cluster to consumers */}
      <path d="M 870 240 L 970 180" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 870 280 L 970 260" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 870 320 L 970 340" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>
      <path d="M 870 360 L 970 420" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrow)"/>

      {/* AI Layer */}
      <g filter="url(#shadow)">
        <rect x="50" y="580" width="1100" height="80" rx="8" fill="#c7d2fe" stroke="#6366f1" strokeWidth="2"/>
        <text x="600" y="610" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#3730a3">
          🤖 AI-Powered Auto-Scaling & Monitoring
        </text>
        <text x="600" y="633" textAnchor="middle" fontSize="12" fill="#4338ca">
          Queue depth analysis • Consumer lag detection • Predictive scaling • Automatic node recovery
        </text>
        <text x="600" y="653" textAnchor="middle" fontSize="11" fill="#4338ca">
          Anomaly detection • Dead letter queue management • Performance optimization
        </text>
      </g>

      {/* Legend */}
      <g>
        <text x="50" y="30" fontSize="12" fontWeight="bold" fill="#6b7280">Legend:</text>
        <rect x="140" y="22" width="12" height="12" fill="#14b8a6" rx="2"/>
        <text x="158" y="30" fontSize="10" fill="#6b7280">Producer</text>

        <rect x="230" y="22" width="12" height="12" fill="#f97316" rx="2"/>
        <text x="248" y="30" fontSize="10" fill="#6b7280">RabbitMQ Node</text>

        <rect x="360" y="22" width="12" height="12" fill="#3b82f6" rx="2"/>
        <text x="378" y="30" fontSize="10" fill="#6b7280">Consumer</text>

        <line x1="470" y1="28" x2="500" y2="28" stroke="#f97316" strokeWidth="2" strokeDasharray="5,5"/>
        <text x="508" y="30" fontSize="10" fill="#6b7280">Mirroring</text>
      </g>
    </svg>
  );
}
