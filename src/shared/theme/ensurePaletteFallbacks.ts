import type { Theme } from "@mui/material/styles";

/** Paleta extendida que Glove usa; el host puede no exponerlas. */
interface ExtendedPaletteFields {
  surface?: { main?: string; alt?: string };
  border?: { main?: string };
  alwaysDark?: { main?: string };
  scrollbar?: { thumb?: string; track?: string };
  card?: Record<string, unknown>;
  table?: Record<string, unknown>;
  form?: { background?: string };
}

function getExtendedPalette(p: Theme["palette"]): Theme["palette"] & ExtendedPaletteFields {
  return p as unknown as Theme["palette"] & ExtendedPaletteFields;
}

function getTextFallbacks(p: Theme["palette"], isDark: boolean) {
  const textPrimary = p.text?.primary ?? (isDark ? "#EBFCF8" : "#181818");
  const textSecondary = p.text?.secondary ?? (isDark ? "#FFFFFF" : "#696969");
  return {
    ...p.text,
    primaryButton: p.text?.primaryButton ?? "#FFFFFF",
    tertiary: (p.text as { tertiary?: string })?.tertiary ?? (isDark ? "#546E7A" : "#BDBDBD"),
    menuActive: (p.text as { menuActive?: string })?.menuActive ?? textPrimary,
    menuDefault: (p.text as { menuDefault?: string })?.menuDefault ?? textSecondary,
  };
}

function getCardFallbacks(p: Theme["palette"], isDark: boolean) {
  const paper = p.background?.paper ?? (isDark ? "#000000" : "#F6F6F6");
  const divider = p.divider ?? (isDark ? "#37474F" : "#D0D0D0");
  const textSecondary = p.text?.secondary ?? (isDark ? "#FFFFFF" : "#696969");
  const textPrimary = p.text?.primary ?? (isDark ? "#EBFCF8" : "#181818");
  return {
    background: paper,
    border: isDark ? "#1F1F1F" : divider,
    label: textSecondary,
    plate: textPrimary,
    value: textPrimary,
    online: isDark ? "#1B5E20" : (p.success as { light?: string })?.light ?? "#E8F5E9",
    offline: isDark ? "#B71C1C" : (p.error as { light?: string })?.light ?? "#FFEBEE",
    warning: isDark ? "#E65100" : (p.warning as { light?: string })?.light ?? "#FFF3E0",
    iconOnline: (p.success as { main?: string })?.main ?? "#4CAF50",
    iconOffline: (p.error as { main?: string })?.main ?? "#EF5350",
    iconWarning: (p.warning as { main?: string })?.main ?? "#FFA726",
  };
}

function getTableFallbacks(p: Theme["palette"], isDark: boolean) {
  const textPrimary = p.text?.primary ?? (isDark ? "#EBFCF8" : "#181818");
  return {
    headerBackground: isDark ? "#003833" : "#E7FFFA",
    headerText: isDark ? "#FFFFFF" : "#007868",
    headerBorder: "#00BE9C",
    rowBackground: isDark ? "#1a1a1a" : "#FFFFFF",
    rowAlternateBackground: isDark ? "#1f1f1f" : "#F5F5F5",
    rowText: textPrimary,
    rowHoverBackground: isDark ? "#2a2a2a" : "#E7FFFA",
    border: isDark ? "#2a2a2a" : "#E0E0E0",
    background: isDark ? "#000000" : "#FFFFFF",
  };
}

function getFallbackPalette(p: Theme["palette"], isDark: boolean) {
  const paper = p.background?.paper ?? (isDark ? "#000000" : "#F6F6F6");
  const divider = p.divider ?? (isDark ? "#37474F" : "#D0D0D0");
  const pa = getExtendedPalette(p);
  return {
    surface: {
      main: pa.surface?.main ?? paper,
      alt: pa.surface?.alt ?? (isDark ? "#242424" : "#E7FFFA"),
    },
    border: { main: pa.border?.main ?? divider },
    alwaysDark: {
      main: pa.alwaysDark?.main ?? (isDark ? (p.background?.paper ?? "#000000") : "#090907"),
    },
    text: getTextFallbacks(p, isDark),
    scrollbar:
      pa.scrollbar ??
      (isDark ? { thumb: "#003833", track: "#000000" } : { thumb: "#00F1C7", track: "#F6F6F6" }),
    card: pa.card ?? getCardFallbacks(p, isDark),
    table: pa.table ?? getTableFallbacks(p, isDark),
    form: pa.form ?? { background: isDark ? "#000000" : "#FFFFFF" },
  };
}

/**
 * Asegura que el tema del host tenga las propiedades de paleta que Glove espera
 * (surface, border, alwaysDark, card, scrollbar, text.tertiary, etc.).
 * Cuando Glove se monta dentro de TraccarWeb, el host puede no exponer estas
 * propiedades; esta función las rellena con valores derivados del tema del host.
 */
export function ensurePaletteFallbacks(hostTheme: Theme): Theme {
  const p = hostTheme.palette;
  const isDark = (p.mode ?? "light") === "dark";
  const fallbacks = getFallbackPalette(p, isDark);

  return {
    ...hostTheme,
    palette: {
      ...p,
      ...fallbacks,
    },
  } as Theme;
}
