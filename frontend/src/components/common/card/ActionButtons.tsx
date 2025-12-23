import { Delete, Edit, PushPin, Share } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import type { MouseEvent } from "react";

interface ActionButtonsProps {
  itemName: string;

  showShare?: boolean | null;
  showEdit?: boolean | null;
  showDelete?: boolean | null;
  handleShareClick?: (event: MouseEvent<HTMLElement>) => void;
  handleEditClick: (event: MouseEvent<HTMLElement>) => void;
  handleDeleteClick: (event: MouseEvent<HTMLElement>) => void;

  // Pinning (for comments)
  isPinned?: boolean | null;
  canPin?: boolean | null;
  onPin?: () => void;
  onUnpin?: () => void;
}

export function ActionButtons({
  itemName,
  showShare,
  showEdit,
  showDelete,
  handleShareClick,
  handleEditClick,
  handleDeleteClick,
  isPinned,
  canPin,
  onPin,
  onUnpin,
}: ActionButtonsProps) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {(canPin || isPinned) && (
        <Tooltip title={`${isPinned ? "Unpin" : "Pin"} ${itemName}`}>
          <IconButton
            data-ignore-nested-link
            size="small"
            disabled={!canPin}
            onClick={canPin ? (isPinned ? onUnpin : onPin) : undefined}
            sx={{
              boxShadow: 1,
            }}
            color={isPinned ? "primary" : "default"}
          >
            <PushPin fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {showShare && (
        <Tooltip title={`Share ${itemName}`}>
          <IconButton
            data-ignore-nested-link
            size="small"
            onClick={handleShareClick}
            sx={{
              boxShadow: 1,
            }}
          >
            <Share fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {showEdit && (
        <Tooltip title={`Edit ${itemName}`}>
          <IconButton
            data-ignore-nested-link
            size="small"
            onClick={handleEditClick}
            sx={{
              boxShadow: 1,
            }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {showDelete && (
        <Tooltip title={`Delete ${itemName}`}>
          <IconButton
            data-ignore-nested-link
            size="small"
            onClick={handleDeleteClick}
            sx={{
              boxShadow: 1,
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
