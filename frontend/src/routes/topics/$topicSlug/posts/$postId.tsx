import { Alert, Container, Stack } from "@mui/material";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CommentSection } from "@/components/comment/CommentSection";
import { Loading } from "@/components/common/Loading";
import { PostCard } from "@/components/posts/PostCard";
import { POST_COMMENTS_SORT_OPTIONS } from "@/constants/comments";
import { useComments } from "@/hooks/comments";
// import { useAuth } from "@/contexts/AuthContext";
import { usePost } from "@/hooks/posts";
import { listCommentsRequestSchema } from "@/schema/comments";

export const Route = createFileRoute("/topics/$topicSlug/posts/$postId")({
  component: PostPage,
});

function PostPage() {
  const { postId } = useParams({ from: "/topics/$topicSlug/posts/$postId" });
  const [sortValue, setSortValue] = useState(0);

  const navigate = useNavigate();

  const postIdNumber = parseInt(postId, 10);

  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = usePost({ id: postIdNumber });

  const useCommentsParams = useMemo(
    () =>
      listCommentsRequestSchema.parse({
        post_id: postIdNumber,
        show_deleted_comments: true,
        page_size: 0, // Fetch all comments
        sort: POST_COMMENTS_SORT_OPTIONS[sortValue].value.sort,
        order_by: POST_COMMENTS_SORT_OPTIONS[sortValue].value.order_by,
      }),
    [postIdNumber, sortValue],
  );

  const {
    data,
    isLoading: isCommentsLoading,
    error: commentsError,
  } = useComments(useCommentsParams);

  // const { user } = useAuth();

  const comments = useMemo(() => {
    if (!data?.comments) return [];
    const pinnedComments = data.comments.filter(
      (c) => c.id === post?.pinned_comment_id,
    );
    const notPinnedComments = data.comments.filter(
      (c) => c.id !== post?.pinned_comment_id,
    );

    // if you want comments by the current user to always
    // appear right after the pinned comment at the top:
    //
    // const userComments = notPinnedComments.filter(
    //   (c) => c.user_id === user?.id,
    // );
    // const otherComments = notPinnedComments.filter(
    //   (c) => c.user_id !== user?.id,
    // );
    // return [...pinnedComments, ...userComments, ...otherComments];
    // }, [data?.comments, user?.id, post?.pinned_comment_id]);

    return [...pinnedComments, ...notPinnedComments];
  }, [data?.comments, post?.pinned_comment_id]);

  if (isPostLoading) {
    return <Loading isPage={true} loadingText="Loading post..." />;
  }

  if (postError || !post) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load post{" "}
        {postError?.message ? `: ${postError.message}` : "."}
      </Alert>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Stack direction="column" spacing={4}>
        <PostCard item={post} isInDetailView={true} />
        <CommentSection
          postAuthorId={post.user_id}
          pinnedCommentId={post.pinned_comment_id}
          comments={comments}
          isLoading={isCommentsLoading}
          error={commentsError?.message || null}
          postId={postIdNumber}
          isPostDeleted={post.is_deleted}
          sortValue={sortValue}
          onSortChange={(v) => {
            // override hash to specific comment when sort is changed
            navigate({ hash: "comments", replace: true });
            setSortValue(v);
          }}
        />
      </Stack>
    </Container>
  );
}
