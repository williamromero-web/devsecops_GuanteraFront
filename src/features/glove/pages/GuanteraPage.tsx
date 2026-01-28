/**
 * Listado de vehículos (Guantera / Glove).
 * Placeholder para Fase 0; maquetado en Fase 6.
 */

import { Box, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export function GuanteraPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h1">
        Guantera — Listado
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        Página placeholder. Fase 6: maquetado con GloveLayout, VehicleCard, etc.
      </Typography>
      <Box sx={{ mt: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Link component={RouterLink} to="/glove/ABC123/propiedad">
          Ir a Propiedad (ABC123)
        </Link>
        <Link component={RouterLink} to="/glove/ABC123/seguros/soat">
          Ir a SOAT (ABC123)
        </Link>
      </Box>
    </Box>
  );
}
