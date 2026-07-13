/**
 * Shared design system for the website's architecture diagrams.
 *
 * Goal: one consistent, professional vector language across every diagram —
 * a tidy grid, a restrained slate-based palette with one accent hue per AWS
 * service family, compact AWS-style service glyphs, soft depth, and clean
 * arrowed connectors. No gradients-for-their-own-sake, no floating labels.
 *
 * Everything is plain SVG-returning functions so diagrams compose them on a
 * fixed 1200-wide viewBox. Import { tokens, DiagramSvg, Lane, Node, Connector,
 * Cylinder, ConnLabel, glyphs } and lay out on the grid.
 */
import ZoomableDiagram from "./ZoomableDiagram";

// --- Palette ----------------------------------------------------------------
// Neutrals are slate (a cool grey with a faint blue bias — chosen, not default).
// Each service family gets ONE muted accent hue used consistently everywhere.
export const tokens = {
  ink: "#0f172a", // slate-900 — titles
  body: "#334155", // slate-700 — labels
  muted: "#64748b", // slate-500 — captions
  hair: "#e2e8f0", // slate-200 — hairlines / grid
  line: "#94a3b8", // slate-400 — connectors
  laneBg: "#f8fafc", // slate-50 — group fill
  laneBorder: "#e2e8f0",
  aws: "#ff9900", // region boundary accent (thin, dashed)
  font: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  // Service families: [stroke, tint fill, icon ink]
  fam: {
    edge: { line: "#2563eb", tint: "#eff6ff", ink: "#1d4ed8" }, // CloudFront / ALB / network
    compute: { line: "#4f46e5", tint: "#eef2ff", ink: "#4338ca" }, // Fargate / ECS / EC2
    data: { line: "#0e7490", tint: "#ecfeff", ink: "#0e7490" }, // Aurora / RDS / cache
    serverless: { line: "#7c3aed", tint: "#f5f3ff", ink: "#6d28d9" }, // Lambda / control plane
    storage: { line: "#16a34a", tint: "#f0fdf4", ink: "#15803d" }, // S3 / queue / stream
    neutral: { line: "#475569", tint: "#f1f5f9", ink: "#334155" }, // users / external
  },
} as const;

export type Fam = keyof typeof tokens.fam;

// --- Root wrapper: fonts + shared <defs> (shadow + arrow markers) ------------
export function DiagramSvg({
  title,
  viewBox = "0 0 1200 720",
  children,
}: {
  title?: string;
  viewBox?: string;
  children: React.ReactNode;
}) {
  return (
    <ZoomableDiagram>
    <svg
      viewBox={viewBox}
      className="w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
      style={{ fontFamily: tokens.font }}
      role="img"
      aria-label={title}
    >
      <defs>
        <filter id="dg-shadow" x="-4%" y="-4%" width="108%" height="112%">
          <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.10" />
        </filter>
        <marker id="dg-arrow" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
          <path d="M0,0 L7.5,3 L0,6 Z" fill={tokens.line} />
        </marker>
        <marker id="dg-arrow-v" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto">
          <path d="M0,0 L7.5,3 L0,6 Z" fill={tokens.fam.serverless.line} />
        </marker>
      </defs>
      {title && (
        <text x="600" y="38" textAnchor="middle" fontSize="21" fontWeight="700" fill={tokens.ink} style={{ letterSpacing: "-0.01em" }}>
          {title}
        </text>
      )}
      {children}
    </svg>
    </ZoomableDiagram>
  );
}

// --- Group container (a labelled "lane"/card) -------------------------------
export function Lane({
  x, y, w, h, label, fam = "neutral", region = false,
}: {
  x: number; y: number; w: number; h: number; label?: string; fam?: Fam; region?: boolean;
}) {
  const c = tokens.fam[fam];
  x = Number(x); y = Number(y); w = Number(w); h = Number(h);
  return (
    <g>
      <rect
        x={x} y={y} width={w} height={h} rx="12"
        fill={region ? "#ffffff" : tokens.laneBg}
        stroke={region ? tokens.aws : tokens.laneBorder}
        strokeWidth={region ? 2 : 1}
        strokeDasharray={region ? "7,5" : undefined}
      />
      {label && (
        <g>
          <circle cx={x + 18} cy={y + 20} r="4" fill={c.line} />
          <text x={x + 30} y={y + 24} fontSize="12" fontWeight="700" fill={c.ink} style={{ letterSpacing: "0.06em" }}>
            {label.toUpperCase()}
          </text>
        </g>
      )}
    </g>
  );
}

