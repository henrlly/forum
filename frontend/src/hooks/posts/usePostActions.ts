import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { postApi } from "@/api/post";
import { useAuth } from "@/contexts/AuthContext";
import { useSnackbar } from "@/contexts/SnackbarContext";
import type { Post, UpdatePostRequest, VotePostRequest } from "@/types/post";
import { mutateCache } from "@/utils/mutate";
import { summarizePostContent } from "@/utils/summary";

export function usePostActions(post: Post) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useSnackbar();
  const { isAuthenticated } = useAuth();

  const voteMutation = useMutation({
    mutationFn: ({ vote_value }: VotePostRequest) =>
      postApi.votePost(post.id, { vote_value }),
    onSuccess: (_, { vote_value }) => {
      mutateCache<Post>({
        queryClient,
        itemName: "post",
        itemKey: post.id,
        mutateFn: (oldPost) => {
          if (oldPost.id !== post.id) return oldPost;
          return {
            ...oldPost,
            score: oldPost.score - (oldPost.my_vote || 0) + vote_value,
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
      showSuccess(`${vote} post successfully!`);
    },
  });

  const editMutation = useMutation({
    mutationFn: (data: UpdatePostRequest) => postApi.updatePost(post.id, data),
    onSuccess: (_, { title, content }) => {
      mutateCache<Post>({
        queryClient,
        itemName: "post",
        itemKey: post.id,
        mutateFn: (oldPost) => {
          if (oldPost.id !== post.id) return oldPost;
          return {
            ...oldPost,
            title: title ?? oldPost.title,
            content: content ?? oldPost.content,
            summary: summarizePostContent(content ?? oldPost.content),
            updated_at: new Date().toISOString(),
          };
        },
      });

      showSuccess("Post updated successfully!");
    },
    onError: () => {
      showError("Failed to update post. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => postApi.deletePost(post.id),
    onSuccess: () => {
      mutateCache<Post>({
        queryClient,
        itemName: "post",
        itemKey: post.id,
        mutateFn: (oldPost) => {
          if (oldPost.id !== post.id) return oldPost;
          return {
            ...oldPost,
            is_deleted: true,
          };
        },
      });

      // Stay on the deleted post page to show the deleted state (only for detail context)
      showSuccess("Post deleted successfully!");
    },
    onError: () => {
      showError("Failed to delete post. Please try again.");
    },
  });

  const handleUpvote = () => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
      return;
    }
    if (post.my_vote === 1) {
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
    if (post.my_vote === -1) {
      voteMutation.mutate({ vote_value: 0 });
    } else {
      voteMutation.mutate({ vote_value: -1 });
    }
  };

  const handleEdit = (data: UpdatePostRequest) => {
    editMutation.mutate(data);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };


  return {
    handleUpvote,
    handleDownvote,
    handleEdit,
    handleDelete,

    isEditing: editMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
