import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";

export interface DeclaracionImportacionProps {
  plate: string;
}

export function DeclaracionImportacion({
  plate,
}: Readonly<DeclaracionImportacionProps>) {
  const theme = useTheme();
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState("Sin archivo");
  const [fileSizeLabel, setFileSizeLabel] = useState("0 KB");

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
    setMessage("Archivo guardado correctamente (mock).");
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

      <Paper
        sx={{
          p: 2,
          bgcolor: theme.palette.background.paper,
          borderRadius: 2,
          border: `1px solid ${theme.palette.border.main}`,
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
            Adjuntar declaración de importación
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
            instruction={`Adjunte aquí la declaración de importación del vehículo (Placa: ${plate}).`}
            hasFile={hasFile}
            fileName={fileName}
            fileSizeLabel={fileSizeLabel}
            onView={() =>
              setMessage(
                "Vista previa (mock): aquí se abriría la declaración desde la API.",
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
              borderColor: theme.palette.border.main,
              color: theme.palette.text.secondary,
              fontWeight: 600,
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              "&:hover": {
                borderColor: theme.palette.text.secondary,
                bgcolor: theme.palette.surface.alt,
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
