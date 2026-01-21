import finappApi from "../api/finappApi";
import { Budget, CreateBudgetParams } from "../types/budget.types";

export const BudgetService = {
  /**
   * @param month
   * @param year
   */
  getBudgets: async (month: number, year: number): Promise<Budget[]> => {
    try {
      const response = await finappApi.get<Budget[]>("/budgets", {
        params: { month, year },
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo presupuestos:", error);
      throw error;
    }
  },

  createBudget: async (data: CreateBudgetParams): Promise<Budget> => {
    try {
      const response = await finappApi.post<Budget>("/budgets", data);
      return response.data;
    } catch (error) {
      console.error("❌ Error creando presupuesto:", error);
      throw error;
    }
  },

  getBudgetById: async (id: string): Promise<Budget> => {
    try {
      const response = await finappApi.get<Budget>(`/budgets/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo presupuesto ${id}:`, error);
      throw error;
    }
  },

  updateBudget: async (
    id: string,
    data: Partial<CreateBudgetParams>
  ): Promise<Budget> => {
    try {
      const response = await finappApi.patch<Budget>(`/budgets/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando presupuesto ${id}:`, error);
      throw error;
    }
  },

  deleteBudget: async (id: string): Promise<void> => {
    try {
      await finappApi.delete(`/budgets/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando presupuesto ${id}:`, error);
      throw error;
    }
  },
};
