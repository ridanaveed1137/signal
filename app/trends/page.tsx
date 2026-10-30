import AnalysisCards from "@/components/AnalysisCards";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { getKev } from "@/lib/kev";
import CountUp from "@/components/CountUp";
import HeatBars from "@/components/HeatBars";
import LiveFeed, { type LiveItem } from "@/components/LiveFeed";
import { colorFor, labelFor, readMinutes } from "@/lib/editorial";

export const revalidate = 600;

const wrap = "mx-auto w-full max-w-7xl px-5";

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

const HEAT_COLORS = [
  "#ff3b30",
  "#e5a53b",
  "#38bdf8",
  "#7c5cff",
  "#2dd4bf",
  "#ff7a59",
  "#7bd88f",
  "#f472b6",
];

function SectionHead({
  title,
  aside,
  index,
}: {
  title: string;
  aside?: string;
  index?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-3 border-b border-paper/30 pb-3">
      <h2 className="font-display text-[clamp(36px,7vw,110px)] uppercase leading-[0.85]">
        {index && <sup className="mo mr-3 align-top">({index})</sup>}
        {title}
      </h2>
      {aside && <span className="mo">({aside})</span>}
    </div>
  );
}

export default async function TrendsPage() {
  const [{ data, error }, kev] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("type", "trend")
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false }),
    getKev(),
  ]);

  if (error) console.log(error);

  const posts = (data ?? []) as Post[];
  const lead = posts[0];
  const analysis = posts.slice(1);

  // ---- live data ----
  const now = Date.now();
  const daysAgo = (iso: string) =>
    Math.floor((now - new Date(`${iso}T00:00:00Z`).getTime()) / 86400000);
  const fmt = (iso: string) => {
    const d = new Date(`${iso}T00:00:00Z`);
    return {
      day: `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`,
      year: String(d.getUTCFullYear()),
    };
  };
  const agoText = (n: number) =>
    n <= 0 ? "today" : n === 1 ? "yesterday" : `${n} days ago`;

  const all = kev?.items ?? [];
  const last7 = all.filter((i) => daysAgo(i.added) <= 7).length;
  const last30 = all.filter((i) => daysAgo(i.added) <= 30);
  const ransom30 = last30.filter((i) => i.ransomware).length;

  const windowDays = last30.length >= 6 ? 30 : 90;
  const windowItems = all.filter((i) => daysAgo(i.added) <= windowDays);
  const vendorMap = new Map<string, number>();
  windowItems.forEach((i) =>
    vendorMap.set(i.vendor, (vendorMap.get(i.vendor) ?? 0) + 1)
  );
  const vendors = Array.from(vendorMap, ([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
    .map((v, i) => ({ ...v, color: HEAT_COLORS[i % HEAT_COLORS.length] }));

  const liveItems: LiveItem[] = all.slice(0, 48).map((i) => ({
    cve: i.cve,
    vendor: i.vendor,
    product: i.product,
    name: i.name,
    desc: i.desc,
    day: fmt(i.added).day,
    year: fmt(i.added).year,
    ago: agoText(daysAgo(i.added)),
    due: i.due ? `${fmt(i.due).day} ${fmt(i.due).year}` : "",
    ransomware: i.ransomware,
  }));

  const updated = kev?.released
    ? (() => {
        const d = new Date(kev.released);
        return Number.isNaN(+d)
          ? ""
          : `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]}`;
      })()
    : "";

  const lines = ["What is", "changing in", "security."];

  return (
    <main className="flex-1 overflow-x-clip">
      {/* statement hero */}
      <section className={`${wrap} pb-10 pt-8`}>
        <div className="mo flex items-center justify-between">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ac opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ac" />
            </span>
            (Live wire)
          </span>
          <span>{updated ? `Updated ${updated}` : "Updates hourly"}</span>
        </div>

        <h1
          aria-label="What is changing in security."
          className="font-display mt-8 text-[clamp(44px,10.5vw,170px)] uppercase leading-[0.9] tracking-[-0.02em]"
        >
          {lines.map((line, i) => (
            <span
              key={line}
              aria-hidden="true"
              className="block overflow-hidden pb-[0.1em]"
            >
              <span
                className="block animate-[rise-in_1s_cubic-bezier(.2,.8,.2,1)_backwards] motion-reduce:animate-none"
                style={{
                  animationDelay: `${0.1 + i * 0.18}s`,
                  color: i === 1 && lead ? colorFor(lead) : undefined,
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-[44ch] text-lg text-mu md:text-xl">
            Updated automatically from the vulnerabilities attackers are
            exploiting right now, with analysis curated by Signal.
          </p>
          <Link href="/submit" className="btn rounded-full">
            Report a trend
          </Link>
        </div>
      </section>

      {/* live stats */}
      {kev && (
        <section className={`${wrap} pb-6 pt-4`}>
          <div className="grid grid-cols-2 border-y border-paper/30 md:grid-cols-4 md:divide-x md:divide-paper/30">
            <div className="p-6">
              <CountUp
                to={last7}
                className="font-display text-[clamp(40px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Added this week</p>
            </div>
            <div className="p-6">
              <CountUp
                to={last30.length}
                className="font-display text-[clamp(40px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Added in 30 days</p>
            </div>
            <div className="p-6">
              <CountUp
                to={ransom30}
                className="font-display text-[clamp(40px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Ransomware-linked</p>
            </div>
            <div className="p-6">
              <CountUp
                to={kev.total}
                className="font-display text-[clamp(40px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Exploited, on record</p>
            </div>
          </div>
        </section>
      )}

      {/* live feed */}
      <section className="border-t border-paper/30">
        <div className={`${wrap} py-14`}>
          <SectionHead
            title="Live feed"
            index="01"
            aside="newly exploited vulnerabilities"
          />
          {kev ? (
            <>
              <LiveFeed items={liveItems} />
              <p className="mo mt-8 normal-case tracking-normal opacity-70">
                Source: CISA Known Exploited Vulnerabilities catalog. Refreshed
                hourly. Each entry links to its official record.
              </p>
            </>
          ) : (
            <p className="border border-ln bg-ch p-6 font-mono text-sm text-mu">
              <span className="text-ac">$</span> the live feed is unreachable
              right now. check back in a few minutes.
            </p>
          )}
        </div>
      </section>

      {/* most targeted vendors */}
      {vendors.length > 1 && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="Most targeted"
              index="02"
              aside={`vendors, last ${windowDays} days`}
            />
            <HeatBars rows={vendors} />
          </div>
        </section>
      )}

      {/* editor's pick + analysis */}
      {lead && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="Analysis"
              index="03"
              aside="curated by Signal"
            />

            <Link
              href={`/post/${lead.slug}`}
              className="group relative block overflow-hidden rounded-[2.5rem] p-6 text-ink md:p-12"
              style={{ background: colorFor(lead) }}
            >
              <span
                aria-hidden="true"
                className="font-display pointer-events-none absolute -right-6 -top-10 select-none text-[clamp(180px,30vw,420px)] leading-none opacity-15 transition-transform duration-700 group-hover:scale-105"
              >
                01
              </span>

              <div className="relative grid gap-10 md:grid-cols-12">
                <div className="min-w-0 md:col-span-8">
                  <p className="mo">(Editor&apos;s pick) · {labelFor(lead)}</p>
                  <h3 className="font-display mt-6 text-[clamp(30px,5vw,84px)] uppercase leading-[0.92] [overflow-wrap:anywhere]">
                    {lead.title}
                  </h3>
                </div>

                <div className="flex flex-col justify-end gap-5 md:col-span-4">
                  {lead.summary && (
                    <p className="text-base md:text-lg">{lead.summary}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="mo">{readMinutes(lead.body)} min read</p>
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-xl text-paper transition-transform duration-500 group-hover:rotate-45">
                      ↗
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {analysis.length > 0 && (
<AnalysisCards posts={analysis} />
            )}
          </div>
        </section>
      )}

      {/* report */}
      <section className={`${wrap} py-20 text-center`}>
        <p className="mo">(Report)</p>
        <h2 className="font-display mt-3 text-[clamp(32px,7vw,100px)] uppercase leading-[0.9]">
          Spotted a shift?
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-mu">
          Tell the community what changed. An editor reviews it and approved
          work goes public with your name and timestamp.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex items-center rounded-full bg-paper px-8 py-4 font-mono text-xs uppercase tracking-widest text-ink hover:opacity-80"
        >
          Submit a post ↗
        </Link>
      </section>
    </main>
  );
}