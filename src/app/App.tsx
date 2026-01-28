import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes/AppRoutes";

import { palette } from "../shared/theme/palette";
import tokens from "../shared/theme/tokens.json";
import { useStandaloneDarkMode } from "../shared/theme/useStandaloneDarkMode";

const STANDALONE = import.meta.env.VITE_STANDALONE !== "false";

export function App() {
  const darkMode = useStandaloneDarkMode();

  // En modo embebido (TraccarWeb), Glove NO debe inyectar ThemeProvider/CssBaseline.
  // El host ya provee ThemeProvider y Router.
  if (!STANDALONE) {
    return <AppRoutes />;
  }

  // Standalone: crear theme compatible con TraccarWeb (shape de palette).
  const theme = createTheme({
    typography: {
      fontFamily: tokens.typography.fontFamily,
    },
    shape: {
      borderRadius: tokens.borderRadius.xl,
    },
    palette: palette(null, darkMode),
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
