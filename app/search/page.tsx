import { supabase } from "@/lib/supabase";
import PostCard from "@/components/PostCard";
import SplitFlap from "@/components/SplitFlap";
import FallingText from "@/components/FallingText";

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
    <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-10">
      <h1 className="mb-2 font-mono text-3xl font-bold uppercase tracking-widest">
        <SplitFlap text="SEARCH" />
      </h1>

      {term ? (
        <>
          <p className="mb-2 text-2xl font-bold">
            <FallingText text={term} />
          </p>
          <p className="mo mb-8">
            {posts?.length ?? 0} result{posts?.length === 1 ? "" : "s"}
          </p>
        </>
      ) : (
        <p className="mo mb-8">Press Ctrl+K and search for something.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}