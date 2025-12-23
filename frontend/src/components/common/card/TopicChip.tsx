import { Topic } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { slugifyTopicName } from "@/utils/slugify";

export interface TopicChipProps {
  topic_name: string;
}
export function TopicChip({ topic_name }: TopicChipProps) {
  const topicSlug = slugifyTopicName(topic_name);
  return (
    <Chip
      onClick={() => {}} // for click animation
      icon={<Topic />}
      component={Link}
      to={`/topics/${topicSlug}`}
      label={topic_name}
      color="primary"
      variant="outlined"
      size="small"
    />
  );
}
