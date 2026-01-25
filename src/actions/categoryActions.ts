import { CategoryService } from "../services/categoryService";
import { useCategoryStore } from "../stores/useCategoryStore";
import {
  CreateCategoryParams,
  UpdateCategoryParams,
} from "../types/category.types";

export const CategoryActions = {
  loadCategories: async (withArchived: boolean = false) => {
    const store = useCategoryStore.getState();
    if (!withArchived && store.categories.length > 0 && !store.isLoading)
      return;

    store.setLoading(true);

    try {
      const categories = await CategoryService.getAll(undefined, withArchived);
      store.setCategories(categories);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      store.setLoading(false);
    }
  },

  createCategory: async (data: CreateCategoryParams) => {
    const store = useCategoryStore.getState();
    store.setLoading(true);

    try {
      const newCategory = await CategoryService.create(data);
      store.addCategory(newCategory);
      return true;
    } catch (error) {
      console.error("Error creando categoría:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  updateCategory: async (id: string, data: UpdateCategoryParams) => {
    const store = useCategoryStore.getState();

    const categoryToEdit = store.categories.find((c) => c.id === id);
    if (!categoryToEdit?.userId) {
      console.warn(
        "⛔ Intento bloqueado: No puedes editar una categoría global."
      );
      return false;
    }

    store.setLoading(true);

    try {
      const updatedCategory = await CategoryService.update(id, data);
      store.updateCategory(updatedCategory);
      return true;
    } catch (error) {
      console.error("Error actualizando categoría:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  restoreCategory: async (id: string) => {
    const store = useCategoryStore.getState();
    const category = store.categories.find((c) => c.id === id);

    if (!category) return;

    store.updateCategory({ ...category, isActive: true });

    try {
      await CategoryService.restore(id);
    } catch (error) {
      console.error("Error al restaurar categoría", error);
      store.updateCategory({ ...category, isActive: false });
    }
  },

  deleteCategory: async (id: string) => {
    const store = useCategoryStore.getState();
    const category = store.categories.find((c) => c.id === id);

    if (!category) return;

    if (!category.userId) {
      throw new Error("No puedes eliminar una categoría del sistema.");
    }

    store.updateCategory({ ...category, isActive: false });

    try {
      await CategoryService.delete(id);
    } catch (error) {
      console.error("Error borrando categoría:", error);
      store.updateCategory({ ...category, isActive: true });
      throw error;
    }
  },
};
