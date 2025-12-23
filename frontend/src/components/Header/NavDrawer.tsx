import {
  Article,
  Close,
  Comment,
  Group,
  Login,
  Logout,
  PersonAdd,
  Settings,
  Topic,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { ReactElement } from "react";

interface NavDrawerItemProps {
  to?: string;
  icon: ReactElement;
  title: string;
  onClick: () => void;
}

function NavDrawerItem({ to, icon, title, onClick }: NavDrawerItemProps) {
  const linkProps = to ? { component: Link, to } : {};
  return (
    <ListItem disablePadding>
      <ListItemButton {...linkProps} onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={title} />
      </ListItemButton>
    </ListItem>
  );
}

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
}

export function NavDrawer({
  isOpen,
  onClose,
  isAuthenticated,
  onLogout,
}: NavDrawerProps) {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <Drawer anchor="left" open={isOpen} onClose={onClose}>
      <Box width={250}>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
          >
            <Typography variant="h6">Navigation</Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
        </Toolbar>

        <List>
          <NavDrawerItem
            to="/posts/all"
            icon={<Article />}
            title="All Posts"
            onClick={onClose}
          />

          {isAuthenticated && (
            <NavDrawerItem
              to="/posts/following"
              icon={<Article />}
              title="Feed"
              onClick={onClose}
            />
          )}

          <NavDrawerItem
            to="/topics"
            icon={<Topic />}
            title="Topics"
            onClick={onClose}
          />
          <NavDrawerItem
            to="/comments"
            icon={<Comment />}
            title="Comments"
            onClick={onClose}
          />
          <NavDrawerItem
            to="/users"
            icon={<Group />}
            title="Users"
            onClick={onClose}
          />

          <Divider />

          {isAuthenticated ? (
            <Box>
              <NavDrawerItem
                to="/settings"
                icon={<Settings />}
                title="Settings"
                onClick={onClose}
              />
              <NavDrawerItem
                icon={<Logout />}
                title="Logout"
                onClick={handleLogout}
              />
            </Box>
          ) : (
            <Box>
              <NavDrawerItem
                to="/login"
                icon={<Login />}
                title="Login"
                onClick={onClose}
              />
              <NavDrawerItem
                to="/register"
                icon={<PersonAdd />}
                title="Sign Up"
                onClick={onClose}
              />
            </Box>
          )}
        </List>
      </Box>
    </Drawer>
  );
}
