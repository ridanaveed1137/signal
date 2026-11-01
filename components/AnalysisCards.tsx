import Link from "next/link";
import type { Post } from "@/lib/types";
import { colorFor, labelFor, readMinutes } from "@/lib/editorial";

// Analysis as a typographic index: numerals, one hairline per story,
// strong headlines. On hover a row floods with the story's own colour.
// (File and props are unchanged, so page.tsx needs no edit.)
export default function AnalysisCards({
  posts,
  startAt = 2,
}: {
  posts: Post[];
  startAt?: number;
}) {
  if (posts.length === 0) return null;

  return (
    <ul className="mt-12 border-t border-paper/40">
      {posts.map((p, i) => {
        const accent = colorFor(p);
        return (
          <li key={p.id} className="border-b border-paper/20">
            <Link
              href={`/post/${p.slug}`}
              style={{ ["--c" as string]: accent }}
              className="group grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-3 py-6 transition-all duration-300 hover:bg-[var(--c)] hover:px-5 hover:text-ink active:bg-[var(--c)] active:text-ink md:grid-cols-[72px_minmax(0,1fr)_170px] md:gap-x-8 md:py-8"
            >
              {/* numeral */}
              <span className="font-display text-[clamp(22px,2.4vw,36px)] leading-[1] opacity-40 transition-opacity group-hover:opacity-100">
                {String(i + startAt).padStart(2, "0")}
              </span>

              {/* headline + summary */}
              <div className="min-w-0">
                <h3 className="font-display text-[clamp(20px,2.3vw,34px)] uppercase leading-[1.02] [overflow-wrap:anywhere]">
                  {p.title}
                </h3>
                {p.summary && (
                  <p className="mt-3 line-clamp-2 max-w-[64ch] text-sm opacity-65 md:text-base">
                    {p.summary}
                  </p>
                )}
              </div>

              {/* meta */}
              <div className="mo col-span-2 flex items-center justify-between gap-3 md:col-span-1 md:flex-col md:items-end md:justify-between md:self-stretch">
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: accent }}
                  />
                  {labelFor(p)}
                </span>
                <span className="flex items-center gap-4">
                  <span className="opacity-60">{readMinutes(p.body)} min</span>
                  <span className="text-lg leading-none transition-transform duration-300 group-hover:rotate-45">
                    ↗
                  </span>
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}