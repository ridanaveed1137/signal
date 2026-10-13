import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import HeroStory from "@/components/story/HeroStory";
import FeatureStory from "@/components/story/FeatureStory";
import CompactStory from "@/components/story/CompactStory";
import BriefStory from "@/components/story/BriefStory";
import FadeIn from "@/components/FadeIn";

export const revalidate = 60;

const wrap = "";

function SectionHead({ title, aside }: { title: string; aside?: string }) {
  return (
    <div className="mb-6 flex items-baseline justify-between gap-3">
      <h2 className="text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
        {title}
      </h2>
      {aside && <span className="mo">{aside}</span>}
    </div>
  );
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
  const side = list.slice(1, 4);
  const briefs = list.slice(4, 8);
  const features = list.slice(8);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="TRENDS" />
      </h1>
      <p className="mo mb-12 mt-2">
        Wire · {list.length} {list.length === 1 ? "story" : "stories"}
      </p>

      {list.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      {/* lead + sidebar, same composition as the homepage */}
      {lead && (
        <section className="border-t border-ln">
          <div className="grid gap-10 py-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <HeroStory post={lead} />
            </div>

            {side.length > 0 && (
              <aside className="lg:col-span-4">
                <p className="mo mb-1">Also on the wire</p>
                {side.map((p) => (
                  <CompactStory key={p.id} post={p} />
                ))}
              </aside>
            )}
          </div>
        </section>
      )}

      {/* dense briefs */}
      {briefs.length > 0 && (
        <section className="border-t border-ln">
          <div className="py-10">
            <SectionHead title="Signals" aside="In brief" />
            <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
              {briefs.map((p) => (
                <BriefStory key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* alternating large feature stories */}
      {features.length > 0 && (
        <section className="border-t border-ln">
          <div className="flex flex-col gap-20 py-14">
            {features.map((p, i) => (
              <FadeIn key={p.id}>
                <FeatureStory post={p} flip={i % 2 === 1} />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}