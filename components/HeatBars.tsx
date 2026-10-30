"use client";
import { useEffect, useRef, useState } from "react";

type Row = { label: string; count: number; color: string };

export default function HeatBars({ rows }: { rows: Row[] }) {
  const ref = useRef<HTMLUListElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <ul ref={ref} className="space-y-3">
      {rows.map((r, i) => (
        <li
          key={r.label}
          className="grid grid-cols-[110px_1fr_36px] items-center gap-4 sm:grid-cols-[200px_1fr_48px]"
        >
          <span className="mo flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: r.color }}
            />
            {r.label}
          </span>
          <span className="h-3 overflow-hidden rounded-full bg-paper/10">
            <span
              className="block h-full rounded-full transition-[width] duration-1000 ease-out motion-reduce:transition-none"
              style={{
                width: on ? `${(r.count / max) * 100}%` : "0%",
                background: r.color,
                transitionDelay: `${i * 80}ms`,
              }}
            />
          </span>
          <span className="font-display text-right text-xl">{r.count}</span>
        </li>
      ))}
    </ul>
  );
}