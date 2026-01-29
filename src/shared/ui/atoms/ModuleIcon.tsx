import type { SxProps, Theme } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import FolderOutlined from "@mui/icons-material/FolderOutlined";
import SecurityOutlined from "@mui/icons-material/SecurityOutlined";
import BuildOutlined from "@mui/icons-material/BuildOutlined";
import DirectionsCarOutlined from "@mui/icons-material/DirectionsCarOutlined";
import type { ModuleKey } from "../../../features/glove/config/optionsConfig";

export interface ModuleIconProps {
  variant: ModuleKey;
  sx?: SxProps<Theme>;
  size?: number;
}

export function ModuleIcon({
  variant,
  sx,
  size = 22,
}: Readonly<ModuleIconProps>) {
  const theme = useTheme();
  const baseSx: SxProps<Theme> = {
    width: size,
    height: size,
    color: theme.palette.primary.light,
  };

  switch (variant) {
    case "propiedad":
      return <FolderOutlined sx={{ ...baseSx, ...sx }} />;
    case "seguros":
      return <SecurityOutlined sx={{ ...baseSx, ...sx }} />;
    case "mantenimiento":
      return <BuildOutlined sx={{ ...baseSx, ...sx }} />;
    case "operacion":
      return <DirectionsCarOutlined sx={{ ...baseSx, ...sx }} />;
    default: {
      return <FolderOutlined sx={{ ...baseSx, ...sx }} />;
    }
  }
}
