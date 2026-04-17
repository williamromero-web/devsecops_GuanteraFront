import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { useState, useEffect } from "react";
import { useGuanteraConfig } from "../../providers/GuanteraProvider";
import { DocumentUploadCard } from "../../../../shared/ui/molecules";
import { DateField } from "../../../../shared/ui/atoms";
import { httpDelete, httpGet, httpPut, httpPutForm } from "../../lib/httpClient";
import { getVehicleDocumentNodes, type VehicleDocumentNode } from "../../services/propertyCardService";
import { computeExpiryStatus } from "../../lib/expiryStatus";

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
  id: string | null;
  categoryType: TipoCategoria | "";
  expiredDate: string;
}

interface DriverLicenseApiData {
  id: number;
  documentCollectionId?: string | null;
  categories?: CategoriaLicencia[];
}

interface DriverLicenseApiResponse {
  success: boolean;
  data?: DriverLicenseApiData;
}

export interface LicenciaConduccionProps {
  plate: string;
  vehicleId: number;
}

export function LicenciaConduccion({
  plate,
  vehicleId,
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
  const [documentCollectionId, setDocumentCollectionId] = useState<string>("");
  const [documentNodes, setDocumentNodes] = useState<VehicleDocumentNode[]>([]);
  const [nodeFiles, setNodeFiles] = useState<Record<string, { hasFile: boolean; fileName: string; fileSizeLabel?: string }>>({});
  const [licenseId, setLicesnseId] = useState<number | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { userProfile } = useGuanteraConfig();
  
  const [licenciaNumero, setLicenciaNumero] = useState(
    userProfile?.licenseNumber ?? ""
  );
  const [nombres, setNombres] = useState(userProfile?.firstName ?? "");
  const [apellidos, setApellidos] = useState(userProfile?.lastName ?? "");
  const [categorias, setCategorias] = useState<CategoriaLicencia[]>([
    // { id: crypto.randomUUID(), categoryType: "", expiredDate: "" },
  ]);

  const currentState = {
    licenciaNumero,
    nombres,
    apellidos,
    categorias,
  };

  const loadDocumentNodes = async (collectionId: string) => {
    const nodes = await getVehicleDocumentNodes(collectionId);
    setDocumentNodes(nodes);

    const files: Record<string, { hasFile: boolean; fileName: string; fileSizeLabel?: string }> = {};
    nodes.forEach((node) => {
      files[node.nodeId] = {
        hasFile: true,
        fileName: node.name,
      };
    });
    setNodeFiles(files);
  };

  const fetchLicenseData = async (
    options?: { silent?: boolean },
  ): Promise<DriverLicenseApiData | null> => {
    if (!licenciaNumero) return null;

    try {
      const data = await httpGet<DriverLicenseApiResponse>(
        `/driverlicense/${licenciaNumero}`,
      );
      if (data.success && data.data) {
        const licenseData = data.data;
        setLicesnseId(licenseData.id);
        setDocumentCollectionId(licenseData.documentCollectionId ?? "");

        // Map categories from API response
        if (licenseData.categories && Array.isArray(licenseData.categories)) {
          const mappedCategories = licenseData.categories.map((cat) => ({
            id: cat.id,
            categoryType: (cat.categoryType || "") as TipoCategoria | "",
            expiredDate: cat.expiredDate || "",
          }));
          setCategorias(mappedCategories);
        }

        return licenseData;
      }

      return null;
    } catch (err) {
      console.error("Error fetching driving license data:", err);
      if (!options?.silent) {
        setError("Error al cargar los datos de la licencia de conducción");
      }
      return null;
    }
  };

  // Fetch driving license data
  useEffect(() => {
    fetchLicenseData();
  }, [licenciaNumero]);

  // Load document nodes when collection ID is available
  useEffect(() => {
    const loadNodes = async () => {
      if (documentCollectionId) {
        try {
          await loadDocumentNodes(documentCollectionId);
        } catch (err) {
          console.error("Error loading document nodes:", err);
        }
      } else {
        setDocumentNodes([]);
        setNodeFiles({});
      }
    };

    loadNodes();
  }, [documentCollectionId]);

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

      const payload = {
        driverLinceCategories: categorias
          .filter(cat => cat.categoryType && cat.expiredDate)
          .map(cat => ({
            // temp-* IDs are new categories → send null so backend creates them
            ID: cat.id?.startsWith("temp-") ? null : cat.id,
            name: cat.categoryType,
            expiredDate: cat.expiredDate,
          })),
      };

      await httpPut(`/driverlicense/driverlicense/${licenseId}`, payload);

      setIsEditing(false);
      setMessage("Información de la licencia guardada correctamente.");
    } catch (e) {
      console.error("No se pudo guardar la licencia de conducción:", e);
      setError("No se pudo guardar la información de la licencia.");
    } finally {
      setSaving(false);
    }
  };

  const disabledFields = !isEditing || saving;

  const handleCategoriaChange = (
    id: string | null,
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
      { id: `temp-${crypto.randomUUID()}`, categoryType: "", expiredDate: "" },
    ]);
  };

  const handleRemoveCategoria = (id: string | null) => {
    setDeleteId(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const isTempId = deleteId?.startsWith("temp-") ?? false;

    try {
      setConfirmDeleteOpen(false);

      // Only call backend delete if it's not a temp (not-yet-saved) category
      if (!isTempId) {
        try {
          await httpDelete(`/driverlicensecategory/category/${deleteId}`);
        } catch {
          // Ignore delete errors to keep UX resilient
        }
      }

      setCategorias((prev) => prev.filter((cat) => cat.id !== deleteId));
      setMessage("Categoría eliminada correctamente.");
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("No se pudo eliminar la categoría.");
    } finally {
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false);
    setDeleteId(null);
  };

  const handleSaveNode = async (
    fileSide: "Front" | "Reverse",
    file: File,
    nodeId?: string,
  ) => {
    try {
      setError(null);
      if (!licenseId) {
        setError("No se encontró la licencia para asociar el documento.");
        return;
      }

      const formData = new FormData();
      formData.append(`file${fileSide}`, file);
      if (documentCollectionId) {
        formData.append("collectionId", documentCollectionId);
      }
      
      await httpPutForm(`/driverlicense/upload/${licenseId}`, formData);

      // Si no existía colección/nodos, refrescamos para obtenerlos y asociar nodeId reales.
      const refreshedLicense = await fetchLicenseData();
      const collectionIdToUse =
        refreshedLicense?.documentCollectionId ?? documentCollectionId;
      if (collectionIdToUse) {
        await loadDocumentNodes(collectionIdToUse);
      }

      // Update nodeFiles state (cuando ya conocemos el nodeId del documento)
      if (nodeId) {
        setNodeFiles((prev) => ({
          ...prev,
          [nodeId]: {
            hasFile: true,
            fileName: file.name,
            fileSizeLabel: `${(file.size / 1024).toFixed(1)} KB`,
          },
        }));
      }

      setMessage("Archivo cargado correctamente");
    } catch (err) {
      console.error(`Error uploading file Placa: ${plate}, Vehículo: ${vehicleId}):`, err);
      setError("Error al cargar el archivo");
    }
  };

  const refreshDocumentsState = async () => {
    try {
      const refreshedLicense = await fetchLicenseData({ silent: true });
      const collectionIdToUse =
        refreshedLicense?.documentCollectionId ?? documentCollectionId;

      if (collectionIdToUse) {
        await loadDocumentNodes(collectionIdToUse);
      } else {
        setDocumentNodes([]);
        setNodeFiles({});
      }
    } catch (err) {
      // No romper la UX cuando el backend no tiene nodos para listar.
      console.warn("No se pudieron refrescar los nodos de documentos:", err);
      setDocumentNodes([]);
      setNodeFiles({});
    }
  };

  const handleSaveFrontNode = async (file: File) => {
    await handleSaveNode("Front", file, documentNodes[0]?.nodeId);
  };

  const handleSaveBackNode = async (file: File) => {
    await handleSaveNode("Reverse", file, documentNodes[1]?.nodeId);
  };

  const handleDeleteFrontNode = async () => {
    const nodeId = documentNodes[0]?.nodeId;
    if (!nodeId) return;

    setNodeFiles((prev) => ({
      ...prev,
      [nodeId]: {
        hasFile: false,
        fileName: "Sin archivo",
      },
    }));

    await refreshDocumentsState();
    setError(null);
    setMessage("Archivo eliminado correctamente");
  };

  const handleDeleteBackNode = async () => {
    const nodeId = documentNodes[1]?.nodeId;
    if (!nodeId) return;

    setNodeFiles((prev) => ({
      ...prev,
      [nodeId]: {
        hasFile: false,
        fileName: "Sin archivo",
      },
    }));

    await refreshDocumentsState();
    setError(null);
    setMessage("Archivo eliminado correctamente");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
                  sx={{
                    borderColor: theme.palette.text.secondary,
                    color: theme.palette.text.secondary,
                    textTransform: "none",
                    "&:hover": { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                  sx={{
                    bgcolor: theme.palette.mode === "dark" ? theme.palette.primary.main : theme.palette.primary.dark,
                    color: "#FFFFFF",
                    "&:hover": { bgcolor: theme.palette.primary.light, color: "#181818" },
                    textTransform: "none",
                  }}
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
                sx={{
                  borderColor: theme.palette.text.secondary,
                  color: theme.palette.text.secondary,
                  textTransform: "none",
                  "&:hover": { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
                }}
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
              label="Nombres"
              value={nombres}
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
              label="Apellidos"
              value={apellidos}
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

        <Divider sx={{ mt: 2, mb: 2 }} />

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
          {categorias.map((cat, index) => {
            const catStatus = computeExpiryStatus(cat.expiredDate);
            const catChip = catStatus === "OK"
              ? { label: "VIGENTE", icon: CheckCircleIcon, color: "success" as const }
              : catStatus === "PRÓXIMO A VENCER"
                ? { label: "PRÓXIMO A VENCER", icon: WarningIcon, color: "warning" as const }
                : catStatus === "VENCIDO"
                  ? { label: "VENCIDO", icon: ErrorIcon, color: "error" as const }
                  : null;

            // Use stable key: id if exists, otherwise a unique index-based key
            const catKey = cat.id ?? `new-cat-${index}`;

            return (
            <Paper
              key={catKey}
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
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Typography
                    sx={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Categoría {index + 1}
                  </Typography>
                  {catChip && (
                    <Chip
                      icon={<catChip.icon sx={{ fontSize: "1rem !important" }} />}
                      label={catChip.label}
                      color={catChip.color}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: "0.75rem", height: 24, borderRadius: "12px" }}
                    />
                  )}
                </Box>
                {!disabledFields && (
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveCategoria(cat.id)}
                    disabled={saving}
                    sx={{ color: theme.palette.text.secondary }}
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
                      value={cat.categoryType}
                      label="Tipo de categoría"
                      onChange={(e) =>
                        handleCategoriaChange(
                          cat.id,
                          "categoryType",
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
                  <DateField
                    fullWidth
                    label="Fecha de vigencia"
                    value={cat.expiredDate}
                    onChange={(e) =>
                      handleCategoriaChange(
                        cat.id,
                        "expiredDate",
                        e.target.value,
                      )
                    }
                    size="small"
                    disabled={disabledFields}
                  />
                </Grid>
              </Grid>
            </Paper>
            );
          })}
        </Box>

        <Divider sx={{ mt: 2, mb: 2 }} />

        <Typography
          sx={{
            fontSize: "0.875rem",
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Adjuntar licencia de conducción (opcional)
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>

                  {/* Front face */}
                  {documentNodes[0] ? (
                    <DocumentUploadCard
                      key={documentNodes[0].nodeId}
                      instruction={`Cara frontal — Adjunte aquí la cara frontal de la licencia de conducción.`}
                      hasFile={nodeFiles[documentNodes[0].nodeId]?.hasFile ?? false}
                      fileName={nodeFiles[documentNodes[0].nodeId]?.fileName ?? documentNodes[0].name}
                      fileSizeLabel={nodeFiles[documentNodes[0].nodeId]?.fileSizeLabel}
                      nodeId={nodeFiles[documentNodes[0].nodeId]?.hasFile ? documentNodes[0].nodeId : undefined}
                      onDelete={handleDeleteFrontNode}
                      onSave={handleSaveFrontNode}
                    />
                  ) : (
                    <DocumentUploadCard
                      instruction={`Cara frontal — Adjunte aquí la cara frontal de la licencia de conducción.`}
                      hasFile={false}
                      fileName="Sin archivo"
                      onSave={handleSaveFrontNode}
                    />
                  )}
                </Grid>
          
                <Grid size={{ xs: 12, sm: 6 }}>
                  {/* Back face */}
                  {documentNodes[1] ? (
                    <DocumentUploadCard
                      key={documentNodes[1].nodeId}
                      instruction={`Cara trasera — Adjunte aquí la cara trasera de la licencia de conducción.`}
                      hasFile={nodeFiles[documentNodes[1].nodeId]?.hasFile ?? false}
                      fileName={nodeFiles[documentNodes[1].nodeId]?.fileName ?? documentNodes[1].name}
                      fileSizeLabel={nodeFiles[documentNodes[1].nodeId]?.fileSizeLabel}
                      nodeId={nodeFiles[documentNodes[1].nodeId]?.hasFile ? documentNodes[1].nodeId : undefined}
                      onDelete={handleDeleteBackNode}
                      onSave={handleSaveBackNode}
                    />
                  ) : (
                    <DocumentUploadCard
                      instruction={`Cara trasera — Adjunte aquí la cara trasera de la licencia de conducción.`}
                      hasFile={false}
                      fileName="Sin archivo"
                      onSave={handleSaveBackNode}
                    />
                  )}
                </Grid>
              </Grid>
          </Box>
        {!disabledFields && (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleAddCategoria}
            disabled={saving}
            sx={{
              mt: 2,
              textTransform: "none",
              borderColor: theme.palette.text.secondary,
              color: theme.palette.text.secondary,
              "&:hover": { borderColor: theme.palette.text.primary, color: theme.palette.text.primary },
            }}
          >
            Agregar otra categoría
          </Button>
        )}

      </Paper>

      {/* Confirmation Delete Dialog */}
      <Dialog open={confirmDeleteOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} variant="outlined" sx={{ textTransform: "none", borderColor: theme.palette.text.secondary, color: theme.palette.text.secondary }}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
