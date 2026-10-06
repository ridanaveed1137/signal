import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TOPICS } from "@/lib/topics";
import { FIELD_NOTES } from "@/lib/fieldNotes";
import type { Post } from "@/lib/types";
import TileFlap from "@/components/TileFlap";
import IntelFeed, { type FeedEvent } from "@/components/IntelFeed";
import OpenSearchButton from "@/components/OpenSearchButton";
import FadeIn from "@/components/FadeIn";
import HeroStory from "@/components/story/HeroStory";
import FeatureStory from "@/components/story/FeatureStory";
import CompactStory from "@/components/story/CompactStory";
import BriefStory from "@/components/story/BriefStory";
import ToolFeature from "@/components/story/ToolFeature";
import ResearchFeature from "@/components/story/ResearchFeature";

export const dynamic = "force-dynamic";

const wrap = "mx-auto w-full max-w-7xl px-5";

function SectionHead({
  title,
  aside,
  dark = true,
}: {
  title: string;
  aside?: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-3">
      <h2 className="text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
        {title}
      </h2>
      {aside && (
        <span className={`mo ${dark ? "" : "text-ink/60"}`}>{aside}</span>
      )}
    </div>
  );
}

export default async function Home() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = (data ?? []) as Post[];

  // editorial slots, filled from your real posts
  const lead = list[0];
  const side = list.slice(1, 4);
  const briefs = list.slice(4, 10);
  const features = list.slice(10, 12);
  const rest = list.slice(12);
  const tool = rest.find((p) => p.type === "tool");
  const more = rest.filter((p) => p !== tool).slice(0, 12);
  const paper = list.find((p) => p.type === "paper");

  // real recent activity for the intelligence feed
  const events: FeedEvent[] = [
    { stamp: "SYNC", text: `ok · ${list.length} posts indexed` },
    ...list.slice(0, 12).map((p) => ({
      stamp: new Date(p.created_at)
        .toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
        .toUpperCase(),
      text: `new ${p.type} indexed · ${p.title}`,
    })),
  ];

  // story count per topic, and the 3 busiest topics count as "trending"
  const counts: Record<string, number> = {};
  list.forEach((p) => {
    if (p.topic) counts[p.topic] = (counts[p.topic] ?? 0) + 1;
  });

  const trending = new Set(
    TOPICS.filter((t) => (counts[t.slug] ?? 0) > 0)
      .sort((a, b) => (counts[b.slug] ?? 0) - (counts[a.slug] ?? 0))
      .slice(0, 3)
      .map((t) => t.slug)
  );

  return (
    <main className="flex-1">
      {/* masthead */}
      <section className={`${wrap} flex flex-wrap items-end justify-between gap-6 py-8`}>
        <div>
          <span className="mo">[ Security publication / 2026 ]</span>
          <TileFlap />
        </div>
        <div className="max-w-[40ch]">
          <p className="text-mu">
            Research, trends, tools and ideas from the people building and
            breaking security.
          </p>
          <OpenSearchButton>Explore signals</OpenSearchButton>
          <Link href="/submit" className="btn">
            Publish research
          </Link>
        </div>
      </section>

      {/* lead story + sidebar */}
      {lead ? (
        <section className="border-t border-ln">
          <div className={`${wrap} grid gap-10 py-10 lg:grid-cols-12`}>
            <div className="lg:col-span-8">
              <HeroStory post={lead} />
            </div>

            <aside className="flex flex-col gap-6 lg:col-span-4">
              <IntelFeed events={events} />
              <div>
                <p className="mo mb-1">Also today</p>
                {side.map((p) => (
                  <CompactStory key={p.id} post={p} />
                ))}
              </div>
            </aside>
          </div>
        </section>
      ) : (
        <section className={`${wrap} py-16`}>
          <p className="text-mu">No stories yet.</p>
        </section>
      )}

      {/* short signals */}
      {briefs.length > 0 && (
        <section className="border-t border-ln">
          <div className={`${wrap} py-10`}>
            <SectionHead title="Signals" aside="In brief" />
            <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
              {briefs.map((p) => (
                <BriefStory key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* features */}
      {features.length > 0 && (
        <section className="border-t border-ln">
          <div className={`${wrap} flex flex-col gap-20 py-14`}>
            {features.map((p, i) => (
              <FadeIn key={p.id}>
                <FeatureStory post={p} flip={i % 2 === 1} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* featured tool */}
      {tool && (
        <section className="border-t border-ln">
          <div className={`${wrap} py-14`}>
            <ToolFeature post={tool} />
          </div>
        </section>
      )}

      {/* research, on a light page */}
      {paper && (
        <section className="bg-paper text-ink">
          <div className={`${wrap} py-14`}>
            <SectionHead title="Research" aside="Papers" dark={false} />
            <ResearchFeature post={paper} />
          </div>
        </section>
      )}

      {/* topics */}
      <section className="border-t border-ln">
        <div className={`${wrap} py-10`}>
          <SectionHead title="Current signals" aside="Topics" />

          <div className="sig">
            {TOPICS.map((t) => {
              const n = counts[t.slug] ?? 0;
              const label =
                n === 0 ? "quiet" : trending.has(t.slug) ? "▲ trending" : "steady";

              return (
                <Link
                  key={t.slug}
                  href={`/topic/${t.slug}`}
                  style={{ "--ta": t.color } as React.CSSProperties}
                >
                  <span className="mo ta">
                    {label} · {n} {n === 1 ? "story" : "stories"}
                  </span>
                  <h3>{t.title}</h3>
                  <p>{t.blurb}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* more stories */}
      {more.length > 0 && (
        <section className="border-t border-ln">
          <div className={`${wrap} py-10`}>
            <SectionHead title="More stories" />
            <div className="grid gap-x-10 md:grid-cols-2">
              {more.map((p) => (
                <CompactStory key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* field notes */}
      <section className="border-t border-ln">
        <div className={`${wrap} py-10`}>
          <SectionHead title="Field notes" />
          <div className="fn">
            {FIELD_NOTES.map((note, i) => (
              <div key={i}>
                <span
                  className="mo"
                  style={{ color: TOPICS[i % TOPICS.length].color }}
                >
                  Note {String(i + 1).padStart(2, "0")}
                </span>
                <b>{note}</b>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* publish */}
      <section className="border-t border-ln">
        <div className={`${wrap} py-10`}>
          <h2 className="text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
            Publish what you find.
          </h2>
          <p className="mt-2 max-w-[60ch] text-mu">
            Write it up. An editor reviews it. Approved work goes public with
            your name and timestamp.
          </p>
          <Link href="/submit" className="btn btn-p">
            Submit research
          </Link>
        </div>
      </section>
    </main>
  );
}