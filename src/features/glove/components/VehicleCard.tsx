import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { Vehicle } from "../types/domain";
import { MODULES, type ModuleKey } from "../config/optionsConfig";
import { ESSENTIAL_MODULE_MAP } from "../config/essentialMap";
import { getAggregatedStatus, getModuleStatus, getVehicleStatus } from "../lib/status";
import { StatusChip } from "../../../shared/ui/molecules/StatusChip";
import { OptionCard } from "../../../shared/ui/molecules/OptionCard";

export interface VehicleCardProps {
  vehicle: Vehicle;
  searchTerm?: string;
  onModuleClick?: (moduleKey: ModuleKey) => void;
  sx?: SxProps<Theme>;
}

function highlightText(text: string, searchTerm: string, theme: Theme) {
  const term = searchTerm.trim();
  if (!term) return text;

  const searchLower = term.toLowerCase();
  const textLower = text.toLowerCase();

  const parts: Array<string | { match: string; key: string }> = [];
  let lastIndex = 0;
  let index = textLower.indexOf(searchLower, lastIndex);

  while (index !== -1) {
    if (index > lastIndex) {
      parts.push(text.substring(lastIndex, index));
    }
    const match = text.substring(index, index + term.length);
    parts.push({ match, key: `${index}` });
    lastIndex = index + term.length;
    index = textLower.indexOf(searchLower, lastIndex);
  }

  if (lastIndex < text.length) parts.push(text.substring(lastIndex));

  return (
    <>
      {parts.map((p) =>
        typeof p === "string" ? (
          p
        ) : (
          <Box
            key={p.key}
            component="span"
            sx={{
              bgcolor: theme.palette.warning.light,
              color: theme.palette.text.primary,
              fontWeight: 600,
              px: 0.5,
              borderRadius: "4px",
            }}
          >
            {p.match}
          </Box>
        ),
      )}
    </>
  );
}

export function VehicleCard({ vehicle, searchTerm = "", onModuleClick, sx }: Readonly<VehicleCardProps>) {
  const theme = useTheme();
  if (!vehicle) return null;

  const plate = vehicle.plate || "Sin placa";
  const aggregated = getAggregatedStatus(vehicle);
  const chipVariant = getVehicleStatus(aggregated);

  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Paper
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: `1px solid ${theme.palette.border.main}`,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          bgcolor: theme.palette.background.paper,
          boxShadow: theme.shadows[1],
          ...sx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "flex-start" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Box sx={{ order: { xs: 2, sm: 1 } }}>
            <Typography sx={{ fontSize: "0.75rem", color: theme.palette.text.secondary, fontWeight: 500 }}>
              Placa
            </Typography>

            <Box
              component="span"
              sx={{
                fontSize: "1.7rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                display: "inline-block",
              }}
            >
              {searchTerm.trim() ? highlightText(plate, searchTerm, theme) : plate}
            </Box>
          </Box>

          <Box sx={{ order: { xs: 1, sm: 2 }, alignSelf: { xs: "flex-end", sm: "auto" } }}>
            <StatusChip variant={chipVariant} />
          </Box>
        </Box>

        <Grid container spacing={1.5}>
          {MODULES.map((m) => {
            const moduleStatus = getModuleStatus(vehicle, m.key, ESSENTIAL_MODULE_MAP);
            return (
              <Grid key={m.key} size={{ xs: 12, sm: 6 }}>
                <OptionCard
                  moduleKey={m.key}
                  label={m.label}
                  status={moduleStatus}
                  onClick={onModuleClick ? () => onModuleClick(m.key) : undefined}
                />
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Grid>
  );
}

