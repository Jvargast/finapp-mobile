import finappApi from "../api/finappApi";

export type OAuthProvider = "GMAIL" | "GOOGLE";

export type EmailNotificationPayload = {
  accountId: string;
  email: string;
  senderEmails?: string[];
  senderDomains?: string[];
  subjectIncludes?: string[];
  syncFrequencyMinutes?: number;
  syncSchedule?: any;
  initialSyncMonths?: number;
};

export const BankingService = {
  listSources: async () => {
    const response = await finappApi.get("/banking/sources");
    return response.data;
  },

  listRules: async () => {
    const response = await finappApi.get("/banking/rules");
    return response.data;
  },

  createRule: async (data: any) => {
    const response = await finappApi.post("/banking/rules", data);
    return response.data;
  },

  updateRule: async (id: string, data: any) => {
    const response = await finappApi.patch(`/banking/rules/${id}`, data);
    return response.data;
  },

  removeRule: async (id: string) => {
    const response = await finappApi.delete(`/banking/rules/${id}`);
    return response.data;
  },

  getSource: async (id: string) => {
    const response = await finappApi.get(`/banking/sources/${id}`);
    return response.data;
  },

  createEmailApi: async (data: any) => {
    const response = await finappApi.post("/banking/sources/email-api", data);
    return response.data;
  },

  createEmailNotification: async (data: EmailNotificationPayload) => {
    const response = await finappApi.post(
      "/banking/sources/email-notification",
      data,
    );
    return response.data;
  },

  createStatement: async (data: any) => {
    const response = await finappApi.post("/banking/sources/statement", data);
    return response.data;
  },

  updateSource: async (id: string, data: any) => {
    const response = await finappApi.patch(`/banking/sources/${id}`, data);
    return response.data;
  },

  createInboundAddress: async (id: string) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/inbound-address`,
    );
    return response.data;
  },

  verifyForward: async (id: string) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/verify-forward`,
    );
    return response.data;
  },

  listSourceRules: async (id: string) => {
    const response = await finappApi.get(`/banking/sources/${id}/rules`);
    return response.data;
  },

  attachRule: async (id: string, ruleId: string) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/rules/${ruleId}`,
    );
    return response.data;
  },

  detachRule: async (id: string, ruleId: string) => {
    const response = await finappApi.delete(
      `/banking/sources/${id}/rules/${ruleId}`,
    );
    return response.data;
  },

  connect: async (id: string, data?: any) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/connect`,
      data ?? {},
    );
    return response.data;
  },

  callback: async (id: string, data: any) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/callback`,
      data,
    );
    return response.data;
  },

  test: async (id: string) => {
    const response = await finappApi.post(`/banking/sources/${id}/test`);
    return response.data;
  },

  preview: async (id: string, data: any) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/preview`,
      data,
    );
    return response.data;
  },

  startSync: async (id: string, data: any) => {
    const response = await finappApi.post(`/banking/sources/${id}/sync`, data);
    return response.data;
  },

  syncStatus: async (id: string) => {
    const response = await finappApi.get(`/banking/sources/${id}/sync-status`);
    return response.data;
  },

  getSchedule: async (id: string) => {
    const response = await finappApi.get(`/banking/sources/${id}/schedule`);
    return response.data;
  },

  uploadStatement: async (id: string, data: any) => {
    const response = await finappApi.post(
      `/banking/sources/${id}/statements/upload`,
      data,
    );
    return response.data;
  },

  removeSource: async (id: string) => {
    const response = await finappApi.delete(`/banking/sources/${id}`);
    return response.data;
  },

  hardDeleteSource: async (id: string) => {
    const response = await finappApi.delete(`/banking/sources/${id}/hard`);
    return response.data;
  },

  listCandidates: async (params?: {
    status?: string;
    source?: string;
    limit?: number;
  }) => {
    const response = await finappApi.get("/banking/candidates", { params });
    return response.data;
  },

  confirmCandidate: async (id: string, data?: any) => {
    const response = await finappApi.post(
      `/banking/candidates/${id}/confirm`,
      data ?? {},
    );
    return response.data;
  },

  confirmCandidates: async (items: any[]) => {
    const response = await finappApi.post("/banking/candidates/confirm", {
      items,
    });
    return response.data;
  },

  ignoreCandidate: async (id: string) => {
    const response = await finappApi.post(`/banking/candidates/${id}/ignore`);
    return response.data;
  },
};