// --- A service node: icon chip + title (+ optional subtitle) -----------------
export function Node({
  x, y, w = 220, h = 54, fam = "neutral", title, subtitle, icon, center = false,
}: {
  x: number; y: number; w?: number; h?: number; fam?: Fam;
  title: string; subtitle?: string; icon?: keyof typeof glyphs; center?: boolean;
}) {
  const c = tokens.fam[fam];
  x = Number(x); y = Number(y); w = Number(w); h = Number(h);
  const tx = center ? x + w / 2 : x + (icon ? 52 : 16);
  const anchor = center ? "middle" : "start";
  return (
    <g filter="url(#dg-shadow)">
      <rect x={x} y={y} width={w} height={h} rx="10" fill="#ffffff" stroke={c.line} strokeWidth="1.5" />
      {icon && !center && <IconChip x={x + 12} y={y + h / 2 - 14} fam={fam} name={icon} />}
      <text x={tx} y={subtitle ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor={anchor} fontSize="13.5" fontWeight="600" fill={tokens.ink}>
        {title}
      </text>
      {subtitle && (
        <text x={tx} y={y + h / 2 + 15} textAnchor={anchor} fontSize="10.5" fill={tokens.muted}>
          {subtitle}
        </text>
      )}
    </g>
  );
}

// A rounded icon chip carrying a service glyph.
export function IconChip({ x, y, fam, name }: { x: number; y: number; fam: Fam; name: keyof typeof glyphs }) {
  const c = tokens.fam[fam];
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="28" height="28" rx="7" fill={c.tint} stroke={c.line} strokeWidth="1" />
      <g transform="translate(4,4)" stroke={c.ink} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {glyphs[name]}
      </g>
    </g>
  );
}

// --- Database cylinder ------------------------------------------------------
export function Cylinder({
  cx, cy, rx = 200, ry = 15, h = 58, fam = "data", title, subtitle,
}: {
  cx: number; cy: number; rx?: number; ry?: number; h?: number; fam?: Fam; title: string; subtitle?: string;
}) {
  const c = tokens.fam[fam];
  cx = Number(cx); cy = Number(cy); rx = Number(rx); ry = Number(ry); h = Number(h);
  // Ellipse radius (ry) is independent of body height (h) so labels clear the rim.
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  return (
    <g filter="url(#dg-shadow)">
      <path
        d={`M ${cx - rx} ${top} L ${cx - rx} ${bottom} A ${rx} ${ry} 0 0 0 ${cx + rx} ${bottom} L ${cx + rx} ${top} Z`}
        fill={c.tint} stroke={c.line} strokeWidth="1.5"
      />
      <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill="#ffffff" stroke={c.line} strokeWidth="1.5" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="13" fontWeight="700" fill={c.ink}>{title}</text>
      {subtitle && <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill={tokens.muted}>{subtitle}</text>}
    </g>
  );
}

// --- Connectors -------------------------------------------------------------
export function Connector({
  d, dashed = false, accent = false,
}: {
  d: string; dashed?: boolean; accent?: boolean;
}) {
  return (
    <path
      d={d} fill="none"
      stroke={accent ? tokens.fam.serverless.line : tokens.line}
      strokeWidth="1.75"
      strokeDasharray={dashed ? "5,4" : undefined}
      markerEnd={accent ? "url(#dg-arrow-v)" : "url(#dg-arrow)"}
    />
  );
}

// A label that sits cleanly over a connector (pill background).
export function ConnLabel({ x, y, text, accent = false }: { x: number; y: number; text: string; accent?: boolean }) {
  x = Number(x); y = Number(y);
  const w = text.length * 6.1 + 16;
  return (
    <g>
      <rect x={x - w / 2} y={y - 11} width={w} height="19" rx="9.5" fill="#ffffff" stroke={tokens.hair} strokeWidth="1" />
      <text x={x} y={y + 2.5} textAnchor="middle" fontSize="10.5" fontWeight="600" fill={accent ? tokens.fam.serverless.ink : tokens.body}>
        {text}
      </text>
    </g>
  );
}

