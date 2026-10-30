"use client";
import { useEffect, useState } from "react";

export type LiveItem = {
  cve: string;
  vendor: string;
  product: string;
  name: string;
  desc: string;
  day: string;
  year: string;
  ago: string;
  due: string;
  ransomware: boolean;
};

const PALETTE = [
  "#e5a53b",
  "#38bdf8",
  "#7c5cff",
  "#2dd4bf",
  "#ff7a59",
  "#7bd88f",
  "#f472b6",
];

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// true when CISA added the entry within the last few days.
// Worked out in the visitor's browser so it never goes stale; no date is shown.
function isNew(day: string, year: string, now: number) {
  const [d, m] = day.split(" ");
  const added = Date.UTC(Number(year), MONTHS.indexOf(m), Number(d));
  const n = Math.floor((now - added) / 86400000);
  return !Number.isNaN(n) && n <= 3;
}

// stable accent color per vendor
const hue = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export default function LiveFeed({ items }: { items: LiveItem[] }) {
  const [only, setOnly] = useState<"all" | "ransom">("all");
  const [visible, setVisible] = useState(5);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 3600000);
    return () => clearInterval(id);
  }, []);

  const pool = only === "all" ? items : items.filter((i) => i.ransomware);
  const shown = pool.slice(0, visible);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["all", `All (${items.length})`],
              [
                "ransom",
                `Ransomware-linked (${items.filter((i) => i.ransomware).length})`,
              ],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => {
                setOnly(k);
                setVisible(5);
              }}
              className={`mo rounded-full border px-4 py-2 transition-colors ${
                only === k
                  ? "border-paper bg-paper text-ink"
                  : "border-paper/30 hover:border-paper"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="mo">
          Showing {shown.length} of {pool.length}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((i, idx) => {
          const feature = idx === 0;
          const color = i.ransomware ? "#ff3b30" : hue(i.vendor);

          return (
            <a
              key={i.cve}
              href={`https://nvd.nist.gov/vuln/detail/${i.cve}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative flex flex-col justify-between overflow-hidden border border-ln bg-ch transition-all duration-300 hover:-translate-y-1 hover:border-paper/60 ${
                feature ? "p-6 md:col-span-2 md:p-8" : "p-5"
              }`}
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: color }}
              />

              <div className="mo flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: color }}
                  />
                  Actively exploited
                </span>
                {now && isNew(i.day, i.year, now) && (
                  <span
                    className="shrink-0 rounded-full border px-2 py-0.5"
                    style={{ color, borderColor: color }}
                  >
                    New
                  </span>
                )}
              </div>

              <div className={feature ? "mt-12" : "mt-8"}>
                <p
                  className={`font-display uppercase leading-[0.95] [overflow-wrap:anywhere] ${
                    feature
                      ? "text-[clamp(34px,4.6vw,68px)]"
                      : "text-[clamp(22px,2.3vw,32px)]"
                  }`}
                >
                  {i.vendor}
                </p>
                <p className="mo mt-2 opacity-60">{i.product}</p>
                <p
                  className={`mt-5 font-semibold uppercase leading-[1.1] [overflow-wrap:anywhere] ${
                    feature ? "text-xl md:text-2xl" : "text-base"
                  }`}
                >
                  {i.name}
                </p>
                <p
                  className={`mt-3 text-sm opacity-60 ${
                    feature
                      ? "line-clamp-4 md:max-w-[60ch] md:text-base"
                      : "line-clamp-3"
                  }`}
                >
                  {i.desc}
                </p>
              </div>

              <div className="mo mt-6 flex items-center justify-between gap-3 border-t border-ln pt-4">
                <span className="flex flex-wrap items-center gap-2">
                  <span>{i.cve}</span>
                  {i.ransomware && (
                    <span className="rounded-full bg-ac px-2 py-0.5 text-white">
                      Ransomware
                    </span>
                  )}
                </span>
                <span className="text-lg transition-transform duration-300 group-hover:rotate-45">
                  ↗
                </span>
              </div>
            </a>
          );
        })}
      </div>

      <p className="mo mt-6 normal-case tracking-normal opacity-70">
        Newest first, from CISA&apos;s catalog of vulnerabilities confirmed to
        be under active attack.
      </p>

      {visible < pool.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + 6)}
          className="mo mt-6 rounded-full border border-paper/30 px-6 py-3 transition-colors hover:border-paper hover:bg-paper hover:text-ink"
        >
          Show 6 more
        </button>
      )}
    </div>
  );
}