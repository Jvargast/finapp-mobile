import { create } from "zustand";
import { Budget } from "../types/budget.types";

interface BudgetState {
  budgets: Budget[];
  isLoading: boolean;
  selectedMonth: number;
  selectedYear: number;

  totalBudgeted: number;
  totalSpent: number;

  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;

  setDateContext: (month: number, year: number) => void;
  setLoading: (loading: boolean) => void;
}

const calculateTotals = (budgets: Budget[]) => {
  return budgets.reduce(
    (acc, b) => ({
      budgeted: acc.budgeted + Number(b.amount),
      spent: acc.spent + Number(b.progress.spent),
    }),
    { budgeted: 0, spent: 0 }
  );
};

export const useBudgetStore = create<BudgetState>((set, get) => {
  const now = new Date();

  return {
    budgets: [],
    isLoading: false,
    selectedMonth: now.getMonth() + 1,
    selectedYear: now.getFullYear(),

    totalBudgeted: 0,
    totalSpent: 0,

    setBudgets: (budgets) => {
      const { budgeted, spent } = calculateTotals(budgets);
      set({ budgets, totalBudgeted: budgeted, totalSpent: spent });
    },

    addBudget: (budget) => {
      const state = get();
      const belongsToCurrentView =
        budget.month === state.selectedMonth &&
        budget.year === state.selectedYear;

      if (!belongsToCurrentView) return;

      const current = state.budgets;
      const newBudgets = [...current, budget];
      const { budgeted, spent } = calculateTotals(newBudgets);

      set({ budgets: newBudgets, totalBudgeted: budgeted, totalSpent: spent });
    },

    updateBudget: (updatedBudget) => {
      const current = get().budgets;
      const newBudgets = current.map((b) =>
        b.id === updatedBudget.id ? updatedBudget : b
      );

      const { budgeted, spent } = calculateTotals(newBudgets);
      set({ budgets: newBudgets, totalBudgeted: budgeted, totalSpent: spent });
    },

    removeBudget: (id) => {
      const current = get().budgets;
      const newBudgets = current.filter((b) => b.id !== id);

      const { budgeted, spent } = calculateTotals(newBudgets);
      set({ budgets: newBudgets, totalBudgeted: budgeted, totalSpent: spent });
    },

    setDateContext: (month, year) => {
      set({ selectedMonth: month, selectedYear: year });
    },

    setLoading: (isLoading) => set({ isLoading }),
  };
});
