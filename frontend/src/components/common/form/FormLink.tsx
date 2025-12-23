import { Divider, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "@tanstack/react-router";

interface FormLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export function FormLink({ text, linkText, href }: FormLinkProps) {
  return (
    <Stack direction="column" spacing={3} mt={2}>
      <Divider />
      <Typography variant="body2" color="text.secondary" align="center">
        {text}{" "}
        <Link
          component={RouterLink}
          to={href}
          variant="body2"
          color="primary"
          underline="hover"
        >
          {linkText}
        </Link>
      </Typography>
    </Stack>
  );
}
