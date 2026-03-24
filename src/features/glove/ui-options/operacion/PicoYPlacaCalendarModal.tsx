import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { usePypCalendar } from "../../hooks/usePypCalendar";

export interface PicoYPlacaCalendarModalProps {
  open: boolean;
  onClose: () => void;
  plate: string;
  municipalityCode?: string;
  municipalityName: string;
}

export function PicoYPlacaCalendarModal({
  open,
  onClose,
  plate,
  municipalityCode,
  municipalityName,
}: Readonly<PicoYPlacaCalendarModalProps>) {
  const theme = useTheme();
  const { data, isLoading, error } = usePypCalendar(open ? plate : "", municipalityCode);

  const titleColor = (theme.palette as any)?.brand?.main ?? "#00E0B1";

  // Dummy current month details
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  // Adjust so Monday is the first day of the week
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const daysOfWeek = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  const buildCalendarGrid = () => {
    const grid: (number | null)[] = [];
    for (let i = 0; i < adjustedFirstDayIndex; i++) {
      grid.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push(i);
    }
    return grid;
  };

  const calendarGrid = buildCalendarGrid();

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 4, 
          p: 2,
          maxWidth: "470px" 
        } 
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, pb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: titleColor }}>
            Calendario pico y placa
          </Typography>
          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
            Información de pico y placa en el mes para {municipalityName}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: theme.palette.text.secondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 2 }}>
        {isLoading || !data ? (
          <Box display="flex" justifyContent="center" p={4}>
            {error ? (
              <Typography color="error">{error}</Typography>
            ) : (
             <CircularProgress />
            )}
          </Box>
        ) : (
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 3 }}>
              {monthNames[month]} {year}
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, width: "100%", maxWidth: 350, textAlign: "center" }}>
              {daysOfWeek.map((day) => (
                <Typography key={day} variant="body2" sx={{ color: theme.palette.text.secondary, fontWeight: 500 }}>
                  {day}
                </Typography>
              ))}

              {calendarGrid.map((day, idx) => {
                if (!day) return <Box key={`empty-${idx}`} />;
                
                const isRestricted = data.restrictedDays?.includes(day) ?? false;
                const isAllowed = data.allowedCirculationDays?.includes(day) ?? false;
                
                let bgColor = "transparent";
                let textColor = theme.palette.text.secondary;
                let fontWeight = "normal";

                if (isRestricted) {
                  bgColor = theme.palette.error.main;
                  textColor = "#fff";
                  fontWeight = "bold";
                } else if (isAllowed) {
                  bgColor = "#00E0B1";
                  textColor = "#fff";
                  fontWeight = "bold";
                }
                
                return (
                  <Box
                    key={`day-${day}`}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 36,
                      width: 36,
                      mx: "auto",
                      borderRadius: "50%",
                      bgcolor: bgColor,
                      color: textColor,
                      fontWeight: fontWeight,
                    }}
                  >
                    <Typography variant="body2">{day}</Typography>
                  </Box>
                );
              })}
            </Box>

            <Box sx={{ mt: 4, width: "100%", display: "flex", justifyContent: "flex-end" }}>
              <Box
                component="button"
                onClick={onClose}
                sx={{
                  bgcolor: "transparent",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { bgcolor: theme.palette.action.hover },
                }}
              >
                Cerrar
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}