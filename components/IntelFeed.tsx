"use client";

import { useEffect, useState } from "react";
import { rng } from "@/lib/seed";

export type FeedEvent = { stamp: string; text: string };

const rn = rng("intel-network");
const POINTS = Array.from({ length: 14 }, () => [
  Math.round(20 + rn() * 260),
  Math.round(15 + rn() * 120),
]);

const rb = rng("intel-bars");
const BARS = Array.from({ length: 28 }, () => ({
  h: Math.round(20 + rb() * 80),
  d: (rb() * 2).toFixed(2),
}));

export default function IntelFeed({ events }: { events: FeedEvent[] }) {
  const visible = Math.min(7, events.length);
  const [tick, setTick] = useState(visible - 1);

  // scroll the log by one line every 1.6s when there are more events than fit
  useEffect(() => {
    if (events.length <= visible) return;
    const id = setInterval(() => setTick((t) => t + 1), 1600);
    return () => clearInterval(id);
  }, [events.length, visible]);

  const lines = Array.from({ length: visible }, (_, k) => {
    const j = tick - visible + 1 + k;
    return { j, ev: events[j % events.length] };
  });

  return (
    <div className="min-h-[340px] overflow-hidden border border-ln bg-ch/70 p-3.5">
      <div className="mo flex justify-between">
        <span>Intelligence feed</span>
        <span className="text-ac">● streaming</span>
      </div>

      <svg viewBox="0 0 300 150" className="h-[150px] w-full" aria-hidden="true">
        {POINTS.map((p, i) => {
          const q = POINTS[(i * 5 + 3) % 14];
          return (
            <line
              key={`l${i}`}
              x1={p[0]}
              y1={p[1]}
              x2={q[0]}
              y2={q[1]}
              stroke="#5fd0c4"
              strokeOpacity="0.2"
            />
          );
        })}
        {POINTS.map((p, i) => (
          <circle key={`c${i}`} cx={p[0]} cy={p[1]} r="3" fill="#5fd0c4">
            <animate
              attributeName="opacity"
              values="1;.2;1"
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div className="bars" aria-hidden="true">
        {BARS.map((b, i) => (
          <i key={i} style={{ height: `${b.h}%`, animationDelay: `-${b.d}s` }} />
        ))}
      </div>

      <div className="mo mt-3 h-[130px] overflow-hidden normal-case leading-[1.7] tracking-normal text-gr">
        {lines.length === 0 && <div>waiting for signals...</div>}
        {lines.map(({ j, ev }) => (
          <div key={j} className="truncate">
            <b className="font-normal text-ac">{ev.stamp}</b> {ev.text}
          </div>
        ))}
      </div>
    </div>
  );
}