import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Paper,
  Switch,
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

export interface BotiquinProps {
  plate: string;
  vehicleId: number;
}

const FIRST_AID_KIT_ITEMS = [
  { id: "cotton", label: "Algodón", apiKey: "cotton" },
  { id: "elastic_band", label: "Banda elástica", apiKey: "elastic_band" },
  { id: "soap", label: "Jabón", apiKey: "soap" },
  { id: "cutting_tool", label: "Herramienta de corte", apiKey: "cutting_tool" },
  { id: "sterile_gauze", label: "Gasa estéril", apiKey: "sterile_gauze" },
  { id: "painkillers", label: "Analgésicos", apiKey: "painkillers" },
  { id: "antiseptics", label: "Antisépticos", apiKey: "antiseptics" },
];

interface FirstAidKitApiData {
  id?: number;
  cotton?: boolean;
  elastic_band?: boolean;
  soap?: boolean;
  cutting_tool?: boolean;
  sterile_gauze?: boolean;
  painkillers?: boolean;
  antiseptics?: boolean;
}

export function Botiquin({ plate: _plate, vehicleId: _vehicleId }: Readonly<BotiquinProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;
  
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [firstAidKitId, setFirstAidKitId] = useState<number | null>(null);

  const [kitItems, setKitItems] = useState<Record<string, boolean>>({
    cotton: false,
    elastic_band: false,
    soap: false,
    cutting_tool: false,
    sterile_gauze: false,
    painkillers: false,
    antiseptics: false,
  });
  
  const [currentKitItems, setCurrentKitItems] = useState(kitItems);

  // Fetch first aid kit data
  useEffect(() => {
    const fetchFirstAidKitData = async () => {
      try {
        const data = await httpGet<{ success: boolean; data?: FirstAidKitApiData }>(
          `/firstaidkit/${_plate}`,
        );
        if (data.success && data.data) {
          const firstAidKitData = data.data;
          
          // Set ID if it exists
          if (firstAidKitData.id) {
            setFirstAidKitId(firstAidKitData.id);
          }

          // Map API response to component state
          const mappedKitItems = {
            cotton: firstAidKitData.cotton ?? false,
            elastic_band: firstAidKitData.elastic_band ?? false,
            soap: firstAidKitData.soap ?? false,
            cutting_tool: firstAidKitData.cutting_tool ?? false,
            sterile_gauze: firstAidKitData.sterile_gauze ?? false,
            painkillers: firstAidKitData.painkillers ?? false,
            antiseptics: firstAidKitData.antiseptics ?? false,
          };
          
          setKitItems(mappedKitItems);
          setCurrentKitItems(mappedKitItems);
        }
      } catch (err) {
        console.error("Error fetching first aid kit data:", err);
        setError("Error al cargar los datos del botiquín");
      }
    };

    fetchFirstAidKitData();
  }, [_plate]);

  const handleCancel = () => {
    setIsEditing(false);
    setKitItems(currentKitItems);
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    
    try {
      // Map component state to API request format
      const payload = {
        cotton: kitItems.cotton,
        elasticBand: kitItems.elastic_band,
        soap: kitItems.soap,
        cuttingTool: kitItems.cutting_tool,
        sterileGauze: kitItems.sterile_gauze,
        painkillers: kitItems.painkillers,
        antiseptics: kitItems.antiseptics,
        vehicleId: _vehicleId,
      };

      let result: { success?: boolean; data?: { id?: number } };
      if (firstAidKitId) {
        // PUT request - update existing record
        result = await httpPut<{ success?: boolean; data?: { id?: number } }>(
          `/firstaidkit/firstaidkit/${firstAidKitId}`,
          payload,
        );
      } else {
        // POST request - create new record
        result = await httpPost<{ success?: boolean; data?: { id?: number } }>(
          "/firstaidkit/firstaidkit",
          payload,
        );
      }

      if (result.success && result.data && result.data.id) {
        setFirstAidKitId(result.data.id);
      }

      setCurrentKitItems(kitItems);
      setIsEditing(false);
      setMessage("Información del botiquín guardada correctamente.");
    } catch (err) {
      console.error("Error saving first aid kit data:", err);
      setError("Error al guardar los datos del botiquín. Intenta de nuevo.");
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
            Información del botiquín
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
            {FIRST_AID_KIT_ITEMS.map((item) => (
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
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {item.label}
                  </Typography>
                }
              />
            ))}
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
                bgcolor: surfaceAlt,
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
            setIsEditing(true);
          }}
          sx={{
            bgcolor: theme.palette.primary.light,
            color: theme.palette.text.primaryButton,
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
