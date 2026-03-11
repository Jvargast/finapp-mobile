import { create } from "zustand";
import { type BackendSubscriptionState } from "../types/subscription.types";
import { SubscriptionPlan, User } from "../types/user.types";

interface UserState {
  user: User | null;
  setUser: (user: any) => void;
  clearUser: () => void;
  updateSubscriptionStatus: (
    plan: SubscriptionPlan,
    expiresAt?: string
  ) => void;
  syncSubscriptionState: (
    subscription: BackendSubscriptionState | null
  ) => void;
  isPro: () => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  updateSubscriptionStatus: (plan, expiresAt) =>
    set((state) => {
      if (!state.user) return {};
      return {
        user: {
          ...state.user,
          plan: plan,
          subscriptionExpiresAt: expiresAt || state.user.subscriptionExpiresAt,
        },
      };
    }),
  syncSubscriptionState: (subscription) =>
    set((state) => {
      if (!state.user) return {};

      return {
        user: {
          ...state.user,
          plan: subscription?.plan ?? SubscriptionPlan.FREE,
          subscriptionExpiresAt: subscription?.expiresAt ?? null,
        },
      };
    }),

  isPro: () => {
    const user = get().user;
    if (!user) return false;

    return (
      user.plan === SubscriptionPlan.PRO ||
      user.plan === SubscriptionPlan.FAMILY_ADMIN ||
      user.plan === SubscriptionPlan.FAMILY_MEMBER
    );
  },
}));
