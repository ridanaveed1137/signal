import Link from "next/link";
import type { Post } from "@/lib/types";

export default function ResearchFeature({ post }: { post: Post }) {
  const meta = post.metadata ?? {};

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group grid gap-8 md:grid-cols-12 md:gap-10"
    >
      <div className="mo text-ink/60 md:col-span-3">
        <p>Research</p>
        {meta.authors && <p className="mt-3">{meta.authors}</p>}
        {meta.year && <p>{meta.year}</p>}
      </div>

      <div className="md:col-span-9">
        <h3 className="max-w-[22ch] text-[clamp(32px,5vw,72px)] font-semibold leading-[1] tracking-[-0.02em]">
          {post.title}
        </h3>
        {post.summary && (
          <p className="mt-5 max-w-[56ch] text-xl text-ink/80">
            {post.summary}
          </p>
        )}
        <p className="mo mt-6 text-ink/60 group-hover:underline">
          Read the summary →
        </p>
      </div>
    </Link>
  );
}