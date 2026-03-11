import { createFont, createTamagui } from "tamagui";
import { config as configBase } from "@tamagui/config/v3";
import { getAppVisualPalette } from "./src/theme/appVisuals";

const lightPalette = getAppVisualPalette("light");

const sharedBodySize = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 24,
  9: 30,
  10: 40,
  11: 52,
  12: 64,
  13: 74,
  14: 92,
  15: 112,
  16: 128,
} as const;

const sharedBodyLineHeight = {
  1: 16,
  2: 18,
  3: 20,
  4: 22,
  5: 24,
  6: 27,
  7: 30,
  8: 34,
  9: 40,
  10: 50,
  11: 62,
  12: 74,
  13: 86,
  14: 104,
  15: 124,
  16: 140,
} as const;

const manropeFace = {
  400: { normal: "Manrope", italic: "Manrope" },
  500: { normal: "Manrope", italic: "Manrope" },
  600: { normal: "Manrope", italic: "Manrope" },
  700: { normal: "Manrope", italic: "Manrope" },
  800: { normal: "Manrope", italic: "Manrope" },
  900: { normal: "Manrope", italic: "Manrope" },
} as const;

const bodyFont = createFont({
  family: "Manrope",
  size: sharedBodySize,
  lineHeight: sharedBodyLineHeight,
  weight: {
    1: "400",
    2: "400",
    3: "400",
    4: "500",
    5: "500",
    6: "600",
    7: "700",
    8: "700",
    9: "800",
    10: "800",
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: -0.1,
    7: -0.15,
    8: -0.25,
    9: -0.35,
    10: -0.45,
    11: -0.55,
    12: -0.7,
    13: -0.85,
    14: -1,
    15: -1.2,
    16: -1.35,
  },
  face: manropeFace,
});

const headingFont = createFont({
  family: "Manrope",
  size: {
    ...sharedBodySize,
    7: 21,
    8: 26,
    9: 32,
    10: 42,
    11: 54,
    12: 66,
  },
  lineHeight: {
    ...sharedBodyLineHeight,
    7: 30,
    8: 35,
    9: 41,
    10: 52,
    11: 64,
    12: 76,
  },
  weight: {
    4: "500",
    5: "600",
    6: "600",
    7: "700",
    8: "700",
    9: "800",
    10: "800",
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: -0.05,
    5: -0.1,
    6: -0.15,
    7: -0.25,
    8: -0.35,
    9: -0.5,
    10: -0.7,
    11: -0.9,
    12: -1.1,
    13: -1.25,
    14: -1.4,
    15: -1.55,
    16: -1.7,
  },
  face: manropeFace,
});

const displayFont = createFont({
  family: "InstrumentSerif",
  size: {
    1: 12,
    2: 13,
    3: 14,
    4: 15,
    5: 17,
    6: 19,
    7: 22,
    8: 28,
    9: 34,
    10: 42,
    11: 52,
    12: 62,
    13: 72,
    14: 92,
    15: 112,
    16: 128,
  },
  lineHeight: {
    1: 16,
    2: 18,
    3: 19,
    4: 21,
    5: 24,
    6: 26,
    7: 30,
    8: 36,
    9: 42,
    10: 50,
    11: 60,
    12: 70,
    13: 80,
    14: 100,
    15: 120,
    16: 136,
  },
  weight: {
    4: "400",
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: -0.1,
    7: -0.2,
    8: -0.35,
    9: -0.5,
    10: -0.65,
    11: -0.8,
    12: -1,
    13: -1.2,
    14: -1.4,
    15: -1.6,
    16: -1.8,
  },
  face: {
    400: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
    500: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
    600: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
    700: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
    800: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
    900: { normal: "InstrumentSerif", italic: "InstrumentSerifItalic" },
  },
});

const extendTheme = (themeName: string, theme: Record<string, string>) => {
  const palette = getAppVisualPalette(themeName);

  return {
    ...theme,
    brand: palette.brand,
    appPage: palette.page,
    appSurface: palette.surface,
    appBorder: palette.border,
    appInk: palette.ink,
    appMuted: palette.muted,
    appAccent: palette.accent,
    appAccentSoft: palette.accentSoft,
    appSuccess: palette.success,
    appSuccessSoft: palette.successSoft,
    appWarning: palette.warning,
    appWarningSoft: palette.warningSoft,
    appDanger: palette.danger,
    appDangerSoft: palette.dangerSoft,
    appBadgeBg: palette.badgeBg,
    appBadgeText: palette.badgeText,
    appOverlay: palette.overlay,
  };
};

const tokens = {
  ...configBase.tokens,
  color: {
    ...configBase.tokens.color,
    brand: lightPalette.brand,
    white: lightPalette.badgeText,
    ink: lightPalette.ink,
    muted: lightPalette.muted,
    surface: lightPalette.surface,
    page: lightPalette.page,
    accent: lightPalette.accent,
    accentSoft: lightPalette.accentSoft,
    success: lightPalette.success,
    successSoft: lightPalette.successSoft,
    warning: lightPalette.warning,
    warningSoft: lightPalette.warningSoft,
    danger: lightPalette.danger,
    dangerSoft: lightPalette.dangerSoft,
  },
};

const themes = Object.fromEntries(
  Object.entries(configBase.themes).map(([name, theme]) => [
    name,
    extendTheme(name, theme as Record<string, string>),
  ])
);

const config = createTamagui({
  ...configBase,
  themes,
  tokens,
  fonts: {
    ...configBase.fonts,
    body: bodyFont,
    heading: headingFont,
    display: displayFont,
  },
});

export type AppConfig = typeof config;

declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
