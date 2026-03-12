import finappApi from "../api/finappApi";
import {
  type BackendSubscriptionState,
  type SubscriptionFamilyRole,
  type SubscriptionPeriodType,
} from "../types/subscription.types";
import { SubscriptionPlan } from "../types/user.types";

const normalizePlan = (value: unknown): SubscriptionPlan => {
  switch (value) {
    case SubscriptionPlan.PRO:
    case SubscriptionPlan.FAMILY_ADMIN:
    case SubscriptionPlan.FAMILY_MEMBER:
    case SubscriptionPlan.FREE:
      return value;
    default:
      return SubscriptionPlan.FREE;
  }
};

const normalizeFamilyRole = (
  value: unknown,
  plan: SubscriptionPlan
): SubscriptionFamilyRole => {
  switch (value) {
    case "ADMIN":
    case "MEMBER":
    case "NONE":
      return value;
    default:
      if (plan === SubscriptionPlan.FAMILY_ADMIN) {
        return "ADMIN";
      }

      if (plan === SubscriptionPlan.FAMILY_MEMBER) {
        return "MEMBER";
      }

      return "NONE";
  }
};

const normalizeNullableString = (value: unknown): string | null => {
  return typeof value === "string" ? value : null;
};

const normalizePeriodType = (value: unknown): SubscriptionPeriodType => {
  switch (value) {
    case "TRIAL":
    case "INTRO":
    case "NORMAL":
    case "PROMOTIONAL":
    case "PREPAID":
    case "UNKNOWN":
      return value;
    default:
      return "UNKNOWN";
  }
};

const normalizeSubscription = (payload: unknown): BackendSubscriptionState => {
  const source =
    typeof payload === "object" &&
    payload !== null &&
    "subscription" in payload &&
    payload.subscription
      ? payload.subscription
      : payload;

  const data =
    typeof source === "object" && source !== null
      ? (source as Record<string, unknown>)
      : {};
  const plan = normalizePlan(
    "plan" in data ? (data.plan as unknown) : SubscriptionPlan.FREE
  );
  const familySource =
    "family" in data && typeof data.family === "object" && data.family !== null
      ? (data.family as Record<string, unknown>)
      : null;

  return {
    plan,
    isActive: Boolean("isActive" in data ? data.isActive : false),
    purchasedAt: normalizeNullableString(data.purchasedAt),
    currentPeriodStartsAt: normalizeNullableString(data.currentPeriodStartsAt),
    expiresAt: normalizeNullableString(data.expiresAt),
    periodType: normalizePeriodType(data.periodType),
    willRenew: Boolean("willRenew" in data ? data.willRenew : false),
    isCanceled: Boolean("isCanceled" in data ? data.isCanceled : false),
    canceledAt: normalizeNullableString(data.canceledAt),
    productId: normalizeNullableString(data.productId),
    entitlement: normalizeNullableString(data.entitlement),
    environment: normalizeNullableString(data.environment),
    store: normalizeNullableString(data.store),
    family: {
      role: normalizeFamilyRole(
        familySource && "role" in familySource ? familySource.role : null,
        plan
      ),
    },
  };
};

export const SubscriptionService = {
  getMySubscription: async (): Promise<BackendSubscriptionState> => {
    const { data } = await finappApi.get("/subscription/me");
    return normalizeSubscription(data);
  },

  reconcile: async (): Promise<void> => {
    await finappApi.post("/subscription/reconcile", {});
  },
};
