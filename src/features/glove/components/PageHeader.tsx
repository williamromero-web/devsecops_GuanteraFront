import type { SxProps, Theme } from "@mui/material/styles";
import { Box, IconButton, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Breadcrumb, type BreadcrumbItem } from "../../../shared/ui/molecules/Breadcrumb";

export interface PageHeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
  onBack?: () => void;
  trailing?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function PageHeader({
  title,
  breadcrumbItems,
  onBack,
  trailing,
  sx,
}: Readonly<PageHeaderProps>) {
  const theme = useTheme();

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        ...sx,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          {onBack ? (
            <IconButton
              onClick={onBack}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${borderColor}`,
                borderRadius: 3,
                color: theme.palette.text.secondary,
                width: 40,
                height: 40,
                p: 1,
                "&:hover": {
                  bgcolor: (theme.palette as { surface?: { main?: string } })?.surface?.main ?? theme.palette.background.paper,
                  borderColor: borderColor,
                },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: "1.25rem" }} />
            </IconButton>
          ) : null}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.75, minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: theme.palette.text.primary,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </Typography>
            <Breadcrumb items={breadcrumbItems} />
          </Box>
        </Box>

        {trailing ? <Box sx={{ flexShrink: 0 }}>{trailing}</Box> : null}
      </Box>
    </Paper>
  );
}

