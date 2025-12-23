import { Menu } from "@mui/icons-material";
import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLogout } from "@/hooks/user";
import { AuthSection, ColorModeToggle, NavDrawer, UserMenu } from ".";

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null,
  );
  const { user, isAuthenticated, isLoading } = useAuth();
  const { logout } = useLogout();

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Stack direction="row" alignItems="center" gap={2}>
              <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerOpen}
              >
                <Menu />
              </IconButton>
              <Typography variant="h6">
                <Link to="/">Forum</Link>
              </Typography>
              <ColorModeToggle />
            </Stack>

            <AuthSection
              isAuthenticated={isAuthenticated}
              user={user}
              isLoading={isLoading}
              onUserMenuOpen={handleUserMenuOpen}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <UserMenu
        anchorEl={userMenuAnchorEl}
        isOpen={!!userMenuAnchorEl}
        onClose={handleUserMenuClose}
        user={user}
        onLogout={logout}
      />

      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
    </Box>
  );
}
