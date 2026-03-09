import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useState } from "react";
import { getStoredLicenseNumber } from "../../../../shared/lib";

const TipoCategoria = {
  A1: "A1",
  A2: "A2",
  B1: "B1",
  B2: "B2",
  B3: "B3",
  C1: "C1",
  C2: "C2",
  C3: "C3",
} as const;

type TipoCategoria = (typeof TipoCategoria)[keyof typeof TipoCategoria];

interface CategoriaLicencia {
  id: string;
  tipoCategoria: TipoCategoria | "";
  fechaVigencia: string;
}

export interface LicenciaConduccionProps {
  plate: string;
}

export function LicenciaConduccion({
  plate: _plate,
}: Readonly<LicenciaConduccionProps>) {
  const theme = useTheme();

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [licenciaNumero, setLicenciaNumero] = useState(
    () => getStoredLicenseNumber() ?? "",
  );
  const [nombres, setNombres] = useState("PEPITO");
  const [apellidos, setApellidos] = useState("PEREZ");
  const [categorias, setCategorias] = useState<CategoriaLicencia[]>([
    { id: crypto.randomUUID(), tipoCategoria: "", fechaVigencia: "" },
  ]);

  const currentState = {
    licenciaNumero,
    nombres,
    apellidos,
    categorias,
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLicenciaNumero(currentState.licenciaNumero);
    setNombres(currentState.nombres);
    setApellidos(currentState.apellidos);
    setCategorias(currentState.categorias);
    setError(null);
    setMessage(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      // TODO: integrar con API real de licencia cuando exista
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsEditing(false);
      setMessage("Información de la licencia guardada correctamente (mock).");
    } catch (e) {
      console.error("No se pudo guardar la licencia de conducción:", e);
      setError("No se pudo guardar la información de la licencia.");
    } finally {
      setSaving(false);
    }
  };

  const disabledFields = !isEditing || saving;

  const handleCategoriaChange = (
    id: string,
    field: keyof Omit<CategoriaLicencia, "id">,
    value: string,
  ) => {
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, [field]: value } : cat)),
    );
  };

  const handleAddCategoria = () => {
    setCategorias((prev) => [
      ...prev,
      { id: crypto.randomUUID(), tipoCategoria: "", fechaVigencia: "" },
    ]);
  };

  const handleRemoveCategoria = (id: string) => {
    setCategorias((prev) => prev.filter((cat) => cat.id !== id));
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

      {/* Banner informativo */}
      <Paper
        sx={{
          p: 2,
          bgcolor: surfaceAlt,
          borderRadius: 2,
          border: `1px solid ${borderColor}`,
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
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
          La digitalización de estos documentos es únicamente para fines de
          registro y no reemplaza los documentos originales, los cuales deberán
          presentarse en caso de ser requeridos por las autoridades competentes.
        </Typography>
      </Paper>

      {/* Formulario principal */}
      <Paper
        sx={{
          p: 2,
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
              fontSize: "1rem",
              fontWeight: 800,
              color: theme.palette.text.primary,
            }}
          >
            Información de tu licencia de conducción
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {isEditing ? (
              <>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  Guardar
                </Button>
              </>
            ) : (
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Licencia número"
              value={licenciaNumero}
              onChange={(e) => setLicenciaNumero(e.target.value)}
              size="small"
              disabled={disabledFields}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Nombres"
              value={nombres}
              onChange={(e) => setNombres(e.target.value)}
              size="small"
              disabled={disabledFields}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              size="small"
              disabled={disabledFields}
            />
          </Grid>
        </Grid>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Categorías
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {categorias.map((cat, index) => (
            <Paper
              key={cat.id}
              variant="outlined"
              sx={{ p: 2, borderColor, borderRadius: 2 }}
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
                    fontSize: "0.875rem",
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                  }}
                >
                  Categoría {index + 1}
                </Typography>
                {!disabledFields && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveCategoria(cat.id)}
                    disabled={saving}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth size="small" disabled={disabledFields}>
                    <InputLabel>Tipo de categoría</InputLabel>
                    <Select
                      value={cat.tipoCategoria}
                      label="Tipo de categoría"
                      onChange={(e) =>
                        handleCategoriaChange(
                          cat.id,
                          "tipoCategoria",
                          e.target.value,
                        )
                      }
                    >
                      {Object.values(TipoCategoria).map((tipo) => (
                        <MenuItem key={tipo} value={tipo}>
                          {tipo}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Fecha de vigencia"
                    type="date"
                    value={cat.fechaVigencia}
                    onChange={(e) =>
                      handleCategoriaChange(
                        cat.id,
                        "fechaVigencia",
                        e.target.value,
                      )
                    }
                    size="small"
                    disabled={disabledFields}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>

        {!disabledFields && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAddCategoria}
            disabled={saving}
            sx={{ mt: 2 }}
          >
            Agregar otra categoría
          </Button>
        )}

      </Paper>
    </Box>
  );
}
