import { create } from "zustand";
import { RecurringTransaction } from "../types/recurring.types";

interface RecurringState {
  recurring: RecurringTransaction[];
  isLoading: boolean;

  setRecurring: (items: RecurringTransaction[]) => void;
  addRecurring: (item: RecurringTransaction) => void;
  updateRecurring: (item: RecurringTransaction) => void;
  removeRecurring: (id: string) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

const dedupeRecurringById = (items: RecurringTransaction[]) => {
  const map = new Map<string, RecurringTransaction>();
  const noIdItems: RecurringTransaction[] = [];

  items.forEach((item) => {
    if (!item?.id) {
      noIdItems.push(item);
      return;
    }
    map.set(item.id, item);
  });

  return [...Array.from(map.values()), ...noIdItems];
};

export const useRecurringStore = create<RecurringState>((set, get) => ({
  recurring: [],
  isLoading: false,

  setRecurring: (items) => set({ recurring: dedupeRecurringById(items) }),

  addRecurring: (item) => {
    const current = get().recurring;
    set({ recurring: dedupeRecurringById([item, ...current]) });
  },

  updateRecurring: (updated) => {
    const current = get().recurring;
    const exists = current.some((item) => item.id === updated.id);
    const next = exists
      ? current.map((item) => (item.id === updated.id ? updated : item))
      : [updated, ...current];
    set({ recurring: dedupeRecurringById(next) });
  },

  removeRecurring: (id) => {
    const current = get().recurring;
    set({ recurring: current.filter((item) => item.id !== id) });
  },

  setLoading: (isLoading) => set({ isLoading }),

  reset: () => set({ recurring: [], isLoading: false }),
}));
