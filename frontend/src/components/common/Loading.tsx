import { CircularProgress, Stack } from "@mui/material";

export interface LoadingProps {
  isPage?: boolean;
  loadingText?: string;
  sx?: object;
  size?: number;
}

export function Loading({
  isPage,
  loadingText,
  sx,
  size,
  ...props
}: LoadingProps) {
  if (isPage) {
    return (
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
        sx={sx}
        height="100vh"
        {...props}
      >
        <CircularProgress size={size} />
        {loadingText}
      </Stack>
    );
  }

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={sx}
      {...props}
    >
      <CircularProgress size={size} />
      {loadingText}
    </Stack>
  );
}
