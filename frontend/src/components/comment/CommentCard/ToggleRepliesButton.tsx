import { Button } from "@mui/material";
import { Link } from "@tanstack/react-router";

interface ToggleRepliesButtonProps {
  isInPostDetailView?: boolean;
  noOfReplies: number;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  commentLink: string;
}

export function ToggleRepliesButton({
  isInPostDetailView,
  noOfReplies,
  isCollapsed,
  onToggleCollapse,
  commentLink,
}: ToggleRepliesButtonProps) {
  const hasChildren = noOfReplies > 0;

  if (isInPostDetailView && !hasChildren) {
    return null;
  }

  return (
    <Button
      sx={{
        textAlign: { xs: "left", sm: "right" },
        p: 0,
        textTransform: "none",
        fontSize: "0.875rem",
        "&:hover": {
          textDecoration: "underline",
        },
      }}
      onClick={isInPostDetailView && hasChildren ? onToggleCollapse : undefined}
    >
      {isInPostDetailView && hasChildren ? (
        isCollapsed ? (
          `Show ${noOfReplies} ${noOfReplies === 1 ? "reply" : "replies"}`
        ) : (
          "Hide replies"
        )
      ) : (
        <Link to={commentLink}>
          {`To comment with ${noOfReplies} ${noOfReplies === 1 ? "reply" : "replies"}`}
        </Link>
      )}
    </Button>
  );
}
