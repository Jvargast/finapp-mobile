import finappApi from "../api/finappApi";
import {
  Transaction,
  CreateTransactionParams,
  UpdateTransactionParams,
  TransactionFilters,
  PaginatedTransactionsResponse,
} from "../types/transaction.types";

export const TransactionService = {
  getAll: async (
    filters: TransactionFilters = {}
  ): Promise<PaginatedTransactionsResponse> => {
    console.log("PARAMS QUE SE ENVÍAN AL BACKEND:", filters);
    try {
      const response = await finappApi.get<PaginatedTransactionsResponse>(
        "/transactions",
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo transacciones:", error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Transaction> => {
    try {
      const response = await finappApi.get<Transaction>(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`❌ Error obteniendo transacción ${id}:`, error);
      throw error;
    }
  },

  create: async (data: CreateTransactionParams): Promise<Transaction> => {
    try {
      const response = await finappApi.post<Transaction>("/transactions", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error creando transacción:",
        error.response?.data || error
      );
      throw error;
    }
  },

  update: async (
    id: string,
    data: UpdateTransactionParams
  ): Promise<Transaction> => {
    try {
      const response = await finappApi.patch<Transaction>(
        `/transactions/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando transacción ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await finappApi.delete(`/transactions/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando transacción ${id}:`, error);
      throw error;
    }
  },
};
