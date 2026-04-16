import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  type SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useState } from "react";
import { useMunicipalities } from "../../hooks/useMunicipalities";
import { usePyp } from "../../hooks/usePyp";
import type { PypData } from "../../services/pypService";
import { PicoYPlacaCalendarModal } from "./PicoYPlacaCalendarModal";

interface InfoPanelProps {
  title: string;
  plate: string;
  municipalityCode?: string;
  data: PypData | null;
  isLoading: boolean;
  onDelete?: () => void;
}

function InfoPanel({ title, plate, municipalityCode, data, isLoading, onDelete }: Readonly<InfoPanelProps>) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  const ultimoDigito = plate ? plate.slice(-1) : "-";
  const lastDigitNum = parseInt(ultimoDigito, 10);
  const puedeCircular =
    data?.notApplicable === true ||
    (data !== null &&
      !isNaN(lastDigitNum) &&
      !data?.cannotCirculateToday.includes(lastDigitNum));
  const ciudad = data?.city ?? "-";
  const digitosRestriccion =
    data && data.cannotCirculateToday.length > 0
      ? data.cannotCirculateToday.join(", ")
      : "Ninguno";
  const franjaHoraria = data ? `${data.startTime} - ${data.endTime}` : "-";
  const descripcion = data?.description ?? "";

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        position: "relative",
      }}
    >
      {onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            color: theme.palette.text.secondary,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography
          sx={{
            fontSize: "1rem",
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
        {isLoading ? (
          <CircularProgress size={20} />
        ) : (
          data &&
          (puedeCircular ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="PUEDE CIRCULAR"
              color="success"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                height: 32,
                borderRadius: "16px",
              }}
            />
          ) : (
            <Chip
              icon={<CancelIcon />}
              label="NO PUEDE CIRCULAR"
              color="error"
              sx={{
                fontWeight: 600,
                fontSize: "0.875rem",
                height: 32,
                borderRadius: "16px",
              }}
            />
          ))
        )}
      </Box>

      <Box
        onClick={() => setExpanded(!expanded)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: expanded ? 2 : 0,
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
          Detalles de restricción
        </Typography>
        {expanded ? (
          <ExpandLessIcon
            sx={{ fontSize: "1.25rem", color: theme.palette.text.secondary }}
          />
        ) : (
          <ExpandMoreIcon
            sx={{ fontSize: "1.25rem", color: theme.palette.text.secondary }}
          />
        )}
      </Box>

      {expanded && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Último dígito de placa"
              value={ultimoDigito}
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
              label="Ciudad"
              value={ciudad}
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
              label="Dígitos restringidos hoy"
              value={digitosRestriccion}
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
              label="Franja horaria"
              value={franjaHoraria}
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
          {descripcion && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Descripción"
                value={descripcion}
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
          )}
        </Grid>
      )}

      {data && (
        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Chip
            icon={<CalendarTodayIcon />}
            label="Ver calendario"
            onClick={() => setCalendarOpen(true)}
            variant="outlined"
            sx={{
              fontWeight: 600,
              fontSize: "0.875rem",
              borderRadius: "16px",
              cursor: "pointer",
            }}
          />
        </Box>
      )}

      {calendarOpen && (
        <PicoYPlacaCalendarModal
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
          plate={plate}
          municipalityCode={municipalityCode}
          municipalityName={ciudad}
        />
      )}
    </Paper>
  );
}

export interface PicoYPlacaProps {
  plate: string;
}

interface MunicipalityInfoPanelProps {
  plate: string;
  municipalityCode: string;
  municipalityName: string;
  onDelete: () => void;
}

function MunicipalityInfoPanel({
  plate,
  municipalityCode,
  municipalityName,
  onDelete,
}: Readonly<MunicipalityInfoPanelProps>) {
  const { data, isLoading, error } = usePyp(plate, municipalityCode);

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      <InfoPanel
        title={`Información para ${municipalityName}`}
        plate={plate}
        municipalityCode={municipalityCode}
        data={data}
        isLoading={isLoading}
        onDelete={onDelete}
      />
    </>
  );
}

export function PicoYPlaca({ plate }: Readonly<PicoYPlacaProps>) {
  const theme = useTheme();
  const [selectValue, setSelectValue] = useState("");
  const [selectedMunicipalities, setSelectedMunicipalities] = useState<string[]>([]);
  const [showBasePanel, setShowBasePanel] = useState(true);
  const { municipalities, isLoading: municipalitiesLoading } = useMunicipalities();

  const { data: baseData, isLoading: baseLoading, error: baseError } = usePyp(plate);

  const handleMunicipalityChange = (event: SelectChangeEvent) => {
    const code = event.target.value;
    if (!code) return;
    setSelectValue(code);
    if (!selectedMunicipalities.includes(code)) {
      setSelectedMunicipalities((prev) => [code, ...prev]);
    }
  };

  const handleDeleteMunicipality = (code: string) => {
    setSelectedMunicipalities((prev) => prev.filter((c) => c !== code));
  };

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";
  const surfaceAlt =
    (theme.palette as { surface?: { alt?: string } })?.surface?.alt ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
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
          La información es informativa y no oficial, aplicable solo a Bogotá, Cali, Villavicencio, Barranquilla y Medellín. 
          El usuario debe verificar la actualización de la información, 
          consultando siempre los canales oficiales de las entidades pertinentes 
          (alcaldía, gobernación o ente regulador correspondiente).
        </Typography>
      </Paper>

      <FormControl fullWidth size="small">
        <InputLabel id="municipality-select-label">Municipio</InputLabel>
        <Select
          labelId="municipality-select-label"
          value={selectValue}
          label="Municipio"
          onChange={handleMunicipalityChange}
          disabled={municipalitiesLoading}
          sx={{
            bgcolor: theme.palette.background.paper,
            color: theme.palette.text.primary,
          }}
        >
          <MenuItem value="">
            <em>Seleccionar municipio</em>
          </MenuItem>
          {municipalities.map((m) => (
            <MenuItem
              key={m.code}
              value={m.code}
              disabled={selectedMunicipalities.includes(m.code)}
            >
              {m.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {baseError && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {baseError}
        </Alert>
      )}

      {showBasePanel && (
        <InfoPanel
          title="Información de tu vehículo"
          plate={plate}
          data={baseData}
          isLoading={baseLoading}
          onDelete={() => setShowBasePanel(false)}
        />
      )}

      {selectedMunicipalities.map((code) => {
        const name =
          municipalities.find((m) => m.code === code)?.name ?? code;
        return (
          <MunicipalityInfoPanel
            key={code}
            plate={plate}
            municipalityCode={code}
            municipalityName={name}
            onDelete={() => handleDeleteMunicipality(code)}
          />
        );
      })}
    </Box>
  );
}