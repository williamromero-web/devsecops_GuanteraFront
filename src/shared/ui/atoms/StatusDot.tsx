import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import type { NormalizedStatus } from "../../../features/glove/types/domain";

export interface StatusDotProps {
  status: NormalizedStatus;
  sx?: SxProps<Theme>;

  size?: number;
}

export function StatusDot({ status, sx, size = 12 }: Readonly<StatusDotProps>) {
  const theme = useTheme();

  if (status === "ok") return null;

  const bg =
    status === "warning"
      ? theme.palette.warning.main
      : theme.palette.error.main;

  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "9999px",
        backgroundColor: bg,
        border: `1px solid ${theme.palette.background.paper}`,
        ...sx,
      }}
    />
  );
}
