import { AccessTime } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { formatDate } from "@/utils/date";

export interface TimeProps {
  created_at: string;
  updated_at?: string;
  isRow?: boolean;
}

export function Time({ created_at, updated_at, isRow }: TimeProps) {
  return (
    <Stack
      direction={isRow ? "row" : "column"}
      spacing={1}
      alignItems="right"
      justifyContent="right"
      px={isRow ? 0 : 2}
    >
      <Stack
        direction="row"
        spacing={0.5}
        alignItems="right"
        justifyContent="right"
      >
        <AccessTime fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary" textAlign="right">
          {formatDate(created_at)}
        </Typography>
      </Stack>
      {updated_at && updated_at !== created_at && (
        <Typography variant="caption" color="text.secondary" textAlign="right">
          (edited {formatDate(updated_at)})
        </Typography>
      )}
    </Stack>
  );
}
