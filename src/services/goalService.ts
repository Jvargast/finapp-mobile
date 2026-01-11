import finappApi from "../api/finappApi";
import {
  FinancialGoal,
  CreateGoalPayload,
  JoinResponse,
} from "../types/goal.types";

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

  joinByToken: async (token: string): Promise<JoinResponse> => {
    const { data } = await finappApi.post<JoinResponse>("/goals/join", {
      token,
    });
    return data;
  },

  removeParticipant: async (goalId: string, userId: string): Promise<void> => {
    await finappApi.delete(`/goals/${goalId}/participants/${userId}`);
  },

  leave: async (goalId: string): Promise<void> => {
    await finappApi.post(`/goals/${goalId}/leave`);
  },

  update: async (
    id: string,
    data: Partial<CreateGoalPayload>
  ): Promise<FinancialGoal> => {
    const { data: response } = await finappApi.patch<FinancialGoal>(
      `/goals/${id}`,
      data
    );
    return response;
  },

  delete: async (id: string): Promise<void> => {
    await finappApi.delete(`/goals/${id}`);
  },
};
