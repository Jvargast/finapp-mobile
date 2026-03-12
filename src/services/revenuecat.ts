import { Linking, Platform } from "react-native";
import Purchases, {
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  type LogInResult,
  type MakePurchaseResult,
  type PurchasesError,
  type PurchasesOfferings,
  type PurchasesPackage,
} from "react-native-purchases";
import RevenueCatUI, {
  type PresentCustomerCenterParams,
} from "react-native-purchases-ui";

import {
  type RevenueCatOfferingsByPlan,
  type RevenueCatOfferingOption,
  type RevenueCatPackageOption,
  type SubscriptionBillingCycle,
  type SubscriptionProductKind,
} from "../types/subscription.types";

const SUPPORTS_NATIVE_PURCHASES =
  Platform.OS === "ios" || Platform.OS === "android";

const REVENUECAT_ENTITLEMENT_ID =
  process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID ?? "woufinance_pro";

const REVENUECAT_OFFERING_IDS: Record<SubscriptionProductKind, string> = {
  PRO: process.env.EXPO_PUBLIC_REVENUECAT_PRO_OFFERING_ID ?? "pro",
  FAMILY: process.env.EXPO_PUBLIC_REVENUECAT_FAMILY_OFFERING_ID ?? "family",
};

const OFFERING_COPY: Record<
  SubscriptionProductKind,
  { title: string; description: string }
> = {
  PRO: {
    title: "WouFinance Pro",
    description: "Control premium, automatizacion y analitica avanzada.",
  },
  FAMILY: {
    title: "WouFinance Family",
    description: "Beneficios premium para ti y tu grupo familiar.",
  },
};

const createEmptyOfferings = (): RevenueCatOfferingsByPlan => ({
  PRO: null,
  FAMILY: null,
});

const getRevenueCatApiKey = () => {
  if (Platform.OS === "ios") {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? null;
  }

  if (Platform.OS === "android") {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? null;
  }

  return null;
};

const formatPeriodLabel = (billingCycle: SubscriptionBillingCycle) => {
  return billingCycle === "MONTHLY" ? "/ mes" : "/ año";
};

const buildPackageOption = (
  planType: SubscriptionProductKind,
  billingCycle: SubscriptionBillingCycle,
  revenueCatPackage: PurchasesPackage
): RevenueCatPackageOption => {
  const copy = OFFERING_COPY[planType];

  return {
    planType,
    billingCycle,
    title: copy.title,
    description: copy.description,
    offeringIdentifier: revenueCatPackage.presentedOfferingContext.offeringIdentifier,
    productIdentifier: revenueCatPackage.product.identifier,
    priceString: revenueCatPackage.product.priceString,
    periodLabel: formatPeriodLabel(billingCycle),
    package: revenueCatPackage,
    introPrice: revenueCatPackage.product.introPrice?.priceString ?? null,
  };
};

const buildOfferingOption = (
  planType: SubscriptionProductKind,
  offerings: PurchasesOfferings
): RevenueCatOfferingOption | null => {
  const identifier = REVENUECAT_OFFERING_IDS[planType];
  const offering = offerings.all[identifier];

  if (!offering) {
    return null;
  }

  const copy = OFFERING_COPY[planType];

  return {
    planType,
    identifier: offering.identifier,
    title: copy.title,
    description: copy.description,
    monthly: offering.monthly
      ? buildPackageOption(planType, "MONTHLY", offering.monthly)
      : null,
    yearly: offering.annual
      ? buildPackageOption(planType, "YEARLY", offering.annual)
      : null,
  };
};

