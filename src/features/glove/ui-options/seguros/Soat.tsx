import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";

export interface SoatProps {
  plate: string;
}

export function Soat({ plate }: Readonly<SoatProps>) {
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
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // TODO: implementacion de api para obtener datos de SOAT
  // CAMBIO REQUERIDO:
  // 1. Reemplazar mock values con llamada GET a API: /simon-glove/private/vehicles/{plate}/soat
  // 2. Usar useEffect para cargar datos al montar componente
  // 3. Mapear respuesta de API a estados (statusType, numeroPoliza, fechaVencimiento, file)

  const statusType = "OK"; // "OK" | "PRÓXIMO A VENCER" | "VENCIDO"
  const numeroPoliza = "POL-123456789";
  const fechaVencimiento = "31/12/2025";
  const [hasFile, setHasFile] = useState(true);
  const [fileName, setFileName] = useState("soat.pdf");
  const [fileSizeLabel, setFileSizeLabel] = useState("220.0 KB");

  const getStatusInfo = () => {
    if (statusType === "OK") {
      return {
        title: "SOAT VIGENTE",
        message:
          "El Seguro Obligatorio de Accidentes de Tránsito correspondiente al vehículo seleccionado, se encuentra VIGENTE a la fecha. A continuación se detalla la información de la póliza:",
        chip: { label: "VIGENTE", icon: CheckCircleIcon, color: "success" },
      };
    }
    if (statusType === "PRÓXIMO A VENCER") {
      return {
        title: "SOAT PRÓXIMO A VENCER",
        message:
          "El Seguro Obligatorio de Accidentes de Tránsito correspondiente al vehículo seleccionado, está próximo a vencer. A continuación se detalla la información de la póliza:",
        chip: {
          label: "PRÓXIMO A VENCER",
          icon: WarningIcon,
          color: "warning",
        },
      };
    }
    if (statusType === "VENCIDO") {
      return {
        title: "SOAT VENCIDO",
        message:
          "El Seguro Obligatorio de Accidentes de Tránsito correspondiente al vehículo seleccionado, se encuentra VENCIDO. A continuación se detalla la información de la póliza:",
        chip: { label: "VENCIDO", icon: ErrorIcon, color: "error" },
      };
    }
    return {
      title: "SOAT",
      message: "A continuación se detalla la información de la póliza:",
      chip: null,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.chip?.icon;

  const handleCancel = () => {
    setIsEditing(false);
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
    setMessage("Información y archivo guardados correctamente (mock).");
  };

  const handleSaveDocument = async (file: File) => {
    setHasFile(true);
    setFileName(file.name);
    setFileSizeLabel(`${(file.size / 1024).toFixed(1)} KB`);
    setMessage("Archivo guardado correctamente (mock).");
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

      {/* Título y estado */}
      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
        }}
      >
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: theme.palette.primary.light,
              mb: 1,
            }}
          >
            {statusInfo.title}
          </Typography>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              mb: 2,
            }}
          >
            {statusInfo.message}
          </Typography>
          {statusInfo.chip && StatusIcon && (
            <Chip
              icon={<StatusIcon />}
              label={statusInfo.chip.label}
              color={statusInfo.chip.color as "success" | "warning" | "error"}
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
            Información SOAT
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
                label="Número de póliza"
                value={numeroPoliza}
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
                label="Fecha de vencimiento"
                value={fechaVencimiento}
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

      {/* Sección: Adjuntar SOAT */}
      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
        }}
      >
        <Box
          onClick={() => setDocumentsExpanded(!documentsExpanded)}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: documentsExpanded ? 2 : 0,
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
            Adjuntar SOAT
          </Typography>
          {documentsExpanded ? (
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

        {documentsExpanded && (
          <DocumentUploadCard
            instruction={`Adjunte aquí el SOAT vigente del vehículo (Placa: ${plate}).`}
            hasFile={hasFile}
            fileName={fileName}
            fileSizeLabel={fileSizeLabel}
            onView={() =>
              setMessage(
                "Vista previa (mock): aquí se abriría el SOAT desde la API.",
              )
            }
            onSave={handleSaveDocument}
          />
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
