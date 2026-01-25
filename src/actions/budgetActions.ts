import { BudgetService } from "../services/budgetService";
import { useBudgetStore } from "../stores/useBudgetStore";
import { Budget, CreateBudgetParams } from "../types/budget.types";

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

  getBudgetById: async (id: string) => {
    try {
      const budget = await BudgetService.getBudgetById(id);
      const store = useBudgetStore.getState();
      store.updateBudget(budget);

      return budget;
    } catch (error) {
      console.error(`Error obteniendo detalle del presupuesto ${id}:`, error);
      throw error;
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
      const rawBudget = await BudgetService.createBudget(data);

      const newBudgetWithProgress: Budget = {
        ...rawBudget,
        progress: {
          spent: 0,
          percentage: 0,
          remaining: Number(rawBudget.amount),
          isOverBudget: false,
        },
      };

      store.addBudget(newBudgetWithProgress);

      return true;
    } catch (error) {
      console.error("Error creando presupuesto:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  joinBudget: async (token: string) => {
    const store = useBudgetStore.getState();
    store.setLoading(true); 

    try {
      await BudgetService.join(token);
      await BudgetActions.loadBudgets(); 
    } catch (error) {
      console.error("Error uniéndose al presupuesto:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  removeParticipant: async (budgetId: string, userId: string) => {
    try {
      await BudgetService.removeParticipant(budgetId, userId);
      await BudgetActions.loadBudgets();
    } catch (error) {
      console.error("Error eliminando participante:", error);
      throw error;
    }
  },

  leaveBudget: async (budgetId: string) => {
    try {
      await BudgetService.leave(budgetId);
      await BudgetActions.loadBudgets();
    } catch (error) {
      console.error("Error saliendo del presupuesto:", error);
      throw error;
    }
  },

  regenerateToken: async (budgetId: string) => {
    try {
      const data = await BudgetService.regenerateToken(budgetId);
      await BudgetActions.loadBudgets();
      return data;
    } catch (error) {
      console.error("Error regenerando token:", error);
      throw error;
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
