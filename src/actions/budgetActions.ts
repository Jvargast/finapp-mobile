import { BudgetService } from "../services/budgetService";
import { useBudgetStore } from "../stores/useBudgetStore";
import { CreateBudgetParams } from "../types/budget.types";

export const BudgetActions = {
  loadBudgets: async () => {
    const store = useBudgetStore.getState();
    store.setLoading(true);

    try {
      const { selectedMonth, selectedYear } = store;

      const budgets = await BudgetService.getBudgets(
        selectedMonth,
        selectedYear
      );
      store.setBudgets(budgets);
    } catch (error) {
      console.error("Error cargando presupuestos:", error);
    } finally {
      store.setLoading(false);
    }
  },

  changeDate: async (month: number, year: number) => {
    const store = useBudgetStore.getState();

    store.setDateContext(month, year);
    await BudgetActions.loadBudgets();
  },

  createBudget: async (data: CreateBudgetParams) => {
    const store = useBudgetStore.getState();
    store.setLoading(true);

    try {
      const newBudget = await BudgetService.createBudget(data);
      store.addBudget(newBudget);
      return true;
    } catch (error) {
      console.error("Error creando presupuesto:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  updateBudget: async (id: string, data: Partial<CreateBudgetParams>) => {
    const store = useBudgetStore.getState();
    store.setLoading(true);

    try {
      const updatedBudget = await BudgetService.updateBudget(id, data);
      store.updateBudget(updatedBudget);
      return true;
    } catch (error) {
      console.error("Error actualizando presupuesto:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  deleteBudget: async (id: string) => {
    const store = useBudgetStore.getState();
    const previousBudgets = store.budgets;

    store.removeBudget(id);

    try {
      await BudgetService.deleteBudget(id);
    } catch (error) {
      console.error("Error borrando presupuesto:", error);
      store.setBudgets(previousBudgets);
      throw error;
    }
  },
};
