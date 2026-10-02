"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export default function SplitFlap({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    // skip the animation for people who prefer reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const letters = text.split("");
    // the tick at which each letter locks into place
    const settleAt = letters.map((_, i) => 8 + i * 4);
    const lastTick = settleAt[settleAt.length - 1];
    let tick = 0;

    const id = setInterval(() => {
      tick++;

      setDisplay(
        letters
          .map((ch, i) => {
            if (ch === " " || tick >= settleAt[i]) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (tick >= lastTick) clearInterval(id);
    }, 60);

    return () => clearInterval(id);
  }, [text]);

  return <span aria-label={text}>{display}</span>;
}