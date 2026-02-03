import { Routes, Route } from "react-router-dom";
import { GuanteraProvider } from "../../features/glove/providers/GuanteraProvider";
import { GuanteraPage } from "../../features/glove/pages/GuanteraPage";
import { GuanteraDetailPage } from "../../features/glove/pages/GuanteraDetailPage";
import { GuanteraOptionPage } from "../../features/glove/pages/GuanteraOptionPage";

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
 */
export default function GloveModule({
  config,
}: Readonly<{ config?: GloveModuleConfig }>) {
  const content = (
    <Routes>
      <Route index element={<GuanteraPage />} />
      <Route path=":plate/:module" element={<GuanteraDetailPage />} />
      <Route path=":plate/:module/:option" element={<GuanteraOptionPage />} />
    </Routes>
  );

  if (config) {
    return (
      <GuanteraProvider
        value={{
          userId: config.userId ?? null,
          baseUrl: config.baseUrl ?? null,
          getAuthHeaders: config.getAuthHeaders ?? (() => ({})),
          fetchDevices: config.fetchDevices ?? null,
          devicesApiConfig: config.devicesApiConfig ?? null,
        }}
      >
        {content}
      </GuanteraProvider>
    );
  }

  return content;
}
