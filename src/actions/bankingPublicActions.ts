import { BankingPublicService } from "../services/bankingPublicService";
import { useToastStore } from "../stores/useToastStore";

export const BankingPublicActions = {
  oauthCallback: async (params: any) => {
    try {
      return await BankingPublicService.oauthCallback(params);
    } catch (error) {
      console.error("Error en oauth callback", error);
      useToastStore
        .getState()
        .showToast("No se pudo procesar el callback", "error");
      throw error;
    }
  },

  inboundEmail: async (data: any, inboundSecret?: string) => {
    try {
      return await BankingPublicService.inboundEmail(data, inboundSecret);
    } catch (error) {
      console.error("Error ingestando email inbound", error);
      useToastStore
        .getState()
        .showToast("No se pudo procesar el email", "error");
      throw error;
    }
  },
};
