import { TextField } from "@mui/material";
import type { TextFieldProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export type DateFieldProps = Omit<TextFieldProps, "type">;

export function DateField({ sx, ...props }: Readonly<DateFieldProps>) {
  const theme = useTheme();

  return (
    <TextField
      {...props}
      type="date"
      InputLabelProps={{ shrink: true, ...props.InputLabelProps }}
      sx={{
        "& .MuiOutlinedInput-root": {
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        },
        "& input[type='date']::-webkit-calendar-picker-indicator": {
          filter: theme.palette.mode === "dark" ? "invert(1)" : "none",
          cursor: "pointer",
          opacity: 0.7,
          "&:hover": {
            opacity: 1,
          },
        },
        ...sx,
      }}
    />
  );
}
