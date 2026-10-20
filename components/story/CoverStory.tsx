import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { colorFor, labelFor, stamp, readMinutes } from "@/lib/editorial";

export default function CoverStory({ post }: { post: Post }) {
  const color = colorFor(post);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden border border-ln sm:aspect-[16/9] lg:aspect-[21/9]"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
        <Visual post={post} big />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
        <span className="mo ta">Cover story · {labelFor(post)}</span>
        <h2 className="display mt-3 max-w-[22ch] text-[clamp(32px,6vw,88px)] font-black italic leading-[0.95] tracking-tight [overflow-wrap:anywhere]">
          {post.title}
        </h2>
        {post.summary && (
          <p className="mt-3 hidden max-w-[56ch] text-lg text-white/80 sm:block">
            {post.summary}
          </p>
        )}
        <p className="mo mt-4 text-white/70">
          {post.author_name} · {stamp(post.created_at)} ·{" "}
          {readMinutes(post.body)} min
        </p>
      </div>
    </Link>
  );
}