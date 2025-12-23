import { zodResolver } from "@hookform/resolvers/zod";
import { Edit } from "@mui/icons-material";
import {
  Alert,
  Button,
  capitalize,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { UseQueryResult } from "@tanstack/react-query";
import { useEffect } from "react";
import type { FieldValues } from "react-hook-form";
import { useForm } from "react-hook-form";
import type { ZodType } from "zod";
import { FormSubmitButton } from "@/components/common/form";
import { Loading } from "@/components/common/Loading";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "@/constants/posts";
import type { UseItemParams } from "@/types/hook";

interface EditModalProps<T, U> {
  itemName: string;
  open: boolean;
  item: T;
  hasTitleField: boolean;
  onClose: () => void;
  onSubmit: (data: U) => void;
  refetchItem?: boolean; // whether to refetch full item content when modal opens
  fetchItemHook: ({
    id,
    isEnabled,
    staleTime,
  }: UseItemParams) => UseQueryResult<T>;
  schema: ZodType<any, FieldValues>;
  maxContentLength?: number;
  maxTitleLength?: number;
  isSubmitting?: boolean;
}

export function EditModal<
  T extends { id: number; title?: string; content: string },
  U extends { content?: string },
>({
  itemName,
  open,
  item,
  hasTitleField,
  onClose,
  onSubmit,
  refetchItem = false,
  fetchItemHook,
  schema,
  maxContentLength = MAX_POST_CONTENT_LENGTH,
  maxTitleLength = MAX_POST_TITLE_LENGTH,
  isSubmitting,
}: EditModalProps<T, U>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ...(hasTitleField ? { title: item.title } : {}),
      content: item.content,
    },
  });

  const watchedFields = watch();

  const {
    data: fullItem,
    isLoading,
    error: fetchError,
  } = fetchItemHook({
    id: item.id,
    isEnabled: open && refetchItem,
    staleTime: 0,
  });

  // Reset form when modal opens or item data changes
  useEffect(() => {
    if (open) {
      const itemToUse = refetchItem && fullItem ? fullItem : item;
      reset({
        ...(hasTitleField ? { title: itemToUse.title } : {}),
        content: itemToUse.content,
      });
    }
  }, [open, hasTitleField, item, fullItem, refetchItem, reset]);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle display="flex" alignItems="center" gap={1}>
        <Edit />
        Edit {capitalize(itemName)}
      </DialogTitle>

      <DialogContent>
        {fetchError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load full {itemName} content.
          </Alert>
        )}

        {refetchItem && isLoading ? (
          <Loading
            loadingText={`Loading full ${itemName} content...`}
            size={24}
          />
        ) : (
          <Stack direction="column">
            <Stack
              direction="column"
              spacing={4}
              pt={1}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              {hasTitleField && (
                <TextField
                  {...register("title")}
                  id="title"
                  label="Title"
                  error={!!errors.title}
                  helperText={
                    (errors.title?.message as string) ||
                    `${(watchedFields.title?.length || 0).toLocaleString()}/${maxTitleLength.toLocaleString()} characters`
                  }
                  disabled={isLoading}
                  required
                  slotProps={{
                    htmlInput: { maxLength: maxTitleLength },
                  }}
                />
              )}

              <TextField
                {...register("content")}
                id="content"
                label="Content"
                error={!!errors.content}
                helperText={
                  (errors.content?.message as string) ||
                  `${(watchedFields.content?.length || 0).toLocaleString()}/${maxContentLength.toLocaleString()} characters`
                }
                disabled={isLoading}
                multiline
                rows={12}
                slotProps={{
                  htmlInput: { maxLength: maxContentLength },
                }}
              />
            </Stack>
          </Stack>
        )}
      </DialogContent>

      <Stack direction="row-reverse" justifyContent="space-between">
        <DialogActions sx={{ px: 3, pb: 5 }}>
          <Button onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <FormSubmitButton
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading || !isDirty || !isValid}
            loadingText="Saving..."
            isSubmitting={isSubmitting}
            removeSx={true}
            fullWidth={false}
          >
            Save Changes
          </FormSubmitButton>
        </DialogActions>

        {isDirty && (
          <Typography variant="caption" color="warning.main" height={8} ml={4}>
            You have unsaved changes
          </Typography>
        )}
      </Stack>
    </Dialog>
  );
}
