import type { SxProps, Theme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import type { NormalizedStatus, OptionConfigItem } from "../types/domain";
import { OptionCard } from "../../../shared/ui/molecules/OptionCard";
// import { getOptionStatus } from "../lib/status";
import type { ModuleDetailResponse } from "../services";

export interface OptionsGridProps {
  options: OptionConfigItem[];
  // vehicle?: Vehicle | null;
  moduleDetail?: ModuleDetailResponse | null;
  onSelect: (optionKey: string) => void;
  sx?: SxProps<Theme>;
}

function getOptionIcon(optionKey: string, theme: Theme) {
  const iconSx = { fontSize: "1.5rem", color: theme.palette.text.secondary };
  if (optionKey.includes("manual")) return <MenuBookOutlined sx={iconSx} />;
  return <DescriptionOutlined sx={iconSx} />;
}

function mapColorToStatus(color: string): NormalizedStatus {

  switch (color) {
    case "#FF4444":
      return "error"      // expirado

    case "#FF8844":
      return "warning"    // 3 dias

    case "#FFBB44":
      return "warning"    // 8 dias

    case "#FFDD44":
      return "warning"    // 15 dias

    case "green":
      return "ok"

    case "#9CA3AF":
      return { color: "#9CA3AF" } // gris

    default:
      return "ok"
  }
}

export function OptionsGrid({ options, moduleDetail, onSelect, sx }: Readonly<OptionsGridProps>) {
  console.log("moduleDetail", moduleDetail); 
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={sx}>
      {options.map((opt) => {

        const item = moduleDetail?.items?.find(
          (i) => i.optionKey === opt.key
        );

        const status = item ? mapColorToStatus(item.color) : "ok";
        
        return (
          <Grid key={opt.key} size={{ xs: 12, sm: 6, md: 4 }}>
            <OptionCard
              label={opt.label}
              status={status}
              disabled={!!opt.disabled}
              onClick={() => onSelect(opt.key)}
              icon={getOptionIcon(opt.key, theme)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
}

