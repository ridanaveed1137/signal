import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { topicBySlug } from "@/lib/topics";
import PostCard from "@/components/PostCard";
import FadeIn from "@/components/FadeIn";

export const dynamic = "force-dynamic";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = topicBySlug(slug);
  if (!topic) notFound();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("topic", slug)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  const list = posts ?? [];

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-7xl px-5">
        <section className="py-14">
          <span className="mo" style={{ color: topic.color }}>
            {topic.title} / Security signal
          </span>
          <h1 className="my-3.5 text-[clamp(38px,9vw,120px)] font-bold leading-[1.05]">
            {topic.headline}
          </h1>
          <p className="max-w-[44ch] text-[clamp(18px,2vw,24px)] text-mu">
            {topic.blurb}
          </p>
        </section>

        <section className="border-t border-ln py-11">
          <div className="mb-6 flex items-baseline justify-between gap-3">
            <h2 className="text-[clamp(26px,4vw,44px)] font-bold uppercase leading-[1.05]">
              Latest signals
            </h2>
            <span className="mo">
              {list.length} {list.length === 1 ? "story" : "stories"}
            </span>
          </div>

          {list.length === 0 ? (
            <p className="text-mu">
              Nothing here yet.{" "}
              <Link href="/submit" className="text-ac hover:underline">
                Publish the first one.
              </Link>
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {list.map((post, i) => (
                <FadeIn key={post.id} delay={Math.min(i, 8) * 0.05}>
                  <PostCard post={post} />
                </FadeIn>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}