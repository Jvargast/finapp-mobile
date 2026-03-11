export type PlannedActualStatus = "ON_TRACK" | "RISK" | "OVER";

export interface PlannedActualCategoryRow {
  id: string;
  name: string;
  icon?: string;
  color: string;
  planned: number;
  actual: number;
  variance: number;
  remaining: number;
  utilization: number;
  warningThreshold: number;
  status: PlannedActualStatus;
}

export interface PlannedActualCardColors {
  surface: string;
  page: string;
  border: string;
  ink: string;
  muted: string;
  accent: string;
  accentSoft: string;
  good: string;
  goodSoft: string;
  warn: string;
  warnSoft: string;
  danger: string;
  dangerSoft: string;
  heroStart: string;
  heroEnd: string;
  glow: string;
  glowSoft: string;
}
