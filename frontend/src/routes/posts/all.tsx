import { createFileRoute } from "@tanstack/react-router";
import { PostsPage } from "@/components/pages/PostsPage";
import { listPostsSearchParamsSchema } from "@/schema/posts";
import type { ListPostsSearchParams } from "@/types/post";

export const Route = createFileRoute("/posts/all")({
  component: AllPostsPage,
  validateSearch: (search): ListPostsSearchParams =>
    listPostsSearchParamsSchema.parse(search),
});

function AllPostsPage() {
  return (
    <PostsPage
      routePath="/posts/all"
      routePathId="/posts/all"
      title="Posts"
      subtitle="Browse all posts in the community"
      showNewPostButton={true}
      searchPlaceholder="Search all posts..."
    />
  );
}
