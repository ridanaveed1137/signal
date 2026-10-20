import Link from "next/link";
import Visual from "@/components/Visual";
import type { Post } from "@/lib/types";
import { labelFor, readMinutes } from "@/lib/editorial";

export default function PortraitCard({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex h-full flex-col rounded-[2rem] bg-paper p-3 text-ink transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="aspect-[16/10] overflow-hidden rounded-[1.4rem] [&_svg]:h-full [&_svg]:w-full">
        <Visual post={post} />
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
        <p className="mo flex justify-between text-ink/60">
          <span>
            ({String(index + 1).padStart(2, "0")}) · {labelFor(post)}
          </span>
          <span>{readMinutes(post.body)} min</span>
        </p>

        <h3 className="hv mt-3 flex-1 text-xl font-semibold leading-[1.1] tracking-tight [overflow-wrap:anywhere] sm:text-2xl">
          {post.title}
        </h3>

        <span
          aria-hidden="true"
          className="mt-5 flex h-10 w-10 items-center justify-center self-end rounded-full bg-ink text-lg text-paper transition-transform duration-300 group-hover:rotate-45"
        >
          ↗
        </span>
      </div>
    </Link>
  );
}