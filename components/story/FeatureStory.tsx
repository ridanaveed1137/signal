import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { colorFor, labelFor, stamp } from "@/lib/editorial";

export default function FeatureStory({
  post,
  flip = false,
}: {
  post: Post;
  flip?: boolean;
}) {
  const color = colorFor(post);

  return (
    <Link
      href={`/post/${post.slug}`}
      className="group grid items-end gap-6 md:grid-cols-12 md:gap-10"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className={`md:col-span-5 ${flip ? "md:order-2" : ""}`}>
        <div className="aspect-[4/5] overflow-hidden border border-ln">
          <div className="h-full w-full transition-transform duration-700 group-hover:scale-[1.04] [&>svg]:block [&>svg]:h-full [&>svg]:w-full">
            <Visual post={post} shape="tall" big />
          </div>
        </div>
      </div>

      <div className={`md:col-span-7 ${flip ? "md:order-1" : ""}`}>
        <p className="mo ta">{labelFor(post)}</p>
        <h3 className="mt-3 text-[clamp(30px,4vw,60px)] font-bold leading-[1] tracking-[-0.02em]">
          {post.title}
        </h3>
        {post.summary && (
          <p className="mt-4 max-w-[46ch] text-lg text-mu">{post.summary}</p>
        )}
        <p className="mo mt-5">
          {post.author_name} · {stamp(post.created_at)}
        </p>
      </div>
    </Link>
  );
}