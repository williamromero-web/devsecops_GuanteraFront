/**
 * Formulario de una opción (ej. SOAT, Tarjeta de propiedad).
 * Placeholder para Fase 0; maquetado en Fase 6, ui-options en Fase 7–8.
 */

import { Box, Typography } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";

export function GuanteraOptionPage() {
  const { plate, module, option } = useParams<{
    plate: string;
    module: string;
    option: string;
  }>();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1">
        Guantera — Opción: {option ?? "—"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Placa: {plate ?? "—"} / Módulo: {module ?? "—"}
      </Typography>
      <Typography
        component={RouterLink}
        to={`/glove/${plate}/${module}`}
        sx={{ mt: 2, display: "inline-block", color: "primary.main" }}
      >
        ← Volver al módulo
      </Typography>
    </Box>
  );
}
