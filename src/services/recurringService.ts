import finappApi from "../api/finappApi";
import {
  RecurringTransaction,
  CreateRecurringParams,
  UpdateRecurringParams,
  RecurringFilters,
} from "../types/recurring.types";

export const RecurringService = {
  getAll: async (
    filters: RecurringFilters = {},
  ): Promise<RecurringTransaction[]> => {
    try {
      const response = await finappApi.get<RecurringTransaction[]>(
        "/recurring",
        { params: filters },
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo recurrentes:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<RecurringTransaction> => {
    try {
      const response = await finappApi.get<RecurringTransaction>(
        `/recurring/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo recurrente ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateRecurringParams): Promise<RecurringTransaction> => {
    try {
      const response = await finappApi.post<RecurringTransaction>(
        "/recurring",
        data,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error creando recurrente:",
        error.response?.data || error,
      );
      throw error;
    }
  },

  update: async (
    id: string,
    data: UpdateRecurringParams,
  ): Promise<RecurringTransaction> => {
    try {
      const response = await finappApi.patch<RecurringTransaction>(
        `/recurring/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando recurrente ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await finappApi.delete(`/recurring/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando recurrente ${id}:`, error);
      throw error;
    }
  },
};
