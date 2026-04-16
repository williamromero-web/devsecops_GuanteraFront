import {
  Alert,
  Box,
  Button,
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
import { useEffect, useRef, useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { getPropertyCard, getVehicleDocumentNodes, updatePropertyCardNumber, type VehicleDocumentNode } from "../../services/propertyCardService";
import { getDocumentTypeByCode, uploadPropertyCardDocuments } from "../../services";

export interface TarjetaPropiedadProps {
  vehicleId: number;
  plate: string;
}

export function TarjetaPropiedad({ vehicleId, plate }: Readonly<TarjetaPropiedadProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;
  const [optionInfoExpanded, setOptionInfoExpanded] = useState(true);
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [originalPropertyNumber, setOriginalPropertyNumber] = useState("");

  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);
  const [nodeFiles, setNodeFiles] = useState<Record<string, { hasFile: boolean; fileName: string; fileSizeLabel: string }>>({});
  const [propertyId, setPropertyId] = useState(0);
  const [propertyNumber, setPropertyNumber] = useState("");
  const [service, setService] = useState("");
  const [vehTypeName, setVehTypeName] = useState("");
  const [fileChanged, setFileChanged] = useState(false);
  const [documentCollectionId, setDocumentCollectionId] = useState<string | null>(null);
  const [documentTypeId, setDocumentTypeId] = useState("");
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const loadedRef = useRef(false);

  const loadNodes = async (collectionId: string) => {
    const nodes = await getVehicleDocumentNodes(collectionId);
    setDocumentNodes(nodes);
    const initFiles: Record<string, { hasFile: boolean; fileName: string; fileSizeLabel: string }> = {};
    for (const node of nodes) {
      initFiles[node.nodeId] = { hasFile: true, fileName: node.name, fileSizeLabel: "" };
    }
    setNodeFiles(initFiles);
  };

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    async function loadPropertyCard() {
      try {
        const [response, docTypeRes] = await Promise.all([
          getPropertyCard(plate),
          getDocumentTypeByCode("TC"),
        ]);

        setDocumentTypeId(String(docTypeRes.data.id));

        const property = response.data.propertyCard;
        const document = response.data.document;

        const cardNumber = (property.cardNumber ?? "").trim();
        setPropertyId(property.id);
        setPropertyNumber(cardNumber);
        setOriginalPropertyNumber(cardNumber);
        setService(property.service ?? "");
        setVehTypeName(property.vehTypeName?.toLowerCase() ?? "");

        if (document.documentCollectionId) {
          setDocumentCollectionId(document.documentCollectionId);
          try {
            await loadNodes(document.documentCollectionId);
          } catch {
            // Si falla, la sección de documentos no muestra tarjetas
            console.error("No se pudieron cargar los nodos de documentos");
          }
        }

      } catch {
        setError("No se pudo cargar la tarjeta de propiedad.");
      }
    }

    loadPropertyCard();
  }, [plate, vehicleId]);

  const handleCancel = () => {
    setIsEditing(false);
    setPropertyNumber(originalPropertyNumber);
    setFileChanged(false);
    setFrontFile(null);
    setBackFile(null);
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      await updatePropertyCardNumber(propertyId, propertyNumber);
      setMessage("Número de tarjeta de propiedad actualizado correctamente.");
      setIsEditing(false);
    } catch {
      setError("No se pudo actualizar el número de tarjeta.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveFrontNode = async (file: File) => {
    setFrontFile(file);
    setNodeFiles((prev) => ({
      ...prev,
      ...(documentNodes[0] ? { [documentNodes[0].nodeId]: { hasFile: true, fileName: file.name, fileSizeLabel: `${(file.size / 1024).toFixed(1)} KB` } } : {}),
    }));
    setFileChanged(true);
    try {
      console.log("document type tc: ", documentTypeId); //TODO parece que esto esta pasando primero que el useEffect que lo carga, revisar
      
      await uploadPropertyCardDocuments({ documentTypeId, vehicleId: String(vehicleId), frontFile: file, collectionId: documentCollectionId ?? undefined });
      setMessage("Cara frontal guardada correctamente.");
      if (documentCollectionId) await loadNodes(documentCollectionId);
    } catch {
      setError("No se pudo guardar la cara frontal.");
    }
  };

  const handleSaveBackNode = async (file: File) => {
    setBackFile(file);
    setNodeFiles((prev) => ({
      ...prev,
      ...(documentNodes[1] ? { [documentNodes[1].nodeId]: { hasFile: true, fileName: file.name, fileSizeLabel: `${(file.size / 1024).toFixed(1)} KB` } } : {}),
    }));
    setFileChanged(true);
    try {
      await uploadPropertyCardDocuments({ documentTypeId, vehicleId: String(vehicleId), backFile: file, collectionId: documentCollectionId ?? undefined });
      setMessage("Cara trasera guardada correctamente.");
      if (documentCollectionId) await loadNodes(documentCollectionId);
    } catch {
      setError("No se pudo guardar la cara trasera.");
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
            Información tarjeta de propiedad
          </Typography>
          {optionInfoExpanded ? (
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

        {optionInfoExpanded && (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Número"
                value={propertyNumber}
                variant="outlined"
                size="small"
                disabled={!isEditing}
                onChange={(e) => setPropertyNumber(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Servicio"
                value={service}
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
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="Clase"
                value={vehTypeName}
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
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                {isEditing && (
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{
                      borderColor: theme.palette.text.secondary,
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
                      ((propertyNumber || "").trim() === (originalPropertyNumber || "").trim() && !fileChanged))
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
                  {(() => {
                    if (!isEditing) return "Editar";
                    if (saving) return "Guardando...";
                    return Object.values(nodeFiles).some((nf) => nf.hasFile) ? "Actualizar" : "Guardar";
                  })()}
                </Button>
              </Box>
            </Grid>
          </Grid>
        )}
      </Paper>

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
            Adjuntar tarjeta de propiedad
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Front face */}
            {documentNodes[0] ? (
              <DocumentUploadCard
                key={documentNodes[0].nodeId}
                instruction={`Front face — Adjunte aquí la cara frontal de la tarjeta de propiedad (Placa: ${plate}).`}
                hasFile={nodeFiles[documentNodes[0].nodeId]?.hasFile ?? false}
                fileName={nodeFiles[documentNodes[0].nodeId]?.fileName ?? documentNodes[0].name}
                fileSizeLabel={nodeFiles[documentNodes[0].nodeId]?.fileSizeLabel}
                nodeId={nodeFiles[documentNodes[0].nodeId]?.hasFile ? documentNodes[0].nodeId : undefined}
                onSave={handleSaveFrontNode}
                onDelete={documentCollectionId ? () => window.location.reload() : undefined}
              />
            ) : (
              <DocumentUploadCard
                instruction={`Front face — Adjunte aquí la cara frontal de la tarjeta de propiedad (Placa: ${plate}).`}
                hasFile={!!frontFile}
                fileName={frontFile?.name ?? "Sin archivo"}
                fileSizeLabel={frontFile ? `${(frontFile.size / 1024).toFixed(1)} KB` : undefined}
                onSave={handleSaveFrontNode}
              />
            )}

            {/* Back face */}
            {documentNodes[1] ? (
              <DocumentUploadCard
                key={documentNodes[1].nodeId}
                instruction={`Back face — Adjunte aquí la cara trasera de la tarjeta de propiedad (Placa: ${plate}).`}
                hasFile={nodeFiles[documentNodes[1].nodeId]?.hasFile ?? false}
                fileName={nodeFiles[documentNodes[1].nodeId]?.fileName ?? documentNodes[1].name}
                fileSizeLabel={nodeFiles[documentNodes[1].nodeId]?.fileSizeLabel}
                nodeId={nodeFiles[documentNodes[1].nodeId]?.hasFile ? documentNodes[1].nodeId : undefined}
                onSave={handleSaveBackNode}
                onDelete={documentCollectionId ? () => window.location.reload() : undefined}
              />
            ) : (
              <DocumentUploadCard
                instruction={`Back face — Adjunte aquí la cara trasera de la tarjeta de propiedad (Placa: ${plate}).`}
                hasFile={!!backFile}
                fileName={backFile?.name ?? "Sin archivo"}
                fileSizeLabel={backFile ? `${(backFile.size / 1024).toFixed(1)} KB` : undefined}
                onSave={handleSaveBackNode}
              />
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}
