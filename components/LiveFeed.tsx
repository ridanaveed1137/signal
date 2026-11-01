"use client";
import { useCallback, useEffect, useRef, useState } from "react";

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
// Worked out in the visitor's browser so it never goes stale.
function isNew(day: string, year: string, now: number) {
  const [d, m] = day.split(" ");
  const added = Date.UTC(Number(year), MONTHS.indexOf(m), Number(d));
  const n = Math.floor((now - added) / 86400000);
  return !Number.isNaN(n) && n <= 3;
}

// stable accent colour per vendor (ransomware-linked entries are red)
const hue = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

// One horizontal strip of connected cells, like a weekly schedule board.
// Swipe / drag / shift-scroll, or use the arrows to step left and right.
export default function LiveFeed({ items }: { items: LiveItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 3600000);
    return () => clearInterval(id);
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    sync();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sync, items.length]);

  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // step by about one screenful of cards
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const arrow =
    "flex h-12 w-12 items-center justify-center rounded-full border border-paper/40 text-xl leading-none transition-colors hover:border-paper hover:bg-paper hover:text-ink disabled:pointer-events-none disabled:opacity-25";

  return (
    <div>
      <div className="mb-5 flex items-center justify-end gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            aria-label="Previous entries"
            onClick={() => go(-1)}
            disabled={!canPrev}
            className={arrow}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next entries"
            onClick={() => go(1)}
            disabled={!canNext}
            className={arrow}
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={track}
        onScroll={sync}
        tabIndex={0}
        aria-label="Live feed of exploited vulnerabilities"
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth border border-paper/30 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((i) => {
          const fresh = now !== null && isNew(i.day, i.year, now);
          const color = i.ransomware ? "#ff3b30" : hue(i.vendor);

          return (
            <a
              key={i.cve}
              href={`https://nvd.nist.gov/vuln/detail/${i.cve}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ["--c" as string]: color }}
              className="group flex min-h-[380px] w-[80vw] shrink-0 snap-start flex-col border-r border-paper/30 transition-colors duration-300 last:border-r-0 hover:bg-[var(--c)] hover:text-ink active:bg-[var(--c)] active:text-ink sm:w-[320px]"
            >
              {/* date header */}
              <div className="mo flex items-center justify-between gap-3 border-b border-paper/30 px-5 py-3 group-hover:border-ink/30">
                <span>
                  {i.day} {i.year}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: color }}
                  />
                  {fresh ? "New" : i.ago}
                </span>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col px-5 pb-5 pt-6">
                <p className="font-display text-[clamp(26px,2.2vw,34px)] uppercase leading-[0.98] [overflow-wrap:anywhere]">
                  {i.vendor}
                </p>
                <p className="mo mt-2 line-clamp-2 opacity-60">{i.product}</p>

                <p className="mt-5 line-clamp-4 text-sm font-semibold uppercase leading-snug [overflow-wrap:anywhere]">
                  {i.name}
                </p>
                <p className="mt-3 line-clamp-3 text-sm opacity-60">
                  {i.desc}
                </p>

                <div className="mo mt-auto flex items-end justify-between gap-3 pt-6">
                  <span className="min-w-0">
                    <span className="block">{i.cve}</span>
                    {i.ransomware && (
                      <span className="mt-1 block text-ac group-hover:text-ink">
                        Ransomware
                      </span>
                    )}
                  </span>
                  <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-45">
                    ↗
                  </span>
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}