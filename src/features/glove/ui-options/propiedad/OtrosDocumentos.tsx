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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import { useState } from "react";

interface Document {
  id: string | null;
  nombre: string;
  entidad: string;
  fechaExpedicion: string;
  fechaVencimiento: string;
  observaciones: string;
  archivos: File[];
}

export interface OtrosDocumentosProps {
  plate: string;
}

export function OtrosDocumentos({ plate: _plate }: Readonly<OtrosDocumentosProps>) {
  const theme = useTheme();
  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [documentos, setDocumentos] = useState<Document[]>([
    {
      id: null,
      nombre: "",
      entidad: "",
      fechaExpedicion: "",
      fechaVencimiento: "",
      observaciones: "",
      archivos: [],
    },
  ]);

  const handleInputChange = (index: number, field: keyof Document, value: string) => {
    const nuevosDocumentos = [...documentos];
    (nuevosDocumentos[index][field] as any) = value;
    setDocumentos(nuevosDocumentos);
  };

  const handleFileChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const nuevosDocumentos = [...documentos];
    const selectedFiles = Array.from(event.target.files || []);
    const maxFiles = 2;
    
    if ((nuevosDocumentos[index].archivos?.length || 0) + selectedFiles.length > maxFiles) {
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
    nuevosDocumentos[docIndex].archivos = nuevosDocumentos[docIndex].archivos.filter(
      (_, idx) => idx !== fileIndex
    );
    setDocumentos(nuevosDocumentos);
  };

  const addDocumento = () => {
    setDocumentos([
      ...documentos,
      {
        id: null,
        nombre: "",
        entidad: "",
        fechaExpedicion: "",
        fechaVencimiento: "",
        observaciones: "",
        archivos: [],
      },
    ]);
  };

  const removeDocumento = (index: number) => {
    if (documentos.length > 1) {
      setDocumentos(documentos.filter((_, idx) => idx !== index));
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setMessage(null);

    for (const doc of documentos) {
      if (!doc.nombre || !doc.entidad || !doc.fechaExpedicion) {
        setError("Todos los campos marcados con * son obligatorios.");
        setSaving(false);
        return;
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    setIsEditing(false);
    setMessage("Documentos guardados correctamente.");
  };


  return (
    <>
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
                onClick={() => removeDocumento(docIndex)}
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
                onChange={(e) => handleInputChange(docIndex, "nombre", e.target.value)}
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
                onChange={(e) => handleInputChange(docIndex, "entidad", e.target.value)}
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
                label="Fecha expedición *"
                type="date"
                value={doc.fechaExpedicion}
                variant="outlined"
                size="small"
                required
                disabled={!isEditing}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleInputChange(docIndex, "fechaExpedicion", e.target.value)}
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
                label="Fecha vencimiento"
                type="date"
                value={doc.fechaVencimiento}
                variant="outlined"
                size="small"
                disabled={!isEditing}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleInputChange(docIndex, "fechaVencimiento", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.primary,
                  },
                }}
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
                onChange={(e) => handleInputChange(docIndex, "observaciones", e.target.value)}
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
                    borderColor: theme.palette.primary.light,
                    color: theme.palette.primary.light,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      bgcolor: `${theme.palette.primary.light}20`,
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                      <DescriptionIcon
                        sx={{ color: theme.palette.text.secondary, fontSize: "1.25rem" }}
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
                          {((file.size / 1024).toFixed(1))} KB
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

            {doc.archivos.length === 0 && (
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

      <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 1 }}>
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
          disabled={saving}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
        </Button>
      </Box>
    </>
  );
}
