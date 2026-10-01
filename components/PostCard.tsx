import Link from "next/link";

type Post = {
  id: string;
  type: string;
  title: string;
  slug: string;
  summary: string | null;
  author_name: string;
  created_at: string;
};

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/post/${post.slug}`}
      className="flex flex-col gap-3 border border-neutral-800 p-6 transition-colors hover:border-emerald-400"
    >
      <span className="text-xs uppercase tracking-widest text-emerald-400">
        {post.type}
      </span>

      <h2 className="text-xl font-bold leading-snug">{post.title}</h2>

      {post.summary && (
        <p className="text-sm text-neutral-400">{post.summary}</p>
      )}

      <p className="mt-auto pt-2 text-xs text-neutral-500">
        {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
}
