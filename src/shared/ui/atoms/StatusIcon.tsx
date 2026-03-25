import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import WarningAmberOutlined from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlined from "@mui/icons-material/ErrorOutlineOutlined";

export type StatusIconVariant = "ok" | "warning" | "error";

export interface StatusIconProps {
  variant: StatusIconVariant;
  sx?: SxProps<Theme>;

  size?: number;
}

export function StatusIcon({
  variant,
  sx,
  size = 16,
}: Readonly<StatusIconProps>) {
  const theme = useTheme();

  if (variant === "warning") {
    return (
      <WarningAmberOutlined
        sx={{
          width: size,
          height: size,
          color: theme.palette.warning.main,
          ...sx,
        }}
      />
    );
  }

  if (variant === "error") {
    return (
      <ErrorOutlineOutlined
        sx={{
          width: size,
          height: size,
          color: theme.palette.error.main,
          ...sx,
        }}
      />
    );
  }

  return (
    <CheckCircleOutlined
      sx={{
        width: size,
        height: size,
        color: theme.palette.success.main,
        ...sx,
      }}
    />
  );
}
