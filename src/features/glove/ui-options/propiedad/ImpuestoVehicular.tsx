import { Alert, Box, Grid, Paper, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";

export interface ImpuestoVehicularProps {
  plate: string;
}

export function ImpuestoVehicular({ plate }: Readonly<ImpuestoVehicularProps>) {
  const theme = useTheme();
  const [optionInfoExpanded, setOptionInfoExpanded] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const ciudadMatricula = "Bogotá D.C.";
  const fechaLimitePagoDescuento = "15/03/2025";
  const fechaLimitePago = "31/03/2025";
  const pagoExtemporaneoDesde = "01/04/2025";
  const primeraFechaDescuento = "28/02/2025";
  const segundaFechaDescuento = "10/03/2025";
  const terceraFechaDescuento = "20/03/2025";

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {message ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          {message}
        </Alert>
      ) : null}

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${theme.palette.border.main}`,
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
                value={ciudadMatricula}
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
                value={fechaLimitePagoDescuento}
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
                value={fechaLimitePago}
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
                value={pagoExtemporaneoDesde}
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
                label="Primera fecha límite descuento"
                value={primeraFechaDescuento}
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
                label="Segunda fecha límite descuento"
                value={segundaFechaDescuento}
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
                label="Tercera fecha límite descuento"
                value={terceraFechaDescuento}
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
