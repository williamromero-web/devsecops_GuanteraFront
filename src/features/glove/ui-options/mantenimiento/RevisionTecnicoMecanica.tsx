import {
  Alert,
  Box,
  // Button,
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
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useEffect, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { getRTM } from "../../services/rtmService";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { getDocumentTypeByCode } from "../../services";
import { useVehicleDocumentInfo } from "../../hooks/useVehicleDocumentInfo";

export interface RevisionTecnicoMecanicaProps {
  plate: string;
  vehicleId?: number | string;
}

export function RevisionTecnicoMecanica({
  plate,
  vehicleId: vehicleIdProp,
}: Readonly<RevisionTecnicoMecanicaProps>) {
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
  // const [isEditing, setIsEditing] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [statusType, setStatusType] = useState("");
  const [fechaUltimaRevision, setFechaUltimaRevision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");

  const [documentTypeId, setDocumentTypeId] = useState<string>("");
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);

  const mapStatus = (status: string) => {

    if (status === "Expirado") return "VENCIDO";

    if (status.includes("Próximo")) return "PRÓXIMO A VENCER";

    if (status === "Vigente") return "OK";

    return "";
  }

  useEffect(() => {
    async function loadData() {

      try {

        const response = await getRTM(plate);

        const data = response.data;

        setFechaUltimaRevision(data.rtm.lastReviewDate);
        setFechaVencimiento(data.rtm.expiredDate);
        setStatusType(mapStatus(data.document.status));

      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información de la RTM");
      }

    }

  loadData();

  }, [plate]);

  useEffect(() => {
    let ignore = false;
    getDocumentTypeByCode("RTM")
      .then((res) => {
        if (!ignore) setDocumentTypeId(String(res.data.id));
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, []);

  const { data: vehicleDocument, refetch } = useVehicleDocumentInfo(
    vehicleIdProp ?? "",
    documentTypeId,
  );

  const collectionId: string | null =
    vehicleDocument?.documentCollectionId ?? null;

  const loadNodes = async (id: string) => {
    try {
      const nodes = await getVehicleDocumentNodes(id);
      setDocumentNodes(nodes);
    } catch {
      setDocumentNodes([]);
    }
  };

  useEffect(() => {
    if (!collectionId) return;
    const fetchNodes = async () => {
      await loadNodes(collectionId);
    };
    fetchNodes();
  }, [collectionId]);

  const handleAfterChange = async () => {
    await refetch();
    if (collectionId) await loadNodes(collectionId);
  };

  const getStatusInfo = () => {
    if (statusType === "OK") {
      return {
        title: "TECNICOMECÁNICA VIGENTE",
        message:
          "La Revisión Tecnicomecánica correspondiente al vehículo seleccionado, se encuentra VIGENTE a la fecha. A continuación se detalla la información:",
        chip: { label: "VIGENTE", icon: CheckCircleIcon, color: "success" },
      };
    }
    if (statusType === "PRÓXIMO A VENCER") {
      return {
        title: "TECNICOMECÁNICA PRÓXIMO A VENCER",
        message:
          "La Revisión Tecnicomecánica correspondiente al vehículo seleccionado está PRÓXIMA A VENCER. Se recomienda realizar la renovación antes de la fecha de vencimiento.",
        chip: {
          label: "PRÓXIMO A VENCER",
          icon: WarningIcon,
          color: "warning",
        },
      };
    }
    if (statusType === "VENCIDO") {
      return {
        title: "TECNICOMECÁNICA VENCIDA",
        message:
          "La Revisión Tecnicomecánica correspondiente al vehículo seleccionado está VENCIDA. Es necesario realizar la renovación de manera inmediata.",
        chip: { label: "VENCIDO", icon: ErrorIcon, color: "error" },
      };
    }
    return {
      title: "REVISIÓN TÉCNICO-MECÁNICA",
      message:
        "Información de la Revisión Tecnicomecánica del vehículo seleccionado:",
      chip: null,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.chip?.icon;

  // const handleCancel = () => {
  //   setIsEditing(false);
  //   setError(null);
  //   setMessage(null);
  // };

  // const handleSave = async () => {
  //   setSaving(true);
  //   setError(null);
  //   setMessage(null);
  //   await new Promise((resolve) => setTimeout(resolve, 500));
  //   setSaving(false);
  //   setIsEditing(false);
  //   setMessage("Información y archivo guardados correctamente (mock).");
  // };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          bgcolor: surfaceAlt,
        }}
      >
        <InfoIcon
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.4rem",
            mt: 0.25,
          }}
        />
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: theme.palette.text.secondary,
          }}
        >
          Los datos son de carácter informativo y no oficial. Si encuentra alguna inconsistencia, 
          consulte directamente con las entidades oficiales de tránsito o directamente 
          con el Centro de Diagnóstico Automotor (CDA) donde se realizó la RTM (Revisión Técnico Mecánica).
        </Typography>
      </Paper>

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
              color:
                statusType === "OK"
                  ? (theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark)
                  : statusType === "PRÓXIMO A VENCER"
                    ? theme.palette.warning.main
                    : statusType === "VENCIDO"
                      ? theme.palette.error.main
                      : theme.palette.text.secondary,
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
            Información revisión técnico-mecánica
          </Typography>
          {infoExpanded ? (
            <ExpandLessIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.secondary,
              }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.secondary,
              }}
            />
          )}
        </Box>

        {infoExpanded && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha última revisión"
                value={fechaUltimaRevision}
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

      {/* Sección: Adjuntar RTM */}
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
            Adjuntar revisión técnico-mecánica
          </Typography>
          {documentsExpanded ? (
            <ExpandLessIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.secondary,
              }}
            />
          ) : (
            <ExpandMoreIcon
              sx={{
                fontSize: "1.25rem",
                color: theme.palette.text.secondary,
              }}
            />
          )}
        </Box>

        {documentsExpanded && (
          <>
            {documentNodes.length > 0 ? (
              documentNodes.map((node) => (
                <DocumentUploadCard
                  key={node.nodeId}
                  instruction={`Adjunte aquí el certificado de revisión técnico-mecánica (Placa: ${plate}).`}
                  hasFile
                  fileName={node.name}
                  vehicleId={
                    vehicleIdProp !== undefined
                      ? String(vehicleIdProp)
                      : undefined
                  }
                  documentTypeId={documentTypeId}
                  collectionId={collectionId ?? undefined}
                  nodeId={node.nodeId}
                  onDelete={handleAfterChange}
                  onSave={async (file, newCollectionId) => {
                    setMessage(`${file.name} guardado correctamente.`);
                    const idToUse = newCollectionId ?? collectionId ?? null;
                    if (idToUse) await loadNodes(idToUse);
                    else await refetch();
                  }}
                />
              ))
            ) : (
              <DocumentUploadCard
                instruction={`Adjunte aquí el certificado de revisión técnico-mecánica (Placa: ${plate}).`}
                hasFile={false}
                fileName="Sin archivo"
                vehicleId={
                  vehicleIdProp !== undefined
                    ? String(vehicleIdProp)
                    : undefined
                }
                documentTypeId={documentTypeId}
                collectionId={collectionId ?? undefined}
                onSave={async (file, newCollectionId) => {
                  setMessage(`${file.name} guardado correctamente.`);
                  const idToUse = newCollectionId ?? collectionId ?? null;
                  if (idToUse) await loadNodes(idToUse);
                  else await refetch();
                }}
              />
            )}
          </>
        )}
      </Paper>

      {/* Botones de acción */}
      {/* <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
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
      </Box> */}
    </Box>
  );
}
