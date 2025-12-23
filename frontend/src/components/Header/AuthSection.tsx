import { AccountCircle, Login, PersonAdd } from "@mui/icons-material";
import { Button, IconButton, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { MouseEvent } from "react";
import type { UserAuth } from "@/types/auth";

interface AuthSectionProps {
  isAuthenticated: boolean;
  user: UserAuth | null;
  isLoading: boolean;
  onUserMenuOpen: (event: MouseEvent<HTMLElement>) => void;
}

export function AuthSection({
  isAuthenticated,
  user,
  isLoading,
  onUserMenuOpen,
}: AuthSectionProps) {
  if (isLoading) {
    return null;
  }

  if (isAuthenticated && user) {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Typography variant="body2" display={{ xs: "none", sm: "block" }}>
          Welcome,{" "}
          <Link
            to="/users/$username/posts"
            params={{ username: user.username }}
          >
            {user.username}
          </Link>
        </Typography>
        <IconButton size="large" onClick={onUserMenuOpen} color="inherit">
          <AccountCircle />
        </IconButton>
      </Stack>
    );
  }

  return (
    <Stack direction="row" spacing={2}>
      <Button
        color="inherit"
        startIcon={<Login />}
        component={Link}
        to="/login"
      >
        Login
      </Button>
      <Button
        color="inherit"
        startIcon={<PersonAdd />}
        component={Link}
        to="/register"
        variant="outlined"
      >
        Sign Up
      </Button>
    </Stack>
  );
}
