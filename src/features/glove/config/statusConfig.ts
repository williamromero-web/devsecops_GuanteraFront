import type { Theme } from "@mui/material/styles";
import type { NormalizedStatus } from "../types/domain";

export type VehicleChipVariant = "activo" | "advertencia" | "error";

export function getStatusConfig(theme: Theme) {
  return {
    activo: {
      label: "Activo",
      color: theme.palette.success.main,
      bg: theme.palette.success.light,
      iconColor: theme.palette.success.main,
    },
    advertencia: {
      label: "Advertencia",
      color: theme.palette.warning.main,
      bg: theme.palette.warning.light,
      iconColor: theme.palette.warning.main,
    },
    error: {
      label: "Alerta",
      color: theme.palette.error.main,
      bg: theme.palette.error.light,
      iconColor: theme.palette.error.main,
    },
  } as const;
}

export function getOptionCardConfig(theme: Theme, status: NormalizedStatus) {
  if (status === "warning") {
    return {
      dotColor: theme.palette.warning.main,
      border: theme.palette.warning.main,
      bg: theme.palette.warning.light,
      iconColor: theme.palette.warning.main,
      iconBg: theme.palette.surface.alt,
    } as const;
  }

  if (status === "error") {
    return {
      dotColor: theme.palette.error.main,
      border: theme.palette.error.main,
      bg: theme.palette.error.light,
      iconColor: theme.palette.error.main,
      iconBg: theme.palette.surface.alt,
    } as const;
  }

  return {
    dotColor: theme.palette.primary.light,
    border: theme.palette.border.main,
    bg: theme.palette.background.paper,
    iconColor: theme.palette.primary.light,
    iconBg: theme.palette.surface.alt,
  } as const;
}
