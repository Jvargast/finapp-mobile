import { createFont, createTamagui } from "tamagui";
import { config as configBase } from "@tamagui/config/v3";
import {
  getAppAppearance,
  getAppVisualPalette,
  withAlpha,
} from "./src/theme/appVisuals";

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

const quicksandBodyFace = {
  300: { normal: "QuicksandLight", italic: "QuicksandLight" },
  400: { normal: "QuicksandRegular", italic: "QuicksandRegular" },
  500: { normal: "QuicksandMedium", italic: "QuicksandMedium" },
  600: { normal: "QuicksandSemiBold", italic: "QuicksandSemiBold" },
  700: { normal: "QuicksandBold", italic: "QuicksandBold" },
  800: { normal: "QuicksandBold", italic: "QuicksandBold" },
  900: { normal: "QuicksandBold", italic: "QuicksandBold" },
} as const;

const quicksandDisplayFace = {
  400: { normal: "QuicksandSemiBold", italic: "QuicksandSemiBold" },
  500: { normal: "QuicksandSemiBold", italic: "QuicksandSemiBold" },
  600: { normal: "QuicksandBold", italic: "QuicksandBold" },
  700: { normal: "QuicksandBold", italic: "QuicksandBold" },
  800: { normal: "QuicksandBold", italic: "QuicksandBold" },
  900: { normal: "QuicksandBold", italic: "QuicksandBold" },
} as const;

const bodyFont = createFont({
  family: "Quicksand",
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
  face: quicksandBodyFace,
});

const headingFont = createFont({
  family: "Quicksand",
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
  face: quicksandBodyFace,
});

const displayFont = createFont({
  family: "Quicksand",
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
    4: "500",
    5: "600",
    6: "700",
    7: "700",
    8: "700",
    9: "700",
    10: "700",
  },
  letterSpacing: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: -0.05,
    6: -0.1,
    7: -0.15,
    8: -0.2,
    9: -0.25,
    10: -0.3,
    11: -0.35,
    12: -0.45,
    13: -0.55,
    14: -0.65,
    15: -0.75,
    16: -0.85,
  },
  face: quicksandDisplayFace,
});

const extendTheme = (themeName: string, theme: Record<string, string>) => {
  const appearance = getAppAppearance(themeName);
  const isLight = appearance === "light";
  const palette = getAppVisualPalette(themeName);
  const softSurface = withAlpha(palette.mixAlt, 0.03, palette.surface);
  const softSurfaceAlt = withAlpha(palette.mixAlt, 0.05, palette.page);

  return {
    ...theme,
    background: isLight ? palette.page : theme.background,
    backgroundHover: isLight ? palette.surface : theme.backgroundHover,
    backgroundPress: isLight ? softSurfaceAlt : theme.backgroundPress,
    backgroundFocus: isLight ? palette.surface : theme.backgroundFocus,
    background0: isLight ? withAlpha(palette.page, 0, theme.background0) : theme.background0,
    background025: isLight
      ? withAlpha(palette.page, 0.25, theme.background025)
      : theme.background025,
    background05: isLight
      ? withAlpha(palette.page, 0.5, theme.background05)
      : theme.background05,
    background075: isLight
      ? withAlpha(palette.page, 0.75, theme.background075)
      : theme.background075,
    color1: isLight ? palette.surface : theme.color1,
    color2: isLight ? softSurface : theme.color2,
    color3: isLight ? softSurfaceAlt : theme.color3,
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
