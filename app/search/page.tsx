import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  // strip characters that could break the filter
  const term = (q ?? "").replace(/[^a-zA-Z0-9 -]/g, " ").trim();

  let posts = null;

  if (term) {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .or(
        `title.ilike.%${term}%,summary.ilike.%${term}%,body.ilike.%${term}%`
      )
      .order("created_at", { ascending: false });

    if (error) console.log(error);
    posts = data;
  }

  return (
    <main className="flex-1 p-6">
      <h1 className="mb-2 text-3xl font-bold uppercase tracking-widest">
        Search
      </h1>

      {term ? (
        <p className="mb-8 text-sm text-neutral-500">
          {posts?.length ?? 0} result{posts?.length === 1 ? "" : "s"} for &quot;{term}&quot;
        </p>
      ) : (
        <p className="mb-8 text-sm text-neutral-500">
          Type something in the search box.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}