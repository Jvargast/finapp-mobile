import type {
  SubscriptionFamilyRole,
  SubscriptionPeriodType,
} from "../types/subscription.types";
import { SubscriptionPlan } from "../types/user.types";

const PRODUCT_LABELS: Record<string, string> = {
  wou_pro_monthly: "Wou Pro Mensual",
  wou_pro_yearly: "Wou Pro Anual",
  wou_family_monthly: "Wou Family Mensual",
  wou_family_yearly: "Wou Family Anual",
};

const STORE_LABELS: Record<string, string> = {
  APP_STORE: "App Store",
  APPLE_APP_STORE: "App Store",
  MAC_APP_STORE: "Mac App Store",
  PLAY_STORE: "Google Play",
  GOOGLE_PLAY_STORE: "Google Play",
  AMAZON: "Amazon Appstore",
  AMAZON_STORE: "Amazon Appstore",
  STRIPE: "Stripe",
  PROMOTIONAL: "Promocional",
  TEST_STORE: "Test Store",
};

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.FREE]: "Plan gratuito",
  [SubscriptionPlan.PRO]: "WouFinance Pro",
  [SubscriptionPlan.FAMILY_ADMIN]: "WouFinance Family",
  [SubscriptionPlan.FAMILY_MEMBER]: "WouFinance Family",
};

const FAMILY_ROLE_LABELS: Record<Exclude<SubscriptionFamilyRole, "NONE">, string> = {
  ADMIN: "Administrador",
  MEMBER: "Miembro",
};

const PERIOD_TYPE_LABELS: Record<SubscriptionPeriodType, string> = {
  TRIAL: "Prueba",
  INTRO: "Introductorio",
  NORMAL: "Normal",
  PROMOTIONAL: "Promocional",
  PREPAID: "Prepago",
  UNKNOWN: "Desconocido",
};

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-CL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const DISPLAY_TOKEN_LABELS: Record<string, string> = {
  wou: "Wou",
  woufinance: "WouFinance",
  pro: "Pro",
  family: "Family",
  monthly: "Mensual",
  yearly: "Anual",
};

export const parseSubscriptionDate = (value: string | null): Date | null => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

export const formatSubscriptionDateTime = (value: string | null): string | null => {
  const parsedDate = parseSubscriptionDate(value);
  return parsedDate ? DATE_TIME_FORMATTER.format(parsedDate) : null;
};

const humanizeSubscriptionIdentifier = (value: string) => {
  return value
    .split(/[_-]+/)
    .filter(Boolean)
    .map((token) => {
      const normalizedToken = token.toLowerCase();
      if (DISPLAY_TOKEN_LABELS[normalizedToken]) {
        return DISPLAY_TOKEN_LABELS[normalizedToken];
      }

      return normalizedToken.charAt(0).toUpperCase() + normalizedToken.slice(1);
    })
    .join(" ");
};

export const getSubscriptionProductName = (productId: string | null) => {
  if (!productId) {
    return "Producto por confirmar";
  }

  return PRODUCT_LABELS[productId] ?? humanizeSubscriptionIdentifier(productId);
};

export const getSubscriptionStoreName = (store: string | null) => {
  if (!store) {
    return "Pendiente de confirmación";
  }

  return STORE_LABELS[store] ?? humanizeSubscriptionIdentifier(store);
};

export const getSubscriptionPlanName = (
  plan: SubscriptionPlan | null | undefined
) => {
  if (!plan) {
    return PLAN_LABELS[SubscriptionPlan.FREE];
  }

  return PLAN_LABELS[plan] ?? PLAN_LABELS[SubscriptionPlan.FREE];
};

export const getSubscriptionFamilyRoleName = (
  familyRole: SubscriptionFamilyRole | null | undefined
) => {
  if (!familyRole || familyRole === "NONE") {
    return null;
  }

  return FAMILY_ROLE_LABELS[familyRole];
};

export const getSubscriptionPeriodTypeName = (
  periodType: SubscriptionPeriodType | null | undefined
) => {
  if (!periodType) {
    return "Pendiente de confirmación";
  }

  return PERIOD_TYPE_LABELS[periodType] ?? PERIOD_TYPE_LABELS.UNKNOWN;
};

export const formatSubscriptionRemainingTime = (
  value: string | null,
  now = new Date()
) => {
  const expirationDate = parseSubscriptionDate(value);
  if (!expirationDate) {
    return null;
  }

  const diffMs = expirationDate.getTime() - now.getTime();
  if (diffMs <= 0) {
    return "Expirada";
  }

  const totalMinutes = Math.floor(diffMs / 60_000);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "día" : "días"}`);
  }

  if (hours > 0 && parts.length < 2) {
    parts.push(`${hours} h`);
  }

  if (minutes > 0 && parts.length === 0) {
    parts.push(`${minutes} min`);
  }

  return parts.join(" ");
};
