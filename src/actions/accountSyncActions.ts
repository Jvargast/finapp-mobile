import { AccountSyncService } from "../services/accountSyncService";
import { useToastStore } from "../stores/useToastStore";

export const AccountSyncActions = {
  setupSource: async (accountId: string, data: any) => {
    try {
      return await AccountSyncService.setupSource(accountId, data);
    } catch (error) {
      console.error("Error configurando source de cuenta", error);
      useToastStore
        .getState()
        .showToast("No se pudo guardar el metodo", "error");
      throw error;
    }
  },

  getForwardAlias: async (accountId: string) => {
    try {
      return await AccountSyncService.getForwardAlias(accountId);
    } catch (error) {
      console.error("Error obteniendo alias", error);
      throw error;
    }
  },

  syncEmailHistory: async (accountId: string, data: any) => {
    try {
      return await AccountSyncService.syncEmailHistory(accountId, data);
    } catch (error) {
      console.error("Error iniciando sync email history", error);
      useToastStore
        .getState()
        .showToast("No se pudo iniciar la importacion", "error");
      throw error;
    }
  },

  syncStatement: async (accountId: string, data: any) => {
    try {
      return await AccountSyncService.syncStatement(accountId, data);
    } catch (error) {
      console.error("Error iniciando sync de cartola", error);
      useToastStore
        .getState()
        .showToast("No se pudo importar la cartola", "error");
      throw error;
    }
  },
};
