import { Comment } from "@mui/icons-material";
import {
  CardContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import {
  CardWithLink,
  Time,
  TopicChip,
  UserChip,
  VoteButtons,
} from "@/components/common/card";
import { CLAMP_TEXT_SX } from "@/constants/style";
import { useAuth } from "@/contexts/AuthContext";
import { usePostActions } from "@/hooks/posts";
import type { Post } from "@/types/post";
import { getPostLink } from "@/utils/link";
import { PostActions, PostContent } from ".";

interface PostCardProps {
  item: Post;
  showActions?: boolean;
  isInDetailView?: boolean;
}

export function PostCard({ item: post, isInDetailView }: PostCardProps) {
  const { isAuthenticated, user } = useAuth();
  const {
    handleUpvote,
    handleDownvote,
    handleEdit,
    handleDelete,
    isEditing,
    isDeleting,
  } = usePostActions(post);

  const canModify =
    isAuthenticated && user?.username === post.username && !post.is_deleted;

  const linkToPost = getPostLink({
    relative: true,
    topicName: post.topic_name,
    postId: post.id,
  });

  const isDeleted = post.is_deleted;

  return (
    <CardWithLink link={isInDetailView ? undefined : linkToPost}>
      <CardContent>
        <Stack direction="column" spacing={2}>
          {/* Post Author, Topic, and Actions */}
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="row" spacing={1.7}>
              <TopicChip topic_name={post.topic_name} />
              <UserChip username={post.username} />
            </Stack>
            <PostActions
              post={post}
              onEdit={handleEdit}
              onDelete={handleDelete}
              refetchItem={true}
              isEditing={isEditing}
              isDeleting={isDeleting}
              canModify={canModify}
            />
          </Stack>

          {/* Post Title */}
          <Typography
            variant="h6"
            fontWeight={600}
            color={isDeleted ? "text.disabled" : "text.primary"}
            fontStyle={isDeleted ? "italic" : "normal"}
            sx={isInDetailView ? {} : CLAMP_TEXT_SX(2)}
          >
            {isDeleted ? "[Deleted Post]" : post.title}
          </Typography>

          {/* Post Content */}
          {isInDetailView ? (
            <PostContent isDeleted={isDeleted} content={post.content} />
          ) : (
            <Typography
              sx={{
                ...CLAMP_TEXT_SX(2),
                lineHeight: 1.5,
              }}
              variant="body2"
              color={isDeleted ? "text.disabled" : "text.secondary"}
              fontSize={isDeleted ? "italic" : "normal"}
            >
              {isDeleted ? "This post has been deleted." : post.summary}
            </Typography>
          )}

          {isInDetailView && <Divider />}

          {/* Post Vote Buttons, Comments Link, and Time */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={2.5} alignItems="center">
              <VoteButtons
                score={post.score}
                myVote={post.my_vote}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
              />

              <IconButton
                size="small"
                component={Link}
                to={`${linkToPost}#comments`}
                sx={{
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Stack direction="row" spacing={0.5}>
                  <Comment fontSize="small" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {post.no_of_comments}
                  </Typography>
                </Stack>
              </IconButton>
            </Stack>
            <Time
              created_at={post.created_at}
              updated_at={isInDetailView ? post.updated_at : undefined}
            />
          </Stack>
        </Stack>
      </CardContent>
    </CardWithLink>
  );
}
