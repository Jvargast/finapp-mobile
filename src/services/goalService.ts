import finappApi from "../api/finappApi";
import { FinancialGoal, CreateGoalPayload } from "../types/goal.types";

export const GoalService = {
  getAll: async (): Promise<FinancialGoal[]> => {
    const { data } = await finappApi.get<FinancialGoal[]>("/goals");
    return data;
  },

  getById: async (id: string): Promise<FinancialGoal> => {
    const { data } = await finappApi.get<FinancialGoal>(`/goals/${id}`);
    return data;
  },

  create: async (goalData: CreateGoalPayload): Promise<FinancialGoal> => {
    const payload = {
      ...goalData,
      targetAmount: Number(goalData.targetAmount),
      currentAmount: goalData.currentAmount ?? 0,
      interestRate: goalData.interestRate ?? 0,
    };

    const { data } = await finappApi.post<FinancialGoal>("/goals", payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await finappApi.delete(`/goals/${id}`);
  },
};
