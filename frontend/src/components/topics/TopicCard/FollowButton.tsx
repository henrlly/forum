import { PersonAdd, PersonRemove } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { useTopicActions } from "@/hooks/topics";
import { Loading } from "@/components/common/Loading";

interface FollowButtonProps {
  topicSlug: string;
  isFollowing: boolean;
}

export function FollowButton({ topicSlug, isFollowing }: FollowButtonProps) {
  const { isAuthenticated } = useAuth();
  const { followTopic, isLoading } = useTopicActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <IconButton
      data-ignore-nested-link
      onClick={() =>
        followTopic({
          topic_slug: topicSlug,
          is_follow: !isFollowing,
        })
      }
      disabled={isLoading}
      size="small"
      color={isFollowing ? "primary" : "default"}
    >
      {isLoading ? (
        <Loading size={32} />
      ) : isFollowing ? (
        <PersonRemove />
      ) : (
        <PersonAdd />
      )}
    </IconButton>
  );
}
