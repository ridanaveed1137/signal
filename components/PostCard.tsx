import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { ago, colorFor, labelFor, readMinutes } from "@/lib/editorial";

function isNew(iso: string) {
  return Date.now() - new Date(iso).getTime() < 48 * 3600 * 1000;
}

export default function PostCard({ post }: { post: Post }) {
  const color = colorFor(post);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="cd h-full"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="cv">
        <Visual post={post} />
      </div>

      <span className="mo ta">
        {labelFor(post)}
        {post.licensable && <span className="tag">Licensable</span>}
        {post.curated && <span className="tag">Curated</span>}
        {isNew(post.created_at) && <span className="tag">New</span>}
      </span>

      <h3>{post.title}</h3>

      <div className="meta mo">
        <span>{post.author_name}</span>
        <span>{ago(post.created_at)}</span>
        <span>{readMinutes(post.body)} min</span>
      </div>
    </Link>
  );
}