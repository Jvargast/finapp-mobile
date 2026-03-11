import axios from "axios";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";
import type {
  CustomerInfo,
  CustomerInfoUpdateListener,
} from "react-native-purchases";

import { RevenueCatService } from "../services/revenuecat";
import { SubscriptionService } from "../services/subscriptionService";
import { useAccountStore } from "../stores/useAccountStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useToastStore } from "../stores/useToastStore";
import { useUserStore } from "../stores/useUserStore";
import {
  type BackendSubscriptionState,
  type RevenueCatOfferingsByPlan,
  type SubscriptionBillingCycle,
  type SubscriptionContextValue,
  type SubscriptionProductKind,
  type SubscriptionRefreshOptions,
} from "../types/subscription.types";
import { SubscriptionPlan } from "../types/user.types";

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const apiMessage =
      typeof error.response?.data?.message === "string"
        ? error.response.data.message
        : null;

    return apiMessage ?? fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const getFamilyRoleFromPlan = (plan: SubscriptionPlan) => {
  if (plan === SubscriptionPlan.FAMILY_ADMIN) {
    return "ADMIN" as const;
  }

  if (plan === SubscriptionPlan.FAMILY_MEMBER) {
    return "MEMBER" as const;
  }

  return "NONE" as const;
};

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const user = useUserStore((state) => state.user);
  const syncSubscriptionState = useUserStore(
    (state) => state.syncSubscriptionState
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accountsCount = useAccountStore((state) => state.accounts.length);
  const showToast = useToastStore((state) => state.showToast);

  const [backendSubscription, setBackendSubscription] =
    useState<BackendSubscriptionState | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [offerings, setOfferings] = useState<RevenueCatOfferingsByPlan>(
    RevenueCatService.createEmptyOfferings()
  );
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  const backendSyncRef = useRef<{
    userId: string;
    promise: Promise<BackendSubscriptionState | null>;
  } | null>(null);
  const offeringsRef = useRef(offerings);
  const customerInfoRef = useRef(customerInfo);

  useEffect(() => {
    offeringsRef.current = offerings;
  }, [offerings]);

  useEffect(() => {
    customerInfoRef.current = customerInfo;
  }, [customerInfo]);

  const authUserId = isAuthenticated ? user?.id ?? null : null;

  const isCurrentUser = (expectedUserId: string) => {
    return useUserStore.getState().user?.id === expectedUserId;
  };

  const applyBackendSubscription = (
    nextSubscription: BackendSubscriptionState | null
  ) => {
    setBackendSubscription(nextSubscription);
    syncSubscriptionState(nextSubscription);
  };

  const resetSubscriptionState = () => {
    setBackendSubscription(null);
    setCustomerInfo(null);
    setOfferings(RevenueCatService.createEmptyOfferings());
    setError(null);
    setIsConfigured(false);
    setIsInitializing(false);
    setIsRefreshing(false);
    setIsPurchasing(false);
    setIsRestoring(false);
    setIsManaging(false);
  };

  const syncBackendState = async (
    expectedUserId: string,
    fallbackMessage: string
  ) => {
    if (!isCurrentUser(expectedUserId)) {
      return null;
    }

    if (backendSyncRef.current?.userId === expectedUserId) {
      return backendSyncRef.current.promise;
    }

    const promise = (async () => {
      await SubscriptionService.reconcile();
      const nextSubscription = await SubscriptionService.getMySubscription();

      if (isCurrentUser(expectedUserId)) {
        applyBackendSubscription(nextSubscription);
        setError(null);
      }

      return nextSubscription;
    })();

    backendSyncRef.current = {
      userId: expectedUserId,
      promise,
    };

    try {
      return await promise;
    } catch (syncError) {
      if (isCurrentUser(expectedUserId)) {
        setError(getErrorMessage(syncError, fallbackMessage));
      }

      throw syncError;
    } finally {
      if (backendSyncRef.current?.promise === promise) {
        backendSyncRef.current = null;
      }
    }
  };

  const refreshOfferings = async (expectedUserId: string) => {
    if (!RevenueCatService.isSupportedPlatform()) {
      setOfferings(RevenueCatService.createEmptyOfferings());
      return RevenueCatService.createEmptyOfferings();
    }

    const rawOfferings = await RevenueCatService.getOfferings();
    const mappedOfferings = RevenueCatService.mapOfferings(rawOfferings);

    if (isCurrentUser(expectedUserId)) {
      setOfferings(mappedOfferings);
    }

    return mappedOfferings;
  };

  const refreshCustomerInfo = async (expectedUserId: string) => {
    if (!RevenueCatService.isSupportedPlatform()) {
      return null;
    }

    const nextCustomerInfo = await RevenueCatService.getCustomerInfo();

    if (isCurrentUser(expectedUserId)) {
      setCustomerInfo(nextCustomerInfo);
    }

    return nextCustomerInfo;
  };

  const refresh = async (options?: SubscriptionRefreshOptions) => {
    const expectedUserId = useUserStore.getState().user?.id;

    if (!expectedUserId) {
      return;
    }

    const refreshOfferingsEnabled = options?.refreshOfferings ?? true;
    const refreshCustomerInfoEnabled = options?.refreshCustomerInfo ?? true;
    const silent = options?.silent ?? false;
    const fallbackMessage = "No pudimos actualizar tu suscripcion.";

    if (!silent) {
      setIsRefreshing(true);
    }

    try {
      const configuration = await RevenueCatService.ensureConfigured(expectedUserId);

      if (!isCurrentUser(expectedUserId)) {
        return;
      }

      setIsConfigured(configuration.isConfigured);

      if (configuration.customerInfo) {
        setCustomerInfo(configuration.customerInfo);
      }

      if (refreshOfferingsEnabled) {
        await refreshOfferings(expectedUserId);
      }

      if (refreshCustomerInfoEnabled) {
        await refreshCustomerInfo(expectedUserId);
      }

      await syncBackendState(expectedUserId, fallbackMessage);
    } catch (refreshError) {
      if (!isCurrentUser(expectedUserId)) {
        return;
      }

      const message = getErrorMessage(refreshError, fallbackMessage);
      setError(message);

      if (!silent) {
        showToast(message, "error");
      }

      throw refreshError;
    } finally {
      if (!silent && isCurrentUser(expectedUserId)) {
        setIsRefreshing(false);
      }
    }
  };

  const purchasePackage = async (
    planType: SubscriptionProductKind,
    billingCycle: SubscriptionBillingCycle
  ) => {
    const expectedUserId = useUserStore.getState().user?.id;

    if (!expectedUserId) {
      throw new Error("Debes iniciar sesion para comprar una suscripcion.");
    }

    let selectedPackage = RevenueCatService.getPackageOption(
      offeringsRef.current,
      planType,
      billingCycle
    );

    if (!selectedPackage) {
      await refresh({
        reason: "missing_offering_before_purchase",
        silent: true,
      });

      selectedPackage = RevenueCatService.getPackageOption(
        offeringsRef.current,
        planType,
        billingCycle
      );
    }

    if (!selectedPackage) {
      const message = "No encontramos ese plan en RevenueCat. Revisa tus offerings.";
      setError(message);
      throw new Error(message);
    }

    setIsPurchasing(true);
    setError(null);

    try {
      const purchaseResult = await RevenueCatService.purchasePackage(
        selectedPackage.package
      );

      if (!isCurrentUser(expectedUserId)) {
        return null;
      }

      setCustomerInfo(purchaseResult.customerInfo);

      const nextSubscription = await syncBackendState(
        expectedUserId,
        "La compra se realizo, pero no pudimos validarla con el backend."
      );

      showToast("Suscripcion actualizada correctamente.", "success");

      return nextSubscription;
    } catch (purchaseError) {
      if (!isCurrentUser(expectedUserId)) {
        return null;
      }

      if (RevenueCatService.isPurchaseCancelled(purchaseError)) {
        showToast("Compra cancelada.", "info");
        return null;
      }

      const message = getErrorMessage(
        purchaseError,
        "No pudimos completar la compra."
      );
      setError(message);
      showToast(message, "error");
      throw purchaseError;
    } finally {
      if (isCurrentUser(expectedUserId)) {
        setIsPurchasing(false);
      }
    }
  };

  const restorePurchases = async () => {
    const expectedUserId = useUserStore.getState().user?.id;

    if (!expectedUserId) {
      throw new Error("Debes iniciar sesion para restaurar compras.");
    }

    setIsRestoring(true);
    setError(null);

    try {
      const restoredCustomerInfo = await RevenueCatService.restorePurchases();

      if (!isCurrentUser(expectedUserId)) {
        return null;
      }

      if (restoredCustomerInfo) {
        setCustomerInfo(restoredCustomerInfo);
      }

      const nextSubscription = await syncBackendState(
        expectedUserId,
        "Restauramos la compra, pero no pudimos sincronizarla con el backend."
      );

      showToast("Compras restauradas.", "success");
      return nextSubscription;
    } catch (restoreError) {
      if (!isCurrentUser(expectedUserId)) {
        return null;
      }

      const message = getErrorMessage(
        restoreError,
        "No pudimos restaurar tus compras."
      );
      setError(message);
      showToast(message, "error");
      throw restoreError;
    } finally {
      if (isCurrentUser(expectedUserId)) {
        setIsRestoring(false);
      }
    }
  };

  const openCustomerCenter = async () => {
    const expectedUserId = useUserStore.getState().user?.id;

    if (!expectedUserId) {
      throw new Error("Debes iniciar sesion para gestionar tu suscripcion.");
    }

    setIsManaging(true);
    setError(null);

    try {
      await RevenueCatService.presentCustomerCenter({
        callbacks: {
          onRestoreStarted: () => {
            if (isCurrentUser(expectedUserId)) {
              setIsRestoring(true);
            }
          },
          onRestoreCompleted: ({ customerInfo: restoredCustomerInfo }) => {
            if (!isCurrentUser(expectedUserId)) {
              return;
            }

            setCustomerInfo(restoredCustomerInfo);
            showToast("Compras restauradas.", "success");

            void syncBackendState(
              expectedUserId,
              "Restauramos la compra, pero no pudimos sincronizarla con el backend."
            ).catch(() => undefined);
          },
          onRestoreFailed: ({ error: restoreError }) => {
            if (!isCurrentUser(expectedUserId)) {
              return;
            }

            const message = getErrorMessage(
              restoreError,
              "No pudimos restaurar tus compras."
            );
            setError(message);
            showToast(message, "error");
          },
        },
      });

      if (!isCurrentUser(expectedUserId)) {
        return;
      }

      await refresh({
        reason: "customer_center_closed",
        refreshOfferings: false,
        refreshCustomerInfo: true,
        silent: true,
      });
    } catch (manageError) {
      if (!isCurrentUser(expectedUserId)) {
        return;
      }

      const managementUrl = customerInfoRef.current?.managementURL;

      if (managementUrl) {
        await RevenueCatService.openManagementUrl(managementUrl);
        return;
      }

      const message = getErrorMessage(
        manageError,
        "No pudimos abrir la gestion de la suscripcion."
      );
      setError(message);
      showToast(message, "error");
      throw manageError;
    } finally {
      if (isCurrentUser(expectedUserId)) {
        setIsManaging(false);
        setIsRestoring(false);
      }
    }
  };

  useEffect(() => {
    if (!authUserId) {
      resetSubscriptionState();
      void RevenueCatService.logOut().catch(() => undefined);
      return;
    }

    let isCancelled = false;

    const customerInfoListener: CustomerInfoUpdateListener = (nextCustomerInfo) => {
      if (isCancelled || !isCurrentUser(authUserId)) {
        return;
      }

      setCustomerInfo(nextCustomerInfo);

      void syncBackendState(
        authUserId,
        "No pudimos sincronizar la suscripcion tras actualizar RevenueCat."
      ).catch((listenerError) => {
        if (!isCurrentUser(authUserId)) {
          return;
        }

        setError(
          getErrorMessage(
            listenerError,
            "No pudimos sincronizar la suscripcion tras actualizar RevenueCat."
          )
        );
      });
    };

    RevenueCatService.addCustomerInfoUpdateListener(customerInfoListener);
    setIsInitializing(true);
    setError(null);

    void (async () => {
      try {
        const configuration = await RevenueCatService.ensureConfigured(authUserId);

        if (isCancelled || !isCurrentUser(authUserId)) {
          return;
        }

        setIsConfigured(configuration.isConfigured);

        if (configuration.customerInfo) {
          setCustomerInfo(configuration.customerInfo);
        }

        await Promise.all([
          refreshOfferings(authUserId),
          refreshCustomerInfo(authUserId),
        ]);

        await syncBackendState(
          authUserId,
          "No pudimos sincronizar tu suscripcion al iniciar la app."
        );
      } catch (initializationError) {
        if (isCancelled || !isCurrentUser(authUserId)) {
          return;
        }

        setError(
          getErrorMessage(
            initializationError,
            "No pudimos inicializar las suscripciones."
          )
        );
      } finally {
        if (!isCancelled && isCurrentUser(authUserId)) {
          setIsInitializing(false);
        }
      }
    })();

    return () => {
      isCancelled = true;
      RevenueCatService.removeCustomerInfoUpdateListener(customerInfoListener);
    };
  }, [authUserId]);

  useEffect(() => {
    if (!authUserId) {
      return;
    }

    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refresh({
          reason: "app_became_active",
          refreshOfferings: false,
          refreshCustomerInfo: true,
          silent: true,
        }).catch(() => undefined);
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [authUserId]);

  const plan = backendSubscription?.plan ?? user?.plan ?? SubscriptionPlan.FREE;
  const familyRole =
    backendSubscription?.family?.role ?? getFamilyRoleFromPlan(plan);
  const hasPremiumAccess = backendSubscription?.isActive ?? false;
  const hasManageSubscription =
    plan !== SubscriptionPlan.FREE || Boolean(customerInfo?.managementURL);

  const value: SubscriptionContextValue = {
    backendSubscription,
    customerInfo,
    offerings,
    plan,
    familyRole,
    hasPremiumAccess,
    isPro: hasPremiumAccess,
    canCreateAccount: hasPremiumAccess || accountsCount < 3,
    canEditCash: hasPremiumAccess,
    canUsePremiumSkins: hasPremiumAccess,
    hasManageSubscription,
    isConfigured,
    isInitializing,
    isRefreshing,
    isPurchasing,
    isRestoring,
    isManaging,
    error,
    refresh,
    purchasePackage,
    restorePurchases,
    openCustomerCenter,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);

  if (!context) {
    throw new Error("useSubscription must be used inside SubscriptionProvider.");
  }

  return context;
}
