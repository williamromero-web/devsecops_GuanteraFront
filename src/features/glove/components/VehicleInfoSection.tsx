import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { StatusChip } from "../../../shared/ui/molecules/StatusChip";

export interface VehicleInfoSectionProps {
  plate: string;
  isActive: boolean;
  defaultExpanded?: boolean;
  sx?: SxProps<Theme>;
}

export function VehicleInfoSection({
  plate,
  isActive,
  defaultExpanded = true,
  sx,
}: Readonly<VehicleInfoSectionProps>) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(defaultExpanded);

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        ...sx,
      }}
    >
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 2 : 0,
          cursor: "pointer",
        }}
      >
        <Typography sx={{ fontSize: "1rem", fontWeight: 800, color: theme.palette.text.primary }}>
          Información vehículo
        </Typography>
        {expanded ? (
          <ExpandLessIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.tertiary }} />
        ) : (
          <ExpandMoreIcon sx={{ fontSize: "1.25rem", color: theme.palette.text.tertiary }} />
        )}
      </Box>

      {expanded ? (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: "0.875rem", color: theme.palette.text.tertiary, fontWeight: 400 }}>
              Placa
            </Typography>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 600, color: theme.palette.text.primary }}>
              {plate}
            </Typography>
          </Box>

          {isActive ? <StatusChip variant="activo" /> : null}
        </Box>
      ) : null}
    </Paper>
  );
}

