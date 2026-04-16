import type { SxProps, Theme } from "@mui/material/styles";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  maxWidth?: number | string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Buscar...",
  loading = false,
  disabled = false,
  sx,
  maxWidth,
}: Readonly<SearchInputProps>) {
  const showClear =
    !loading && !disabled && value.trim().length > 0 && !!onClear;

  const endAdornment = (
    <InputAdornment position="end">
      {loading ? (
        <CircularProgress
          size={18}
          sx={{ color: (theme) => theme.palette.primary.light }}
        />
      ) : null}
      {!loading && showClear ? (
        <IconButton
          edge="end"
          onClick={onClear}
          size="small"
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "error.main",
              bgcolor: (theme) => `${theme.palette.error.light}`,
            },
          }}
        >
          <Box component="span" sx={{ fontSize: "1.2rem", lineHeight: 1 }}>
            ×
          </Box>
        </IconButton>
      ) : null}
    </InputAdornment>
  );

  return (
    <TextField
      fullWidth
      disabled={disabled}
      size="small"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      slotProps={{
        input: {
          sx: {
            borderRadius: 3,
            bgcolor: (theme) => theme.palette.background.paper,
            color: "text.primary",
            fontWeight: 600,
            fontSize: "1rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
            border: value.trim()
              ? (theme) => `2px solid ${theme.palette.primary.light}`
              : (theme) => `1px solid ${theme.palette.border.main}`,
            transition: "all 0.2s",
            maxWidth: maxWidth ?? undefined,
            "&:hover": {
              boxShadow: "0 4px 8px rgba(0,0,0,0.10)",
            },
            "&:focus-within": {
              border: (theme) => `2px solid ${theme.palette.primary.light}`,
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.light}`,
            },
          },
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon
                sx={{
                  color: (theme) =>
                    value.trim()
                      ? theme.palette.primary.light
                      : theme.palette.text.secondary,
                }}
              />
            </InputAdornment>
          ),
          endAdornment,
        },
      }}
      sx={sx}
    />
  );
}
