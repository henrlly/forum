import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";

interface VoteButtonsProps {
  score: number;
  myVote?: number;
  onUpvote: () => void;
  onDownvote: () => void;
}

export function VoteButtons({
  score,
  myVote,
  onUpvote,
  onDownvote,
}: VoteButtonsProps) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      data-ignore-nested-link
      border={1}
      borderColor="divider"
      borderRadius={1}
      p={0.5}
    >
      <IconButton
        size="small"
        onClick={onUpvote}
        sx={{
          p: 0.5,
          color: myVote === 1 ? "success.main" : "text.secondary",
          backgroundColor:
            myVote === 1 ? "rgba(76, 175, 80, 0.1)" : "transparent",
          "&:hover": {
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "success.main",
          },
        }}
      >
        <KeyboardArrowUp fontSize="small" />
      </IconButton>

      <Typography
        variant="body2"
        fontWeight={600}
        minWidth={24}
        textAlign="center"
        color="text.primary"
      >
        {score}
      </Typography>

      <IconButton
        size="small"
        onClick={onDownvote}
        sx={{
          p: 0.5,
          color: myVote === -1 ? "error.main" : "text.secondary",
          backgroundColor:
            myVote === -1 ? "rgba(244, 67, 54, 0.1)" : "transparent",
          "&:hover": {
            backgroundColor: "rgba(244, 67, 54, 0.1)",
            color: "error.main",
          },
        }}
      >
        <KeyboardArrowDown fontSize="small" />
      </IconButton>
    </Stack>
  );
}
