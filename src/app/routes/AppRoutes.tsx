/**
 * Rutas de la aplicación.
 * Glove: /glove (listado), /glove/:plate/:module, /glove/:plate/:module/:option.
 */

import { Routes, Route, Navigate } from "react-router-dom";
import { GuanteraPage } from "../../features/glove/pages/GuanteraPage";
import { GuanteraDetailPage } from "../../features/glove/pages/GuanteraDetailPage";
import { GuanteraOptionPage } from "../../features/glove/pages/GuanteraOptionPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/glove" replace />} />
      <Route path="/glove" element={<GuanteraPage />} />
      <Route path="/glove/:plate/:vehicleId/:module" element={<GuanteraDetailPage />} />
      <Route path="/glove/:plate/:vehicleId/:module/:option" element={<GuanteraOptionPage />} />
    </Routes>
  );
}
