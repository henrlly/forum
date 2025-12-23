import { Box, Card, CardContent, Divider, Link, Stack } from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Time, UserChip, VoteButtons } from "@/components/common/card";
import { CommentForm } from "@/components/forms/CommentForm";
import { CLAMP_TEXT_SX, HIGHLIGHT_COMMENT_SX } from "@/constants/style";
import { useAuth } from "@/contexts/AuthContext";
import { useCommentActions } from "@/hooks/comments";
import { useHashHighlight } from "@/hooks/utils";
import type { Comment } from "@/types/comment";
import { getCommentLink, getPostLink } from "@/utils/link";
import {
  CommentActions,
  CommentContent,
  ReplyButton,
  ToggleRepliesButton,
} from ".";

interface CommentCardProps {
  postAuthorId?: number;
  pinnedCommentId?: number | null;
  item: Comment;
  depth?: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showPostTitle?: boolean;
  isInPostDetailView?: boolean;
}

export function CommentCard({
  postAuthorId,
  pinnedCommentId,
  item: comment,
  depth = 0,
  isCollapsed = false,
  onToggleCollapse,
  showPostTitle = !onToggleCollapse,
  isInPostDetailView = !!onToggleCollapse,
}: CommentCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const {
    handleUpvote,
    handleDownvote,
    handleEdit,
    handleDelete,
    handlePin,
    handleUnpin,
    isEditing,
    isDeleting,
  } = useCommentActions(comment);

  const commentLink = getCommentLink({
    relative: true,
    topicName: comment.topic_name,
    postId: comment.post_id,
    commentId: comment.id,
  });

  const postLink = getPostLink({
    relative: true,
    topicName: comment.topic_name,
    postId: comment.post_id,
  });

  const canModify =
    isAuthenticated &&
    user &&
    user.id === comment.user_id &&
    !comment.is_deleted;
  const isDeleted = comment.is_deleted;
  const isPinned = pinnedCommentId === comment.id;
  const canPin = postAuthorId === user?.id && !isDeleted && !comment.parent_id;

  // Highlight comment if URL hash matches
  const isHighlighted = useHashHighlight(`comment-${comment.id}`);
  const commentRef = useRef<HTMLDivElement>(null);

  // Explicitly scroll into view on highlight change,
  // since the comment might render only after initial load
  useEffect(() => {
    if (isHighlighted && commentRef.current) {
      commentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isHighlighted]);

  return (
    <Card
      ref={commentRef}
      id={`comment-${comment.id}`}
      variant="outlined"
      sx={{
        ml: depth * 3,
        mb: 2,
        backgroundColor: isDeleted
          ? "action.disabledBackground"
          : "background.paper",
        borderLeft: depth > 0 ? "3px solid" : undefined,
        borderLeftColor: `primary.${Math.min(depth * 100 + 100, 500)}`,
        transition: "all 0.2s ease-in-out",
        position: "relative",
        ...(isHighlighted && HIGHLIGHT_COMMENT_SX),
        ...(isPinned && {
          borderColor: "primary.main",
          borderWidth: 2,
        }),
      }}
    >
      <CardContent sx={{ py: 1.5 }}>
        <Stack direction="column" spacing={1.5}>
          {/* Comment Author, Time, and Actions */}
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={1.7} alignItems="center">
              <UserChip username={comment.username} />
              <Time
                created_at={comment.created_at}
                updated_at={comment.updated_at}
                isRow={true}
              />
            </Stack>
            <CommentActions
              isPinned={isPinned}
              canPin={isInPostDetailView && canPin}
              comment={comment}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPin={handlePin}
              onUnpin={handleUnpin}
              isEditing={isEditing}
              isDeleting={isDeleting}
              canModify={canModify}
            />
          </Stack>

          {/* Post Title (if in list view) */}
          {showPostTitle && comment.post_title && (
            <Link
              variant="caption"
              color="primary.main"
              sx={CLAMP_TEXT_SX(1)}
              fontStyle="italic"
              underline="hover"
              component={RouterLink}
              to={postLink}
            >
              On: {comment.post_title}
            </Link>
          )}

          {/* Comment Content */}
          <CommentContent
            isDeleted={isDeleted}
            hasLongContent={comment.has_long_content}
            commentId={comment.id}
            commentSummary={comment.summary}
          />

          {/* Comment Vote and Reply Buttons, and Link To Comment */}
          {!isDeleted && (
            <Stack direction="column" spacing={2}>
              <Divider />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <VoteButtons
                    score={comment.score}
                    myVote={comment.my_vote}
                    onUpvote={handleUpvote}
                    onDownvote={handleDownvote}
                  />
                  <ReplyButton
                    isInPostDetailView={isInPostDetailView}
                    setShowReplyForm={setShowReplyForm}
                    showReplyForm={showReplyForm}
                    commentLink={commentLink}
                  />
                </Stack>
                <ToggleRepliesButton
                  isInPostDetailView={isInPostDetailView}
                  noOfReplies={comment.no_of_replies}
                  isCollapsed={isCollapsed}
                  onToggleCollapse={onToggleCollapse}
                  commentLink={commentLink}
                />
              </Stack>
            </Stack>
          )}
        </Stack>
      </CardContent>

      {/* Comment Reply Form */}
      {showReplyForm && !isDeleted && (
        <Box sx={{ p: 2 }}>
          <CommentForm
            autoFocus={true}
            postId={comment.post_id}
            parentId={comment.id}
            placeholder={`Reply to ${comment.username}...`}
            showCancel={true}
            onSuccess={() => setShowReplyForm(false)}
            onCancel={() => setShowReplyForm(false)}
          />
        </Box>
      )}
    </Card>
  );
}
