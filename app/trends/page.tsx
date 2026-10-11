import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import HeroStory from "@/components/story/HeroStory";
import CompactStory from "@/components/story/CompactStory";
import FadeIn from "@/components/FadeIn";
import { stamp } from "@/lib/editorial";

export const dynamic = "force-dynamic";

function dayKey(iso: string) {
  return new Date(iso).toDateString();
}

export default async function TrendsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "trend")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = (data ?? []) as Post[];
  const lead = list[0];
  const rest = list.slice(1);

  // group remaining stories by the day they were posted, newest day first
  const groups = new Map<string, Post[]>();
  rest.forEach((p) => {
    const key = dayKey(p.created_at);
    groups.set(key, [...(groups.get(key) ?? []), p]);
  });

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="TRENDS" />
      </h1>
      <p className="mo mb-12 mt-2">
        Wire · {list.length} {list.length === 1 ? "story" : "stories"}
      </p>

      {list.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      {lead && (
        <div className="mb-14 border-b border-ln pb-14">
          <HeroStory post={lead} />
        </div>
      )}

      {[...groups.entries()].map(([day, posts]) => (
        <div key={day} className="border-t border-ln py-8">
          <p className="mo mb-4">{stamp(posts[0].created_at)}</p>

          <div className="grid gap-x-10 md:grid-cols-2">
            {posts.map((p, i) => (
              <FadeIn key={p.id} delay={Math.min(i, 6) * 0.04}>
                <CompactStory post={p} />
              </FadeIn>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}