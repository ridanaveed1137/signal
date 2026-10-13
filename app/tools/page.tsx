import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import SplitFlap from "@/components/SplitFlap";
import HeroStory from "@/components/story/HeroStory";
import FeatureStory from "@/components/story/FeatureStory";
import CompactStory from "@/components/story/CompactStory";
import BriefStory from "@/components/story/BriefStory";
import Visual from "@/components/Visual";
import FadeIn from "@/components/FadeIn";
import { colorFor } from "@/lib/editorial";

export const revalidate = 60;

const shortName = (p: Post) => p.title.split(":")[0].trim();

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

export default async function ToolsPage() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", "tool")
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const tools = (data ?? []) as Post[];

  const spotlight = tools[0];
  const rest = tools.slice(1);

  const lead = rest[0];
  const side = rest.slice(1, 4);
  const briefs = rest.slice(4, 8);
  const features = rest.slice(8);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="font-display text-6xl tracking-[0.02em]">
        <SplitFlap text="TOOLS" />
      </h1>
      <p className="mo mb-12 mt-2">
        Field manual · {tools.length} {tools.length === 1 ? "entry" : "entries"}
      </p>

      {tools.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      {/* standalone spotlight, tool-specific, not a story component */}
      {spotlight && (
        <Link
          href={`/post/${spotlight.slug}`}
          className="group mb-14 grid gap-8 border-b border-ln pb-14 md:grid-cols-12 md:gap-10"
          style={{ "--ta": colorFor(spotlight) } as React.CSSProperties}
        >
          <div className="flex flex-col justify-end md:col-span-5">
            <p className="mo ta">Tool of the moment</p>
            <h2 className="display mt-3 text-[clamp(56px,8vw,120px)] italic leading-[0.85] transition-colors group-hover:text-ac">
              {shortName(spotlight)}
            </h2>
            {spotlight.summary && (
              <p className="mt-5 max-w-[40ch] text-lg text-mu">
                {spotlight.summary}
              </p>
            )}
          </div>

          <div className="aspect-[16/9] overflow-hidden border border-ln md:col-span-7">
            <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
              <Visual post={spotlight} big />
            </div>
          </div>
        </Link>
      )}

      {/* lead + sidebar */}
      {lead && (
        <section className="border-t border-ln">
          <div className="grid gap-10 py-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <HeroStory post={lead} />
            </div>

            {side.length > 0 && (
              <aside className="lg:col-span-4">
                <p className="mo mb-1">Also in the field manual</p>
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
            <SectionHead title="More tools" aside="In brief" />
            <div className="columns-1 gap-10 sm:columns-2 lg:columns-3">
              {briefs.map((p) => (
                <BriefStory key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* alternating features */}
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