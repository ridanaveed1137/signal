import { rng } from "@/lib/seed";

const LABELS = [
  "PACKET 00352",
  "ROUTE FOUND",
  "UDP :53",
  "ICMP ECHO",
  "NODE CONNECTED",
  "DNS QUERY",
  "HTTPS :443",
  "STATUS: ACTIVE",
  "POLICY ALLOW",
  "SYNC OK",
];

export default function Cover({
  seed,
  color,
  label,
}: {
  seed: string;
  color: string;
  label: string;
}) {
  const r = rng(seed);
  const bars = r() > 0.65;
  const gid = `g-${seed}`;

  const nodes = Array.from({ length: 9 }, () => ({
    x: Math.round(24 + r() * 352),
    y: Math.round(20 + r() * 120),
  }));

  const tags = Array.from({ length: 4 }, () => ({
    x: Math.round(12 + r() * 260),
    y: Math.round(24 + r() * 130),
    t: LABELS[Math.floor(r() * LABELS.length)],
  }));

  const columns = Array.from({ length: 12 }, () => Math.round(20 + r() * 80));

  return (
    <svg
      viewBox="0 0 400 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.38" />
          <stop offset="1" stopColor={color} stopOpacity="0.12" />
        </linearGradient>
      </defs>

      <rect width="400" height="200" fill={`url(#${gid})`} />

      {tags.map((g, i) => (
        <text
          key={`t${i}`}
          x={g.x}
          y={g.y}
          fontSize="9"
          fill={color}
          fillOpacity="0.55"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {g.t}
        </text>
      ))}

      {bars ? (
        columns.map((h, i) => (
          <rect
            key={`b${i}`}
            x={20 + i * 31}
            y={170 - h}
            width="18"
            height={h}
            fill={color}
            fillOpacity="0.45"
          />
        ))
      ) : (
        <>
          {nodes.map((p, i) => {
            const q = nodes[(i * 4 + 3) % nodes.length];
            return (
              <line
                key={`l${i}`}
                x1={p.x}
                y1={p.y}
                x2={q.x}
                y2={q.y}
                stroke={color}
                strokeOpacity="0.5"
              />
            );
          })}
          {nodes.map((p, i) => (
            <circle key={`n${i}`} cx={p.x} cy={p.y} r="3.5" fill={color} />
          ))}
        </>
      )}

      <text
        x="14"
        y="190"
        fontSize="10"
        fill="#ece8df"
        fillOpacity="0.85"
        letterSpacing="1.2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label.toUpperCase()}
      </text>
    </svg>
  );
}