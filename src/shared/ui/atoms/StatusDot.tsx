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

  let bgColor: string;

  if (typeof status === 'object' && status.color) {
    bgColor = status.color;
  } else {
    if (status === "ok") return null;
    bgColor = status === "warning" 
      ? theme.palette.warning.main 
      : theme.palette.error.main;
  }


  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        width: size,
        height: size,
        // borderRadius: "9999px",
        borderRadius: "50%",
        backgroundColor: bgColor,
        // border: `1px solid ${theme.palette.background.paper}`,
        border: `1px solid ${theme.palette.background.paper}`,
        boxShadow: bgColor !== 'gray' ? `0 0 4px ${bgColor}66` : 'none',
        ...sx,
      }}
    />
  );
}
