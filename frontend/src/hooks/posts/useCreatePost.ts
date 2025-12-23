import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { postApi } from "@/api/post";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { CreatePostRequest } from "@/types/post";
import type { Topic } from "@/types/topic";
import { getPostLink } from "@/utils/link";

export function useCreatePost(topics?: Topic[]) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: CreatePostRequest) => postApi.createPost(data),
    // Navigate to the newly created post on success
    onSuccess: ({ post_id }, { topic_id }) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      showSuccess("Post created successfully!");
      const topic = topics?.find((t) => t.id === topic_id);
      if (topic) {
        navigate({
          to: getPostLink({
            relative: true,
            topicName: topic.name,
            postId: post_id,
          }),
        });
      }
    },
    onError: () => {
      showError("Error creating post. Please try again.");
    },
  });

  return {
    createPost: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
