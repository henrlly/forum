import { Alert, Box, Divider, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { CommentCard } from "@/components/comment/CommentCard";
import { Loading } from "@/components/common/Loading";
import { CommentForm } from "@/components/forms/CommentForm";
import { Sort } from "@/components/List";
import { POST_COMMENTS_SORT_OPTIONS } from "@/constants/comments";
import { HIGHLIGHT_COMMENTS_SX } from "@/constants/style";
import { useHashHighlight } from "@/hooks/utils";
import type { Comment } from "@/types/comment";

interface CommentSectionProps {
  postAuthorId: number;
  pinnedCommentId?: number | null;
  comments: Comment[];
  isLoading?: boolean;
  error?: string | null;
  postId: number;
  isPostDeleted?: boolean;
  sortValue: number;
  onSortChange: (index: number) => void;
}

interface CommentNode extends Comment {
  children: CommentNode[];
}

export function CommentSection({
  postAuthorId,
  pinnedCommentId,
  comments,
  isLoading,
  error,
  postId,
  isPostDeleted = false,
  sortValue,
  onSortChange,
}: CommentSectionProps) {
  const [collapsedComments, setCollapsedComments] = useState(new Set());

  // Highlight comments section if URL hash matches
  const commentsRef = useRef<HTMLDivElement>(null);
  const isCommentsHighlighted = useHashHighlight("comments");

  // Explicitly scroll into view on highlight change,
  // since the comment section might render only after
  // initial load
  useEffect(() => {
    if (isCommentsHighlighted && commentsRef.current) {
      commentsRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isCommentsHighlighted]);

  // Build comment tree
  const commentMap: Record<number, CommentNode> = {};
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, children: [] };
  });

  const commentTree: CommentNode[] = [];
  comments.forEach((comment) => {
    if (comment.parent_id) {
      const parentNode = commentMap[comment.parent_id];
      if (parentNode) {
        parentNode.children.push(commentMap[comment.id]);
      }
    } else {
      commentTree.push(commentMap[comment.id]);
    }
  });

  const toggleCollapse = (commentId: number) => {
    setCollapsedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const renderCommentTree = (
    commentNode: CommentNode,
    depth = 0,
  ): ReactNode => {
    const isCollapsed = collapsedComments.has(commentNode.id);
    return (
      <Stack direction="column" key={commentNode.id}>
        <CommentCard
          postAuthorId={postAuthorId}
          pinnedCommentId={pinnedCommentId}
          item={commentNode}
          depth={depth}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => toggleCollapse(commentNode.id)}
          showPostTitle={false}
          isInPostDetailView={true}
        />

        {commentNode.children.length > 0 && !isCollapsed && (
          <Stack direction="column">
            {commentNode.children.map((childNode) =>
              renderCommentTree(childNode, depth + 1),
            )}
          </Stack>
        )}
      </Stack>
    );
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Failed to load comments: {error}
      </Alert>
    );
  }

  return (
    <Stack
      direction="column"
      ref={commentsRef}
      id="comments"
      sx={{
        transition: "all 0.2s ease-in-out",
        ...(isCommentsHighlighted && HIGHLIGHT_COMMENTS_SX),
      }}
      spacing={3}
    >
      {/* Comments List Header */}
      <Stack
        direction="row"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Typography variant="h6">Comments</Typography>
          <Typography variant="body2" color="text.secondary">
            ({comments.length})
          </Typography>
        </Stack>

        {comments.length > 0 && (
          <Sort
            sortValue={sortValue}
            onSortChange={onSortChange}
            sortOptions={POST_COMMENTS_SORT_OPTIONS}
            label="Sort"
            size="small"
            minWidth={140}
          />
        )}
      </Stack>

      <Divider />

      {/* Top Level Comment Form */}
      {!isPostDeleted ? (
        <CommentForm postId={postId} />
      ) : (
        <Typography
          variant="body2"
          color="text.secondary"
          p={2}
          bgcolor="action.disabledBackground"
          borderRadius={1}
          textAlign="center"
        >
          Comments are disabled for deleted posts
        </Typography>
      )}

      {/* Comments Tree */}
      {isLoading ? (
        <Loading loadingText="Loading comments..." />
      ) : comments.length === 0 ? (
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          py={4}
        >
          No comments yet. Be the first to comment!
        </Typography>
      ) : (
        <Box>
          {commentTree.map((commentNode) => renderCommentTree(commentNode))}
        </Box>
      )}
    </Stack>
  );
}
