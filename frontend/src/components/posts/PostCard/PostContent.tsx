import { Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { POST_TRUNCATE_LENGTH_THRESHOLD } from "@/constants/posts";
import { CLAMP_TEXT_SX } from "@/constants/style";

interface PostContentProps {
  isDeleted: boolean;
  content: string;
}

export function PostContent({ isDeleted, content }: PostContentProps) {
  const hasLongContent = content.length > POST_TRUNCATE_LENGTH_THRESHOLD;
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <Stack direction="column" spacing={1}>
      <Typography
        variant="body1"
        lineHeight={1.7}
        color={isDeleted ? "text.disabled" : "text.primary"}
        fontStyle={isDeleted ? "italic" : "normal"}
        whiteSpace="pre-wrap"
        sx={{
          ...(hasLongContent && !isExpanded && CLAMP_TEXT_SX(5)),
        }}
      >
        {isDeleted ? "This post has been deleted." : content}
      </Typography>

      {/* Read More / Show Less Button */}
      {!isDeleted && hasLongContent && (
        <Button
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
          sx={{
            p: 0,
            textTransform: "none",
            fontSize: "0.95rem",
            alignSelf: "flex-start",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {isExpanded ? "Show less" : "Read more"}
        </Button>
      )}
    </Stack>
  );
}
