export default function RotatingBadge({
  text = "SIGNAL · SCROLL · SIGNAL · SCROLL · ",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-[spin_16s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      >
        <defs>
          <path
            id="badge-circle"
            d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          />
        </defs>
        <text
          fontSize="9"
          className="fill-current"
          style={{ fontFamily: '"JetBrains Mono Variable", monospace' }}
        >
          <textPath
            href="#badge-circle"
            textLength="236"
            lengthAdjust="spacing"
          >
            {text}
          </textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl">
        ↓
      </span>
    </div>
  );
}