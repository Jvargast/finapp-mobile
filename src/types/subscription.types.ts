import type { CustomerInfo, PurchasesPackage } from "react-native-purchases";

import { SubscriptionPlan } from "./user.types";

export type SubscriptionBillingCycle = "MONTHLY" | "YEARLY";
export type SubscriptionProductKind = "PRO" | "FAMILY";
export type SubscriptionFamilyRole = "ADMIN" | "MEMBER" | "NONE";
export type SubscriptionPeriodType =
  | "TRIAL"
  | "INTRO"
  | "NORMAL"
  | "PROMOTIONAL"
  | "PREPAID"
  | "UNKNOWN";

export interface BackendSubscriptionState {
  plan: SubscriptionPlan;
  isActive: boolean;
  purchasedAt: string | null;
  currentPeriodStartsAt: string | null;
  expiresAt: string | null;
  periodType: SubscriptionPeriodType;
  willRenew: boolean;
  isCanceled: boolean;
  canceledAt: string | null;
  productId: string | null;
  entitlement: string | null;
  environment: string | null;
  store: string | null;
  family: {
    role: SubscriptionFamilyRole;
  } | null;
}

export interface RevenueCatPackageOption {
  planType: SubscriptionProductKind;
  billingCycle: SubscriptionBillingCycle;
  title: string;
  description: string;
  offeringIdentifier: string;
  productIdentifier: string;
  priceString: string;
  periodLabel: string;
  package: PurchasesPackage;
  introPrice: string | null;
}

export interface RevenueCatOfferingOption {
  planType: SubscriptionProductKind;
  identifier: string;
  title: string;
  description: string;
  monthly: RevenueCatPackageOption | null;
  yearly: RevenueCatPackageOption | null;
}

export type RevenueCatOfferingsByPlan = Record<
  SubscriptionProductKind,
  RevenueCatOfferingOption | null
>;

export interface SubscriptionRefreshOptions {
  reason?: string;
  refreshOfferings?: boolean;
  refreshCustomerInfo?: boolean;
  silent?: boolean;
}

export interface SubscriptionContextValue {
  backendSubscription: BackendSubscriptionState | null;
  customerInfo: CustomerInfo | null;
  offerings: RevenueCatOfferingsByPlan;
  plan: SubscriptionPlan;
  familyRole: SubscriptionFamilyRole;
  hasPremiumAccess: boolean;
  isPro: boolean;
  canCreateAccount: boolean;
  canEditCash: boolean;
  canUsePremiumSkins: boolean;
  hasManageSubscription: boolean;
  isConfigured: boolean;
  isInitializing: boolean;
  isRefreshing: boolean;
  isPurchasing: boolean;
  isRestoring: boolean;
  isManaging: boolean;
  error: string | null;
  refresh: (options?: SubscriptionRefreshOptions) => Promise<void>;
  purchasePackage: (
    planType: SubscriptionProductKind,
    billingCycle: SubscriptionBillingCycle
  ) => Promise<BackendSubscriptionState | null>;
  restorePurchases: () => Promise<BackendSubscriptionState | null>;
  openCustomerCenter: () => Promise<void>;
}
