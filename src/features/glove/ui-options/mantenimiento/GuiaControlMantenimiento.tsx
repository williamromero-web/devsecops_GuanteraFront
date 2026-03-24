import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import EditIcon from "@mui/icons-material/Edit";
// import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { useVehicleDocumentInfo } from "../../hooks/useVehicleDocumentInfo";
import { getDocumentTypeByCode } from "../../services";

export interface GuiaControlMantenimientoProps {
  plate: string;
  vehicleId?: number | string;
}

export function GuiaControlMantenimiento({
  plate,
  vehicleId: vehicleIdProp,
}: Readonly<GuiaControlMantenimientoProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  // const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [documentTypeId, setDocumentTypeId] = useState<string>("");
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);

  useEffect(() => {
    let ignore = false;
    getDocumentTypeByCode("GM")
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

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setMessage(null);
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

      {/* Sección: Adjuntar guía */}
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
            Adjuntar guía de control de mantenimiento
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
                  instruction={`Adjunte aquí la guía de control de mantenimiento del vehículo (Placa: ${plate}).`}
                  hasFile
                  fileName={node.name}
                  vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
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
                instruction={`Adjunte aquí la guía de control de mantenimiento del vehículo (Placa: ${plate}).`}
                hasFile={false}
                fileName="Sin archivo"
                vehicleId={vehicleIdProp !== undefined ? String(vehicleIdProp) : undefined}
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
        {/* <Button
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
        </Button> */}
      </Box>
    </Box>
  );
}
