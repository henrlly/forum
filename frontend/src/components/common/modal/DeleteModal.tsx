import { Warning } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";
import { CLAMP_TEXT_SX } from "@/constants/style";
import { FormSubmitButton } from "@/components/common/form";

interface DeleteModalProps {
  itemName: string;
  open: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  itemContent: string;
  isSubmitting?: boolean;
}

export function DeleteModal({
  itemName,
  open,
  onClose,
  onConfirmDelete,
  itemContent,
  isSubmitting,
}: DeleteModalProps) {
  return (
    <Dialog
      onClick={(e) => e.stopPropagation()}
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle display="flex" alignItems="center" gap={1}>
        <Warning color="warning" />
        Confirm Delete
      </DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={2}>
          <DialogContentText>
            Are you sure you want to delete this {itemName}? This action cannot
            be undone.
          </DialogContentText>
          <Box p={2} bgcolor="action.disabledBackground" borderRadius={1}>
            <DialogContentText
              variant="body2"
              fontWeight={600}
              color="text.primary"
              sx={CLAMP_TEXT_SX(1)}
            >
              "{itemContent}"
            </DialogContentText>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <FormSubmitButton
          onClick={onConfirmDelete}
          loadingText="Saving..."
          isSubmitting={isSubmitting}
          removeSx={true}
          fullWidth={false}
          variant="contained"
          color="error"
        >
          Delete {itemName}
        </FormSubmitButton>
      </DialogActions>
    </Dialog>
  );
}
