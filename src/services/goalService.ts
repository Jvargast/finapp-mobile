import axios from "axios";
import finappApi from "../api/finappApi";
import {
  FinancialGoal,
  CreateGoalPayload,
  JoinResponse,
} from "../types/goal.types";
import { ExpenseModel } from "../types/expense.types";

const GOALS_RETRY_DELAY_MS = 1200;

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const isCloudflareTimeout = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 524;

export const GoalService = {
  getAll: async (filters?: {
    expenseModel?: ExpenseModel;
  }): Promise<FinancialGoal[]> => {
    const startedAt = Date.now();
    const params = { expenseModel: filters?.expenseModel };
    const requestGoals = async () => {
      const { data } = await finappApi.get<FinancialGoal[]>("/goals", {
        params,
      });
      return data;
    };

    try {
      return await requestGoals();
    } catch (error) {
      if (isCloudflareTimeout(error)) {
        await sleep(GOALS_RETRY_DELAY_MS);
        try {
          return await requestGoals();
        } catch (retryError) {
          if (axios.isAxiosError(retryError)) {
            console.error("[GoalService.getAll] 524 after retry", {
              status: retryError.response?.status,
              code: retryError.code,
              durationMs: Date.now() - startedAt,
              params,
            });
          }
          throw retryError;
        }
      }

      if (axios.isAxiosError(error)) {
        console.error("[GoalService.getAll] request failed", {
          status: error.response?.status,
          code: error.code,
          durationMs: Date.now() - startedAt,
          params,
        });
      }
      throw error;
    }
  },

  getById: async (
    id: string,
    filters?: { expenseModel?: ExpenseModel }
  ): Promise<FinancialGoal> => {
    const { data } = await finappApi.get<FinancialGoal>(`/goals/${id}`, {
      params: { expenseModel: filters?.expenseModel },
    });
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

  addTransaction: async (
    goalId: string,
    data: { amount: number; type: "DEPOSIT" | "WITHDRAW" }
  ): Promise<FinancialGoal> => {
    const response = await finappApi.post(
      `/goals/${goalId}/transactions`,
      data
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await finappApi.delete(`/goals/${id}`);
  },
};
