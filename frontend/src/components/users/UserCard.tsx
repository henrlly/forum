import { CalendarToday, Star } from "@mui/icons-material";
import { Avatar, CardContent, Chip, Stack, Typography } from "@mui/material";
import { CardWithLink } from "@/components/common/card";
import type { User } from "@/types/user";
import { formatDate } from "@/utils/date";

interface UserCardProps {
  item: User;
}

export function UserCard({ item: user }: UserCardProps) {
  const memberSince = formatDate(user.created_at, true);

  const getInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  const getKarmaColor = (karma: number) => {
    if (karma >= 1000) return "success";
    if (karma >= 500) return "info";
    if (karma >= 100) return "primary";
    return "default";
  };

  return (
    <CardWithLink link={`/users/${user.username}`}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="column" spacing={1.5}>
          {/* User Avatar and Username */}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: "primary.main",
                fontSize: "1.25rem",
                fontWeight: "bold",
              }}
            >
              {getInitials(user.username)}
            </Avatar>
            <Typography
              variant="h6"
              fontWeight="bold"
              gap={1}
              sx={{
                wordBreak: "break-word",
              }}
            >
              {user.username}
            </Typography>
          </Stack>

          {/* User Karma and Member Since */}
          <Stack direction="column" spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Star fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Karma:
              </Typography>
              <Chip
                label={user.karma.toLocaleString()}
                size="small"
                color={getKarmaColor(user.karma)}
                variant="outlined"
              />
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CalendarToday fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                Joined {memberSince}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </CardWithLink>
  );
}
