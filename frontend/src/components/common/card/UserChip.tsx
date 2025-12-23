import { Person } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts/AuthContext";

export interface UserChipProps {
  username: string;
}
export function UserChip({ username }: UserChipProps) {
  const { user } = useAuth();
  return (
    <Chip
      onClick={() => {}} // for click animation
      icon={<Person />}
      component={Link}
      to={`/users/${username}`}
      label={username}
      color={username === user?.username ? "success" : "secondary"}
      variant="outlined"
      size="small"
    />
  );
}
