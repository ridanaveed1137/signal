import PostFeed from "@/components/PostFeed";

export const revalidate = 60;

export default function Projects() {
  return <PostFeed type="project" heading="Projects" />;
}