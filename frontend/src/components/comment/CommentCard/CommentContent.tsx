import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Loading } from "@/components/common/Loading";
import { CLAMP_TEXT_SX } from "@/constants/style";
import { useComment } from "@/hooks/comments";

interface CommentContentProps {
  isDeleted: boolean;
  hasLongContent?: boolean;
  commentId: number;
  commentSummary: string;
}

export function CommentContent({
  isDeleted,
  hasLongContent,
  commentId,
  commentSummary,
}: CommentContentProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: fullComment, isLoading: isLoadingFullComment } = useComment({
    id: commentId,
    isEnabled: isExpanded && hasLongContent && !isDeleted,
  });

  return (
    <Stack
      direction="column"
      spacing={0.5}
      alignContent="right"
      justifyContent="right"
      justifyItems="right"
    >
      {/* Comment Text */}
      <Typography
        variant="body2"
        color={isDeleted ? "text.secondary" : "text.primary"}
        fontStyle={isDeleted ? "italic" : "normal"}
        whiteSpace="pre-wrap"
        sx={{
          ...(hasLongContent && !isExpanded && CLAMP_TEXT_SX(2)),
        }}
      >
        {isDeleted
          ? "[deleted]"
          : isExpanded && fullComment
            ? fullComment.content
            : commentSummary}
      </Typography>

      {/* Read More / Show Less Button */}
      {!isDeleted && hasLongContent && (
        <Button
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={isLoadingFullComment}
          sx={{
            p: 0,
            textTransform: "none",
            fontSize: "0.875rem",
            alignSelf: "flex-start",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {isLoadingFullComment ? (
            <Loading loadingText={"Loading full comment..."} size={16} />
          ) : isExpanded ? (
            "Show less"
          ) : (
            "Read more"
          )}
        </Button>
      )}
    </Stack>
  );
}
