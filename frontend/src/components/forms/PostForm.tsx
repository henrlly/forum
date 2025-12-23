import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { FormSubmitButton } from "@/components/common/form";
import { Loading } from "@/components/common/Loading";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "@/constants/posts";
import { useCreatePost } from "@/hooks/posts";
import { useTopicsSummary } from "@/hooks/topics";
import { createPostSchema } from "@/schema/posts";
import type { CreatePostRequest } from "@/types/post";

interface PostFormProps {
  initialTopicId?: number;
}

// Doesn't check if user is authenticated - should be handled by parent
export function PostForm({ initialTopicId }: PostFormProps) {
  const {
    data: topics,
    isLoading: isTopicsLoading,
    error: topicsError,
  } = useTopicsSummary();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreatePostRequest>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      topic_id: initialTopicId || 0,
      title: "",
      content: "",
    },
    mode: "onChange",
  });

  const watchedFields = watch();

  const { createPost, isLoading, error } = useCreatePost(topics);

  const onSubmitHandler = (data: CreatePostRequest) => createPost(data);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="column" spacing={4}>
        <Typography variant="h5">Create New Post</Typography>

        <Stack
          direction="column"
          component="form"
          onSubmit={handleSubmit(onSubmitHandler)}
          spacing={3}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Failed to create post {error.message ? `: ${error.message}` : "."}
            </Alert>
          )}
          <TextField
            {...register("topic_id")}
            select
            fullWidth
            label="Topic"
            margin="normal"
            required
            error={!!errors.topic_id}
            helperText={errors.topic_id?.message}
            defaultValue={initialTopicId || 0}
          >
            <MenuItem disabled value={0}>
              Select a topic
            </MenuItem>

            {isTopicsLoading ? (
              <MenuItem disabled>
                <Loading size={24} loadingText="Loading topics..." />
              </MenuItem>
            ) : topicsError || !topics ? (
              <MenuItem disabled>
                Error loading topics. Please try again.
              </MenuItem>
            ) : (
              topics.map((topic) => (
                <MenuItem key={topic.id} value={topic.id}>
                  {topic.name}
                </MenuItem>
              ))
            )}
          </TextField>

          <TextField
            {...register("title")}
            fullWidth
            label="Title"
            margin="normal"
            required
            placeholder="Add post title..."
            error={!!errors.title}
            helperText={
              errors.title?.message ||
              `${(watchedFields.title?.length || 0).toLocaleString()}/${MAX_POST_TITLE_LENGTH.toLocaleString()} characters`
            }
            slotProps={{ htmlInput: { maxLength: MAX_POST_TITLE_LENGTH } }}
          />

          <TextField
            {...register("content")}
            fullWidth
            label="Content"
            margin="normal"
            multiline
            rows={6}
            placeholder="Add post content..."
            error={!!errors.content}
            helperText={
              errors.content?.message ||
              `${(watchedFields.content?.length || 0).toLocaleString()}/${MAX_POST_CONTENT_LENGTH.toLocaleString()} characters`
            }
            slotProps={{ htmlInput: { maxLength: MAX_POST_CONTENT_LENGTH } }}
          />

          <FormSubmitButton
            disabled={isLoading || !isValid}
            isSubmitting={isLoading}
            loadingText="Creating..."
            fullWidth={false}
            removeSx={true}
          >
            {"Create Post"}
          </FormSubmitButton>
        </Stack>
      </Stack>
    </Paper>
  );
}
