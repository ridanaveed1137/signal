import Link from "next/link";
import Cover from "@/components/Cover";
import { topicBySlug } from "@/lib/topics";

type Post = {
  id: string;
  type: string;
  topic?: string | null;
  title: string;
  slug: string;
  body?: string | null;
  author_name: string;
  licensable?: boolean;
  created_at: string;
};

const TYPE_COLOR: Record<string, string> = {
  trend: "#5fd0c4",
  tool: "#e0a75f",
  paper: "#9d7cf5",
  project: "#4fc3f7",
};

function ago(iso: string) {
  const mins = Math.max(
    1,
    Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  );
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function isNew(iso: string) {
  return Date.now() - new Date(iso).getTime() < 48 * 3600 * 1000;
}

function readMinutes(body?: string | null) {
  const words = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostCard({ post }: { post: Post }) {
  const topic = post.topic ? topicBySlug(post.topic) : undefined;
  const color = topic?.color ?? TYPE_COLOR[post.type] ?? "#5fd0c4";
  const label = topic?.title ?? post.type;

  return (
    <Link
      href={`/post/${post.slug}`}
      className="cd h-full"
      style={{ "--ta": color } as React.CSSProperties}
    >
      <div className="cv">
        <Cover
          seed={post.slug}
          color={color}
          label={`${label} · ${post.type}`}
        />
      </div>

      <span className="mo ta">
        {label}
        {post.licensable && <span className="tag">Licensable</span>}
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