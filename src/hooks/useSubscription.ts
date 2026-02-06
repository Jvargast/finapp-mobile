import { useUserStore } from "../stores/useUserStore";
import { useAccountStore } from "../stores/useAccountStore";

export const useSubscription = () => {
  const user = useUserStore((state) => state.user);
  const accounts = useAccountStore((state) => state.accounts);

  const isPro = user?.plan && user.plan !== "FREE";

  return {
    isPro,
    canCreateAccount: isPro || accounts.length < 3,
    canEditCash: isPro,
    canUsePremiumSkins: isPro,
  };
};
