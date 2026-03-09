import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useRoadTax } from "../../hooks/useRoadTax";

export interface ImpuestoVehicularProps {
  plate: string;
}

export function ImpuestoVehicular({
  plate: _plate,
}: Readonly<ImpuestoVehicularProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const [optionInfoExpanded, setOptionInfoExpanded] = useState(true);

  const { roadTax } = useRoadTax(_plate);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
        }}
      >
        <Box
          onClick={() => setOptionInfoExpanded(!optionInfoExpanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: optionInfoExpanded ? 2 : 0,
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 800,
              color: theme.palette.text.primary,
            }}
          >
            Información impuesto vehicular
          </Typography>
          {optionInfoExpanded ? (
            <ExpandLessIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.tertiary,
              }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.tertiary,
              }}
            />
          )}
        </Box>

        {optionInfoExpanded && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ciudad de matrícula"
                value={roadTax?.cityRegistration ?? ""}
                variant="outlined"
                size="small"
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha límite pago con descuento"
                value={roadTax?.discountPaymentDeadline ?? ""}
                variant="outlined"
                size="small"
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha límite pago"
                value={roadTax?.paymentDeadline ?? ""}
                variant="outlined"
                size="small"
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Pago extemporáneo a partir de"
                value={roadTax?.untimelyPayment ?? ""}
                variant="outlined"
                size="small"
                disabled
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
          </Grid>
        )}
      </Paper>
    </Box>
  );
}
