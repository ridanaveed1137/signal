import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LicenseForm from "@/components/LicenseForm";

export const dynamic = "force-dynamic";

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

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
  const year = new Date(post.created_at).getFullYear();
  const date = new Date(post.created_at).toLocaleDateString();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <span className="mo text-ac">{post.type}</span>

      <h1 className="mt-3 text-3xl font-bold leading-tight">{post.title}</h1>

      <p className="mt-3 text-sm text-mu">
        {post.curated ? "Curated by " : ""}
        {post.author_name} · {date}
      </p>

      {!post.curated && (
        <p className="mt-2 text-xs text-mu">
          {post.type === "paper"
            ? `© ${year} ${post.author_name} (summary and commentary only). The original paper belongs to its authors.`
            : `© ${year} ${post.author_name}. Posted ${date}.`}
        </p>
      )}

      {post.summary && (
        <p className="mt-6 text-lg text-tx">{post.summary}</p>
      )}

      {post.curated && post.source_url && (
        <div className="mt-6 border border-ln p-4 text-sm text-mu">
          <p>Curated summary. The original work belongs to its authors.</p>
          <a
            href={post.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ac hover:underline"
          >
            Read the original at {hostOf(post.source_url)}
          </a>
        </div>
      )}

      {post.type === "paper" && (
        <div className="mt-6 border border-ln p-4 text-sm text-mu">
          {meta.authors && <p>Authors: {meta.authors}</p>}
          {meta.year && <p>Year: {meta.year}</p>}
          {meta.link && (
            <a
              href={meta.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ac hover:underline"
            >
              Read the original paper
            </a>
          )}
        </div>
      )}

      {post.type === "tool" && (
        <div className="mt-6 border border-ln p-4 text-sm text-mu">
          {meta.license && <p>License: {meta.license}</p>}
          {meta.repo && (
            <a
              href={meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ac hover:underline"
            >
              View repository
            </a>
          )}
        </div>
      )}

      {post.body && (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-tx">
          {post.body}
        </div>
      )}

      {post.tags?.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              className="border border-ln px-2 py-1 text-xs text-mu"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {post.licensable && post.type !== "paper" && !post.curated && (
        <LicenseForm postId={post.id} />
      )}
    </main>
  );
}