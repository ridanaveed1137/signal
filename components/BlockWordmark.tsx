const LETTERS = [
  "M20 0 H150 V48 H68 V80 H130 L150 100 V190 L130 210 H0 V162 H82 V130 H20 L0 110 V20 Z",
  "M20 0 H130 L150 20 V48 H112 V162 H150 V190 L130 210 H20 L0 190 V162 H38 V48 H0 V20 Z",
  "M20 0 H150 V48 H68 V162 H102 V130 H80 V100 H150 V190 L130 210 H20 L0 190 V20 Z",
  "M0 20 L20 0 H50 L100 70 V0 H130 L150 20 V190 L130 210 H100 L50 140 V210 H20 L0 190 Z",
  "M0 210 V30 L30 0 H120 L150 30 V210 H100 V150 H50 V210 Z M50 48 H100 V102 H50 Z",
  "M20 0 H50 V162 H150 V190 L130 210 H0 V20 Z",
];

export default function BlockWordmark({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1980 210"
      className={`block h-auto w-full ${className}`}
      role="img"
      aria-label="Signal"
    >
      {LETTERS.map((d, i) => (
        <g key={i} transform={`translate(${i * 336} 0) scale(2 1)`}>
          <path d={d} fillRule="evenodd" className="fill-paper" />
          <line
            x1="75"
            y1="-2"
            x2="75"
            y2="212"
            className="stroke-bg"
            strokeWidth="3"
          />
        </g>
      ))}
    </svg>
  );
}