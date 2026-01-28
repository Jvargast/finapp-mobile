import { TransactionService } from "../services/transactionService";
import { useTransactionStore } from "../stores/useTransactionStore";
import {
  CreateTransactionParams,
  UpdateTransactionParams,
} from "../types/transaction.types";
import { useToastStore } from "../stores/useToastStore";
import { BudgetActions } from "./budgetActions";
import { AccountActions } from "./accountActions";

export const TransactionActions = {
  loadTransactions: async () => {
    const store = useTransactionStore.getState();
    const { selectedMonth, selectedYear } = store;

    store.setLoading(true);
    try {
      const response = await TransactionService.getAll({
        month: selectedMonth,
        year: selectedYear,
        limit: 100,
      });

      store.setTransactions(response.data);
    } catch (error) {
      console.error("Error cargando transacciones", error);
      useToastStore
        .getState()
        .showToast("Error al cargar movimientos", "error");
    } finally {
      store.setLoading(false);
    }
  },

  loadRecent: async () => {
    try {
      const response = await TransactionService.getAll({
        limit: 5,
        offset: 0,
      });

      useTransactionStore.getState().setRecentTransactions(response.data);
    } catch (error) {
      console.error("Error cargando recientes", error);
    }
  },

  changeDate: (month: number, year: number) => {
    const store = useTransactionStore.getState();
    store.setDateContext(month, year);
    TransactionActions.loadTransactions();
  },

  createTransaction: async (data: CreateTransactionParams) => {
    const store = useTransactionStore.getState();
    store.setLoading(true);

    try {
      const newTransaction = await TransactionService.create(data);

      store.addTransaction(newTransaction);

      BudgetActions.loadBudgets();
      AccountActions.loadAccounts();

      return newTransaction;
    } catch (error) {
      console.error("Error creando transacción", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  deleteTransaction: async (id: string) => {
    const store = useTransactionStore.getState();
    store.setLoading(true);

    try {
      await TransactionService.delete(id);
      store.removeTransaction(id);

      BudgetActions.loadBudgets();

      useToastStore.getState().showToast("Movimiento eliminado", "success");
    } catch (error) {
      useToastStore.getState().showToast("No se pudo eliminar", "error");
    } finally {
      store.setLoading(false);
    }
  },

  updateTransaction: async (id: string, data: UpdateTransactionParams) => {
    const store = useTransactionStore.getState();
    store.setLoading(true);
    try {
      const updated = await TransactionService.update(id, data);
      store.updateTransaction(updated);

      BudgetActions.loadBudgets();

      return updated;
    } catch (error) {
      throw error;
    } finally {
      store.setLoading(false);
    }
  },
};
