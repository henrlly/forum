import { Alert } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Loading } from "@/components/common/Loading";
import type { ChipData } from "@/components/List";
import { CommentsPage } from "@/components/pages/CommentsPage";
import { useUser } from "@/hooks/users";
import { listCommentsSearchParamsSchema } from "@/schema/comments";
import type { ListCommentsSearchParams } from "@/types/comment";
import { formatDate } from "@/utils/date";

export const Route = createFileRoute("/users/$username/comments")({
  component: UserCommentsPage,
  validateSearch: (search): ListCommentsSearchParams =>
    listCommentsSearchParamsSchema.parse(search),
});

function UserCommentsPage() {
  const { username } = useParams({ from: "/users/$username/comments" });
  const { data: user, isLoading, error } = useUser(username);

  if (isLoading) {
    return (
      <Loading isPage={true} loadingText={`Loading ${username} comments...`} />
    );
  }

  if (error || !user) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load user {error?.message ? `: ${error.message}` : "."}
      </Alert>
    );
  }

  const chips: ChipData[] = [
    { label: `${user.karma} karma` },
    {
      label: `Joined ${formatDate(user.created_at, true)}`,
    },
  ];

  return (
    <CommentsPage
      routePath="/users/$username/comments"
      routePathId="/users/$username/comments"
      title={`@${user.username}`}
      subtitle={`Comments by @${user.username}`}
      searchPlaceholder={`Search posts by @${user.username}...`}
      extraCommentFilters={{ user_id: user ? user.id : 0 }}
      showUserTabs={true}
      chips={chips}
    />
  );
}
