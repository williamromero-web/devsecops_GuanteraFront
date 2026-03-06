import type { Theme } from "@mui/material/styles";
import type { NormalizedStatus } from "../types/domain";

export type VehicleChipVariant = "activo" | "advertencia" | "error" | "inactive";

export function getStatusConfig(theme: Theme) {
  return {
    activo: {
      label: "Activo",
      color: theme.palette.success.main,
      bg: theme.palette.success.light,
      iconColor: theme.palette.success.main,
    },
    inactive: {
      label: "No registrado en el RUNT",
      color: theme.palette.text.disabled,
      bg: theme.palette.action.disabledBackground,
      iconColor: theme.palette.text.disabled,
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
  const borderColor = (theme.palette as any)?.border?.main ?? theme.palette.divider ?? "#D0D0D0";
  const surfaceAlt = (theme.palette as any)?.surface?.alt ?? theme.palette.background.paper;

  if (typeof status === 'object' && status.color) {
    const isGray = status.color === 'gray' || status.color === '#9CA3AF';
    return {
      dotColor: status.color,
      border: isGray ? borderColor : status.color,
      bg: isGray ? theme.palette.background.paper : `${status.color}1A`, // 10% opacidad
      iconColor: isGray ? theme.palette.text.disabled : status.color,
      iconBg: surfaceAlt,
    } as const;
  }

  if (status === "warning") {
    return {
      dotColor: theme.palette.warning.main,
      border: theme.palette.warning.main,
      bg: theme.palette.warning.light,
      iconColor: theme.palette.warning.main,
      iconBg: surfaceAlt,
    } as const;
  }

  if (status === "error") {
    return {
      dotColor: theme.palette.error.main,
      border: theme.palette.error.main,
      bg: theme.palette.error.light,
      iconColor: theme.palette.error.main,
      iconBg: surfaceAlt,
    } as const;
  }

  // Default / "ok"
  return {
    dotColor: theme.palette.success.main,
    border: borderColor,
    bg: theme.palette.background.paper,
    iconColor: theme.palette.success.main,
    iconBg: surfaceAlt,
  } as const;
}
