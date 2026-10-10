import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { colorFor, labelFor, stamp, readMinutes } from "@/lib/editorial";

export default function HeroStory({ post }: { post: Post }) {
  const color = colorFor(post);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group block"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="aspect-[16/9] overflow-hidden border border-ln">
        <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.03] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
          <Visual post={post} big />
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <span className="stamp" style={{ "--ta": color } as React.CSSProperties}>
          Issue · {new Date(post.created_at).getFullYear()}
        </span>
        <span className="mo ta">
          {labelFor(post)}
          {post.curated && " · curated"}
        </span>
      </div>


      <h2 className="display mt-3 max-w-[20ch] text-[clamp(44px,7.5vw,104px)] font-black italic tracking-tight">
        {post.title}
      </h2>

      {post.summary && (
        <p className="mt-5 max-w-[52ch] text-lg text-mu">{post.summary}</p>
      )}

      <p className="mo mt-5">
        {post.author_name} · {stamp(post.created_at)} ·{" "}
        {readMinutes(post.body)} min
      </p>
    </Link>
  );
}
