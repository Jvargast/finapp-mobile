import finappApi from "../api/finappApi";
import {
  BankLink,
  CreateLinkIntentResponse,
  ExchangeTokenParams,
  SyncAllResponse,
  SyncResponse,
} from "../types/fintoc.types";

type LinkStatus = "active" | "disconnected" | "all";

export const FintocService = {
  createLinkIntent: async (): Promise<CreateLinkIntentResponse> => {
    try {
      const response = await finappApi.post<CreateLinkIntentResponse>(
        "/fintoc/link-intent",
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error creando link intent:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  exchangeToken: async (data: ExchangeTokenParams): Promise<BankLink> => {
    try {
      const response = await finappApi.post<BankLink>("/fintoc/exchange", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error haciendo exchange:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  getAll: async (status: LinkStatus = "active"): Promise<BankLink[]> => {
    try {
      const response = await finappApi.get<BankLink[]>("/fintoc", {
        params: { status },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error obteniendo bancos conectados:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  getUiAccounts: async () => {
    try {
      const response = await finappApi.get("/fintoc/ui-accounts");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error obteniendo cuentas para UI:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  sync: async (linkId: string): Promise<SyncResponse> => {
    try {
      const response = await finappApi.post<SyncResponse>(
        `/fintoc/${linkId}/sync`,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        `❌ Error sincronizando banco ${linkId}:`,
        error.response?.data || error,
      );
      throw error;
    }
  },

  syncAll: async (): Promise<SyncAllResponse> => {
    try {
      const response =
        await finappApi.post<SyncAllResponse>("/fintoc/sync-all");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error sincronizando todos los bancos:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  syncStatus: async (
    linkId: string,
  ): Promise<{ state: string; jobId?: string }> => {
    const res = await finappApi.get(`/fintoc/${linkId}/sync-status`);
    return res.data;
  },

  disconnect: async (
    linkId: string,
    deleteAccounts = false,
  ): Promise<{ ok: boolean; deletedAccounts: number }> => {
    const response = await finappApi.post(`/fintoc/${linkId}/disconnect`, {
      deleteAccounts,
    });
    return response.data;
  },

  backfillColors: async (): Promise<{ updated: number }> => {
    try {
      const response = await finappApi.post<{ updated: number }>(
        "/fintoc/backfill-colors",
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error en backfill de colores:",
        error.response?.data || error,
      );
      throw error;
    }
  },
};