// --- Compact AWS-style service glyphs (20x20 line icons) --------------------
// Drawn with stroke set by IconChip; keep paths simple + recognizable.
export const glyphs = {
  users: (<><circle cx="7" cy="6" r="3" /><path d="M2 18c0-3 2.5-5 5-5s5 2 5 5" /><circle cx="15" cy="7" r="2.4" /><path d="M13 18c0-2.4 1.5-4 3.5-4s3.5 1.6 3.5 4" /></>),
  cloudfront: (<><circle cx="10" cy="10" r="8" /><path d="M2 10h16M10 2c2.6 2.2 2.6 13.8 0 16M10 2c-2.6 2.2-2.6 13.8 0 16" /></>),
  alb: (<><circle cx="10" cy="4" r="2" /><circle cx="4" cy="16" r="2" /><circle cx="10" cy="16" r="2" /><circle cx="16" cy="16" r="2" /><path d="M10 6v4M10 10H4v4M10 10h6v4M10 10v4" /></>),
  fargate: (<><rect x="3" y="4" width="14" height="12" rx="1.5" /><path d="M3 8h14M7 4v12" /></>),
  container: (<><path d="M3 7l7-4 7 4v6l-7 4-7-4z" /><path d="M3 7l7 4 7-4M10 11v6" /></>),
  aurora: (<><ellipse cx="10" cy="5" rx="6" ry="2.5" /><path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5M4 10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5" /></>),
  lambda: (<><path d="M5 3h4l6 14M9 8l-4 9" /></>),
  api: (<><rect x="2" y="4" width="16" height="12" rx="2" /><path d="M6 8l-2 2 2 2M14 8l2 2-2 2M11 7l-2 6" /></>),
  billing: (<><rect x="2" y="4" width="16" height="12" rx="2" /><path d="M2 8h16M6 12h3" /></>),
  ai: (<><circle cx="10" cy="10" r="3" /><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14 14l1.4 1.4M15.5 4.5L14 6M6 14l-1.5 1.5" /></>),
  analytics: (<><path d="M3 17V3M3 17h14M6 14v-4M10 14V7M14 14v-6" /></>),
  mail: (<><rect x="2" y="4" width="16" height="12" rx="2" /><path d="M2 6l8 5 8-5" /></>),
  token: (<><circle cx="7" cy="10" r="4" /><path d="M11 10h7M15 10v3M18 10v2" /></>),
  registry: (<><rect x="3" y="3" width="6" height="6" rx="1" /><rect x="11" y="3" width="6" height="6" rx="1" /><rect x="3" y="11" width="6" height="6" rx="1" /><rect x="11" y="11" width="6" height="6" rx="1" /></>),
  s3: (<><path d="M4 5c0-1.5 2.7-2.5 6-2.5s6 1 6 2.5v10c0 1.5-2.7 2.5-6 2.5s-6-1-6-2.5z" /><path d="M4 5c0 1.5 2.7 2.5 6 2.5s6-1 6-2.5" /></>),
  stream: (<><path d="M3 6h10M3 10h14M3 14h8" /><path d="M13 4l3 2-3 2M15 12l3 2-3 2" /></>),
  queue: (<><rect x="2" y="6" width="4" height="8" rx="1" /><rect x="8" y="6" width="4" height="8" rx="1" /><rect x="14" y="6" width="4" height="8" rx="1" /></>),
  shield: (<><path d="M10 2l6 2.5v5c0 4-2.7 7-6 8.5-3.3-1.5-6-4.5-6-8.5v-5z" /><path d="M7.5 10l1.8 1.8L13 8" /></>),
  globe: (<><circle cx="10" cy="10" r="8" /><path d="M2 10h16M10 2v16M4 5c3 2 9 2 12 0M4 15c3-2 9-2 12 0" /></>),
  key: (<><circle cx="6" cy="10" r="3.5" /><path d="M9.5 10H18M15 10v3M18 10v3" /></>),
} as const;
