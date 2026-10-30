"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function PageMasthead({
  label,
  title,
  meta,
  date,
}: {
  label: string;
  title: string;
  meta: string;
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

  const letters = title.toUpperCase().split("");
  const vw = Math.min(21, (21 * 6) / Math.max(letters.length, 1));

  const box = useRef<HTMLElement>(null);
  const word = useRef<HTMLHeadingElement>(null);

  // fit the wordmark to the available width, never bigger than 21vw
  useIsoLayoutEffect(() => {
    const fit = () => {
      const b = box.current;
      const w = word.current;
      if (!b || !w) return;
      const cs = getComputedStyle(b);
      const avail =
        b.clientWidth -
        parseFloat(cs.paddingLeft || "0") -
        parseFloat(cs.paddingRight || "0");
      w.style.fontSize = "100px";
      const natural = w.offsetWidth;
      if (!natural) return;
      const size = Math.min((100 * avail) / natural, window.innerWidth * 0.21);
      w.style.fontSize = `${size}px`;
    };
    fit();
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [title]);

  return (
    <>
      <div className="mo mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
          </span>
          {label}
        </span>
        <span className="hidden sm:inline">{meta}</span>
        <span>
          {date} · <span className="tabular-nums">{time}</span>
        </span>
      </div>

      <section ref={box} className="flex justify-center px-3 pt-4 sm:px-5">
        <h1
          ref={word}
          aria-label={title}
          className="font-display inline-flex select-none whitespace-nowrap leading-[0.8] tracking-[-0.02em]"
          style={{ fontSize: `${vw}vw` }}
        >
          {letters.map((c, i) => (
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