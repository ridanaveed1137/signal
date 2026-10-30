import Link from "next/link";
import type { Post } from "@/lib/types";
import { colorFor, labelFor, readMinutes } from "@/lib/editorial";

// Staggered two-column cards for the Trends "Analysis" section.
//
// - Rows are equal height (no ragged gaps); the right column is then
//   shifted down on desktop for the magazine-spread stagger.
// - Same visual language as the Archive tiles: every 4th card is cream,
//   the rest are outlined with a soft tint of the post's colour, and any
//   card fills with that colour on hover.
// - If the last card would sit alone in its row it spans the full width.
export default function AnalysisCards({
  posts,
  startAt = 2,
}: {
  posts: Post[];
  startAt?: number;
}) {
  if (posts.length === 0) return null;

  return (
    <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7 md:pb-16">
      {posts.map((p, i) => {
        const accent = colorFor(p);
        const cream = i % 4 === 0;
        const loneLast = i === posts.length - 1 && posts.length % 2 === 1;

        return (
          <li
            key={p.id}
            className={`${
              i % 2 === 1 ? "md:translate-y-16" : ""
            } ${loneLast ? "md:col-span-2" : ""}`}
          >
            <Link
              href={`/post/${p.slug}`}
              style={{ ["--c" as string]: accent }}
              className={`group relative flex h-full min-h-[270px] flex-col justify-between gap-8 overflow-hidden rounded-[2rem] border p-6 transition-all duration-500 hover:-translate-y-1.5 hover:border-transparent hover:bg-[var(--c)] hover:text-ink md:min-h-[310px] md:p-8 ${
                cream
                  ? "border-transparent bg-paper text-ink"
                  : "border-paper/30 text-paper"
              }`}
            >
              {/* soft colour tint on the outlined cards, fades on hover */}
              {!cream && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 transition-opacity duration-500 group-hover:opacity-0"
                  style={{
                    background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                  }}
                />
              )}

              {/* big index number */}
              <span
                aria-hidden="true"
                className="font-display pointer-events-none absolute -right-3 -top-6 select-none text-[clamp(120px,14vw,210px)] leading-none opacity-[0.1] transition-transform duration-700 group-hover:scale-105"
              >
                {String(i + startAt).padStart(2, "0")}
              </span>

              <div className="relative min-w-0">
                <p className="mo flex items-center gap-2">
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: accent }}
                  />
                  {labelFor(p)} · {readMinutes(p.body)} min
                </p>
                <h3
                  className={`font-display mt-5 uppercase leading-[0.98] [overflow-wrap:anywhere] ${
                    loneLast
                      ? "max-w-[22ch] text-[clamp(28px,3.4vw,56px)]"
                      : "text-[clamp(26px,2.8vw,44px)]"
                  }`}
                >
                  {p.title}
                </h3>
                {p.summary && (
                  <p
                    className={`mt-4 line-clamp-3 text-base leading-snug opacity-70 ${
                      loneLast ? "max-w-[60ch] md:text-lg" : "max-w-[48ch]"
                    }`}
                  >
                    {p.summary}
                  </p>
                )}
              </div>

              <div className="relative flex items-center justify-between">
                <span className="mo opacity-80">Read analysis</span>
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-xl transition-transform duration-500 group-hover:rotate-45 ${
                    cream
                      ? "bg-ink text-paper"
                      : "bg-paper text-ink group-hover:bg-ink group-hover:text-paper"
                  }`}
                >
                  ↗
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}