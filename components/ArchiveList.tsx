"use client";
import { useState } from "react";
import Link from "next/link";

type Item = {
  id: string | number;
  slug: string;
  title: string;
  summary: string;
  label: string;
  color: string;
  minutes: number;
  date: string;
};

const SPAN = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "col-span-2",
  "",
  "",
  "col-span-2",
  "",
  "",
  "",
];
const LG_SPAN: Record<number, string> = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
};

const SKIN = [
  "cream",
  "line",
  "tint",
  "tint",
  "line",
  "cream",
  "line",
  "tint",
  "line",
  "tint",
  "cream",
  "line",
] as const;

export default function ArchiveList({ items }: { items: Item[] }) {
  const labels = Array.from(new Set(items.map((i) => i.label)));
  const [active, setActive] = useState("All");
  const patterned = active === "All";
  const shown = patterned ? items : items.filter((i) => i.label === active);

  // cells used by every tile before the last one (big = 4, wide = 2, small = 1)
  const cellsBeforeLast = shown.slice(0, -1).reduce((sum, _, i) => {
    const k = i % SPAN.length;
    return sum + (k === 0 ? 4 : SPAN[k] !== "" ? 2 : 1);
  }, 0);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", ...labels].map((l) => {
          const on = active === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setActive(l)}
              className={`mo rounded-full border px-4 py-2 transition-colors ${
                on
                  ? "border-paper bg-paper text-ink"
                  : "border-paper/30 hover:border-paper"
              }`}
            >
              {l}
            </button>
          );
        })}
      </div>

      <div className="grid auto-rows-[minmax(190px,auto)] grid-flow-dense grid-cols-2 gap-3 lg:grid-cols-4">
        {shown.map((p, i) => {
          const k = i % SPAN.length;
          const isLast = i === shown.length - 1;
          const big = patterned && k === 0;
          const wide = patterned && !big && SPAN[k] !== "";
          const skin = SKIN[k];

          let span = patterned ? SPAN[k] : "";
          if (patterned && isLast && !big) {
            const lgFill = 4 - (cellsBeforeLast % 4);
            span = `${cellsBeforeLast % 2 === 0 ? "col-span-2" : "col-span-1"} ${LG_SPAN[lgFill]}`;
          }
          const showSummary = big || wide || (patterned && isLast);

          return (
            <Link
              key={p.id}
              href={`/post/${p.slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border p-5 transition-all duration-500 hover:-translate-y-1 ${span} ${
                skin === "cream"
                  ? "border-transparent bg-paper text-ink hover:border-paper hover:bg-transparent hover:text-paper"
                  : "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-ink"
              }`}
            >
              {skin === "tint" && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                  style={{
                    background: `color-mix(in srgb, ${p.color} 22%, transparent)`,
                  }}
                />
              )}

              <div className="relative flex items-start justify-between gap-3">
                <span className="font-display text-[clamp(28px,3vw,44px)] leading-none opacity-80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mo flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: p.color }}
                  />
                  {p.label}
                </span>
              </div>

              <div className="relative mt-6">
                <h3
                  className={`uppercase [overflow-wrap:anywhere] ${
                    big
                      ? "font-display text-[clamp(26px,3.4vw,52px)] leading-[0.95]"
                      : wide || (patterned && isLast)
                        ? "text-xl font-semibold leading-[1.05] sm:text-2xl"
                        : "text-base font-semibold leading-[1.05] sm:text-lg"
                  }`}
                >
                  {p.title}
                </h3>
                {showSummary && p.summary && (
                  <p className="mt-3 max-w-[50ch] text-sm opacity-70">
                    {p.summary}
                  </p>
                )}
                <div className="mo mt-4 flex items-center justify-between opacity-70">
                  <span>
                    {p.minutes} min · {p.date}
                  </span>
                  <span className="text-lg transition-transform duration-300 group-hover:rotate-45">
                    ↗
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}