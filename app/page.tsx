import Link from "next/link";
import { supabase } from "@/lib/supabase";
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

        {/* temporary: your existing grid, replaced in Steps 4-6 */}
        <section className="border-t border-ln py-11">
          <h2 className="mb-6 text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
            Latest
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
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