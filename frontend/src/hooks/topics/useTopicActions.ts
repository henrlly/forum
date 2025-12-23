import { useMutation, useQueryClient } from "@tanstack/react-query";
import { topicApi } from "@/api/topic";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { FollowTopicRequest, Topic } from "@/types/topic";
import { mutateCache } from "@/utils/mutate";
import { deslugifyTopicName } from "@/utils/slugify";

export function useTopicActions() {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const followMutation = useMutation({
    mutationFn: (data: FollowTopicRequest) => topicApi.follow(data),
    onSuccess: (_, { topic_slug, is_follow }) => {
      const topicName = deslugifyTopicName(topic_slug);
      mutateCache<Topic>({
        queryClient,
        itemName: "topic",
        itemKey: topic_slug,
        mutateFn: (oldTopic) => {
          if (oldTopic.name !== topicName) return oldTopic;
          return {
            ...oldTopic,
            no_of_followers: oldTopic.no_of_followers + (is_follow ? 1 : -1),
            is_following: is_follow,
          };
        },
      });

      // Invalidate topics list with following filter
      queryClient.invalidateQueries({
        queryKey: ["topics", { filter_following: true }],
      });

      showSuccess(
        `Topic ${topicName} ${is_follow ? "followed" : "unfollowed"} successfully!`,
      );
    },

    onError: (_, { topic_slug, is_follow }) => {
      const topicName = deslugifyTopicName(topic_slug);
      showError(
        `Failed to ${is_follow ? "follow" : "unfollow"} topic ${topicName}. Please try again.`,
      );
    },
  });

  return {
    followTopic: followMutation.mutate,
    isLoading: followMutation.isPending,
    error: followMutation.error,
  };
}
