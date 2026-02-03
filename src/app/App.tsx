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

  // Crear tema compatible con TraccarWeb
  const gloveTheme = createTheme({
    typography: {
      fontFamily: tokens.typography.fontFamily,
    },
    shape: {
      borderRadius: tokens.borderRadius.xl,
    },
    palette: palette(null, darkMode),
  });

  // En modo embebido (TraccarWeb), Glove intenta usar el ThemeProvider del host
  // Si no está disponible, crea su propio (fallback para errores)
  if (!STANDALONE) {
    return (
      <ThemeProvider theme={gloveTheme}>
        <AppRoutes />
      </ThemeProvider>
    );
  }

  // Standalone: crear theme e inyectar
  return (
    <ThemeProvider theme={gloveTheme}>
      <CssBaseline />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
