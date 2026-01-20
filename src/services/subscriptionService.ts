import { SubscriptionPlan } from "../types/user.types";

export const SubscriptionService = {
  purchaseSubscription: async (
    productId: string
  ): Promise<{ plan: SubscriptionPlan; expiresAt: string }> => {
    return new Promise((resolve, reject) => {
      console.log(`💳 Iniciando cobro simulado para: ${productId}`);

      setTimeout(() => {
        const isSuccess = true;

        if (isSuccess) {
          const expiryDate = new Date();

          if (productId.toLowerCase().includes("monthly")) {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          } else if (productId.toLowerCase().includes("yearly")) {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          } else {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          }

          let assignedPlan: any = "PRO";

          if (productId.toLowerCase().includes("family")) {
            assignedPlan = "FAMILY_ADMIN";
          } else {
            assignedPlan = "PRO";
          }

          resolve({
            plan: assignedPlan as SubscriptionPlan,
            expiresAt: expiryDate.toISOString(),
          });
        } else {
          reject(new Error("El usuario canceló el pago o la tarjeta falló."));
        }
      }, 2000); 
    });
  },
};
