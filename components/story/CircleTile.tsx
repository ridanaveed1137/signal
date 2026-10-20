import Link from "next/link";
import type { Post } from "@/lib/types";
import { labelFor } from "@/lib/editorial";

export default function CircleTile({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  const filled = index % 3 === 0;

  return (
    <Link
      href={`/post/${post.slug}`}
      className={`group flex aspect-square flex-col items-center justify-center rounded-full p-[14%] text-center transition-colors duration-300 ${
        filled
          ? "bg-paper text-ink hover:bg-transparent hover:text-paper hover:ring-1 hover:ring-paper"
          : "border border-paper/40 hover:bg-paper hover:text-ink"
      }`}
    >
      <span className="mo opacity-60">
        ({String(index + 1).padStart(2, "0")})
      </span>
      <span className="hv mt-2 line-clamp-5 text-[11px] font-semibold uppercase leading-tight tracking-tight [overflow-wrap:anywhere] sm:text-sm lg:text-base">
        {post.title}
      </span>
      <span className="mo mt-2 opacity-60">{labelFor(post)}</span>
    </Link>
  );
}