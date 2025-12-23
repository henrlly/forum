import { Box } from "@mui/material";
import { useState } from "react";
import { ActionButtons } from "@/components/common/card";
import { DeleteModal, EditModal } from "@/components/common/modal";
import { MAX_COMMENT_CONTENT_LENGTH } from "@/constants/comments";
import { useComment } from "@/hooks/comments";
import { useCopyLink } from "@/hooks/utils";
import { updateCommentSchema } from "@/schema/comments";
import type { Comment, UpdateCommentRequest } from "@/types/comment";
import { getCommentLink } from "@/utils/link";

interface CommentActionsProps {
  canPin?: boolean | null;
  isPinned?: boolean | null;
  comment: Comment;
  canModify?: boolean | null;
  onEdit?: (data: UpdateCommentRequest) => void;
  onDelete?: () => void;
  onPin?: () => void;
  onUnpin?: () => void;
  isEditing?: boolean;
  isDeleting?: boolean;
}

export function CommentActions({
  canPin,
  isPinned,
  comment,
  onEdit,
  onDelete,
  onPin,
  onUnpin,
  isEditing,
  isDeleting,
  canModify,
}: CommentActionsProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const commentLink = getCommentLink({
    commentId: comment.id,
    topicName: comment.topic_name,
    postId: comment.post_id,
  });

  const { copyLink } = useCopyLink();

  return (
    <Box>
      <ActionButtons
        itemName="comment"
        showShare={true}
        showEdit={canModify}
        showDelete={canModify}
        handleShareClick={() => {
          copyLink(commentLink);
        }}
        handleEditClick={() => setShowEditModal(true)}
        handleDeleteClick={() => setShowDeleteModal(true)}
        canPin={canPin}
        isPinned={isPinned}
        onPin={onPin}
        onUnpin={onUnpin}
      />

      <EditModal
        itemName="comment"
        hasTitleField={false}
        open={showEditModal}
        item={comment}
        onClose={() => setShowEditModal(false)}
        onSubmit={(updatedData: UpdateCommentRequest) => {
          onEdit?.(updatedData);
          setShowEditModal(false);
        }}
        refetchItem={true}
        maxContentLength={MAX_COMMENT_CONTENT_LENGTH}
        fetchItemHook={useComment}
        schema={updateCommentSchema}
        isSubmitting={isEditing}
      />

      <DeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirmDelete={() => {
          onDelete?.();
          setShowDeleteModal(false);
        }}
        itemName="comment"
        itemContent={comment.summary}
        isSubmitting={isDeleting}
      />
    </Box>
  );
}
