import { BankingService } from "../services/bankingService";
import { useToastStore } from "../stores/useToastStore";

export const BankingActions = {
  listSources: async () => {
    try {
      return await BankingService.listSources();
    } catch (error) {
      console.error("Error listando sources", error);
      throw error;
    }
  },

  listRules: async () => {
    try {
      return await BankingService.listRules();
    } catch (error) {
      console.error("Error listando rules", error);
      throw error;
    }
  },

  createRule: async (data: any) => {
    try {
      const res = await BankingService.createRule(data);
      useToastStore.getState().showToast("Regla creada", "success");
      return res;
    } catch (error) {
      console.error("Error creando regla", error);
      useToastStore.getState().showToast("No se pudo crear la regla", "error");
      throw error;
    }
  },

  updateRule: async (id: string, data: any) => {
    try {
      const res = await BankingService.updateRule(id, data);
      useToastStore.getState().showToast("Regla actualizada", "success");
      return res;
    } catch (error) {
      console.error("Error actualizando regla", error);
      useToastStore
        .getState()
        .showToast("No se pudo actualizar la regla", "error");
      throw error;
    }
  },

  removeRule: async (id: string) => {
    try {
      const res = await BankingService.removeRule(id);
      useToastStore.getState().showToast("Regla eliminada", "success");
      return res;
    } catch (error) {
      console.error("Error eliminando regla", error);
      useToastStore
        .getState()
        .showToast("No se pudo eliminar la regla", "error");
      throw error;
    }
  },

  getSource: async (id: string) => {
    try {
      return await BankingService.getSource(id);
    } catch (error) {
      console.error("Error obteniendo source", error);
      throw error;
    }
  },

  createEmailApi: async (data: any) => {
    try {
      const res = await BankingService.createEmailApi(data);
      useToastStore
        .getState()
        .showToast("Fuente creada correctamente", "success");
      return res;
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      console.error("Error creando fuente email-api:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      useToastStore
        .getState()
        .showToast(
          apiMessage ? String(apiMessage) : "No se pudo crear la fuente",
          "error",
        );
      throw error;
    }
  },

  createEmailNotification: async (data: any) => {
    try {
      const res = await BankingService.createEmailNotification(data);
      useToastStore
        .getState()
        .showToast("Fuente creada correctamente", "success");
      return res;
    } catch (error) {
      console.error("Error creando fuente email-notification", error);
      useToastStore
        .getState()
        .showToast("No se pudo crear la fuente", "error");
      throw error;
    }
  },

  createStatement: async (data: any) => {
    try {
      const res = await BankingService.createStatement(data);
      useToastStore
        .getState()
        .showToast("Fuente creada correctamente", "success");
      return res;
    } catch (error) {
      console.error("Error creando fuente statement", error);
      useToastStore
        .getState()
        .showToast("No se pudo crear la fuente", "error");
      throw error;
    }
  },

  updateSource: async (id: string, data: any) => {
    try {
      const res = await BankingService.updateSource(id, data);
      useToastStore
        .getState()
        .showToast("Fuente actualizada", "success");
      return res;
    } catch (error) {
      console.error("Error actualizando fuente", error);
      useToastStore
        .getState()
        .showToast("No se pudo actualizar la fuente", "error");
      throw error;
    }
  },

  createInboundAddress: async (id: string) => {
    try {
      return await BankingService.createInboundAddress(id);
    } catch (error) {
      console.error("Error creando inbound address", error);
      throw error;
    }
  },

  verifyForward: async (id: string) => {
    try {
      return await BankingService.verifyForward(id);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        useToastStore.getState().showToast(String(apiMessage), "error");
      }
      console.error("Error verificando forward", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      throw error;
    }
  },

  listSourceRules: async (id: string) => {
    try {
      return await BankingService.listSourceRules(id);
    } catch (error) {
      console.error("Error listando reglas de source", error);
      throw error;
    }
  },

  attachRule: async (id: string, ruleId: string) => {
    try {
      return await BankingService.attachRule(id, ruleId);
    } catch (error) {
      console.error("Error adjuntando regla", error);
      throw error;
    }
  },

  detachRule: async (id: string, ruleId: string) => {
    try {
      return await BankingService.detachRule(id, ruleId);
    } catch (error) {
      console.error("Error removiendo regla", error);
      throw error;
    }
  },

  connect: async (id: string, data?: any) => {
    try {
      return await BankingService.connect(id, data);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      console.error("Error en connect:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
      if (apiMessage) {
        useToastStore.getState().showToast(String(apiMessage), "error");
      }
      throw error;
    }
  },

  callback: async (id: string, data: any) => {
    try {
      return await BankingService.callback(id, data);
    } catch (error) {
      console.error("Error en callback", error);
      throw error;
    }
  },

  test: async (id: string) => {
    try {
      return await BankingService.test(id);
    } catch (error) {
      console.error("Error en test source", error);
      throw error;
    }
  },

  preview: async (id: string, data: any) => {
    try {
      return await BankingService.preview(id, data);
    } catch (error) {
      console.error("Error en preview", error);
      throw error;
    }
  },

  startSync: async (id: string, data: any) => {
    try {
      return await BankingService.startSync(id, data);
    } catch (error) {
      console.error("Error iniciando sync", error);
      throw error;
    }
  },

  syncStatus: async (id: string) => {
    try {
      return await BankingService.syncStatus(id);
    } catch (error) {
      console.error("Error obteniendo sync status", error);
      throw error;
    }
  },

  getSchedule: async (id: string) => {
    try {
      return await BankingService.getSchedule(id);
    } catch (error) {
      console.error("Error obteniendo schedule", error);
      throw error;
    }
  },

  uploadStatement: async (id: string, data: any) => {
    try {
      return await BankingService.uploadStatement(id, data);
    } catch (error) {
      console.error("Error subiendo cartola", error);
      throw error;
    }
  },

  removeSource: async (id: string) => {
    try {
      return await BankingService.removeSource(id);
    } catch (error) {
      console.error("Error eliminando source", error);
      throw error;
    }
  },

  hardDeleteSource: async (id: string) => {
    try {
      return await BankingService.hardDeleteSource(id);
    } catch (error) {
      console.error("Error eliminando source (hard)", error);
      throw error;
    }
  },

  listCandidates: async (params?: {
    status?: string;
    source?: string;
    limit?: number;
  }) => {
    try {
      return await BankingService.listCandidates(params);
    } catch (error) {
      console.error("Error listando candidatos", error);
      throw error;
    }
  },

  confirmCandidate: async (id: string, overrides?: any) => {
    try {
      const res = await BankingService.confirmCandidate(id, overrides);
      useToastStore.getState().showToast("Movimiento confirmado", "success");
      return res;
    } catch (error) {
      console.error("Error confirmando candidato", error);
      useToastStore
        .getState()
        .showToast("No se pudo confirmar el movimiento", "error");
      throw error;
    }
  },

  confirmCandidates: async (items: any[]) => {
    try {
      const res = await BankingService.confirmCandidates(items);
      useToastStore
        .getState()
        .showToast("Movimientos confirmados", "success");
      return res;
    } catch (error) {
      console.error("Error confirmando candidatos", error);
      useToastStore
        .getState()
        .showToast("No se pudieron confirmar", "error");
      throw error;
    }
  },

  ignoreCandidate: async (id: string) => {
    try {
      const res = await BankingService.ignoreCandidate(id);
      useToastStore.getState().showToast("Movimiento ignorado", "success");
      return res;
    } catch (error) {
      console.error("Error ignorando candidato", error);
      useToastStore
        .getState()
        .showToast("No se pudo ignorar el movimiento", "error");
      throw error;
    }
  },
};
