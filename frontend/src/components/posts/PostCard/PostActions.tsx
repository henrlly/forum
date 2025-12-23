import { Box } from "@mui/material";
import { useState } from "react";
import { ActionButtons } from "@/components/common/card";
import { DeleteModal, EditModal } from "@/components/common/modal";
import {
  MAX_POST_CONTENT_LENGTH,
  MAX_POST_TITLE_LENGTH,
} from "@/constants/posts";
import { usePost } from "@/hooks/posts";
import { useCopyLink } from "@/hooks/utils";
import { updatePostSchema } from "@/schema/posts";
import type { Post, UpdatePostRequest } from "@/types/post";
import { getPostLink } from "@/utils/link";

interface PostActionsProps {
  post: Post;
  onEdit?: (data: UpdatePostRequest) => void;
  onDelete?: () => void;
  refetchItem?: boolean;
  isEditing?: boolean;
  isDeleting?: boolean;
  canModify?: boolean | null;
}

export function PostActions({
  post,
  onEdit,
  onDelete,
  refetchItem,
  isEditing,
  isDeleting,
  canModify,
}: PostActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const postLink = getPostLink({ postId: post.id, topicName: post.topic_name });

  const { copyLink } = useCopyLink();

  return (
    <Box>
      <ActionButtons
        itemName="post"
        showShare={true}
        showEdit={canModify}
        showDelete={canModify}
        handleShareClick={() => {
          copyLink(postLink);
        }}
        handleEditClick={() => setShowEditModal(true)}
        handleDeleteClick={() => setShowDeleteModal(true)}
      />

      <EditModal
        itemName="post"
        hasTitleField={true}
        open={showEditModal}
        item={post}
        onClose={() => setShowEditModal(false)}
        onSubmit={(updatedData: UpdatePostRequest) => {
          onEdit?.(updatedData);
          setShowEditModal(false);
        }}
        refetchItem={refetchItem}
        maxTitleLength={MAX_POST_TITLE_LENGTH}
        maxContentLength={MAX_POST_CONTENT_LENGTH}
        fetchItemHook={usePost}
        schema={updatePostSchema}
        isSubmitting={isEditing}
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirmDelete={() => {
          onDelete?.();
          setShowDeleteModal(false);
        }}
        itemName="post"
        itemContent={post.title}
        isSubmitting={isDeleting}
      />
    </Box>
  );
}
