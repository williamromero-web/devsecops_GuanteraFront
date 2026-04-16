import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
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
import { useEffect, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { DateField } from "../../../../shared/ui/atoms";
import { useInsurancePolicy } from "../../hooks/useInsurancePolicy";
import { useInsurers } from "../../hooks/useInsurers";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { uploadPolicyDocument } from "../../services";

export interface PolizaSeguroProps {
  plate: string;
  vehicleId?: number | string;
}

export function PolizaSeguro({ plate, vehicleId: vehicleIdProp }: Readonly<PolizaSeguroProps>) {
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

  const { policy, document, error: policyError, refetch } = useInsurancePolicy("insurance_policy", plate);
  const { insurers } = useInsurers();

  const [numeroPoliza, setNumeroPoliza] = useState("");
  const [aseguradora, setAseguradora] = useState("");
  const [fechaVigencia, setFechaVigencia] = useState("");
  const [contactoAsistencia, setContactoAsistencia] = useState("");
  
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);

  const collectionId: string | null = document?.documentCollectionId ?? null;

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
    const fetchNodes = async () => { await loadNodes(collectionId); };
    fetchNodes();
  }, [collectionId]);

  const fillInsurerContact = (insurerId: number) => {
    const insurer = insurers.find(i => i.id === insurerId);
    if (insurer) {
      setContactoAsistencia(insurer.contactNumber);
    }
  };

  useEffect(() => {
    if (!policy || insurers.length === 0) return;

    setNumeroPoliza(policy.number ?? "");
    setAseguradora(policy.insurerId?.toString() ?? "");

    fillInsurerContact(policy.insurerId);

    setFechaVigencia(document.endDate ?? "");
  }, [policy, document]);

  const getStatusType = () => {
    switch (document?.color) {
      case "#FF4444":
        return "VENCIDO";
      case "#FF8844":
      case "#FFBB44":
      case "#FFDD44":
        return "PRÓXIMO A VENCER";
      case "green":
        return "OK";
      default:
        return null;
    }
  };

  const statusType = getStatusType();

  const getStatusInfo = () => {
    if (statusType === "OK") {
      return {
        title: "PÓLIZA DE SEGURO VIGENTE",
        message:
          "La póliza de seguro todo riesgo correspondiente al vehículo seleccionado, se encuentra VIGENTE a la fecha.",
        chip: { label: "VIGENTE", icon: CheckCircleIcon, color: "success" },
      };
    }
    if (statusType === "PRÓXIMO A VENCER") {
      return {
        title: "PÓLIZA DE SEGURO PRÓXIMO A VENCER",
        message:
          "La póliza de seguro todo riesgo correspondiente al vehículo seleccionado está próximo a vencer.",
        chip: {
          label: "PRÓXIMO A VENCER",
          icon: WarningIcon,
          color: "warning",
        },
      };
    }
    if (statusType === "VENCIDO") {
      return {
        title: "PÓLIZA DE SEGURO VENCIDA",
        message:
          "La póliza de seguro todo riesgo correspondiente al vehículo seleccionado se encuentra VENCIDA.",
        chip: { label: "VENCIDO", icon: ErrorIcon, color: "error" },
      };
    }
    return {
      title: "PÓLIZA DE SEGURO",
      message: "A continuación se detalla la información de la póliza:",
      chip: null,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.chip?.icon;

  const handleCancel = () => {
    setIsEditing(false);
    setNumeroPoliza(policy?.number ?? "");
    setAseguradora(policy?.insurerId?.toString() ?? "");
    setFechaVigencia(document?.endDate ?? "");
    setContactoAsistencia(policy?.assistanceNumber ?? "");
    setError(null);
    setMessage(null);
  };

    const metadata = { 
      PolicyTypeID: 2, 
      InsurerID: aseguradora,
      InsurerCellPhone: contactoAsistencia,
      AssistanceNumber: contactoAsistencia,
      Number: numeroPoliza,
    };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await uploadPolicyDocument({
        documentTypeId: "4",
        vehicleId: vehicleIdProp !== undefined ? String(vehicleIdProp) : 0,
        expiredDate: fechaVigencia,
        metadata,
      });

      setMessage("Poliza actualizada correctamente.");
      setIsEditing(false);
    } catch {
      setError("No se pudo actualizar La póliza.");
    } finally {
      setSaving(false);
    }
  };

  const handleAfterChange = async () => {
    refetch();
    if (collectionId) await loadNodes(collectionId);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {policyError || error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {policyError || error}
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
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
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
            Información póliza de seguro
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
                label="Número de póliza"
                value={numeroPoliza}
                onChange={(e) => setNumeroPoliza(e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              {/* <TextField
                fullWidth
                label="Aseguradora"
                value={aseguradora}
                onChange={(e) => setAseguradora(e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              /> */}
              <TextField
                select
                label="Aseguradora"
                value={aseguradora}
                disabled={!isEditing}
                onChange={(e) => {
                  const selectedId = Number(e.target.value);
                  setAseguradora(selectedId.toString());
                  fillInsurerContact(selectedId);
                }}
                fullWidth
              >
                {insurers.map((insurer) => (
                  <MenuItem key={insurer.id} value={insurer.id}>
                    {insurer.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField
                fullWidth
                label="Fecha de vigencia"
                value={fechaVigencia}
                onChange={(e) => setFechaVigencia(e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Contacto de asistencia"
                value={contactoAsistencia}
                onChange={(e) => setContactoAsistencia(e.target.value)}
                disabled={!isEditing}
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
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
                  disabled={
                    isEditing &&
                    (saving ||
                      (numeroPoliza.trim() === (policy?.number ?? "").trim() &&
                      aseguradora.trim() === (policy?.insurerName ?? "").trim() &&
                      fechaVigencia === (document?.endDate ?? "") &&
                      contactoAsistencia.trim() === (policy?.assistanceNumber ?? "").trim() //&&
                    ))
                      // !hasFile))
                  }
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  sx={{
                    bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    textTransform: "none",
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: theme.palette.primary.light,
                      color: "#181818",
                    },
                    "&:disabled": {
                      bgcolor: theme.palette.action.disabledBackground,
                      color: theme.palette.action.disabled,
                    },
                  }}
                >
                  {isEditing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
                  {/* {isEditing
                    ? saving
                      ? "Guardando..."
                      : hasFile
                        ? "Actualizar"
                        : "Guardar"
                    : "Editar"} */}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

      {/* Sección: Adjuntar póliza */}
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
            Adjuntar póliza de seguro
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
                  instruction={`Adjunte aquí la póliza de seguro todo riesgo del vehículo (Placa: ${plate}).`}
                  hasFile
                  fileName={node.name}
                  vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
                  documentTypeId="4"
                  collectionId={collectionId ?? undefined}
                  nodeId={node.nodeId}
                  metadata={metadata}
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
                instruction={`Adjunte aquí la póliza de seguro todo riesgo del vehículo (Placa: ${plate}).`}
                hasFile={false}
                fileName="Sin archivo"
                vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
                documentTypeId="4"
                collectionId={collectionId ?? undefined}
                metadata={metadata}
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
    </Box>
  );
}
