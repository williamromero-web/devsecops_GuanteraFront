import tokens from "./tokens.json";

type ServerLike = {
  attributes?: {
    colorPrimary?: string;
    colorSecondary?: string;
    darkMode?: boolean;
  };
} | null;

const validatedColor = (color: unknown) =>
  typeof color === "string" && /^#([0-9A-Fa-f]{3}){1,2}$/.test(color)
    ? color
    : null;

type TokenPalette = typeof tokens.palette.light;

function buildPrimary(p: TokenPalette, server: ServerLike, darkMode: boolean) {
  const gradient = (p as { gradient?: Record<string, unknown> }).gradient;
  return {
    main: validatedColor(server?.attributes?.colorPrimary) || p.primary,
    light: p.primaryHover,
    dark: p.primaryActive,
    contrastText: p.text.primary,
    gradientStart: darkMode
      ? (gradient?.primaryStart as string) || "#007868"
      : p.primary,
    gradientEnd: darkMode
      ? (gradient?.primaryEnd as string) || "#003833"
      : p.primary,
  };
}

function buildSecondary(p: TokenPalette, server: ServerLike) {
  return {
    main: validatedColor(server?.attributes?.colorSecondary) || p.secondary,
    light: (p as { secondaryHover?: string }).secondaryHover,
    dark: p.secondary,
    contrastText: p.text.primary,
  };
}

function buildText(p: TokenPalette, darkMode: boolean) {
  return {
    primary: p.text.primary,
    primaryButton: p.text.primaryButton,
    secondary: p.text.secondary,
    tertiary: p.text.tertiary,
    disabled: p.text.disabled,
    menuActive:
      (p.text as { menuActive?: string }).menuActive ||
      (darkMode ? p.text.primaryButton : "#888888"),
    menuDefault:
      (p.text as { menuDefault?: string }).menuDefault || p.text.secondary,
  };
}

function buildMenu(p: TokenPalette, server: ServerLike, darkMode: boolean) {
  return {
    textDefault:
      (p.text as { menuDefault?: string }).menuDefault || p.text.secondary,
    textActive:
      (p.text as { menuActive?: string }).menuActive ||
      (darkMode ? p.text.primaryButton : "#888888"),
    hoverBg: p.surface,
    hoverStart:
      p.gradient?.menuHoverStart || p.gradient?.menuActiveStart || "#007868",
    hoverEnd:
      p.gradient?.menuHoverEnd || p.gradient?.menuActiveEnd || "#003833",
    activeStart: darkMode
      ? p.gradient?.menuActiveStart || p.secondary
      : validatedColor(server?.attributes?.colorPrimary) ||
        p.gradient?.menuActiveStart ||
        p.primary,
    activeEnd: darkMode
      ? p.gradient?.menuActiveEnd || p.secondary
      : p.gradient?.menuActiveEnd || p.surfaceAlt || p.surface,
  };
}

function buildCard(p: TokenPalette, darkMode: boolean) {
  return {
    background: p.background,
    border: darkMode ? "#1F1F1F" : p.border,
    label: p.text.secondary,
    plate: p.text.primary,
    value: p.text.primary,
    online: darkMode ? "#1B5E20" : p.successLight,
    offline: darkMode ? "#B71C1C" : p.errorLight,
    warning: darkMode ? "#E65100" : p.warningLight,
    iconOnline: p.success,
    iconOffline: p.error,
    iconWarning: p.warning,
  };
}

function buildTable(p: TokenPalette) {
  return {
    headerBackground: p.table?.headerBackground || "#003833",
    headerText: p.table?.headerText || "#FFFFFF",
    headerBorder: p.table?.headerBorder || "#00F1C7",
    rowBackground: p.table?.rowBackground || "#1a1a1a",
    rowAlternateBackground: p.table?.rowAlternateBackground || "#1f1f1f",
    rowText: p.table?.rowText || "#d0d0d0",
    rowHoverBackground: p.table?.rowHoverBackground || "#2a2a2a",
    border: p.table?.border || "#2a2a2a",
    background: p.table?.background || "#000000",
  };
}

function buildScrollbar(p: TokenPalette, darkMode: boolean) {
  return {
    thumb: p.scrollbar?.thumb || (darkMode ? "#003833" : "#00F1C7"),
    track: p.scrollbar?.track || (darkMode ? "#000000" : "#F6F6F6"),
  };
}

function buildForm(p: TokenPalette, darkMode: boolean) {
  return {
    background: p.form?.background || (darkMode ? "#000000" : "#FFFFFF"),
  };
}

function buildStatus(p: TokenPalette, darkMode: boolean) {
  return {
    success: {
      main: p.success,
      light: p.successLight,
      dark: darkMode ? p.successLight : p.success,
      contrastText: p.text.primary,
    },
    warning: {
      main: p.warning,
      light: p.warningLight,
      dark: darkMode ? p.warningLight : p.warning,
      contrastText: p.text.primary,
    },
    error: {
      main: p.error,
      light: p.errorLight,
      dark: darkMode ? p.errorLight : p.error,
      contrastText: p.text.primary,
    },
    info: {
      main: p.info,
      light: p.infoLight,
      dark: darkMode ? p.infoLight : p.info,
      contrastText: p.text.primary,
    },
  };
}

export function palette(server: ServerLike, darkMode: boolean) {
  const colorMode: "dark" | "light" = darkMode ? "dark" : "light";
  const p = tokens.palette[colorMode] as TokenPalette;
  const status = buildStatus(p, darkMode);

  return {
    mode: colorMode,
    background: {
      default: p.background,
      paper: p.background,
    },
    surface: {
      main: p.surface,
      alt: p.surfaceAlt || p.surface,
    },
    primary: buildPrimary(p, server, darkMode),
    secondary: buildSecondary(p, server),
    text: buildText(p, darkMode),
    divider: p.divider,
    border: {
      main: p.border,
    },
    success: status.success,
    warning: status.warning,
    error: status.error,
    info: status.info,
    neutral: {
      main: (p as { accent?: string }).accent,
    },
    geometry: {
      main: "#006257",
    },
    alwaysDark: {
      main: darkMode ? p.surface : "#090907",
    },
    menu: buildMenu(p, server, darkMode),
    tokens: {
      deviceBorder: p.gradient?.deviceBorder || p.primary,
    },
    card: buildCard(p, darkMode),
    table: buildTable(p),
    scrollbar: buildScrollbar(p, darkMode),
    form: buildForm(p, darkMode),
  };
}
