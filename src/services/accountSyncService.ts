import finappApi from "../api/finappApi";

export const AccountSyncService = {
  setupSource: async (accountId: string, data: any) => {
    const response = await finappApi.post(
      `/accounts/${accountId}/setup/source`,
      data,
    );
    return response.data;
  },

  getForwardAlias: async (accountId: string) => {
    const response = await finappApi.get(`/accounts/${accountId}/forward-alias`);
    return response.data;
  },

  syncEmailHistory: async (accountId: string, data: any) => {
    const response = await finappApi.post(
      `/accounts/${accountId}/sync/email-history`,
      data,
    );
    return response.data;
  },

  syncStatement: async (
    accountId: string,
    data: { fileUrl?: string; filename?: string; format?: string }
  ) => {
    const response = await finappApi.post(
      `/accounts/${accountId}/sync/statement`,
      data,
    );
    return response.data;
  },
};
