import { Button, Stack, Typography } from "@mui/material";
import { Link } from "@tanstack/react-router";

export default function NotFoundPage() {
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      spacing={3}
      p={2}
      m={2}
      textAlign="center"
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">
        The page you're looking for doesn't exist.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Back Home
      </Button>
    </Stack>
  );
}
