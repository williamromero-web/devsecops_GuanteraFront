import {
  Alert,
  Box,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";

export interface PicoYPlacaProps {
  plate: string;
}

export function PicoYPlaca({ plate }: Readonly<PicoYPlacaProps>) {
  const theme = useTheme();
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const ultimoDigito = "8";
  const puedeCircular = true;
  const ciudad = "Bogotá";
  const diasRestriccion = "Lunes, Miércoles, Viernes";
  const digitosRestriccion = "8, 9";
  const franjaHoraria = "06:00 - 08:30 y 15:00 - 19:30";

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
          bgcolor: theme.palette.surface.alt,
          borderRadius: 2,
          border: `1px solid ${theme.palette.border.main}`,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
          <InfoIcon
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "1.25rem",
              mt: 0.5,
            }}
          />
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
            }}
          >
            La información es informativa y no oficial, aplicable solo a Bogotá,
            Cali, Villavicencio, Barranquilla y Medellín. El usuario debe
            verificar la actualización de la información, consultando siempre
            los canales oficiales de las entidades pertinentes (alcaldía,
            gobernación o ente regulador correspondiente).
          </Typography>
        </Box>
      </Paper>

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${theme.palette.border.main}`,
        }}
      >
        <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            Información de tu vehículo
          </Typography>
          {puedeCircular ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="PUEDE CIRCULAR"
              color="success"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                height: 32,
                borderRadius: "16px",
              }}
            />
          ) : (
            <Chip
              icon={<CancelIcon />}
              label="NO PUEDE CIRCULAR"
              color="error"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                height: 32,
                borderRadius: "16px",
              }}
            />
          )}
        </Box>

        <Box
          onClick={() => setInfoExpanded(!infoExpanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: infoExpanded ? 2 : 0,
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
            Detalles de restricción
          </Typography>
          {infoExpanded ? (
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

        {infoExpanded && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Último dígito de placa"
                value={ultimoDigito}
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
                label="Ciudad"
                value={ciudad}
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
                label="Días de restricción"
                value={diasRestriccion}
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
                label="Dígitos restringidos"
                value={digitosRestriccion}
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
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Franja horaria"
                value={franjaHoraria}
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
