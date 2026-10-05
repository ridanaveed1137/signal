import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { TOPICS } from "@/lib/topics";
import PostCard from "@/components/PostCard";
import FadeIn from "@/components/FadeIn";
import TileFlap from "@/components/TileFlap";
import IntelFeed, { type FeedEvent } from "@/components/IntelFeed";
import OpenSearchButton from "@/components/OpenSearchButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = posts ?? [];

  // real recent activity for the intelligence feed
  const recent = [...list]
    .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    .slice(0, 12);

  const events: FeedEvent[] = [
    { stamp: "SYNC", text: `ok · ${list.length} posts indexed` },
    ...recent.map((p) => ({
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
      <div className="mx-auto w-full max-w-7xl px-5">
        <section className="grid gap-10 py-14 md:grid-cols-[1.25fr_1fr]">
          <div>
            <span className="mo">[ Security publication / 2026 ]</span>

            <TileFlap />

            <p className="max-w-[36ch] text-[clamp(18px,2vw,24px)]">
              Research, trends, tools and ideas from the people building and
              breaking security.
            </p>
            <p className="mo mt-2 max-w-[52ch] text-[13px] normal-case tracking-[0.02em]">
              Read what security people are watching. Publish what you
              discover. License the work that matters.
            </p>

            <OpenSearchButton>Explore signals</OpenSearchButton>
            <Link href="/submit" className="btn">
              Publish research
            </Link>
          </div>

          <IntelFeed events={events} />
        </section>

        <section className="border-t border-ln py-11">
          <div className="mb-6 flex items-baseline justify-between gap-3">
            <h2 className="text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
              Current signals
            </h2>
            <span className="mo">Topics</span>
          </div>

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
        </section>

        {/* temporary: your existing grid, replaced in Step 5 */}
        <section className="border-t border-ln py-11">
          <h2 className="mb-6 text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
            Latest intelligence
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {list.map((post, i) => (
              <FadeIn key={post.id} delay={Math.min(i, 8) * 0.05}>
                <PostCard post={post} />
              </FadeIn>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}