import { create } from "zustand";
import { Transaction } from "../types/transaction.types";

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;

  selectedMonth: number;
  selectedYear: number;

  totalIncome: number;
  totalExpense: number;

  recentTransactions: Transaction[];
  lastUpdatedTransaction: Transaction | null;

  setTransactions: (transactions: Transaction[]) => void;
  setRecentTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setLastUpdatedTransaction: (transaction: Transaction | null) => void;

  setDateContext: (month: number, year: number) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      if (t.type === "INCOME") {
        acc.income += amount;
      } else if (t.type === "EXPENSE" || t.type === "TRANSFER") {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );
};

export const useTransactionStore = create<TransactionState>((set, get) => {
  const now = new Date();

  return {
    transactions: [],
    recentTransactions: [],
    lastUpdatedTransaction: null,
    isLoading: false,
    selectedMonth: now.getMonth() + 1,
    selectedYear: now.getFullYear(),
    totalIncome: 0,
    totalExpense: 0,

    setTransactions: (transactions) => {
      const { income, expense } = calculateTotals(transactions);
      set({ transactions, totalIncome: income, totalExpense: expense });
    },
    setRecentTransactions: (recentTransactions) => {
      set({ recentTransactions });
    },
    setLastUpdatedTransaction: (transaction) => {
      set({ lastUpdatedTransaction: transaction });
    },

    addTransaction: (transaction) => {
      const state = get();

      const txDate = new Date(transaction.date);
      const txMonth = txDate.getMonth() + 1;
      const txYear = txDate.getFullYear();
      let newTransactions = state.transactions;
      let newIncome = state.totalIncome;
      let newExpense = state.totalExpense;

      if (txMonth === state.selectedMonth && txYear === state.selectedYear) {
        newTransactions = [transaction, ...state.transactions];
        newTransactions.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        const totals = calculateTotals(newTransactions);
        newIncome = totals.income;
        newExpense = totals.expense;
      }

      const newRecent = [transaction, ...state.recentTransactions].slice(0, 5);

      set({
        transactions: newTransactions,
        totalIncome: newIncome,
        totalExpense: newExpense,
        recentTransactions: newRecent,
        lastUpdatedTransaction: transaction,
      });
    },

    updateTransaction: (updatedTx) => {
      const state = get();

      const existsInTransactions = state.transactions.some(
        (t) => t.id === updatedTx.id
      );
      const existsInRecent = state.recentTransactions.some(
        (t) => t.id === updatedTx.id
      );

      let newTransactions = state.transactions;
      if (existsInTransactions) {
        newTransactions = state.transactions.map((t) =>
          t.id === updatedTx.id ? updatedTx : t
        );
      } else {
        const txDate = new Date(updatedTx.date);
        const txMonth = txDate.getMonth() + 1;
        const txYear = txDate.getFullYear();
        if (txMonth === state.selectedMonth && txYear === state.selectedYear) {
          newTransactions = [updatedTx, ...state.transactions];
          newTransactions.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );
        }
      }

      const totals = calculateTotals(newTransactions);

      const newRecent = existsInRecent
        ? state.recentTransactions.map((t) =>
            t.id === updatedTx.id ? updatedTx : t
          )
        : [updatedTx, ...state.recentTransactions].slice(0, 5);

      set({
        transactions: newTransactions,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        recentTransactions: newRecent,
        lastUpdatedTransaction: updatedTx,
      });
    },

    removeTransaction: (id) => {
      const state = get();
      const newTransactions = state.transactions.filter((t) => t.id !== id);
      const totals = calculateTotals(newTransactions);
      const newRecent = state.recentTransactions.filter((t) => t.id !== id);

      set({
        transactions: newTransactions,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        recentTransactions: newRecent,
        lastUpdatedTransaction: null,
      });
    },

    setDateContext: (month, year) => {
      set({ selectedMonth: month, selectedYear: year });
    },

    setLoading: (isLoading) => set({ isLoading }),

    reset: () => set({ transactions: [], totalIncome: 0, totalExpense: 0 }),
  };
});
