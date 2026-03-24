import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export interface DisclaimerBannerProps {
  onTermsClick?: () => void;
  sx?: SxProps<Theme>;
}

export function DisclaimerBanner({ onTermsClick, sx }: Readonly<DisclaimerBannerProps>) {
  const theme = useTheme();

  const borderColor =
    (theme.palette as { border?: { main?: string } })?.border?.main ??
    theme.palette.divider ??
    "#D0D0D0";

  return (
    <Paper
      sx={{
        p: 2,
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        border: `1px solid ${borderColor}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        ...sx,
      }}
    >
      <Box
        sx={{
          width: "4px",
          height: "100%",
          bgcolor: theme.palette.divider,
          opacity: 0.8,
          flexShrink: 0,
          borderRadius: "10px",
        }}
      />
      <Typography sx={{ fontSize: "0.85rem", color: theme.palette.text.secondary, lineHeight: 1.6, flex: 1 }}>
        Los datos son de carácter informativo y no oficial. Si encuentra alguna inconsistencia, consulte directamente
        con quien los expide, las entidades oficiales de tránsito o, con su aseguradora. Esta plataforma, únicamente
        las visibiliza,{" "}
        <Box component="span" sx={{ fontWeight: 600 }}>
          NO
        </Box>{" "}
        es responsable de lo que la fuente de información emita.{" "}
        <Box
          component="span"
          onClick={onTermsClick}
          sx={{
            textDecoration: "underline",
            cursor: onTermsClick ? "pointer" : "default",
            color: theme.palette.text.secondary,
            "&:hover": onTermsClick ? { color: theme.palette.primary.light } : undefined,
          }}
        >
          Términos y condiciones.
        </Box>
      </Typography>
    </Paper>
  );
}

