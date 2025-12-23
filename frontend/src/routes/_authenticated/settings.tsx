import { Settings } from "@mui/icons-material";
import {
  Alert,
  Container,
  Divider,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { createFileRoute, Link as RouterLink } from "@tanstack/react-router";
import { Loading } from "@/components/common/Loading";
import { PasswordForm } from "@/components/forms/PasswordForm";
import { ProfileForm } from "@/components/forms/ProfileForm";
import { AccountInfo } from "@/components/settings/AccountInfo";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/users";

export const Route = createFileRoute("/_authenticated/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user: authUser } = useAuth();
  const { data: user, isLoading, error } = useUser(authUser?.username || "");

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {"Failed to load user data."}
      </Alert>
    );
  }

  if (isLoading || !user) {
    return <Loading isPage={true} loadingText="Loading settings..." />;
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Stack direction="column" spacing={4}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Settings sx={{ fontSize: 32, color: "primary.main" }} />
          <Typography variant="h4" fontWeight="bold">
            Account Settings
          </Typography>
        </Stack>

        {/* Profile and Password Update Forms */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <ProfileForm
            defaultValues={{
              email: user.email,
              username: user.username,
            }}
          />
          <PasswordForm />
        </Stack>

        {/* Account Information */}
        <AccountInfo user={user} />

        <Divider />

        {/* Link to profile */}
        <Typography variant="body2" color="text.secondary" align="center">
          Want to view your public profile? Visit your{" "}
          <Link underline="hover">
            <RouterLink
              to="/users/$username/posts"
              params={{ username: user.username }}
            >
              profile page
            </RouterLink>
          </Link>
          .
        </Typography>
      </Stack>
    </Container>
  );
}
