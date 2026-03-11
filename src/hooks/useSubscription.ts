import { useSubscriptionContext } from "../providers/SubscriptionProvider";

export const useSubscription = () => {
  return useSubscriptionContext();
};

