import { create } from "zustand";
import { Category } from "../types/category.types";

interface CategoryState {
  categories: Category[];
  isLoading: boolean;

  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (id: string) => void;

  setLoading: (loading: boolean) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => {
  return {
    categories: [],
    isLoading: false,

    setCategories: (categories) => {
      set({ categories });
    },

    addCategory: (category) => {
      const current = get().categories;
      const newCategories = [...current, category];

      set({ categories: newCategories });
    },

    updateCategory: (updatedCategory) => {
      const current = get().categories;
      const newCategories = current.map((c) =>
        c.id === updatedCategory.id ? updatedCategory : c
      );

      set({ categories: newCategories });
    },

    removeCategory: (id) => {
      const current = get().categories;
      const newCategories = current.filter((c) => c.id !== id);

      set({ categories: newCategories });
    },

    setLoading: (isLoading) => set({ isLoading }),
  };
});
