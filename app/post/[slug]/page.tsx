import { notFound } from "next/navigation";
import type { ReactElement, ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/lib/types";
import { colorFor } from "@/lib/editorial";
import LicenseForm from "@/components/LicenseForm";
import Visual from "@/components/Visual";
import PostCard from "@/components/PostCard";
import ReadingProgress from "@/components/ReadingProgress";
import ViewTracker from "@/components/ViewTracker";

export const revalidate = 60;

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (node && typeof node === "object" && "props" in node)
    return textOf(
      (node as ReactElement<{ children?: ReactNode }>).props.children
    );
  return "";
}

function headingsOf(body: string) {
  let inCode = false;
  const out: { text: string; id: string }[] = [];
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      continue;
    }
    if (!inCode && line.startsWith("## ")) {
      const text = line.slice(3).replace(/[`*_]/g, "").trim();
      out.push({ text, id: slugify(text) });
    }
  }
  return out;
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
  const headings = post.body ? headingsOf(post.body) : [];

  let related: Post[] = [];

  if (post.tags?.length > 0) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .neq("slug", slug)
      .overlaps("tags", post.tags)
      .order("created_at", { ascending: false })
      .limit(3);
    related = (data as Post[]) ?? [];
  }

  if (related.length < 3) {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .neq("slug", slug)
      .eq("type", post.type)
      .order("created_at", { ascending: false })
      .limit(6);
    const seen = new Set(related.map((p) => p.slug));
    for (const p of (data as Post[]) ?? []) {
      if (related.length >= 3) break;
      if (!seen.has(p.slug)) related.push(p);
    }
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 p-6">
      <ReadingProgress />

      <figure
        className="mb-8"
        style={{ "--ta": colorFor(post) } as React.CSSProperties}
      >
        <div className="aspect-[21/9] w-full overflow-hidden border border-ln [&_svg]:h-full [&_svg]:w-full">
          <Visual post={post} />
        </div>
        <ViewTracker slug={post.slug} />
        <figcaption className="mo mt-2 text-[10px] uppercase tracking-widest text-mu">
          Illustration · Signal
        </figcaption>
      </figure>

      <header className="border-b border-ln pb-8">
        <div className="flex items-center gap-3">
          <span className="mo uppercase tracking-widest text-ac">
            {post.type}
          </span>
          <span className="h-px flex-1 bg-ln" />
        </div>

        <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">
          {post.title}
        </h1>

        {post.summary && (
          <p
            className="mt-6 text-xl italic leading-snug tracking-normal text-mu sm:text-2xl"
            style={{ fontFamily: '"Fraunces Variable", Georgia, serif' }}
          >
            {post.summary}
          </p>
        )}

        <p className="mo mt-6 text-xs text-mu">
          {post.curated ? "Curated by " : "By "}
          {post.author_name} · {date}
        </p>

        {!post.curated && (
          <p className="mt-2 text-xs text-mu">
            {post.type === "paper"
              ? `© ${year} ${post.author_name} (summary and commentary only). The original paper belongs to its authors.`
              : `© ${year} ${post.author_name}. Posted ${date}.`}
          </p>
        )}
      </header>

      {(post.curated || post.type === "tool" || post.type === "paper") && (
        <div className="mo mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-ln pb-4 text-xs text-mu">
          {post.curated && post.source_url && (
            <a
              href={post.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ac hover:underline"
            >
              Original: {hostOf(post.source_url)} ↗
            </a>
          )}
          {post.type === "tool" && meta.license && (
            <span>License: {meta.license}</span>
          )}
          {post.type === "tool" && meta.repo && (
            <a
              href={meta.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ac hover:underline"
            >
              Repository ↗
            </a>
          )}
          {post.type === "paper" && meta.authors && (
            <span>Authors: {meta.authors}</span>
          )}
          {post.type === "paper" && meta.year && <span>Year: {meta.year}</span>}
          {post.type === "paper" && meta.link && (
            <a
              href={meta.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ac hover:underline"
            >
              Original paper ↗
            </a>
          )}
        </div>
      )}

      {headings.length >= 3 && (
        <nav className="mo mb-8 mt-8 border border-ln p-4 text-xs text-mu 2xl:fixed 2xl:left-[calc(50%_+_29rem)] 2xl:top-40 2xl:mb-0 2xl:mt-0 2xl:max-h-[70vh] 2xl:w-52 2xl:overflow-y-auto 2xl:border-0 2xl:border-l 2xl:py-0">
          <p className="mb-3 uppercase tracking-widest text-ac">
            In this article
          </p>
          <ol className="space-y-2">
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`} className="hover:text-ac">
                  {h.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {post.body && (
        <div className="prose-signal mt-8">
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              h2: ({ children }) => (
                <h2 id={slugify(textOf(children))}>{children}</h2>
              ),
            }}
          >
            {post.body}
          </Markdown>
        </div>
      )}

      {post.curated && (
        <p className="mt-8 text-xs text-mu">
          Curated summary. The original work belongs to its authors.
        </p>
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

      {related.length > 0 && (
        <section className="mt-16 border-t border-ln pt-8">
          <div className="flex items-center gap-3">
            <span className="mo uppercase tracking-widest text-ac">
              Related reading
            </span>
            <span className="h-px flex-1 bg-ln" />
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}