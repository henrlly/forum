import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { commentApi } from "@/api/comment";
import { postApi } from "@/api/post";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type {
  Comment,
  UpdateCommentRequest,
  VoteCommentRequest,
} from "@/types/comment";
import type { Post } from "@/types/post";
import { mutateCache } from "@/utils/mutate";
import { summarizeCommentContent } from "@/utils/summary";

export function useCommentActions(comment: Comment) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const { isAuthenticated } = useAuth();

  const voteMutation = useMutation({
    mutationFn: ({ vote_value }: VoteCommentRequest) =>
      commentApi.voteComment(comment.id, { vote_value }),
    onSuccess: (_, { vote_value }) => {
      mutateCache<Comment>({
        queryClient,
        itemName: "comment",
        itemKey: comment.id,
        mutateFn: (oldComment) => {
          if (oldComment.id !== comment.id) return oldComment;
          return {
            ...oldComment,
            score: oldComment.score - (oldComment.my_vote || 0) + vote_value,
            my_vote: vote_value,
          };
        },
      });

      const vote =
        vote_value === 1
          ? "Upvoted"
          : vote_value === -1
            ? "Downvoted"
            : "Removed vote from";
      showSuccess(`${vote} comment successfully!`);
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: UpdateCommentRequest) =>
      commentApi.updateComment(comment.id, data),
    onSuccess: (_, { content }) => {
      mutateCache<Comment>({
        queryClient,
        itemName: "comment",
        itemKey: comment.id,
        mutateFn: (oldComment) => {
          if (oldComment.id !== comment.id) return oldComment;
          const { summary, isTruncated } = summarizeCommentContent(
            content ?? oldComment.content,
          );
          return {
            ...oldComment,
            content: content ?? oldComment.content,
            summary,
            has_long_content: isTruncated,
            updated_at: new Date().toISOString(),
          };
        },
      });

      showSuccess("Comment updated successfully!");
    },
    onError: () => {
      showError("Failed to update comment. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.deleteComment(comment.id),
    onSuccess: () => {
      mutateCache<Comment>({
        queryClient,
        itemName: "comment",
        itemKey: comment.id,
        mutateFn: (oldComment) => {
          if (oldComment.id !== comment.id) return oldComment;
          return {
            ...oldComment,
            is_deleted: true,
          };
        },
      });

      showSuccess("Comment deleted successfully!");
    },
    onError: () => {
      showError("Failed to delete comment. Please try again.");
    },
  });

  const pinMutation = useMutation({
    mutationFn: (is_pin: boolean) =>
      postApi.pinComment(comment.post_id, {
        comment_id: is_pin ? comment.id : null,
      }),
    onSuccess: (_, is_pin) => {
      mutateCache<Post>({
        queryClient,
        itemName: "post",
        itemKey: comment.post_id,
        mutateFn: (oldPost) => {
          if (oldPost.id !== comment.post_id) return oldPost;
          return {
            ...oldPost,
            pinned_comment_id: is_pin ? comment.id : null,
          };
        },
      });

      showSuccess(`Comment ${is_pin ? "pinned" : "unpinned"} successfully!`);
    },
    onError: () => {
      showError("Failed to pin comment. Please try again.");
    },
  });

  const handleUpvote = () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (comment.my_vote === 1) {
      voteMutation.mutate({ vote_value: 0 });
    } else {
      voteMutation.mutate({ vote_value: 1 });
    }
  };

  const handleDownvote = () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (comment.my_vote === -1) {
      voteMutation.mutate({ vote_value: 0 });
    } else {
      voteMutation.mutate({ vote_value: -1 });
    }
  };

  const handleEdit = (data: { content: string }) => {
    editMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handlePin = () => {
    pinMutation.mutate(true);
  };

  const handleUnpin = () => {
    pinMutation.mutate(false);
  };


  return {
    handleUpvote,
    handleDownvote,
    handleEdit,
    handleDelete,
    handlePin,
    handleUnpin,

    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
