import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import SplitFlap from "@/components/SplitFlap";
import FadeIn from "@/components/FadeIn";

export default async function PostFeed({
  type,
  heading,
}: {
  type: string;
  heading: string;
}) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("type", type)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  return (
    <main className="flex-1 p-6">
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-widest">
        <SplitFlap text={heading.toUpperCase()} />
      </h1>

      {posts?.length === 0 && (
        <p className="text-neutral-500">Nothing here yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts?.map((post, i) => (
          <FadeIn key={post.id} delay={Math.min(i, 8) * 0.05}>
            <PostCard post={post} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}