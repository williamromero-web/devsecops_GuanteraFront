import type { SxProps, Theme } from "@mui/material/styles";
import { Box, Link, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  to?: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  sx?: SxProps<Theme>;
}

export function Breadcrumb({ items, sx }: Readonly<BreadcrumbProps>) {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0.5, ...sx }}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const canNavigate = !!item.to || !!item.onClick;

        const commonSx = {
          fontSize: "0.875rem",
          color: isLast ? theme.palette.primary.light : theme.palette.text.secondary,
          fontWeight: isLast ? 500 : 400,
          textDecoration: "none",
          cursor: !isLast && canNavigate ? "pointer" : "default",
          "&:hover": !isLast && canNavigate ? { color: theme.palette.primary.light, textDecoration: "underline" } : undefined,
        } as const;

        let node: ReactNode = (
          <Typography component="span" sx={commonSx}>
            {item.label}
          </Typography>
        );

        if (!isLast && item.to) {
          node = (
            <Link component={RouterLink} to={item.to} sx={commonSx}>
              {item.label}
            </Link>
          );
        } else if (!isLast && item.onClick) {
          node = (
            <Typography component="span" onClick={item.onClick} sx={commonSx}>
              {item.label}
            </Typography>
          );
        }

        return (
          <Box key={`${idx}-${item.label}`} sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            {node}
            {!isLast && (
              <Typography component="span" sx={{ fontSize: "0.875rem", color: theme.palette.text.tertiary }}>
                /
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

