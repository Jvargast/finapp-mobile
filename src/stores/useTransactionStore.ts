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

  setTransactions: (transactions: Transaction[]) => void;
  setRecentTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;

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
      });
    },

    updateTransaction: (updatedTx) => {
      const state = get();

      const newTransactions = state.transactions.map((t) =>
        t.id === updatedTx.id ? updatedTx : t
      );
      const totals = calculateTotals(newTransactions);

      const newRecent = state.recentTransactions.map((t) =>
        t.id === updatedTx.id ? updatedTx : t
      );

      set({
        transactions: newTransactions,
        totalIncome: totals.income,
        totalExpense: totals.expense,
        recentTransactions: newRecent,
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
      });
    },

    setDateContext: (month, year) => {
      set({ selectedMonth: month, selectedYear: year });
    },

    setLoading: (isLoading) => set({ isLoading }),

    reset: () => set({ transactions: [], totalIncome: 0, totalExpense: 0 }),
  };
});
