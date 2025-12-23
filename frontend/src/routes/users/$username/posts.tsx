import { Alert } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Loading } from "@/components/common/Loading";
import type { ChipData } from "@/components/List";
import { PostsPage } from "@/components/pages/PostsPage";
import { useUser } from "@/hooks/users";
import { listPostsSearchParamsSchema } from "@/schema/posts";
import type { ListPostsSearchParams } from "@/types/post";
import { formatDate } from "@/utils/date";

export const Route = createFileRoute("/users/$username/posts")({
  component: UserPostsPage,
  validateSearch: (search): ListPostsSearchParams =>
    listPostsSearchParamsSchema.parse(search),
});

function UserPostsPage() {
  const { username } = useParams({ from: "/users/$username/posts" });
  const { data: user, isLoading, error } = useUser(username);

  if (isLoading) {
    return (
      <Loading isPage={true} loadingText={`Loading ${username} posts...`} />
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
    <PostsPage
      routePath="/users/$username/posts"
      routePathId="/users/$username/posts"
      title={`@${user.username}`}
      subtitle={`Posts by @${user.username}`}
      searchPlaceholder={`Search posts by @${user.username}...`}
      showNewPostButton={false}
      extraPostFilters={{ user_id: user ? user.id : 0 }}
      showUserTabs={true}
      chips={chips}
    />
  );
}
