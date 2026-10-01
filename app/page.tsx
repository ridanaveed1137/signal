import { supabase } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function Home() {
  const { data: posts, error } = await supabase
  .from("posts")
  .select("*")
  .order("created_at", { ascending: false });
  console.log("posts:", posts, "error:", error);
  return (
    <main className="flex-1 p-6">
      <h1>SIGNAL</h1>
      {posts?.map((post) => (
  <div key={post.id}>
    <h2>{post.title}</h2>
    {/* add post.type and post.summary yourself */}
  </div>
))}
    </main>
  );
}