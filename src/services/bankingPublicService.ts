import finappApi from "../api/finappApi";

export const BankingPublicService = {
  oauthCallback: async (params: any) => {
    const response = await finappApi.get("/banking/oauth/callback", { params });
    return response.data;
  },

  inboundEmail: async (data: any, inboundSecret?: string) => {
    const response = await finappApi.post("/banking/inbound/email", data, {
      headers: inboundSecret
        ? { "x-inbound-secret": inboundSecret }
        : undefined,
    });
    return response.data;
  },
};
