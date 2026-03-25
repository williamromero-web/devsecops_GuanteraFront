import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

import { palette } from "../shared/theme/palette";
import tokens from "../shared/theme/tokens.json";
import { useStandaloneDarkMode } from "../shared/theme/useStandaloneDarkMode";

const STANDALONE = import.meta.env.VITE_STANDALONE !== "true";

export function App() {
  const darkMode = useStandaloneDarkMode();

  // Create theme compatible with TraccarWeb
  const gloveTheme = createTheme({
    typography: {
      fontFamily: tokens.typography.fontFamily,
    },
    shape: {
      borderRadius: tokens.borderRadius.xl,
    },
    palette: palette(null, darkMode),
  });

  // In embedded mode (TraccarWeb), Glove tries to use the host's ThemeProvider
  // If not available, creates its own (fallback for errors)
  if (!STANDALONE) {
    return (
      <ThemeProvider theme={gloveTheme}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ThemeProvider>
    );
  }

  // Standalone: create theme and inject
  return (
    <ThemeProvider theme={gloveTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
