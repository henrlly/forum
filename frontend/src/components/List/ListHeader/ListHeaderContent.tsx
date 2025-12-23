import { Chip, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export interface ChipData {
  label: string;
  variant?: "filled" | "outlined";
  size?: "small" | "medium";
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning";
}

export interface ListHeaderContentProps {
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  chips?: ChipData[];
  onTitleClick?: () => void;
}

export function ListHeaderContent({
  title,
  subtitle,
  actions,
  chips,
  onTitleClick,
}: ListHeaderContentProps) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="column" spacing={1}>
        {title && (
          <Typography variant="h4" fontWeight="bold" onClick={onTitleClick}>
            <Link to="." search={{}}>
              {title}
            </Link>
          </Typography>
        )}

        {subtitle && (
          <Typography variant="body1" color="text.secondary">
            {subtitle}
          </Typography>
        )}

        {chips && chips.length > 0 && (
          <Stack direction="row" spacing={1} pt={1}>
            {chips.map((chip) => (
              <Chip
                key={chip.label}
                label={chip.label}
                variant={chip.variant || "outlined"}
                size={chip.size || "small"}
                color={chip.color || "default"}
              />
            ))}
          </Stack>
        )}
      </Stack>

      {actions}
    </Stack>
  );
}
