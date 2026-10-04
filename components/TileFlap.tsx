"use client";

import { useEffect, useRef } from "react";

const PHRASES = [
  "SECURITY SIGNAL",
  "THREAT INTELLIGENCE",
  "NETWORK WATCH",
  "RESEARCH ONLINE",
  "SIGNAL DETECTED",
  "SECURITY IN FOCUS",
];
const N = 19;
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function TileFlap() {
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const first = PHRASES[0].padEnd(N);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const timers = new Set<ReturnType<typeof setInterval>>();
    let i = 0;

    function show() {
      const target = PHRASES[i++ % PHRASES.length].padEnd(N);

      tiles.current.forEach((el, k) => {
        if (!el) return;
        const final = target[k] === " " ? "\u00a0" : target[k];

        if (reduced) {
          el.textContent = final;
          return;
        }

        let step = 0;
        const max = 4 + (k % 6) + (k >> 1); // later tiles flip longer
        el.classList.add("go");

        const iv = setInterval(() => {
          step++;
          if (step >= max) {
            el.textContent = final;
            el.classList.remove("go");
            clearInterval(iv);
            timers.delete(iv);
          } else {
            el.textContent = CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }, 45 + k * 2);

        timers.add(iv);
      });
    }

    show();
    const loop = setInterval(show, 4200);

    return () => {
      clearInterval(loop);
      timers.forEach((t) => clearInterval(t));
    };
  }, []);

  return (
    <div className="sf" aria-label="Security signal">
      {Array.from({ length: N }, (_, k) => (
        <div
          key={k}
          className="tl"
          aria-hidden="true"
          ref={(el) => {
            tiles.current[k] = el;
          }}
        >
          {first[k] === " " ? "\u00a0" : first[k]}
        </div>
      ))}
    </div>
  );
}