import {
  Alert,
  Box,
  Button,
  Paper,
  Typography,
  TextField,
  Grid,
  IconButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DateField } from "../../../../shared/ui/atoms";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import { useState, useEffect } from "react";
import { formatToDD_MM_YYYY, uploadOtrosDocumentos } from "../../services";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { useOtherDocuments } from "../../hooks/useOtherDocuments";
import { httpDelete } from "../../lib/httpClient";

interface Document {
  id: string | null;
  otherDocumentId: number | null;
  nombre: string;
  entidad: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  observaciones: string;
  archivos: File[];
  collectionId?: string;
}

export interface OtrosDocumentosProps {
  plate: string;
  vehicleId: number;
}

export function OtrosDocumentos({
  plate: _plate,
  vehicleId: _vehicleId,
}: Readonly<OtrosDocumentosProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  const { documents: otherDocuments, error: loadingError, refetch } = useOtherDocuments(_plate);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [existingNodes, setExistingNodes] = useState<Map<string, VehicleDocumentNode[]>>(new Map());
  
  // Estado para el diálogo de confirmación
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteType, setDeleteType] = useState<"node" | "document" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDocIndex, setDeleteDocIndex] = useState<number | null>(null);

  const loadNodes = async (collectionId: string) => {
    try {
      const nodes = await getVehicleDocumentNodes(collectionId);
      setExistingNodes((prev) => new Map(prev).set(collectionId, nodes));
    } catch {
      setExistingNodes((prev) => new Map(prev).set(collectionId, []));
    }
  };

  const handleRemoveNode = async (nodeId: string) => {
    setDeleteType("node");
    setDeleteId(nodeId);
    setConfirmDeleteOpen(true);
  };

  const [documentos, setDocumentos] = useState<Document[]>([
    {
      id: null,
      otherDocumentId: null,
      nombre: "",
      entidad: "",
      fechaExpedicion: "",
      fechaVencimiento: "",
      observaciones: "",
      archivos: [],
    },
  ]);

  const handleInputChange = (
    index: number,
    field: keyof Document,
    value: string,
  ) => {
    const nuevosDocumentos = [...documentos];
    const documentoActualizado = {
      ...nuevosDocumentos[index],
      [field]: value,
    } as Document;
    nuevosDocumentos[index] = documentoActualizado;
    setDocumentos(nuevosDocumentos);
  };

  const handleFileChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const nuevosDocumentos = [...documentos];
    const selectedFiles = Array.from(event.target.files || []);
    const maxFiles = 2;

    if (
      (nuevosDocumentos[index].archivos?.length || 0) + selectedFiles.length >
      maxFiles
    ) {
      setError(`Máximo ${maxFiles} archivos por documento.`);
      return;
    }

    nuevosDocumentos[index].archivos = [
      ...(nuevosDocumentos[index].archivos || []),
      ...selectedFiles,
    ];
    setDocumentos(nuevosDocumentos);
    setError(null);
  };

  const handleRemoveFile = (docIndex: number, fileIndex: number) => {
    const nuevosDocumentos = [...documentos];
    nuevosDocumentos[docIndex].archivos = nuevosDocumentos[
      docIndex
    ].archivos.filter((_, idx) => idx !== fileIndex);
    setDocumentos(nuevosDocumentos);
  };

  const addDocumento = () => {
    setDocumentos([
      ...documentos,
      {
        id: null,
        otherDocumentId: null,
        nombre: "",
        entidad: "",
        fechaExpedicion: "",
        fechaVencimiento: "",
        observaciones: "",
        archivos: [],
      },
    ]);
  };

  const removeDocumento = (index: number, id: string | null) => {
    setDeleteType("document");
    setDeleteId(id);
    setDeleteDocIndex(index);
    setConfirmDeleteOpen(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSubmitted(false);
    setMessage(null);
    // Resetear documentos al estado original si es edición
    initializeDocumentsFromOtherDocuments();
  };

  const initializeDocumentsFromOtherDocuments = () => {
    if (otherDocuments.length === 0) {
      setDocumentos([
        {
          id: null,
          otherDocumentId: null,
          nombre: "",
          entidad: "",
          fechaExpedicion: "",
          fechaVencimiento: "",
          observaciones: "",
          archivos: [],
        },
      ]);
    } else {
      const initialized = otherDocuments.map((item) => ({
        id: String(item.document.id),
        otherDocumentId: item.otherDocument.id,
        nombre: item.otherDocument.name,
        entidad: item.otherDocument.entity,
        fechaExpedicion: item.document.startDate,
        fechaVencimiento: item.document.endDate,
        observaciones: item.otherDocument.description,
        archivos: [] as File[],
        collectionId: item.document.documentCollectionId,
      }));
      setDocumentos(initialized);
      // Cargar nodos existentes
      initialized.forEach((doc) => {
        if (doc.collectionId) {
          loadNodes(doc.collectionId);
        }
      });
    }
  };

  // Inicializar documentos cuando se carguen los otherDocuments
  useEffect(() => {
    initializeDocumentsFromOtherDocuments();
  }, [otherDocuments]);

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Limpiar error después de 5 segundos
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);
    setSubmitted(true);

    for (const doc of documentos) {
      if (!doc.nombre || !doc.entidad) {
        setError("Todos los campos marcados con * son obligatorios.");
        setSaving(false);
        return;
      }
    }

    try {
      await uploadOtrosDocumentos({
        documentTypeId: 6, // ID para otros documentos
        vehicleId: String(_vehicleId),
        documents: documentos.map((doc) => ({
          id: Number(doc.id),
          otherDocumentId: doc.otherDocumentId,
          files: doc.archivos,
          name: doc.nombre,
          entity: doc.entidad,
          startDate: formatToDD_MM_YYYY(doc.fechaExpedicion) ?? doc.fechaExpedicion,
          expiredDate: doc.fechaVencimiento
            ? (formatToDD_MM_YYYY(doc.fechaVencimiento) ?? doc.fechaVencimiento)
            : undefined,
          description: doc.observaciones || undefined,
          collectionId: doc.collectionId,
        })),
      });
      setIsEditing(false);
      setMessage("Documentos guardados correctamente.");
      await refetch();
      initializeDocumentsFromOtherDocuments();
    } catch {
      setError("Error al guardar los documentos. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {deleteType === "node" && "¿Está seguro de que desea eliminar este archivo? Esta acción no se puede deshacer."}
            {deleteType === "document" && "¿Está seguro de que desea eliminar este documento? Esta acción no se puede deshacer."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)} sx={{ textTransform: "none" }}>
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              try {
                setDeleting(true);

                if (deleteType === "node" && deleteId) {
                  // Eliminar archivo (node) dentro de un documento
                  try {
                    await httpDelete(`/vehicledocument/nodes/${deleteId}`);
                  } catch {
                    // Ignore errors en caso de que sea 204 No Content
                  }
                  
                  setExistingNodes((prev) => {
                    const newMap = new Map(prev);
                    for (const [key, nodes] of newMap.entries()) {
                      newMap.set(key, nodes.filter((n) => n.nodeId !== deleteId));
                    }
                    return newMap;
                  });
                  setMessage("Archivo eliminado correctamente.");
                  setConfirmDeleteOpen(false);
                  setDeleting(false);
                  setDeleteType(null);
                  setDeleteId(null);
                  setDeleteDocIndex(null);
                  
                } else if (deleteType === "document" && deleteId && deleteDocIndex !== null) {
                  // Eliminar registro completo de vehicleDocument
                  try {
                    await httpDelete(`/vehicledocument/vehicledocument/${deleteId}`);
                  } catch {
                    // Ignore errors en caso de que sea 204 No Content
                  }
                  
                  // Cerrar dialog
                  setConfirmDeleteOpen(false);
                  
                  // Actualizar estado local
                  setDocumentos((prevDocs) => {
                    const updatedDocs = prevDocs.filter((_, idx) => idx !== deleteDocIndex);
                    return updatedDocs.length > 0 
                      ? updatedDocs
                      : [
                          {
                            id: null,
                            otherDocumentId: null,
                            nombre: "",
                            entidad: "",
                            fechaExpedicion: "",
                            fechaVencimiento: "",
                            observaciones: "",
                            archivos: [],
                          },
                        ];
                  });

                  setMessage("Documento eliminado correctamente.");
                  
                  // Resetear los estados
                  setDeleting(false);
                  setDeleteType(null);
                  setDeleteId(null);
                  setDeleteDocIndex(null);
                  
                  // Refrescar la data del hook
                  await refetch();
                }
              } catch {
                setError("No se pudo eliminar el elemento.");
                setConfirmDeleteOpen(false);
                setDeleting(false);
                setDeleteType(null);
                setDeleteId(null);
                setDeleteDocIndex(null);
              }
            }}
            color="error"
            variant="contained"
            disabled={deleting}
            sx={{ textTransform: "none" }}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>
      
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
          La digitalización de estos documentos es únicamente para fines de registro y no reemplaza los documentos originales, 
          los cuales deberán presentarse en caso de ser requeridos por las autoridades competentes. 
          Esta plataforma, únicamente las visibiliza, NO es responsable de lo que la fuente de información emita
        </Typography>
      </Paper>

      {loadingError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadingError}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {documentos.map((doc, docIndex) => (
        <Paper
          key={docIndex}
          sx={{
            p: 2.5,
            mb: 3,
            bgcolor: theme.palette.background.paper,
            borderRadius: 2,
            border: `1px solid ${borderColor}`,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              Documento {docIndex + 1}
            </Typography>
            {isEditing && documentos.length > 1 && (
              <IconButton
                onClick={() => removeDocumento(docIndex, doc.id)}
                sx={{
                  color: theme.palette.error.main,
                  "&:hover": {
                    bgcolor: theme.palette.error.light,
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Nombre / Título *"
                value={doc.nombre}
                variant="outlined"
                size="small"
                required
                disabled={!isEditing}
                error={submitted && !doc.nombre}
                onChange={(e) =>
                  handleInputChange(docIndex, "nombre", e.target.value)
                }
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
                label="Entidad (quien expide) *"
                value={doc.entidad}
                variant="outlined"
                size="small"
                required
                disabled={!isEditing}
                error={submitted && !doc.entidad}
                onChange={(e) =>
                  handleInputChange(docIndex, "entidad", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField
                fullWidth
                label="Fecha expedición"
                value={doc.fechaExpedicion}
                variant="outlined"
                size="small"
                required
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(docIndex, "fechaExpedicion", e.target.value)
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DateField
                fullWidth
                label="Fecha vencimiento"
                value={doc.fechaVencimiento}
                variant="outlined"
                size="small"
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(
                    docIndex,
                    "fechaVencimiento",
                    e.target.value,
                  )
                }
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Observaciones / especificaciones"
                value={doc.observaciones}
                variant="outlined"
                multiline
                rows={3}
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(docIndex, "observaciones", e.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 1.5,
              }}
            >
              Archivos
            </Typography>

            {doc.collectionId && existingNodes.get(doc.collectionId)?.map((node) => (
              <Box
                key={node.nodeId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.25,
                  borderRadius: 1,
                  border: `1px solid ${borderColor}`,
                  bgcolor: theme.palette.action.hover,
                  mb: 1,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                  <DescriptionIcon
                    sx={{ color: theme.palette.text.secondary, fontSize: "1.25rem" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: theme.palette.text.primary,
                    }}
                  >
                    {node.name}
                  </Typography>
                </Box>
                {isEditing && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveNode(node.nodeId)}
                    sx={{
                      color: theme.palette.text.secondary,
                      "&:hover": {
                        bgcolor: theme.palette.error.light,
                        color: theme.palette.error.main,
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}

            {isEditing && (
              <>
                <input
                  id={`add-files-${docIndex}`}
                  type="file"
                  multiple
                  accept="application/pdf,image/*"
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(docIndex, e)}
                />
                <Button
                  component="label"
                  htmlFor={`add-files-${docIndex}`}
                  variant="outlined"
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{
                    mb: 2,
                    textTransform: "none",
                    borderColor: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
                    color: theme.palette.mode === "dark" ? theme.palette.primary.light : theme.palette.primary.dark,
                    "&:hover": {
                      borderColor: theme.palette.primary.light,
                      color: theme.palette.primary.light,
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Agregar archivos ({doc.archivos.length}/2)
                </Button>
                {doc.archivos.length >= 2 && (
                  <Typography
                    sx={{
                      fontSize: "0.75rem",
                      color: theme.palette.text.secondary,
                      mb: 2,
                    }}
                  >
                    Máximo 2 archivos por documento
                  </Typography>
                )}
              </>
            )}

            {doc.archivos && doc.archivos.length > 0 && (
              <Box>
                {doc.archivos.map((file, fileIndex) => (
                  <Box
                    key={fileIndex}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      p: 1.25,
                      borderRadius: 1,
                      border: `1px solid ${borderColor}`,
                      bgcolor: theme.palette.action.hover,
                      mb: 1,
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 1.25 }}
                    >
                      <DescriptionIcon
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "1.25rem",
                        }}
                      />
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "0.95rem",
                            fontWeight: 500,
                            color: theme.palette.text.primary,
                          }}
                        >
                          {file.name}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: "0.75rem",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {(file.size / 1024).toFixed(1)} KB
                        </Typography>
                      </Box>
                    </Box>
                    {isEditing && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveFile(docIndex, fileIndex)}
                        sx={{
                          color: theme.palette.text.secondary,
                          "&:hover": {
                            bgcolor: theme.palette.error.light,
                            color: theme.palette.error.main,
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {doc.archivos.length === 0 && !(doc.collectionId && (existingNodes.get(doc.collectionId)?.length ?? 0) > 0) && (
              <Typography
                sx={{
                  fontSize: "0.9rem",
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                  mb: 2,
                }}
              >
                Sin archivos adjuntos
              </Typography>
            )}
          </Box>
        </Paper>
      ))}

      {isEditing && (
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addDocumento}
            sx={{
              textTransform: "none",
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.secondary,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Agregar otro documento
          </Button>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 1,
        }}
      >
        {isEditing && (
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            disabled={saving}
            sx={{
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.primary,
                bgcolor: theme.palette.action.hover,
              },
            }}
          >
            Cancelar
          </Button>
        )}
        <Button
          variant="contained"
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
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
          disabled={saving}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
        </Button>
      </Box>
    </>
  );
}
