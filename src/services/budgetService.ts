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
    } catch (error: any) {
      console.error("❌ Backend Error Response:", error.response?.data);
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

  join: async (token: string): Promise<void> => {
    await finappApi.post("/budgets/join", { token });
  },

  removeParticipant: async (
    budgetId: string,
    userId: string
  ): Promise<void> => {
    await finappApi.delete(`/budgets/${budgetId}/participants/${userId}`);
  },

  leave: async (budgetId: string): Promise<void> => {
    await finappApi.post(`/budgets/${budgetId}/leave`);
  },

  regenerateToken: async (
    budgetId: string
  ): Promise<{ shareToken: string }> => {
    const { data } = await finappApi.post<{ shareToken: string }>(
      `/budgets/${budgetId}/regenerate-token`
    );
    return data;
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