export const RevenueCatService = {
  isSupportedPlatform: () => SUPPORTS_NATIVE_PURCHASES,

  getEntitlementId: () => REVENUECAT_ENTITLEMENT_ID,

  getOfferingIds: () => ({ ...REVENUECAT_OFFERING_IDS }),

  createEmptyOfferings,

  addCustomerInfoUpdateListener: (
    listener: CustomerInfoUpdateListener
  ): void => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return;
    }

    Purchases.addCustomerInfoUpdateListener(listener);
  },

  removeCustomerInfoUpdateListener: (
    listener: CustomerInfoUpdateListener
  ): void => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return;
    }

    Purchases.removeCustomerInfoUpdateListener(listener);
  },

  ensureConfigured: async (
    appUserID: string
  ): Promise<{ isConfigured: boolean; customerInfo: CustomerInfo | null }> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return { isConfigured: false, customerInfo: null };
    }

    const apiKey = getRevenueCatApiKey();

    if (!apiKey) {
      throw new Error(
        "Falta la public SDK key de RevenueCat. Revisa las variables EXPO_PUBLIC_REVENUECAT_*."
      );
    }

    const alreadyConfigured = await Purchases.isConfigured();

    if (!alreadyConfigured) {
      Purchases.configure({
        apiKey,
        appUserID,
      });
    } else {
      const currentAppUserId = await Purchases.getAppUserID();

      if (currentAppUserId !== appUserID) {
        const loginResult: LogInResult = await Purchases.logIn(appUserID);
        await Purchases.setLogLevel(
          __DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO
        );

        return {
          isConfigured: true,
          customerInfo: loginResult.customerInfo,
        };
      }
    }

    await Purchases.setLogLevel(
      __DEV__ ? Purchases.LOG_LEVEL.DEBUG : Purchases.LOG_LEVEL.INFO
    );

    return {
      isConfigured: true,
      customerInfo: await Purchases.getCustomerInfo(),
    };
  },

  logOut: async (): Promise<void> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return;
    }

    const isConfigured = await Purchases.isConfigured();

    if (!isConfigured) {
      return;
    }

    const isAnonymous = await Purchases.isAnonymous();

    if (!isAnonymous) {
      await Purchases.logOut();
    }
  },

  getOfferings: async (): Promise<PurchasesOfferings | null> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return null;
    }

    return Purchases.getOfferings();
  },

  mapOfferings: (
    offerings: PurchasesOfferings | null
  ): RevenueCatOfferingsByPlan => {
    if (!offerings) {
      return createEmptyOfferings();
    }

    return {
      PRO: buildOfferingOption("PRO", offerings),
      FAMILY: buildOfferingOption("FAMILY", offerings),
    };
  },

  getPackageOption: (
    offerings: RevenueCatOfferingsByPlan,
    planType: SubscriptionProductKind,
    billingCycle: SubscriptionBillingCycle
  ): RevenueCatPackageOption | null => {
    const offering = offerings[planType];

    if (!offering) {
      return null;
    }

    return billingCycle === "MONTHLY" ? offering.monthly : offering.yearly;
  },

  getCustomerInfo: async (): Promise<CustomerInfo | null> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return null;
    }

    return Purchases.getCustomerInfo();
  },

  purchasePackage: async (
    revenueCatPackage: PurchasesPackage
  ): Promise<MakePurchaseResult> => {
    return Purchases.purchasePackage(revenueCatPackage);
  },

  restorePurchases: async (): Promise<CustomerInfo | null> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return null;
    }

    return Purchases.restorePurchases();
  },

  presentCustomerCenter: async (
    params?: PresentCustomerCenterParams
  ): Promise<void> => {
    if (!SUPPORTS_NATIVE_PURCHASES) {
      return;
    }

    await RevenueCatUI.presentCustomerCenter(params);
  },

  openManagementUrl: async (url: string): Promise<void> => {
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
      throw new Error("No pudimos abrir la URL de gestión de suscripción.");
    }

    await Linking.openURL(url);
  },

  isPurchaseCancelled: (error: unknown): boolean => {
    const purchasesError = error as PurchasesError | undefined;

    return (
      purchasesError?.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR ||
      purchasesError?.userCancelled === true
    );
  },
};
