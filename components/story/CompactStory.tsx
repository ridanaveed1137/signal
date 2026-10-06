import Link from "next/link";
import Cover from "@/components/Cover";
import type { Post } from "@/lib/types";
import { ago, colorFor, labelFor } from "@/lib/editorial";

export default function CompactStory({ post }: { post: Post }) {
  const color = colorFor(post);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex gap-4 border-t border-ln py-4"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="h-24 w-24 shrink-0 overflow-hidden border border-ln [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
        <Cover seed={post.slug} color={color} shape="square" />
      </div>

      <div className="min-w-0">
        <p className="mo ta">{labelFor(post)}</p>
        <h4 className="mt-1 text-lg font-bold leading-tight transition-colors group-hover:text-ac">
          {post.title}
        </h4>
        <p className="mo mt-1">
          {post.author_name} · {ago(post.created_at)}
        </p>
      </div>
    </Link>
  );
}