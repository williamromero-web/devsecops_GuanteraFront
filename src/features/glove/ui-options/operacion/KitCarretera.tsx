import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";

export interface KitCarreteraProps {
  plate: string;
}

const KIT_ITEMS = [
  {
    id: "gato",
    label: "Gato",
    description: "Con capacidad para elevar el vehículo",
  },
  {
    id: "senales",
    label: "Señales de carretera (2)",
    description: "En material reflectivo",
  },
  { id: "linterna", label: "Linterna", description: "" },
  { id: "llanta", label: "Llanta", description: "De repuesto" },
  { id: "cruceta", label: "Cruceta", description: "" },
  { id: "tacos", label: "Tacos (2)", description: "Para bloquear el vehículo" },
  {
    id: "caja-herramientas",
    label: "Caja de herramientas",
    description: "Básicas",
  },
];

export function KitCarretera({ plate }: Readonly<KitCarreteraProps>) {
  const theme = useTheme();
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [kitItems, setKitItems] = useState<Record<string, boolean>>({
    gato: true,
    senales: true,
    linterna: false,
    llanta: true,
    cruceta: true,
    tacos: true,
    "caja-herramientas": false,
  });
  const [extintorPresente, setExtintorPresente] = useState(true);
  const [fechaUltimaRecarga, setFechaUltimaRecarga] = useState("2025-01-15");

  const currentKitItems = { ...kitItems };
  const currentExtintorPresente = extintorPresente;
  const currentFechaUltimaRecarga = fechaUltimaRecarga;

  const handleCancel = () => {
    setIsEditing(false);
    setKitItems(currentKitItems);
    setExtintorPresente(currentExtintorPresente);
    setFechaUltimaRecarga(currentFechaUltimaRecarga);
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    setIsEditing(false);
    setMessage("Información del kit guardada correctamente (mock).");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {message ? (
        <Alert severity="success" sx={{ mb: 2 }}>
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
            Elementos del kit de carretera
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {KIT_ITEMS.map((item) => (
              <FormControlLabel
                key={item.id}
                control={
                  <Switch
                    checked={kitItems[item.id] ?? false}
                    onChange={(e) =>
                      setKitItems({ ...kitItems, [item.id]: e.target.checked })
                    }
                    disabled={!isEditing}
                  />
                }
                label={
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {item.label}
                    </Typography>
                    {item.description && (
                      <Typography
                        sx={{
                          fontSize: "0.75rem",
                          color: theme.palette.text.secondary,
                        }}
                      >
                        {item.description}
                      </Typography>
                    )}
                  </Box>
                }
              />
            ))}

            <Box
              sx={{
                mt: 2,
                pt: 2,
                borderTop: `1px solid ${theme.palette.border.main}`,
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={extintorPresente}
                    onChange={(e) => setExtintorPresente(e.target.checked)}
                    disabled={!isEditing}
                  />
                }
                label={
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Extintor
                  </Typography>
                }
              />
              {extintorPresente && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Fecha última recarga"
                      type="date"
                      value={fechaUltimaRecarga}
                      onChange={(e) => setFechaUltimaRecarga(e.target.value)}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      InputLabelProps={{ shrink: true }}
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
            </Box>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            sx={{
              borderColor: theme.palette.border.main,
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                bgcolor: theme.palette.surface.alt,
              },
            }}
          >
            Cancelar
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          disabled={isEditing && saving}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
          sx={{
            bgcolor: theme.palette.primary.light,
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            py: 1.5,
            borderRadius: 2,
            "&:hover": {
              bgcolor: theme.palette.primary.main,
            },
            "&:disabled": {
              bgcolor: theme.palette.action.disabledBackground,
              color: theme.palette.action.disabled,
            },
          }}
        >
          {isEditing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
        </Button>
      </Box>
    </Box>
  );
}
