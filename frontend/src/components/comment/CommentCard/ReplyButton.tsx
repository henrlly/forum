import { Reply } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

interface ReplyButtonProps {
  isInPostDetailView: boolean;
  setShowReplyForm: (show: boolean) => void;
  showReplyForm: boolean;
  commentLink: string;
}

export function ReplyButton({
  isInPostDetailView,
  setShowReplyForm,
  showReplyForm,
  commentLink,
}: ReplyButtonProps) {
  return (
    <IconButton
      size="small"
      onClick={() =>
        isInPostDetailView ? setShowReplyForm(!showReplyForm) : undefined
      }
      sx={{
        padding: 0.5,
        borderRadius: 1,
      }}
    >
      <Stack direction="row" spacing={0.5} alignItems="center">
        <Reply fontSize="small" color="action" />
        <Typography
          variant="caption"
          color="text.secondary"
          {...(!isInPostDetailView && {
            to: commentLink,
            component: Link,
          })}
          pt={0.5}
        >
          Reply
        </Typography>
      </Stack>
    </IconButton>
  );
}
