import finappApi from "../api/finappApi";

export const BankingPublicService = {
  oauthCallback: async (params: any) => {
    const cleanedParams: Record<string, string> = {};
    const code =
      params?.code ||
      params?.authorizationCode ||
      params?.authCode ||
      params?.oauthCode;
    if (!code) {
      const keys =
        params && typeof params === "object" ? Object.keys(params) : [];
      throw new Error(
        `OAuth callback público requiere code. Campos recibidos: ${keys.join(",")}`,
      );
    }
    const state = params?.state;
    const redirectUri = params?.redirectUri || params?.redirect_uri;

    cleanedParams.code = String(code);
    if (state) cleanedParams.state = String(state);
    if (redirectUri) cleanedParams.redirectUri = String(redirectUri);

    const response = await finappApi.get("/banking/oauth/callback", {
      params: cleanedParams,
    });
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
