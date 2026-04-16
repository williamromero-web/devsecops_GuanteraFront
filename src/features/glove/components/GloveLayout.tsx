import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface GloveLayoutProps {
  children: React.ReactNode;
  headerExtra?: React.ReactNode;
  sx?: SxProps<Theme>;
}

export function GloveLayout({
  children,
  headerExtra,
  sx,
}: Readonly<GloveLayoutProps>) {
  const theme = useTheme();
  const isDark = theme.palette?.mode === "dark";
  const paperBg =
    theme.palette?.background?.paper ??
    theme.palette?.background?.default ??
    "#ffffff";
  const alwaysDarkMain =
    (theme.palette as { alwaysDark?: { main?: string } })?.alwaysDark?.main ??
    paperBg;
  const headerBg = isDark ? alwaysDarkMain : paperBg;
  const contentBg = isDark ? alwaysDarkMain : paperBg;
  const primaryLight = theme.palette?.primary?.light ?? theme.palette.primary.main;
  const textPrimary = theme.palette?.text?.primary ?? "#000000";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        bgcolor: "transparent",
        ...sx,
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: headerBg,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          borderRadius: isDark ? 0 : "16px 16px 0 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.7rem",
              color: isDark ? primaryLight : textPrimary,
              fontWeight: "bold",
            }}
          ></Typography>
          {headerExtra}
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0,
          overflow: "auto",
          bgcolor: contentBg,
          borderRadius: isDark ? 0 : "0 0 16px 16px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
