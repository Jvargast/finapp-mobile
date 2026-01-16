import finappApi from "../api/finappApi";
import { Account } from "../types/account.types";

export const AccountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await finappApi.get("/accounts");
    return response.data;
  },

  create: async (data: Omit<Account, "id" | "userId">): Promise<Account> => {
    const response = await finappApi.post("/accounts", data);
    return response.data;
  },

  update: async (id: string, data: Partial<Account>): Promise<Account> => {
    const response = await finappApi.patch(`/accounts/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await finappApi.delete(`/accounts/${id}`);
  },
};
