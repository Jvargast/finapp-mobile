export type AppAppearance = "light" | "dark";

export interface AppVisualPalette {
  brand: string;
  brandStrong: string;
  page: string;
  surface: string;
  border: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  peach: string;
  peachText: string;
  mint: string;
  mintText: string;
  success: string;
  successSoft: string;
  warning: string;
  warningSoft: string;
  danger: string;
  dangerSoft: string;
  badgeBg: string;
  badgeText: string;
  emptyChart: string;
  iconBgFallback: string;
  mixBase: string;
  mixAlt: string;
  hatchStrong: string;
  hatchSoft: string;
  clusterBg: string;
  overlay: string;
  shadow: string;
  glow: string;
  glowSoft: string;
}

export interface AnalyticsVisualPalette extends AppVisualPalette {
  emptyPie: string;
  fixed: string;
  fixedSoft: string;
  variable: string;
  variableSoft: string;
  good: string;
  goodSoft: string;
  warn: string;
  warnSoft: string;
  heroStart: string;
  heroEnd: string;
}

export interface BalanceVisualPalette {
  start: string;
  end: string;
  border: string;
  shadow: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  positive: string;
  negative: string;
  neutral: string;
  surface: string;
  surfaceBorder: string;
  glow: string;
  glowSoft: string;
}

const APP_VISUALS: Record<AppAppearance, AppVisualPalette> = {
  light: {
    brand: "#4F46E5",
    brandStrong: "#4338CA",
    page: "#F8F3EB",
    surface: "#FCF8F1",
    border: "#E7DDD1",
    ink: "#1F2937",
    muted: "#6B7280",
    accent: "#8BA7F2",
    accentSoft: "#EEF3FF",
    peach: "#FFE6D1",
    peachText: "#C2410C",
    mint: "#DCFCE7",
    mintText: "#15803D",
    success: "#15803D",
    successSoft: "#DCFCE7",
    warning: "#C2410C",
    warningSoft: "#FFEDD5",
    danger: "#DC2626",
    dangerSoft: "#FEE2E2",
    badgeBg: "#1F2937",
    badgeText: "#FFFFFF",
    emptyChart: "#E5E7EB",
    iconBgFallback: "#EEF2FF",
    mixBase: "#FCF8F1",
    mixAlt: "#0F172A",
    hatchStrong: "rgba(252,248,241,0.34)",
    hatchSoft: "rgba(252,248,241,0.18)",
    clusterBg: "rgba(252,248,241,0.44)",
    overlay: "rgba(15,23,42,0.3)",
    shadow: "#E2E8F0",
    glow: "rgba(252,248,241,0.76)",
    glowSoft: "rgba(252,248,241,0.48)",
  },
  dark: {
    brand: "#4F46E5",
    brandStrong: "#4338CA",
    page: "#0B1220",
    surface: "#111827",
    border: "#233044",
    ink: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#A5B4FC",
    accentSoft: "rgba(165,180,252,0.18)",
    peach: "#FB923C",
    peachText: "#FDBA74",
    mint: "#34D399",
    mintText: "#6EE7B7",
    success: "#34D399",
    successSoft: "rgba(52,211,153,0.16)",
    warning: "#FBBF24",
    warningSoft: "rgba(251,191,36,0.16)",
    danger: "#F87171",
    dangerSoft: "rgba(248,113,113,0.16)",
    badgeBg: "#E2E8F0",
    badgeText: "#0F172A",
    emptyChart: "#334155",
    iconBgFallback: "rgba(148,163,184,0.18)",
    mixBase: "#0F172A",
    mixAlt: "#FFFFFF",
    hatchStrong: "rgba(255,255,255,0.14)",
    hatchSoft: "rgba(255,255,255,0.08)",
    clusterBg: "rgba(15,23,42,0.7)",
    overlay: "rgba(2,6,23,0.74)",
    shadow: "#0F172A",
    glow: "rgba(255,255,255,0.08)",
    glowSoft: "rgba(255,255,255,0.05)",
  },
};

const ANALYTICS_PIE_COLORS: Record<AppAppearance, readonly string[]> = {
  light: [
    "#9DB8F7",
    "#F6C9A6",
    "#9ADBC0",
    "#C7B9F2",
    "#F4B8C4",
    "#B7D4F1",
    "#F2D48A",
  ],
  dark: [
    "#8FB4FF",
    "#F7B983",
    "#6AD2A9",
    "#B9A6FF",
    "#F5A0C2",
    "#7FC8E8",
    "#F0D070",
  ],
};

export const getAppAppearance = (
  value: boolean | string | AppAppearance
): AppAppearance => {
  if (value === "light" || value === "dark") return value;
  if (typeof value === "boolean") return value ? "dark" : "light";
  return value.startsWith("dark") ? "dark" : "light";
};

export const withAlpha = (
  hex: string,
  alpha: number,
  fallback = "transparent"
) => {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getAppVisualPalette = (
  value: boolean | string | AppAppearance
) => APP_VISUALS[getAppAppearance(value)];

export const getAnalyticsPalette = (
  value: boolean | string | AppAppearance
): AnalyticsVisualPalette => {
  const appearance = getAppAppearance(value);
  const base = APP_VISUALS[appearance];

  return {
    ...base,
    emptyPie: base.emptyChart,
    fixed: appearance === "dark" ? "#60A5FA" : "#2563EB",
    fixedSoft:
      appearance === "dark"
        ? "rgba(96,165,250,0.16)"
        : "#DBEAFE",
    variable: appearance === "dark" ? "#FBBF24" : "#EA580C",
    variableSoft: appearance === "dark" ? "rgba(251,191,36,0.16)" : "#FFEDD5",
    good: base.success,
    goodSoft: base.successSoft,
    warn: base.warning,
    warnSoft: base.warningSoft,
    heroStart: appearance === "dark" ? "#162032" : "#EEF4FF",
    heroEnd: appearance === "dark" ? "#1C172A" : "#FFF4E8",
  };
};

export const getAnalyticsPieColors = (
  value: boolean | string | AppAppearance
) => ANALYTICS_PIE_COLORS[getAppAppearance(value)];

export const getBalancePalette = (
  value: boolean | string | AppAppearance
): BalanceVisualPalette => {
  const appearance = getAppAppearance(value);

  if (appearance === "dark") {
    return {
      start: "#24163F",
      end: "#160F2B",
      border: "rgba(196,181,253,0.16)",
      shadow: "#0F0A1F",
      ink: "#F8FAFC",
      muted: "#D6CCFA",
      accent: "#C4B5FD",
      accentSoft: "rgba(196,181,253,0.12)",
      positive: "#86EFAC",
      negative: "#FCA5A5",
      neutral: "#E9D5FF",
      surface: "rgba(255,255,255,0.08)",
      surfaceBorder: "rgba(196,181,253,0.14)",
      glow: "rgba(255,255,255,0.08)",
      glowSoft: "rgba(255,255,255,0.05)",
    };
  }

  return {
    start: "#7C3AED",
    end: "#5B21B6",
    border: "rgba(139,92,246,0.22)",
    shadow: "#C4B5FD",
    ink: "#FFFFFF",
    muted: "#E9D5FF",
    accent: "#F5F3FF",
    accentSoft: "rgba(255,255,255,0.12)",
    positive: "#BBF7D0",
    negative: "#FECACA",
    neutral: "#EDE9FE",
    surface: "rgba(255,255,255,0.12)",
    surfaceBorder: "rgba(255,255,255,0.14)",
    glow: "rgba(255,255,255,0.16)",
    glowSoft: "rgba(255,255,255,0.09)",
  };
};
