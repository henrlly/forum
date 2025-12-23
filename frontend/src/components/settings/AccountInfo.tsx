import { Divider, Paper, Stack, Typography } from "@mui/material";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/date";

interface AccountInfoProps {
  user: User;
}

export function AccountInfo({ user }: AccountInfoProps) {
  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Stack direction="column" spacing={1.5}>
        <Typography variant="h6">Account Information</Typography>
        <Divider />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="space-between"
          pr={1}
        >
          <Stack direction="column">
            <Typography variant="body2" color="text.secondary">
              User ID
            </Typography>
            <Typography variant="body1">{user.id}</Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="body2" color="text.secondary">
              Karma
            </Typography>
            <Typography variant="body1">{user.karma}</Typography>
          </Stack>
          <Stack direction="column">
            <Typography variant="body2" color="text.secondary">
              Account Created
            </Typography>
            <Typography variant="body1">
              {formatDate(user.created_at, true)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
