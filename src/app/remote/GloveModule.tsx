import { Routes, Route } from "react-router-dom";
import { GuanteraPage } from "../../features/glove/pages/GuanteraPage";
import { GuanteraDetailPage } from "../../features/glove/pages/GuanteraDetailPage";
import { GuanteraOptionPage } from "../../features/glove/pages/GuanteraOptionPage";

/**
 * Se monta dentro de un <Route path="glove/*" ...> en el HOST (TraccarWeb).
 * Por eso las rutas acá son RELATIVAS:
 * - index -> listado
 * - :plate/:module -> detalle
 * - :plate/:module/:option -> opción
 */
export default function GloveModule() {
  return (
    <Routes>
      <Route index element={<GuanteraPage />} />
      <Route path=":plate/:module" element={<GuanteraDetailPage />} />
      <Route path=":plate/:module/:option" element={<GuanteraOptionPage />} />
    </Routes>
  );
}
