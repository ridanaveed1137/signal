import Link from "next/link";
import type { Post } from "@/lib/types";
import { labelFor, readMinutes } from "@/lib/editorial";

export default function PillRow({
  post,
  index,
}: {
  post: Post;
  index: number;
}) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="group flex items-center gap-4 rounded-full border border-paper/30 py-2 pl-2 pr-5 transition-colors hover:bg-paper hover:text-ink sm:gap-6"
    >
      <span className="font-display flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-paper text-sm text-ink transition-colors group-hover:bg-ink group-hover:text-paper sm:h-16 sm:w-16 sm:text-lg">
        {String(index).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className="mo block opacity-60">
          ({labelFor(post)} · {readMinutes(post.body)} min)
        </span>
        <span className="line-clamp-2 block text-base font-semibold uppercase leading-tight [overflow-wrap:anywhere] sm:text-2xl">
          {post.title}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-xl transition-transform group-hover:translate-x-1"
      >
        ↗
      </span>
    </Link>
  );
}