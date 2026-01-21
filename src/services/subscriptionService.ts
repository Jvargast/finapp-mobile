import finappApi from "../api/finappApi"; // O como se llame tu instancia de Axios
import { SubscriptionPlan } from "../types/user.types";

export const SubscriptionService = {
  purchaseSubscription: async (
    productId: string
  ): Promise<{ plan: SubscriptionPlan; expiresAt: string }> => {
    console.log(
      `💳 Enviando solicitud de suscripción al Backend: ${productId}`
    );

    const response = await finappApi.post("/subscription/subscribe", {
      productId: productId,
    });

    const backendData = response.data;

    const estimatedExpiry = new Date();
    estimatedExpiry.setMonth(estimatedExpiry.getMonth() + 1);

    return {
      plan: backendData.plan,
      expiresAt: estimatedExpiry.toISOString(),
    };
  },
};
