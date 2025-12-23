import { Alert } from "@mui/material";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Loading } from "@/components/common/Loading";
import type { ChipData } from "@/components/List";
import { PostsPage } from "@/components/pages/PostsPage";
import { useAuth } from "@/contexts/AuthContext";
import { useTopic, useTopicActions } from "@/hooks/topics";
import { listPostsSearchParamsSchema } from "@/schema/posts";
import type { ListPostsSearchParams } from "@/types/post";

export const Route = createFileRoute("/topics/$topicSlug/")({
  component: TopicPostsPage,
  validateSearch: (search): ListPostsSearchParams =>
    listPostsSearchParamsSchema.parse(search),
});

function TopicPostsPage() {
  const { topicSlug } = useParams({ from: "/topics/$topicSlug/" });
  const { isAuthenticated } = useAuth();
  const { followTopic, isLoading: isFollowLoading } = useTopicActions();
  const {
    data: topic,
    isLoading: topicIsLoading,
    error: topicError,
  } = useTopic(topicSlug);

  if (topicIsLoading) {
    return <Loading isPage={true} loadingText={`Loading ${topicSlug}...`} />;
  }

  if (topicError || !topic) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load topic{" "}
        {topicError?.message ? `: ${topicError.message}` : "."}
      </Alert>
    );
  }

  const chips: ChipData[] = [
    { label: `${topic.no_of_followers} Followers` },
    { label: `${topic.no_of_posts} Posts` },
  ];

  return (
    <PostsPage
      routePath="/topics/$topicSlug"
      routePathId="/topics/$topicSlug/"
      title={topic ? topic.name : "Topic Not Found"}
      subtitle={topic?.description}
      showNewPostButton={true}
      topicId={topic.id}
      searchPlaceholder={`Search in ${topic?.name}...`}
      extraPostFilters={{ topic_id: topic ? topic.id : 0 }}
      showFollowButton={isAuthenticated}
      isFollowLoading={isFollowLoading}
      isFollowing={topic?.is_following}
      onFollowToggle={() => {
        followTopic({
          topic_slug: topicSlug,
          is_follow: !topic?.is_following,
        });
      }}
      chips={chips}
    />
  );
}
