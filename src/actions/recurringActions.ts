import { RecurringService } from "../services/recurringService";
import { useRecurringStore } from "../stores/useRecurringStore";
import {
  CreateRecurringParams,
  RecurringFilters,
  UpdateRecurringParams,
} from "../types/recurring.types";

export const RecurringActions = {
  loadRecurring: async (filters: RecurringFilters = {}) => {
    const store = useRecurringStore.getState();
    if (store.isLoading) return;
    store.setLoading(true);
    try {
      const data: any = await RecurringService.getAll(filters);
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      store.setRecurring(list);
    } catch (error) {
      console.error("Error cargando recurrentes:", error);
    } finally {
      store.setLoading(false);
    }
  },

  getRecurringById: async (id: string) => {
    try {
      const item = await RecurringService.getById(id);
      useRecurringStore.getState().updateRecurring(item);
      return item;
    } catch (error) {
      console.error(`Error obteniendo recurrente ${id}:`, error);
      throw error;
    }
  },

  createRecurring: async (data: CreateRecurringParams) => {
    const store = useRecurringStore.getState();
    store.setLoading(true);
    try {
      const created = await RecurringService.create(data);
      store.addRecurring(created);
      return created;
    } catch (error) {
      console.error("Error creando recurrente:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  updateRecurring: async (id: string, data: UpdateRecurringParams) => {
    const store = useRecurringStore.getState();
    store.setLoading(true);
    try {
      const updated = await RecurringService.update(id, data);
      store.updateRecurring(updated);
      return updated;
    } catch (error) {
      console.error("Error actualizando recurrente:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  deleteRecurring: async (id: string) => {
    const store = useRecurringStore.getState();
    const previous = store.recurring;
    store.removeRecurring(id);
    try {
      await RecurringService.delete(id);
    } catch (error) {
      console.error("Error eliminando recurrente:", error);
      store.setRecurring(previous);
      throw error;
    }
  },
};
