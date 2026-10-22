import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TOPICS } from "@/lib/topics";
import { FIELD_NOTES } from "@/lib/fieldNotes";
import type { Post } from "@/lib/types";
import IntelFeed, { type FeedEvent } from "@/components/IntelFeed";
import OpenSearchButton from "@/components/OpenSearchButton";
import TopicDial from "@/components/TopicDial";
import Visual from "@/components/Visual";
import RotatingBadge from "@/components/RotatingBadge";
import PortraitCard from "@/components/story/PortraitCard";
import PillRow from "@/components/story/PillRow";
import ToolFeature from "@/components/story/ToolFeature";
import { colorFor, labelFor, readMinutes, stamp } from "@/lib/editorial";
import ArchiveList from "@/components/ArchiveList";
import HomeMasthead from "@/components/HomeMasthead";

const wrap = "mx-auto w-full max-w-7xl px-5";

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

export default async function HomePage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = (data ?? []) as Post[];

  const lead = list[0];
  const side = list.slice(1, 4);
  const latest = list.slice(4, 10);
  const afterLatest = list.slice(10);
  const tool = afterLatest.find((p) => p.type === "tool");
  const archive = afterLatest.filter((p) => p !== tool).slice(0, 12);

  const events: FeedEvent[] = [
    { stamp: "SYNC", text: `ok · ${list.length} posts indexed` },
    ...list.slice(0, 12).map((p) => ({
      stamp: new Date(p.created_at)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        .toUpperCase(),
      text: `new ${p.type} indexed · ${p.title}`,
    })),
  ];

  const counts: Record<string, number> = {};
  list.forEach((p) => {
    if (p.topic) counts[p.topic] = (counts[p.topic] ?? 0) + 1;
  });

  return (
    <main className="flex-1 overflow-x-clip">
            <HomeMasthead
        issue={String(list.length).padStart(3, "0")}
        posts={list.length}
        date={new Date()
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
          .toUpperCase()}
      />

      {/* intro row */}
      <section
        className={`${wrap} grid grid-cols-1 items-center gap-8 py-10 md:grid-cols-12`}
      >
        <p className="max-w-[34ch] text-xl uppercase leading-tight md:col-span-6 md:text-3xl">
          Trends, tools, ports and projects from the people building and
          breaking security.
        </p>
        <div className="flex flex-wrap items-center gap-3 md:col-span-4 [&_.btn]:rounded-full [&_button]:rounded-full">
          <OpenSearchButton>Explore signals</OpenSearchButton>
          <Link href="/submit" className="btn">
            Submit a post
          </Link>
        </div>
        <RotatingBadge className="hidden h-28 w-28 justify-self-end rounded-full bg-paper text-ink md:col-span-2 md:block" />
      </section>

      {/* cover story */}
      {lead && (
        <section className={`${wrap} py-6`}>
          <Link
            href={`/post/${lead.slug}`}
            className="group grid grid-cols-1 gap-8 rounded-[2.5rem] bg-paper p-6 text-ink md:grid-cols-12 md:p-10"
          >
            <div className="flex min-w-0 flex-col justify-between gap-10 md:col-span-7">
              <div className="mo flex justify-between">
                <span>(Cover story)</span>
                <span>{labelFor(lead)}</span>
              </div>
              <h2 className="font-display text-[clamp(30px,5.6vw,88px)] uppercase leading-[0.92] [overflow-wrap:anywhere]">
                {lead.title}
              </h2>
              <div>
                {lead.summary && (
                  <p className="max-w-[44ch] text-base text-ink/70 md:text-lg">
                    {lead.summary}
                  </p>
                )}
                <p className="mo mt-4 text-ink/60">
                  {lead.author_name} · {stamp(lead.created_at)} ·{" "}
                  {readMinutes(lead.body)} min
                </p>
              </div>
            </div>

            <div className="aspect-square min-w-0 self-center overflow-hidden rounded-full md:col-span-5 [&_svg]:h-full [&_svg]:w-full [&_svg]:grayscale [&_svg]:transition-[filter] [&_svg]:duration-700 group-hover:[&_svg]:grayscale-0">
              <Visual post={lead} big />
            </div>
          </Link>
        </section>
      )}

      {/* in this issue */}
      {side.length > 0 && (
        <section className={`${wrap} py-14`}>
          <SectionHead
            title="In this issue"
            index="01"
            aside={`${side.length} stories`}
          />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="flex min-w-0 flex-col gap-3 lg:col-span-8">
              {side.map((p, i) => (
                <PillRow key={p.id} post={p} index={i + 2} />
              ))}
            </div>
            <aside className="min-w-0 lg:col-span-4">
              <IntelFeed events={events} />
            </aside>
          </div>
        </section>
      )}

      {/* topic dial */}
      <section className="border-t border-paper/30">
        <div
          className={`${wrap} grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2`}
        >
          <div className="min-w-0">
            <span className="mo">(Topics)</span>
            <h2 className="font-display mt-3 text-[clamp(44px,8vw,120px)] uppercase leading-[0.85]">
              Tune into a signal.
            </h2>
            <p className="mt-5 max-w-[40ch] text-mu">
              Scroll to turn the dial. Tap a topic to see what it covers.
            </p>
          </div>

          <TopicDial
            topics={TOPICS.map((t) => ({
              slug: t.slug,
              title: t.title,
              color: t.color,
              blurb: t.blurb,
              count: counts[t.slug] ?? 0,
            }))}
          />
        </div>
      </section>

      {/* latest */}
      {latest.length > 0 && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="Latest"
              index="02"
              aside={`${latest.length} stories`}
            />
            <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((p, i) => (
                <PortraitCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* tool of the moment */}
      {tool && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <div className="mb-8 flex items-end justify-between gap-3 border-b border-paper/30 pb-3">
              <h2 className="font-display text-[clamp(28px,4.2vw,64px)] uppercase leading-[0.85]">
                <sup className="mo mr-3 align-top">(03)</sup>
                Tool of the moment
              </h2>
              <span className="mo">(Field manual)</span>
            </div>
            <ToolFeature post={tool} />
          </div>
        </section>
      )}

      {/* archive */}
      {archive.length > 0 && (
        <section className="border-t border-paper/30">
          <div className={`${wrap} py-14`}>
            <SectionHead
              title="Archive"
              index="04"
              aside={`${archive.length} more`}
            />
 <ArchiveList
  items={archive.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    summary: p.summary ?? "",
    label: labelFor(p),
    color: colorFor(p),
    minutes: readMinutes(p.body),
    date: stamp(p.created_at),
  }))}
/>
          </div>
        </section>
      )}

      {/* field notes */}
      <section className="border-t border-paper/30">
        <div className={`${wrap} py-14`}>
          <SectionHead title="Field notes" index="05" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {FIELD_NOTES.map((note, i) => (
              <div
                key={i}
                className="flex items-start gap-4 rounded-[2rem] bg-paper p-5 text-ink"
              >
                <span className="font-display flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-paper">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="min-w-0 text-sm font-semibold leading-snug [overflow-wrap:anywhere] sm:text-base">
                  {note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* publish */}
      <section className={`${wrap} py-20 text-center`}>
        <p className="mo">(Publish)</p>
        <h2 className="font-display mt-3 text-[clamp(32px,7vw,100px)] uppercase leading-[0.9]">
          Publish what you find.
        </h2>
        <p className="mx-auto mt-4 max-w-[50ch] text-mu">
          Write it up. An editor reviews it. Approved work goes public with
          your name and timestamp.
        </p>
        <Link
          href="/submit"
          className="mt-8 inline-flex items-center rounded-full bg-paper px-8 py-4 font-mono text-xs uppercase tracking-widest text-ink hover:opacity-80"
        >
          Submit a post ↗
        </Link>
      </section>

      {/* closing wordmark */}
      <section className="overflow-hidden px-3 sm:px-5" aria-hidden="true">
        <p className="font-display select-none whitespace-nowrap text-center text-[21vw] leading-[0.74] tracking-[-0.02em]">
          SIGNAL
        </p>
      </section>
    </main>
  );
}