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
import { useState, useEffect } from "react";
import { httpGet, httpPost, httpPut } from "../../lib/httpClient";

export interface KitCarreteraProps {
  plate: string;
  vehicleId: number;
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

interface RoadKitApiData {
  id?: number;
  jack?: boolean;
  road_signs?: boolean;
  flashlight?: boolean;
  spare_tire?: boolean;
  lug_wrench?: boolean;
  wheel_chocks?: boolean;
  toolbox?: boolean;
  has_extinguisher?: boolean;
}

interface RoadKitPayload {
  jack: boolean;
  roadSigns: boolean;
  flashlight: boolean;
  spareTire: boolean;
  lugWrench: boolean;
  wheelChocks: boolean;
  toolbox: boolean;
  vehicleId: number;
  FireExtinguisher?: {
    hasExtinguisher: boolean;
    refillDate: string;
  };
}

export function KitCarretera({ plate: _plate, vehicleId: _vehicleId }: Readonly<KitCarreteraProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roadKitId, setRoadKitId] = useState<number | null>(null);

  const [kitItems, setKitItems] = useState<Record<string, boolean>>({
    gato: false,
    senales: false,
    linterna: false,
    llanta: false,
    cruceta: false,
    tacos: false,
    "caja-herramientas": false,
  });
  const [extintorPresente, setExtintorPresente] = useState(false);
  const [fechaUltimaRecarga, setFechaUltimaRecarga] = useState("");

  const [currentKitItems, setCurrentKitItems] = useState(kitItems);
  const [currentExtintorPresente, setCurrentExtintorPresente] = useState(extintorPresente);
  const [currentFechaUltimaRecarga, setCurrentFechaUltimaRecarga] = useState(fechaUltimaRecarga);

  // Fetch road kit data
  useEffect(() => {
    const fetchRoadKitData = async () => {
      try {
        const data = await httpGet<{ success: boolean; data?: RoadKitApiData }>(
          `/roadkit/${_plate}`,
        );
        if (data.success && data.data) {
          const roadKitData = data.data;
          
          // Set ID if it exists
          if (roadKitData.id) {
            setRoadKitId(roadKitData.id);
          }

          // Map API response to component state
          const mappedKitItems = {
            gato: roadKitData.jack ?? false,
            senales: roadKitData.road_signs ?? false,
            linterna: roadKitData.flashlight ?? false,
            llanta: roadKitData.spare_tire ?? false,
            cruceta: roadKitData.lug_wrench ?? false,
            tacos: roadKitData.wheel_chocks ?? false,
            "caja-herramientas": roadKitData.toolbox ?? false,
          };
          
          setKitItems(mappedKitItems);
          setCurrentKitItems(mappedKitItems);
          setExtintorPresente(roadKitData.has_extinguisher ?? false);
          setCurrentExtintorPresente(roadKitData.has_extinguisher ?? false);
        }
      } catch (err) {
        console.error("Error fetching road kit data:", err);
        setError("Error al cargar los datos del kit de carretera");
      }
    };

    fetchRoadKitData();
  }, [_plate]);

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
    
    try {
      // Validate that date is required when extinguisher is present
      if (extintorPresente && !fechaUltimaRecarga) {
        setError("La fecha de última recarga del extintor es obligatoria");
        setSaving(false);
        return;
      }

      // Map component state to API request format
      const payload: RoadKitPayload = {
        jack: kitItems.gato,
        roadSigns: kitItems.senales,
        flashlight: kitItems.linterna,
        spareTire: kitItems.llanta,
        lugWrench: kitItems.cruceta,
        wheelChocks: kitItems.tacos,
        toolbox: kitItems["caja-herramientas"],
        vehicleId: _vehicleId,
      };

      // Add FireExtinguisher object only if extinguisher is present
      if (extintorPresente) {
        // Convert date to ISO 8601 format with time
        const dateObj = new Date(fechaUltimaRecarga);
        const isoDate = dateObj.toISOString().replace('Z', '-05:00');
        
        payload.FireExtinguisher = {
          hasExtinguisher: true,
          refillDate: isoDate,
        };
      }

      let result: { success?: boolean; data?: { id?: number } };
      if (roadKitId) {
        // PUT request - update existing record
        result = await httpPut<{ success?: boolean; data?: { id?: number } }>(
          `/roadkit/roadkit/${roadKitId}`,
          payload,
        );
      } else {
        // POST request - create new record
        result = await httpPost<{ success?: boolean; data?: { id?: number } }>(
          "/roadkit/roadkit",
          payload,
        );
      }

      if (result.success && result.data && result.data.id) {
        setRoadKitId(result.data.id);
      }

      setCurrentKitItems(kitItems);
      setCurrentExtintorPresente(extintorPresente);
      setCurrentFechaUltimaRecarga(fechaUltimaRecarga);
      setIsEditing(false);
      setMessage("Información del kit guardada correctamente.");
    } catch (err) {
      console.error("Error saving road kit data:", err);
      setError("Error al guardar los datos del kit de carretera. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
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
          border: `1px solid ${borderColor}`,
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
                borderTop: `1px solid ${borderColor}`,
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
                      label="Fecha última recarga *"
                      type="date"
                      value={fechaUltimaRecarga}
                      onChange={(e) => setFechaUltimaRecarga(e.target.value)}
                      disabled={!isEditing}
                      variant="outlined"
                      size="small"
                      required
                      error={isEditing && !fechaUltimaRecarga}
                      helperText={isEditing && !fechaUltimaRecarga ? "La fecha es obligatoria" : ""}
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
              borderColor,
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                bgcolor:
                  (theme.palette as { surface?: { alt?: string } })?.surface
                    ?.alt ??
                  theme.palette.background.paper ??
                  theme.palette.background.default,
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
          onClick={isEditing ? handleSave : () => {
            setCurrentKitItems(kitItems);
            setCurrentExtintorPresente(extintorPresente);
            setCurrentFechaUltimaRecarga(fechaUltimaRecarga);
            setIsEditing(true);
          }}
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
