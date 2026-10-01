import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

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
    .order("created_at", { ascending: false });

  if (error) console.log(error);

  return (
    <main className="flex-1 p-6">
      <h1 className="mb-8 text-3xl font-bold uppercase tracking-widest">
        {heading}
      </h1>

      {posts?.length === 0 && (
        <p className="text-neutral-500">Nothing here yet.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}