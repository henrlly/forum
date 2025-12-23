import type { TextFieldProps } from "@mui/material";
import { InputAdornment, TextField } from "@mui/material";
import type { ReactNode } from "react";

interface FormFieldProps extends Omit<TextFieldProps, "InputProps"> {
  icon?: ReactNode;
  helperTextDefault?: string;
}

export function FormField({
  icon,
  helperText,
  helperTextDefault,
  error,
  ...props
}: FormFieldProps) {
  const displayHelperText =
    helperText || (error ? undefined : helperTextDefault);

  return (
    <TextField
      {...props}
      fullWidth
      margin="normal"
      error={error}
      helperText={displayHelperText}
      slotProps={{
        input: {
          startAdornment: icon && (
            <InputAdornment position="start">{icon}</InputAdornment>
          ),
        },
      }}
    />
  );
}
