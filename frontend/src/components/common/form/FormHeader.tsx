import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

interface FormHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle?: string;
}

export function FormHeader({ icon, title, subtitle }: FormHeaderProps) {
  return (
    <Stack mb={3} textAlign="center" spacing={1}>
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        {icon}
        <Typography variant={subtitle ? "h6" : "h4"} fontWeight="bold">
          {title}
        </Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>
  );
}
