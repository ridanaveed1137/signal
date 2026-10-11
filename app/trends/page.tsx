import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import HeroStory from "@/components/story/HeroStory";
import FadeIn from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "trend")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = (data ?? []) as Post[];

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="TRENDS" />
      </h1>
      <p className="mo mb-14 mt-2">
        Wire · {list.length} {list.length === 1 ? "story" : "stories"}
      </p>

      {list.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      <div className="flex flex-col">
        {list.map((post, i) => (
          <FadeIn key={post.id}>
            <div
              className={i > 0 ? "border-t border-ln pt-14" : ""}
              style={{ paddingBottom: "3.5rem" }}
            >
              <HeroStory post={post} />
            </div>
          </FadeIn>
        ))}
      </div>
    </main>
  );
}