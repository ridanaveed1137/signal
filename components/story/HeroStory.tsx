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

      <p className="mo ta mt-5">
        {labelFor(post)}
        {post.curated && " · curated"}
      </p>

      <h2 className="mt-2 max-w-[18ch] text-[clamp(38px,6.5vw,92px)] font-black leading-[0.92] tracking-[-0.03em]">
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
