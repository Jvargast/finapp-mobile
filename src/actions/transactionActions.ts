import { TransactionService } from "../services/transactionService";
import { useTransactionStore } from "../stores/useTransactionStore";
import {
  CreateTransactionParams,
  UpdateTransactionParams,
} from "../types/transaction.types";
import { useToastStore } from "../stores/useToastStore";
import { BudgetActions } from "./budgetActions";
import { AccountActions } from "./accountActions";
import { useAccountStore } from "../stores/useAccountStore";

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

  getFilteredTransactions: async (filters: any) => {
    try {
      const response = await TransactionService.getAll(filters);
      return response.data;
    } catch (error) {
      console.error("Error filtrando transacciones", error);
      throw error;
    }
  },

  changeDate: (month: number, year: number) => {
    const store = useTransactionStore.getState();
    store.setDateContext(month, year);
    TransactionActions.loadTransactions();
  },

  getTransactionDetail: async (id: string) => {
    const store = useTransactionStore.getState();
    store.setLoading(true);

    try {
      const transaction = await TransactionService.getById(id);
      store.updateTransaction(transaction);
      return transaction;
    } catch (error) {
      console.error("Error cargando detalle de transacción", error);
    } finally {
      store.setLoading(false);
    }
  },

  createTransaction: async (data: CreateTransactionParams) => {
    const store = useTransactionStore.getState();
    const accountStore = useAccountStore.getState();
    store.setLoading(true);

    try {
      const newTransaction = await TransactionService.create(data);

      const selectedAccount = accountStore.accounts.find(
        (acc) => acc.id === data.accountId
      );

      const transactionWithFullData = {
        ...newTransaction,
        account: selectedAccount
          ? {
              id: selectedAccount.id,
              name: selectedAccount.name,
              currency: selectedAccount.currency,
              type: selectedAccount.type,
            }
          : newTransaction.account,
      };

      store.addTransaction(transactionWithFullData);

      BudgetActions.loadBudgets();
      AccountActions.loadAccounts();

      return transactionWithFullData;
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
      AccountActions.loadAccounts();

      useToastStore.getState().showToast("Movimiento eliminado", "success");
    } catch (error) {
      console.error(error);
      useToastStore.getState().showToast("No se pudo eliminar", "error");
      throw error;
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
      AccountActions.loadAccounts();

      useToastStore.getState().showToast("Movimiento actualizado", "success");
      return updated;
    } catch (error) {
      console.error(error);
      useToastStore.getState().showToast("Error al editar", "error");
      throw error;
    } finally {
      store.setLoading(false);
    }
  },
};
