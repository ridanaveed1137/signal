import PostFeed from "@/components/PostFeed";

export const dynamic = "force-dynamic";

export default function Trends() {
  return <PostFeed type="trend" heading="Trends" />;
}