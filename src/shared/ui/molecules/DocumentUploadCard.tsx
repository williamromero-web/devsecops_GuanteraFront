import { useMemo, useRef, useState } from "react";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";

export interface DocumentUploadCardProps {
  instruction: string;

  fileName: string;

  fileSizeLabel?: string;

  hasFile: boolean;
  accept?: string;
  /** Límite en bytes (default 5MB). */
  maxBytes?: number;

  onView?: () => void;

  /**
   * Callback cuando se guarda. Se invoca con el archivo seleccionado.
   * En Fase 8 se conectará a uploadDocument + refetch.
   */
  onSave?: (file: File) => Promise<void> | void;
  saveLabel?: string;

  updateLabel?: string;

  sx?: SxProps<Theme>;
}

function bytesToLabel(bytes: number) {
  const kb = bytes / 1024;
  if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
  return `${kb.toFixed(1)} KB`;
}

export function DocumentUploadCard({
  instruction,
  fileName,
  fileSizeLabel,
  hasFile,
  accept = "application/pdf,image/*",
  maxBytes = 5 * 1024 * 1024,
  onView,
  onSave,
  saveLabel = "Guardar",
  updateLabel = "Actualizar",
  sx,
}: Readonly<DocumentUploadCardProps>) {
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const effectiveName = useMemo(() => {
    if (selectedFile) return selectedFile.name;
    return hasFile ? fileName : "Sin archivo";
  }, [fileName, hasFile, selectedFile]);

  const effectiveSize = useMemo(() => {
    if (selectedFile) return bytesToLabel(selectedFile.size);
    if (fileSizeLabel) return fileSizeLabel;
    return hasFile ? "" : "0 KB";
  }, [fileSizeLabel, hasFile, selectedFile]);

  const handlePickFile = () => {
    inputRef.current?.click();
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setLocalError(null);
  };

  const handleSave = async () => {
    if (!selectedFile || !onSave) {
      setIsEditing(false);
      return;
    }
    try {
      setSaving(true);
      setLocalError(null);
      await onSave(selectedFile);
      setIsEditing(false);
      setSelectedFile(null);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "No se pudo guardar el documento";
      setLocalError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={sx}>
      {localError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {localError}
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
        <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start", gap: 1 }}>
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: theme.palette.text.secondary,
              flex: 1,
            }}
          >
            {instruction}
          </Typography>
          <IconButton
            size="small"
            sx={{ color: theme.palette.text.tertiary }}
            aria-label="Ayuda"
          >
            <HelpOutlineIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 1.5,
            borderRadius: 1,
            border: `1px solid ${theme.palette.border.main}`,
            bgcolor: theme.palette.surface.alt,
            mb: 2,
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <DescriptionIcon
              sx={{ color: theme.palette.text.tertiary, fontSize: "1.5rem" }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: theme.palette.text.primary,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {effectiveName}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                }}
              >
                {effectiveSize}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
            {isEditing ? (
              <>
                <IconButton
                  size="small"
                  onClick={handleCancel}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.error.main },
                  }}
                  aria-label="Cancelar"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={handleSave}
                  disabled={!selectedFile || saving || !onSave}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.success.main },
                  }}
                  aria-label="Guardar"
                >
                  <SaveIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  size="small"
                  disabled={!hasFile || !onView}
                  onClick={onView}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.primary.light },
                  }}
                  aria-label="Ver"
                >
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => setIsEditing(true)}
                  sx={{
                    color: theme.palette.text.secondary,
                    "&:hover": { color: theme.palette.primary.light },
                  }}
                  aria-label="Editar"
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0] ?? null;
            if (!file) return;
            if (file.size > maxBytes) {
              setLocalError(
                `El archivo supera el límite de ${bytesToLabel(maxBytes)}.`,
              );
              setSelectedFile(null);
              e.target.value = "";
              return;
            }
            setLocalError(null);
            setSelectedFile(file);
          }}
        />

        {isEditing ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Button
              onClick={handlePickFile}
              size="small"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ textTransform: "none" }}
            >
              {updateLabel}
            </Button>
            <Button
              onClick={handleCancel}
              size="small"
              variant="text"
              sx={{
                textTransform: "none",
                color: theme.palette.text.secondary,
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              size="small"
              variant="contained"
              disabled={!selectedFile || saving || !onSave}
              startIcon={<SaveIcon />}
              sx={{ textTransform: "none" }}
            >
              {saveLabel}
            </Button>
          </Box>
        ) : null}
      </Paper>
    </Box>
  );
}
