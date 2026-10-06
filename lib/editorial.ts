import { topicBySlug } from "@/lib/topics";
import type { Post } from "@/lib/types";

const TYPE_COLOR: Record<string, string> = {
  trend: "#5fd0c4",
  tool: "#e0a75f",
  paper: "#9d7cf5",
  project: "#4fc3f7",
};

export function colorFor(p: Post) {
  const topic = p.topic ? topicBySlug(p.topic) : undefined;
  return topic?.color ?? TYPE_COLOR[p.type] ?? "#5fd0c4";
}

export function labelFor(p: Post) {
  return (p.topic && topicBySlug(p.topic)?.title) || p.type;
}

export function stamp(iso: string) {
  return new Date(iso)
    .toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

export function ago(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function readMinutes(body?: string | null) {
  const words = (body ?? "").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}