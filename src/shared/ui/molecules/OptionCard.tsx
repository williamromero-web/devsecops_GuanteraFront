import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import type { NormalizedStatus } from "../../../features/glove/types/domain";
import type { ModuleKey } from "../../../features/glove/config/optionsConfig";
import { getOptionCardConfig } from "../../../features/glove/config/statusConfig";
import { ModuleIcon } from "../atoms/ModuleIcon";
import { StatusDot } from "../atoms/StatusDot";

export interface OptionCardProps {
  label: string;
  status?: NormalizedStatus;
  disabled?: boolean;
  onClick?: () => void;

  moduleKey?: ModuleKey;

  icon?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function OptionCard({
  label,
  status = "ok",
  disabled = false,
  onClick,
  moduleKey,
  icon,
  sx,
}: Readonly<OptionCardProps>) {
  const theme = useTheme();
  const cfg = getOptionCardConfig(theme, status);
  const clickable = !disabled && typeof onClick === "function";

  return (
    <Box
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : -1}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick?.();
            }
          : undefined
      }
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 64, sm: 72 },
        minHeight: { xs: 64, sm: 72 },
        display: "flex",
        alignItems: "center",
        gap: 1,
        p: 1,
        borderRadius: 1,
        border: `1px solid ${cfg.border}`,
        bgcolor: cfg.bg,
        cursor: clickable ? "pointer" : "not-allowed",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s",
        outline: "none",
        "&:hover": clickable
          ? {
              boxShadow: theme.shadows[1],
              transform: "translateY(-1px)",
            }
          : undefined,
        "&:focus-visible": clickable
          ? {
              boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
            }
          : undefined,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: cfg.iconBg,
          p: 1.5,
          borderRadius: 1,
          flexShrink: 0,
          width: { xs: 48, sm: 56 },
          height: { xs: 48, sm: 56 },
          minWidth: { xs: 48, sm: 56 },
          minHeight: { xs: 48, sm: 56 },
        }}
      >
        {icon ??
          (moduleKey ? (
            <ModuleIcon variant={moduleKey} sx={{ color: cfg.iconColor }} />
          ) : null)}
      </Box>

      <Typography
        sx={{
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          color: theme.palette.text.primary,
          fontWeight: 500,
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          minWidth: 0,
        }}
      >
        {label}
      </Typography>

      <Box sx={{ position: "absolute", top: 10, right: 10 }}>
        <StatusDot status={status} />
      </Box>
    </Box>
  );
}
