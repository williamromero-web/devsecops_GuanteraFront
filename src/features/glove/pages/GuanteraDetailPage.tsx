/**
 * Detalle de módulo por placa (Propiedad, Seguros, Mantenimiento, Operación).
 * Placeholder para Fase 0; maquetado en Fase 6.
 */

import { Box, Typography } from "@mui/material";
import { useParams, Link as RouterLink } from "react-router-dom";

export function GuanteraDetailPage() {
  const { plate, module } = useParams<{ plate: string; module: string }>();

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1">
        Guantera — Módulo: {module ?? "—"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Placa: {plate ?? "—"}
      </Typography>
      <Typography
        component={RouterLink}
        to="/glove"
        sx={{ mt: 2, display: "inline-block", color: "primary.main" }}
      >
        ← Volver al listado
      </Typography>
    </Box>
  );
}
