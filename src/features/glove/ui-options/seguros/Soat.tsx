import {
  Alert,
  Box,
  // Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
// import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { formatToDD_MM_YYYY } from "../../services/documentUpload";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { useVehicleDocumentInfo } from "../../hooks/useVehicleDocumentInfo";

export interface SoatProps {
  plate: string;
  vehicleId?: number | string;
}

export function Soat({ plate, vehicleId: vehicleIdProp }: Readonly<SoatProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  // const surfaceAlt =
  //   (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
  //   theme.palette.background.paper ??
  //   theme.palette.background.default;
  const [infoExpanded, setInfoExpanded] = useState(true);
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  // const [isEditing, setIsEditing] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);


  const { data: vehicleDocument, error: policyError, refetch } = useVehicleDocumentInfo(
      vehicleIdProp ?? "",
      3,
    );

  const collectionId: string | null = vehicleDocument?.documentCollectionId ?? null;

  const loadNodes = async (id: string) => {
    try {
      const nodes = await getVehicleDocumentNodes(id);
      setDocumentNodes(nodes);
    } catch {
      setDocumentNodes([]);
    }
  };

  useEffect(() => {
    setError(null)
    if (!collectionId) return;
    const fetchNodes = async () => { await loadNodes(collectionId); };
    fetchNodes();
  }, [collectionId]);

  const handleAfterChange = async () => {
    await refetch();
    if (collectionId) await loadNodes(collectionId);
  };

  let expiredDate = "NO REPORTADO";
  if (vehicleDocument?.expiredDate) {
    const formatted = formatToDD_MM_YYYY(vehicleDocument.expiredDate);
    if (formatted) {
      expiredDate = formatted;
    }
  }

  let startDate = "NO REPORTADO";
  if (vehicleDocument?.startDate) {
    const formatted = formatToDD_MM_YYYY(vehicleDocument.startDate);
    if (formatted) {
      startDate = formatted;
    }
  }

  const getStatusInfo = () => {
    return {
      title: "SOAT",
      message: "A continuación se muestra la información de la póliza:",
      chip: null,
    };
  };

  const statusInfo = getStatusInfo();

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
  //   setMessage("Information and file saved successfully (mock).");
  // };

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
            Información del SOAT
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
          // <Grid container spacing={2}>
          //   <Grid size={{ xs: 12, sm: 6 }}>
          //     <TextField
          //       fullWidth
          //       label="Policy Number"
          //       value={policy?.number ?? ""}
          //       variant="outlined"
          //       size="small"
          //       disabled
          //       sx={{
          //         "& .MuiOutlinedInput-root": {
          //           bgcolor: theme.palette.background.paper,
          //           color: theme.palette.text.primary,
          //         },
          //       }}
          //     />
          //   </Grid>
          //   <Grid size={{ xs: 12, sm: 6 }}>
          //     <TextField
          //       fullWidth
          //       label="Expiration Date"
          //       value={expiredDate}
          //       variant="outlined"
          //       size="small"
          //       disabled
          //       sx={{
          //         "& .MuiOutlinedInput-root": {
          //           bgcolor: theme.palette.background.paper,
          //           color: theme.palette.text.primary,
          //         },
          //       }}
          //     />
          //   </Grid>
          // </Grid>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Fecha de inicio"
                value={startDate}
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
                value={expiredDate}
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
          <>
            {documentNodes.length > 0 ? (
              documentNodes.map((node) => (
                <DocumentUploadCard
                  key={node.nodeId}
                  instruction={`Adjunta el documento SOAT del vehículo (Placa: ${plate}).`}
                  hasFile
                  fileName={node.name}
                  vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
                  documentTypeId="3"
                  collectionId={collectionId ?? undefined}
                  nodeId={node.nodeId}
                  onDelete={handleAfterChange}
                  onSave={async (file, newCollectionId) => {
                    setMessage(`${file.name} se guardó correctamente.`);
                    const idToUse = newCollectionId ?? collectionId ?? null;
                    if (idToUse) await loadNodes(idToUse);
                    else await refetch();
                  }}
                />
              ))
            ) : (
              <DocumentUploadCard
                instruction={`Adjunta el documento SOAT del vehículo (Placa: ${plate}).`}
                hasFile={false}
                fileName="Sin archivo"
                vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
                documentTypeId="3"
                collectionId={collectionId ?? undefined}
                onSave={async (file, newCollectionId) => {
                  setMessage(`${file.name} se guardó correctamente.`);
                  const idToUse = newCollectionId ?? collectionId ?? null;
                  if (idToUse) await loadNodes(idToUse);
                  else await refetch();
                }}
              />
            )}
          </>
        )}
      </Paper>

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
            Cancel
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
          {isEditing ? (saving ? "Saving..." : "Save") : "Edit"}
        </Button>
      </Box> */}
    </Box>
  );
}
