import PostFeed from "@/components/PostFeed";

export const dynamic = "force-dynamic";

export default function Papers() {
  return <PostFeed type="paper" heading="Papers" />;
}