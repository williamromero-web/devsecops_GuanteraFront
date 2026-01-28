import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface TypeText {
    primaryButton?: string;
    tertiary?: string;
    menuActive?: string;
    menuDefault?: string;
  }

  interface Palette {
    surface: { main: string; alt: string };
    border: { main: string };
    neutral?: { main?: string };
    geometry?: { main: string };
    alwaysDark: { main: string };
    menu?: {
      textDefault?: string;
      textActive?: string;
      hoverBg?: string;
      hoverStart?: string;
      hoverEnd?: string;
      activeStart?: string;
      activeEnd?: string;
    };
    tokens?: { deviceBorder?: string };
    card?: {
      background?: string;
      border?: string;
      label?: string;
      plate?: string;
      value?: string;
      online?: string;
      offline?: string;
      warning?: string;
      iconOnline?: string;
      iconOffline?: string;
      iconWarning?: string;
    };
    table?: {
      headerBackground?: string;
      headerText?: string;
      headerBorder?: string;
      rowBackground?: string;
      rowAlternateBackground?: string;
      rowText?: string;
      rowHoverBackground?: string;
      border?: string;
      background?: string;
    };
    scrollbar?: { thumb?: string; track?: string };
    form?: { background?: string };
  }

  interface PaletteOptions {
    surface?: { main: string; alt: string };
    border?: { main: string };
    neutral?: { main?: string };
    geometry?: { main: string };
    alwaysDark?: { main: string };
    menu?: {
      textDefault?: string;
      textActive?: string;
      hoverBg?: string;
      hoverStart?: string;
      hoverEnd?: string;
      activeStart?: string;
      activeEnd?: string;
    };
    tokens?: { deviceBorder?: string };
    card?: {
      background?: string;
      border?: string;
      label?: string;
      plate?: string;
      value?: string;
      online?: string;
      offline?: string;
      warning?: string;
      iconOnline?: string;
      iconOffline?: string;
      iconWarning?: string;
    };
    table?: {
      headerBackground?: string;
      headerText?: string;
      headerBorder?: string;
      rowBackground?: string;
      rowAlternateBackground?: string;
      rowText?: string;
      rowHoverBackground?: string;
      border?: string;
      background?: string;
    };
    scrollbar?: { thumb?: string; track?: string };
    form?: { background?: string };
  }
}

