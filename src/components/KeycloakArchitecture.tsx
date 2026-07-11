export default function KeycloakArchitecture() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="blueGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="greenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#8b5cf6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6d28d9', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
        </filter>
      </defs>

      {/* Title */}
      <text x="600" y="40" textAnchor="middle" fontSize="28" fontWeight="bold" fill="#1f2937">
        Multi-Cloud Keycloak Architecture
      </text>

      {/* Global Load Balancer */}
      <g filter="url(#shadow)">
        <rect x="400" y="80" width="400" height="80" rx="8" fill="url(#blueGrad)" />
        <text x="600" y="115" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">
          Global Load Balancer
        </text>
        <text x="600" y="140" textAnchor="middle" fontSize="14" fill="white" opacity="0.9">
          GeoDNS / Anycast Routing
        </text>
      </g>

      {/* Arrows from LB to regions */}
      <path d="M 500 160 L 200 220" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
      <path d="M 600 160 L 600 220" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
      <path d="M 700 160 L 1000 220" stroke="#6b7280" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>

      {/* Arrow marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#6b7280" />
        </marker>
      </defs>

      {/* AWS Region */}
      <g filter="url(#shadow)">
        <rect x="50" y="220" width="300" height="200" rx="8" fill="#fff" stroke="#ff9900" strokeWidth="3" />
        <text x="200" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ff9900">
          AWS Region (us-east-1)
        </text>

        {/* Keycloak Pods */}
        <rect x="70" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="110" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="110" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 1</text>

        <rect x="160" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="200" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="200" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 2</text>

        <rect x="250" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="290" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="290" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 3</text>

        {/* EKS Label */}
        <text x="200" y="350" textAnchor="middle" fontSize="11" fill="#6b7280">
          Amazon EKS
        </text>

        {/* Database */}
        <ellipse cx="200" cy="390" rx="100" ry="25" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
        <text x="200" y="395" textAnchor="middle" fontSize="11" fill="#d97706">YugabyteDB Node</text>
      </g>

      {/* Azure Region */}
      <g filter="url(#shadow)">
        <rect x="450" y="220" width="300" height="200" rx="8" fill="#fff" stroke="#0078d4" strokeWidth="3" />
        <text x="600" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0078d4">
          Azure Region (eastus)
        </text>

        {/* Keycloak Pods */}
        <rect x="470" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="510" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="510" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 4</text>

        <rect x="560" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="600" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="600" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 5</text>

        <rect x="650" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="690" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="690" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 6</text>

        {/* AKS Label */}
        <text x="600" y="350" textAnchor="middle" fontSize="11" fill="#6b7280">
          Azure AKS
        </text>

        {/* Database */}
        <ellipse cx="600" cy="390" rx="100" ry="25" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
        <text x="600" y="395" textAnchor="middle" fontSize="11" fill="#d97706">YugabyteDB Node</text>
      </g>

      {/* GCP Region */}
      <g filter="url(#shadow)">
        <rect x="850" y="220" width="300" height="200" rx="8" fill="#fff" stroke="#4285f4" strokeWidth="3" />
        <text x="1000" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4285f4">
          GCP Region (us-central1)
        </text>

        {/* Keycloak Pods */}
        <rect x="870" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="910" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="910" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 7</text>

        <rect x="960" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="1000" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="1000" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 8</text>

        <rect x="1050" y="260" width="80" height="60" rx="4" fill="#4ade80" opacity="0.2" stroke="#10b981" strokeWidth="2"/>
        <text x="1090" y="285" textAnchor="middle" fontSize="12" fill="#059669">Keycloak</text>
        <text x="1090" y="305" textAnchor="middle" fontSize="10" fill="#059669">Pod 9</text>

        {/* GKE Label */}
        <text x="1000" y="350" textAnchor="middle" fontSize="11" fill="#6b7280">
          Google GKE
        </text>

        {/* Database */}
        <ellipse cx="1000" cy="390" rx="100" ry="25" fill="#fbbf24" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
        <text x="1000" y="395" textAnchor="middle" fontSize="11" fill="#d97706">YugabyteDB Node</text>
      </g>

      {/* YugabyteDB Replication Layer */}
      <g filter="url(#shadow)">
        <rect x="200" y="470" width="800" height="100" rx="8" fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,5"/>
        <text x="600" y="500" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#92400e">
          YugabyteDB Distributed Database
        </text>
        <text x="600" y="525" textAnchor="middle" fontSize="13" fill="#78350f">
          Multi-Region Active-Active Replication
        </text>
        <text x="600" y="545" textAnchor="middle" fontSize="11" fill="#78350f">
          Raft Consensus • Strong Consistency • Automatic Failover
        </text>
      </g>

      {/* Arrows to DB layer */}
      <path d="M 200 420 L 300 470" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" fill="none"/>
      <path d="M 600 420 L 600 470" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" fill="none"/>
      <path d="M 1000 420 L 900 470" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" fill="none"/>

      {/* Redis Cache Layer */}
      <g filter="url(#shadow)">
        <rect x="50" y="610" width="1100" height="80" rx="8" fill="#fee2e2" stroke="#dc2626" strokeWidth="2"/>
        <text x="600" y="640" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#991b1b">
          Redis Cache Layer (Session Storage)
        </text>
        <text x="600" y="665" textAnchor="middle" fontSize="12" fill="#991b1b">
          Distributed cache for JWT tokens, user sessions, and rate limiting
        </text>
      </g>

      {/* AI Monitoring Layer */}
      <g filter="url(#shadow)">
        <rect x="50" y="720" width="1100" height="60" rx="8" fill="url(#purpleGrad)"/>
        <text x="600" y="745" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white">
          🤖 AI-Powered Monitoring & Auto-Healing
        </text>
        <text x="600" y="765" textAnchor="middle" fontSize="11" fill="white" opacity="0.9">
          Anomaly Detection • Predictive Scaling • Sub-Minute Recovery • Autonomous Operations
        </text>
      </g>

      {/* Legend */}
      <g>
        <text x="50" y="30" fontSize="12" fontWeight="bold" fill="#6b7280">Legend:</text>
        <circle cx="150" cy="26" r="4" fill="#10b981"/>
        <text x="160" y="30" fontSize="10" fill="#6b7280">Keycloak Instance</text>

        <circle cx="280" cy="26" r="4" fill="#f59e0b"/>
        <text x="290" y="30" fontSize="10" fill="#6b7280">Database Node</text>

        <circle cx="400" cy="26" r="4" fill="#dc2626"/>
        <text x="410" y="30" fontSize="10" fill="#6b7280">Cache Layer</text>
      </g>
    </svg>
  );
}
