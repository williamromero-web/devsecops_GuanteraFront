import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Routes, Route } from "react-router-dom";
import { GuanteraProvider } from "../../features/glove/providers/GuanteraProvider";
import { GuanteraPage } from "../../features/glove/pages/GuanteraPage";
import { GuanteraDetailPage } from "../../features/glove/pages/GuanteraDetailPage";
import { GuanteraOptionPage } from "../../features/glove/pages/GuanteraOptionPage";
import { palette } from "../../shared/theme/palette";
import tokens from "../../shared/theme/tokens.json";

export interface GloveModuleConfig {
  userId?: string | null;
  baseUrl?: string | null;
  getAuthHeaders?: () => Record<string, string>;
  fetchDevices?:
    | import("../../features/glove/types/devices").FetchDevicesFunction
    | null;
  devicesApiConfig?: {
    defaultPageSize?: number;
    searchParamName?: string;
  } | null;
  themeMode?: "light" | "dark";
}

/**
 * Se monta dentro de un <Route path="glove/*" ...> en el HOST (TraccarWeb).
 * El host inyecta config (fetchDevices, devicesApiConfig) para consumir la API de Traccar.
 * Las rutas son RELATIVAS:
 * - index -> listado (placas, paginación, búsqueda)
 * - :plate/:module -> detalle
 * - :plate/:module/:option -> opción
 * 
 * Cuando se ejecuta como módulo embebido (VITE_STANDALONE=false), hereda el ThemeProvider
 * del host (TraccarWeb) para que los estilos se apliquen correctamente.
 * Si el host pasa themeMode, se crea un ThemeProvider con ese modo.
 */
export default function GloveModule({
  config,
}: Readonly<{ config?: GloveModuleConfig }>) {
  // Determinar si debe usar ThemeProvider basado en themeMode
  const shouldWrapTheme = config?.themeMode !== undefined;
  const darkMode = config?.themeMode === "dark";

  const gloveTheme = createTheme({
    typography: {
      fontFamily: tokens.typography.fontFamily,
    },
    shape: {
      borderRadius: tokens.borderRadius.xl,
    },
    palette: palette(null, darkMode),
  });

  const content = (
    <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
      <Routes>
        <Route index element={<GuanteraPage />} />
        <Route path=":plate/:module" element={<GuanteraDetailPage />} />
        <Route path=":plate/:module/:option" element={<GuanteraOptionPage />} />
      </Routes>
    </div>
  );

  const guanteraContent = (
    <GuanteraProvider
      value={{
        userId: config?.userId ?? null,
        baseUrl: config?.baseUrl ?? null,
        getAuthHeaders: config?.getAuthHeaders ?? (() => ({})),
        fetchDevices: config?.fetchDevices ?? null,
        devicesApiConfig: config?.devicesApiConfig ?? null,
      }}
    >
      {content}
    </GuanteraProvider>
  );

  // Si el host pasa themeMode, envolver con ThemeProvider para asegurar los estilos correctos
  if (shouldWrapTheme) {
    return <ThemeProvider theme={gloveTheme}>{guanteraContent}</ThemeProvider>;
  }

  return guanteraContent;
}
