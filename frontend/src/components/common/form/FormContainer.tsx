import type { ContainerProps } from "@mui/material";
import { Card, Container, Stack } from "@mui/material";
import type { ReactNode } from "react";

interface FormContainerProps extends ContainerProps {
  children: ReactNode;
  wrapInContainer?: boolean;
}

export function FormContainer({
  children,
  wrapInContainer = true,
  ...props
}: FormContainerProps) {
  const elevation = 3;

  const cardComponent = (
    <Card elevation={elevation} sx={{ width: "100%" }}>
      <Stack p={4} direction="column" alignItems="center" width="100%">
        {children}
      </Stack>
    </Card>
  );

  if (wrapInContainer) {
    return (
      <Container maxWidth="xs" sx={{ marginTop: 8 }} {...props}>
        {cardComponent}
      </Container>
    );
  }

  return cardComponent;
}
