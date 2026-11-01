"use client";
import { useEffect, useState } from "react";

export default function HomeMasthead({
  date,
}: {
  // issue / posts are still passed by HomePage but no longer shown
  issue?: string;
  posts?: number;
  date: string;
}) {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      {/* tiny top row */}
      <div className="mo mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
          </span>
          (Signal)
        </span>
        <span>
          {date} · <span className="tabular-nums">{time}</span>
        </span>
      </div>

      {/* giant wordmark */}
      <section className="px-3 pt-4 sm:px-5">
        <h1
          aria-label="Signal"
          className="font-display flex select-none justify-center whitespace-nowrap text-[21vw] leading-[0.8] tracking-[-0.02em]"
        >
          {"SIGNAL".split("").map((c, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block animate-[rise-in_1s_cubic-bezier(.2,.8,.2,1)_backwards] cursor-default transition-[transform,color] duration-300 hover:-translate-y-[4%] hover:text-ac motion-reduce:animate-none"
              style={{ animationDelay: `${0.1 + i * 0.09}s` }}
            >
              {c}
            </span>
          ))}
        </h1>
      </section>
    </>
  );
}