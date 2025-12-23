import { createFileRoute } from "@tanstack/react-router";
import { CommentsPage } from "@/components/pages/CommentsPage";
import { listCommentsSearchParamsSchema } from "@/schema/comments";
import type { ListCommentsSearchParams } from "@/types/comment";

export const Route = createFileRoute("/comments/")({
  component: AllCommentsPage,
  validateSearch: (search): ListCommentsSearchParams =>
    listCommentsSearchParamsSchema.parse(search),
});

function AllCommentsPage() {
  return (
    <CommentsPage
      routePath="/comments"
      routePathId="/comments/"
      title="Comments"
      subtitle="Browse all comments in the community"
      searchPlaceholder="Search comments..."
      showUserTabs={false}
    />
  );
}
