import finappApi from "../api/finappApi";
import {
  BankLink,
  CreateLinkParams,
  SyncResponse,
} from "../types/fintoc.types";

export const FintocService = {
  createLink: async (data: CreateLinkParams): Promise<BankLink> => {
    try {
      const response = await finappApi.post<BankLink>("/fintoc/link", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error vinculando cuenta bancaria:",
        error.response?.data || error
      );
      throw error;
    }
  },

  getAll: async (): Promise<BankLink[]> => {
    try {
      const response = await finappApi.get<BankLink[]>("/fintoc");
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo bancos conectados:", error);
      throw error;
    }
  },

  sync: async (linkId: string): Promise<SyncResponse> => {
    try {
      const response = await finappApi.post<SyncResponse>(
        `/fintoc/${linkId}/sync`
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error sincronizando banco ${linkId}:`, error);
      throw error;
    }
  },

  delete: async (linkId: string): Promise<void> => {
    try {
      await finappApi.delete(`/fintoc/${linkId}`);
    } catch (error) {
      console.error(`❌ Error eliminando banco ${linkId}:`, error);
      throw error;
    }
  },
};
