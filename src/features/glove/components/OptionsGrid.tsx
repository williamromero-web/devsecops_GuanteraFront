import type { SxProps, Theme } from "@mui/material/styles";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DescriptionOutlined from "@mui/icons-material/DescriptionOutlined";
import MenuBookOutlined from "@mui/icons-material/MenuBookOutlined";
import type { OptionConfigItem } from "../types/domain";
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

export function OptionsGrid({ options, moduleDetail, onSelect, sx }: Readonly<OptionsGridProps>) {
  console.log("moduleDetail", moduleDetail); 
  debugger;
  const theme = useTheme();

  return (
    <Grid container spacing={2} sx={sx}>
      {options.map((opt) => {
        // const status = vehicle ? getOptionStatus(vehicle, opt) : "ok";
        debugger;
        const getStatus = (optionKey: string) => {
          const found = moduleDetail?.items.find(
            (i) => i.name === optionKey
          );

          if (!found) return "ok";

          switch (found.status) {
            case "expired":
              return "error";
            case "warning":
              return "warning";
            default:
              return "ok";
          }
        };
        return (
          <Grid key={opt.key} size={{ xs: 12, sm: 6, md: 4 }}>
            <OptionCard
              label={opt.label}
              status={getStatus(opt.key)}
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

