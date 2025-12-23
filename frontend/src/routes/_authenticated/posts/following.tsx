import { createFileRoute } from "@tanstack/react-router";
import { PostsPage } from "@/components/pages/PostsPage";
import { listPostsSearchParamsSchema } from "@/schema/posts";
import type { ListPostsSearchParams } from "@/types/post";

export const Route = createFileRoute("/_authenticated/posts/following")({
  component: FollowingPostsPage,
  validateSearch: (search): ListPostsSearchParams =>
    listPostsSearchParamsSchema.parse(search),
});

function FollowingPostsPage() {
  return (
    <PostsPage
      routePath="/posts/following"
      routePathId="/_authenticated/posts/following"
      title="Feed"
      subtitle="Browse posts from topics you follow"
      showNewPostButton={true}
      searchPlaceholder="Search feed..."
      extraPostFilters={{ filter_following_topics: true }}
    />
  );
}
