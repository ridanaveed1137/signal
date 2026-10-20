"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type T = {
  slug: string;
  title: string;
  color: string;
  blurb: string;
  count: number;
};

const MONO = '"JetBrains Mono Variable", monospace';

export default function TopicDial({ topics }: { topics: T[] }) {
  const box = useRef<HTMLDivElement>(null);
  const spin = useRef<SVGGElement>(null);
  const [active, setActive] = useState<T | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      raf = 0;
      if (!box.current || !spin.current) return;
      const r = box.current.getBoundingClientRect();
      const deg = (window.innerHeight - r.top) * 0.18;
      spin.current.style.transform = `rotate(${deg}deg)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    tick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={box}
      className="relative mx-auto aspect-square w-full max-w-[560px]"
    >
      <svg
        viewBox="0 0 400 400"
        className="h-full w-full overflow-visible"
        role="group"
        aria-label="Topic dial"
      >
        <circle cx="200" cy="200" r="198" className="fill-paper" />

        <g ref={spin} style={{ transformOrigin: "200px 200px" }}>
          {Array.from({ length: 72 }, (_, i) => (
            <line
              key={i}
              x1="200"
              y1="4"
              x2="200"
              y2={i % 6 === 0 ? 14 : 9}
              transform={`rotate(${i * 5} 200 200)`}
              className="stroke-ink/40"
              strokeWidth="1"
            />
          ))}

          {topics.map((t, i) => (
            <text
              key={t.slug}
              role="button"
              tabIndex={0}
              aria-label={`Show ${t.title}`}
              onClick={() => setActive(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(t);
              }}
              x="200"
              y="38"
              textAnchor="middle"
              transform={`rotate(${(i * 360) / topics.length} 200 200)`}
              fontSize="10"
              letterSpacing="1"
              stroke="transparent"
              strokeWidth="8"
              className="cursor-pointer fill-ink outline-none transition-colors hover:[fill:var(--c)]"
              style={
                {
                  fontFamily: MONO,
                  fill: active?.slug === t.slug ? t.color : undefined,
                  "--c": t.color,
                } as React.CSSProperties
              }
            >
              {t.title.toUpperCase()}
            </text>
          ))}
        </g>

        <circle
          cx="200"
          cy="200"
          r="120"
          className="fill-none stroke-ink/15"
        />

        {!active && (
          <>
            <text
              x="200"
              y="198"
              textAnchor="middle"
              fontSize="30"
              className="font-display fill-ink"
            >
              SIGNAL
            </text>
            <text
              x="200"
              y="216"
              textAnchor="middle"
              fontSize="8"
              letterSpacing="2"
              className="fill-ink/60"
              style={{ fontFamily: MONO }}
            >
              (TAP A TOPIC)
            </text>
          </>
        )}

        <path d="M192 -10 L208 -10 L200 2 Z" className="fill-current" />
      </svg>

      {active && (
        <div className="absolute inset-[21%] flex flex-col items-center justify-center text-center text-ink">
          <span className="mo" style={{ color: active.color }}>
            ({String(active.count).padStart(2, "0")}{" "}
            {active.count === 1 ? "story" : "stories"})
          </span>
          <p className="font-display mt-1 text-[clamp(18px,3.4vw,30px)] uppercase leading-none">
            {active.title}
          </p>
          <p className="mt-2 line-clamp-4 text-[11px] leading-snug text-ink/70 sm:text-xs">
            {active.blurb}
          </p>
          <Link
            href={`/topic/${active.slug}`}
            className="mo mt-3 underline underline-offset-4 hover:opacity-70"
          >
            Open topic →
          </Link>
          <button
            type="button"
            onClick={() => setActive(null)}
            className="mo mt-1 text-ink/50 hover:text-ink"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}