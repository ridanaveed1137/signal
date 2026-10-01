import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  const meta = post.metadata ?? {};

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <span className="text-xs uppercase tracking-widest text-emerald-400">
        {post.type}
      </span>

      <h1 className="mt-3 text-3xl font-bold leading-tight">{post.title}</h1>

      <p className="mt-3 text-sm text-neutral-500">
        {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
      </p>

      {post.summary && (
        <p className="mt-6 text-lg text-neutral-300">{post.summary}</p>
      )}

      {/* type-specific details from the metadata column */}
      {post.type === "paper" && (
        <div className="mt-6 border border-neutral-800 p-4 text-sm text-neutral-400">
          {meta.authors && <p>Authors: {meta.authors}</p>}
          {meta.year && <p>Year: {meta.year}</p>}
          {meta.link && (
            <a
              href={meta.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              Read the original paper
            </a>
          )}
        </div>
      )}

      {post.type === "tool" && (
        <div className="mt-6 border border-neutral-800 p-4 text-sm text-neutral-400">
          {meta.license && <p>License: {meta.license}</p>}
          {meta.repo && (
            <a
              href={meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:underline"
            >
              View repository
            </a>
          )}
        </div>
      )}

      {post.body && (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-neutral-200">
          {post.body}
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="border border-neutral-800 px-2 py-1 text-xs text-neutral-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}