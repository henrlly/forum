import { Logout, Settings } from "@mui/icons-material";
import {
  Box,
  Divider,
  ListItemIcon,
  MenuItem,
  Menu as MuiMenu,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { UserAuth } from "@/types/auth";

interface UserMenuProps {
  anchorEl: HTMLElement | null;
  isOpen: boolean;
  onClose: () => void;
  user: UserAuth | null;
  onLogout: () => void;
}

export function UserMenu({
  anchorEl,
  isOpen,
  onClose,
  user,
  onLogout,
}: UserMenuProps) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <MuiMenu
      anchorEl={anchorEl}
      open={isOpen}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      {user && (
        <Box>
          <Link
            to="/users/$username/posts"
            params={{ username: user.username }}
          >
            <MenuItem onClick={onClose}>
              <Typography variant="subtitle2">{user.username}</Typography>
            </MenuItem>
          </Link>
          <Divider />
        </Box>
      )}

      <MenuItem onClick={onClose} component={Link} to="/settings">
        <ListItemIcon>
          <Settings fontSize="small" />
        </ListItemIcon>
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </MuiMenu>
  );
}
