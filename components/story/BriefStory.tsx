import Link from "next/link";
import type { Post } from "@/lib/types";
import { ago, colorFor, labelFor } from "@/lib/editorial";

export default function BriefStory({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block break-inside-avoid border-t border-ln py-3"
      style={{ "--ta": colorFor(post) } as React.CSSProperties}
    >
      <p className="mo ta">{labelFor(post)}</p>
      <p className="mt-1 font-bold leading-snug transition-colors group-hover:text-ac">
        {post.title}
      </p>
      <p className="mo mt-1">{ago(post.created_at)}</p>
    </Link>
  );
}