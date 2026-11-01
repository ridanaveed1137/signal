import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import CountUp from "@/components/CountUp";
import ArchiveList from "@/components/ArchiveList";
import { colorFor, labelFor, readMinutes } from "@/lib/editorial";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects · Signal",
  description: "Tools, labs and experiments from the Signal community.",
};
export const revalidate = 60;

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

function fmtDate(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(+d)) return "";
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export default async function ProjectsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "project")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const posts = (data ?? []) as Post[];
  const lead = posts[0];
  const rest = posts.slice(1);

  const categories = new Set(posts.map((p) => labelFor(p))).size;
  const minutes = posts.reduce((sum, p) => sum + readMinutes(p.body), 0);

  const items = rest.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary ?? "",
    label: labelFor(p),
    color: colorFor(p),
    minutes: readMinutes(p.body),
    date: fmtDate((p as Post & { created_at?: string }).created_at),
  }));

  const lines = ["Built by", "the community,", "shown here."];

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
            (Project index)
          </span>
          <span>
            {posts.length} {posts.length === 1 ? "project" : "projects"}{" "}
            catalogued
          </span>
        </div>

        <h1
          aria-label="Built by the community, shown here."
          className="font-display mt-8 text-[clamp(34px,7.2vw,118px)] uppercase leading-[0.9] tracking-[-0.02em]"
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
            Tools, labs and experiments from the Signal community. An editor
            reviews every submission before it goes public.
          </p>
          <Link href="/submit" className="btn rounded-full">
            Submit a project
          </Link>
        </div>
      </section>

      {/* stats */}
      {posts.length > 0 && (
        <section className={`${wrap} pb-6 pt-4`}>
          <div className="grid grid-cols-3 border-y border-paper/30 divide-x divide-paper/30">
            <div className="p-4 md:p-6">
              <CountUp
                to={posts.length}
                className="font-display text-[clamp(36px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Projects</p>
            </div>
            <div className="p-4 md:p-6">
              <CountUp
                to={categories}
                className="font-display text-[clamp(36px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Categories</p>
            </div>
            <div className="p-4 md:p-6">
              <CountUp
                to={minutes}
                className="font-display text-[clamp(36px,5.6vw,88px)] leading-none"
              />
              <p className="mo mt-3">Minutes of reading</p>
            </div>
          </div>
        </section>
      )}

      {/* featured project */}
      {lead && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="Featured"
              index="01"
              aside="the project to start with"
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
                  <p className="mo">(Featured project) · {labelFor(lead)}</p>
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
          </div>
        </section>
      )}

      {/* all projects */}
      {items.length > 0 && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="All projects"
              index="02"
              aside={`${items.length} more`}
            />
            <ArchiveList items={items} />
          </div>
        </section>
      )}

      {/* empty state */}
      {posts.length === 0 && (
        <section className={`${wrap} pb-14`}>
          <p className="border border-ln bg-ch p-6 font-mono text-sm text-mu">
            <span className="text-ac">$</span> no projects published yet. be
            the first to submit one.
          </p>
        </section>
      )}

      {/* submit */}
      <section className={`${wrap} py-20 text-center`}>
        <p className="mo">(Contribute)</p>
        <h2 className="font-display mt-3 text-[clamp(32px,7vw,100px)] uppercase leading-[0.9]">
          Built something?
        </h2>
        <p className="mx-auto mt-4 max-w-[45ch] text-mu">
          Share your tool, lab or write-up with the community. An editor
          reviews it and approved work goes public with your name and
          timestamp.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex items-center rounded-full bg-paper px-8 py-4 font-mono text-xs uppercase tracking-widest text-ink hover:opacity-80"
        >
          Submit a project ↗
        </Link>
      </section>
    </main>
  );
}