import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { commentApi } from "@/api/comment";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { CreateCommentRequest } from "@/types/comment";

export function useCreateComment(onSuccess?: () => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();

  const mutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => commentApi.createComment(data),
    // Navigates to the newly created comment on success
    onSuccess: ({ comment_id }, _) => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      showSuccess("Comment created successfully!");
      navigate({ hash: `comment-${comment_id}`, replace: true });
    },
    onError: () => {
      showError("Error creating comment. Please try again.");
    },
  });

  return {
    createComment: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
