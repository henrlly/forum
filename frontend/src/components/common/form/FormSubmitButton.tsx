import type { ButtonProps } from "@mui/material";
import { Button, Stack } from "@mui/material";
import type { ReactNode } from "react";
import { Loading } from "@/components/common/Loading";

interface FormSubmitButtonProps extends ButtonProps {
  children: ReactNode;
  loadingText?: string;
  isSubmitting?: boolean;
  disabled?: boolean;
  variant?: "contained" | "outlined" | "text";
  fullWidth?: boolean;
  removeSx?: boolean;
  sx?: object | null;
}

export function FormSubmitButton({
  children,
  loadingText,
  isSubmitting = false,
  disabled = false,
  variant = "contained",
  fullWidth = true,
  removeSx = false,
  sx = {},
  ...props
}: FormSubmitButtonProps) {
  const defaultSx = removeSx
    ? sx
    : {
        mt: 3,
        mb: 2,
        py: 1.5,
        ...sx,
      };

  return (
    <Button
      type={"submit"}
      fullWidth={fullWidth}
      variant={variant}
      sx={defaultSx}
      disabled={isSubmitting || disabled}
      {...props}
    >
      {isSubmitting ? (
        <Loading
          loadingText={loadingText || "Loading..."}
          size={removeSx ? 16 : 24}
        />
      ) : (
        <Stack direction="row" alignItems="center" gap={1}>
          {children}
        </Stack>
      )}
    </Button>
  );
}
