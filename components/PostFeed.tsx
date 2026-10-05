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
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="mb-8 font-mono text-3xl font-bold uppercase tracking-widest">
        <SplitFlap text={heading.toUpperCase()} />
      </h1>

      {posts?.length === 0 && <p className="text-mu">Nothing here yet.</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post, i) => (
          <FadeIn key={post.id} delay={Math.min(i, 8) * 0.05}>
            <PostCard post={post} />
          </FadeIn>
        ))}
      </div>
    </main>
  );
}