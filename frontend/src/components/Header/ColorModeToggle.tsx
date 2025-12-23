import { DarkMode, LightMode } from "@mui/icons-material";
import { IconButton, useColorScheme, useTheme } from "@mui/material";

export function ColorModeToggle() {
  const theme = useTheme();
  const { setMode } = useColorScheme();

  return (
    <IconButton
      color="inherit"
      onClick={() => {
        setMode(theme.palette.mode === "light" ? "dark" : "light");
      }}
      size="large"
    >
      {theme.palette.mode === "light" ? <DarkMode /> : <LightMode />}
    </IconButton>
  );
}
