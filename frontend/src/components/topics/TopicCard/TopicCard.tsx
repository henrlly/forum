import { Article, People } from "@mui/icons-material";
import { CardContent, Chip, Stack, Typography } from "@mui/material";
import { CardWithLink } from "@/components/common/card";
import { CLAMP_TEXT_SX } from "@/constants/style";
import type { Topic } from "@/types/topic";
import { slugifyTopicName } from "@/utils/slugify";
import { FollowButton } from ".";

interface TopicCardProps {
  item: Topic;
}

export function TopicCard({ item: topic }: TopicCardProps) {
  const topicSlug = slugifyTopicName(topic.name);
  return (
    <CardWithLink link={`/topics/${topicSlug}`}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          {/* Topic Name and Follow Button */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="primary.main">
              {topic.name}
            </Typography>
            <FollowButton
              topicSlug={topicSlug}
              isFollowing={topic.is_following}
            />
          </Stack>

          {/* Topic Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              ...CLAMP_TEXT_SX(2),
              lineHeight: 1.5,
            }}
          >
            {topic.description}
          </Typography>

          {/* Topic Follower and Post Counts */}
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<People />}
              label={`${topic.no_of_followers} ${topic.no_of_followers === 1 ? "follower" : "followers"}`}
              size="small"
              variant="outlined"
              color="secondary"
            />
            <Chip
              icon={<Article />}
              label={`${topic.no_of_posts} ${topic.no_of_posts === 1 ? "post" : "posts"}`}
              size="small"
              variant="outlined"
              color="primary"
            />
          </Stack>
        </Stack>
      </CardContent>
    </CardWithLink>
  );
}
