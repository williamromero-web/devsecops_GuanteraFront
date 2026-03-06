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
import { useState } from "react";
import { DocumentUploadCard } from "../../../../shared/ui/molecules/DocumentUploadCard";
import { useSoat } from "../../hooks/useSoat";
import {
  uploadDocument,
  formatDateToDD_MM_YYYY,
  formatToDD_MM_YYYY,
} from "../../services/documentUpload";

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

  // Load SOAT data using hook
  const soat = useSoat(plate);

  const getStatusInfo = () => {
    return {
      title: "SOAT",
      message: "Below is the policy information:",
      chip: null,
    };
  };

  const statusInfo = getStatusInfo();

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
    setMessage("Information and file saved successfully (mock).");
  };

  const handleSaveDocument = async (file: File) => {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      if (!vehicleIdProp) {
        throw new Error("Vehicle ID not available.");
      }

      // Dates in DD-MM-YYYY format
      const today = new Date();
      const startDate = formatDateToDD_MM_YYYY(today);

      // Expiration date: extract from current state if available
      let expiredDate = startDate;
      if (soat.expirationDate) {
        const formatted = formatToDD_MM_YYYY(soat.expirationDate);
        if (formatted) {
          expiredDate = formatted;
        }
      }

      // SOAT-specific metadata
      const metadata: Record<string, string | number | null | undefined> = {};

      // Use the service to upload the document
      await uploadDocument({
        documentTypeId: 3, // SOAT
        vehicleId: vehicleIdProp,
        file,
        startDate,
        expiredDate,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });

      setMessage("File saved successfully.");
    } catch (err: any) {
      setError(
        err.message ||
          "Error saving file. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {soat.error || error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {soat.error || error}
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
            SOAT Information
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
                label="Policy Number"
                value={soat.number}
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
                label="Expiration Date"
                value={soat.expirationDate}
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
            Attach SOAT
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
            instruction={`Attach the SOAT document for the vehicle (License plate: ${plate}).`}
            hasFile={!!soat.file}
            fileName={soat.file?.fileName || "soat.pdf"}
            fileSizeLabel={soat.file?.size ? `${(soat.file.size / 1024).toFixed(1)} KB` : ""}
            onView={() =>
              setMessage(
                "Preview (mock): SOAT would open from API here.",
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
      </Box>
    </Box>
  );
}
