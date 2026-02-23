import finappApi from "../api/finappApi";
import { Account, AccountSetupMethod } from "../types/account.types";

export const AccountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await finappApi.get("/accounts");
    return response.data;
  },
  getById: async (id: string): Promise<Account> => {
    const response = await finappApi.get(`/accounts/${id}`);
    return response.data;
  },

  create: async (data: Omit<Account, "id" | "userId">): Promise<Account> => {
    const response = await finappApi.post("/accounts", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Account>): Promise<Account> => {
    const response = await finappApi.patch(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await finappApi.delete(`/accounts/${id}`);
  },

  setSetupSource: async (
    id: string,
    method: AccountSetupMethod,
    provider?: "GMAIL" | "GOOGLE"
  ): Promise<Account> => {
    const mapMethodToApi = (value: AccountSetupMethod) => {
      if (value === AccountSetupMethod.EMAIL_HISTORY) return "OAUTH_EMAIL";
      if (value === AccountSetupMethod.EMAIL_FORWARD) return "FORWARD_ALIAS";
      return "STATEMENT_IMPORT";
    };

    const payload: any = { type: mapMethodToApi(method) };
    if (method === AccountSetupMethod.EMAIL_HISTORY && provider) {
      payload.provider = provider;
    }

    const response = await finappApi.post(`/accounts/${id}/setup/source`, payload);
    return response.data;
  },

  syncEmailHistory: async (
    id: string,
    payload?: { fromDate?: string; toDate?: string }
  ): Promise<void> => {
    await finappApi.post(`/accounts/${id}/sync/email-history`, payload || {});
  },

  resetSync: async (id: string): Promise<void> => {
    await finappApi.post(`/accounts/${id}/sync/reset`);
  },

  getForwardAlias: async (id: string): Promise<{ alias: string }> => {
    const response = await finappApi.get(`/accounts/${id}/forward-alias`);
    return response.data;
  },

  syncStatement: async (
    id: string,
    payload: { fileUrl?: string; filename?: string; format?: string }
  ): Promise<void> => {
    await finappApi.post(`/accounts/${id}/sync/statement`, payload);
  },
};
