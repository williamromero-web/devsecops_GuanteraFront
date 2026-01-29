import type { SxProps, Theme } from "@mui/material/styles";
import { Chip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { StatusIcon } from "../atoms/StatusIcon";
import { getStatusConfig, type VehicleChipVariant } from "../../../features/glove/config/statusConfig";

export interface StatusChipProps {
  variant: VehicleChipVariant;
  sx?: SxProps<Theme>;
  size?: "small" | "medium";
}

function toStatusIconVariant(variant: VehicleChipVariant) {
  if (variant === "advertencia") return "warning" as const;
  if (variant === "error") return "error" as const;
  return "ok" as const;
}

export function StatusChip({ variant, sx, size = "small" }: Readonly<StatusChipProps>) {
  const theme = useTheme();
  const conf = getStatusConfig(theme)[variant];

  return (
    <Chip
      size={size}
      icon={<StatusIcon variant={toStatusIconVariant(variant)} />}
      label={conf.label}
      sx={{
        bgcolor: conf.bg,
        color: conf.color,
        fontWeight: 500,
        borderRadius: "9999px",
        "& .MuiChip-icon": {
          color: conf.iconColor,
        },
        ...sx,
      }}
    />
  );
}

