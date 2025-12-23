import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { FormSubmitButton } from "@/components/common/form";
import { MAX_COMMENT_CONTENT_LENGTH } from "@/constants/comments";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateComment } from "@/hooks/comments";
import { createCommentSchema } from "@/schema/comments";
import type { CreateCommentRequest } from "@/types/comment";

interface CommentFormProps {
  postId: number;
  parentId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
  placeholder?: string;
  showCancel?: boolean;
  autoFocus?: boolean;
}

export function CommentForm({
  postId,
  parentId = null,
  onSuccess,
  onCancel,
  placeholder = "Add a comment...",
  showCancel = false,
  autoFocus = false,
}: CommentFormProps) {
  const { isAuthenticated } = useAuth();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<CreateCommentRequest>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      post_id: postId,
      content: "",
      parent_id: parentId,
    },
    mode: "onChange",
  });

  const watchedContent = watch("content");

  const { createComment, isLoading, error } = useCreateComment(() => {
    reset(); // needed since top level comment form stays open
    onSuccess?.();
  });

  const onSubmitHandler = (data: CreateCommentRequest) => createComment(data);

  if (!isAuthenticated) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          backgroundColor: "action.disabledBackground",
          textAlign: "center",
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            You need to be logged in to comment
          </Typography>
          <Button variant="contained" size="small" component={Link} to="/login">
            Log In
          </Button>
        </Stack>
      </Paper>
    );
  }

  return (
    <Stack
      direction="column"
      component="form"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to create comment {error.message ? `: ${error.message}` : "."}
        </Alert>
      )}

      <TextField
        {...register("content")}
        autoFocus={autoFocus}
        fullWidth
        multiline
        rows={3}
        placeholder={placeholder}
        variant="outlined"
        disabled={isLoading}
        error={!!errors.content}
        helperText={
          errors.content?.message ||
          `${watchedContent?.length || 0}/${MAX_COMMENT_CONTENT_LENGTH.toLocaleString()} characters`
        }
        slotProps={{ htmlInput: { maxLength: MAX_COMMENT_CONTENT_LENGTH } }}
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        {showCancel && (
          <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <FormSubmitButton
          disabled={isLoading || !isValid}
          isSubmitting={isLoading}
          loadingText="Posting..."
          fullWidth={false}
          removeSx={true}
        >
          {parentId ? "Reply" : "Comment"}
        </FormSubmitButton>
      </Stack>
    </Stack>
  );
}
