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
  const alwaysDarkMain =
    (theme.palette as { alwaysDark?: { main?: string } })?.alwaysDark?.main ??
    theme.palette.background.paper ??
    theme.palette.background.default;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: theme.palette.background.default,
        ...sx,
      }}
    >
      <Box
        sx={{
          flexShrink: 0,
          bgcolor:
            theme.palette.mode === "dark"
              ? alwaysDarkMain
              : theme.palette.background.paper,
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
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
              color:
                theme.palette.mode === "dark"
                  ? theme.palette.primary.light
                  : theme.palette.text.primary,
              fontWeight: "bold",
            }}
          ></Typography>
          {headerExtra}
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>{children}</Box>
    </Box>
  );
}
