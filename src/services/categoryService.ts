import finappApi from "../api/finappApi";
import {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
  TransactionType,
} from "../types/category.types";

export const CategoryService = {
  getAll: async (
    type?: TransactionType,
    withArchived: boolean = false
  ): Promise<Category[]> => {
    try {
      const params: any = {};

      if (type) params.type = type;
      if (withArchived) params.withArchived = "true";

      const response = await finappApi.get<Category[]>("/categories", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Error obteniendo categorías:", error);
      throw error;
    }
  },

  create: async (data: CreateCategoryParams): Promise<Category> => {
    try {
      const response = await finappApi.post<Category>("/categories", data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Error creando categoría:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  update: async (id: string, data: UpdateCategoryParams): Promise<Category> => {
    try {
      const response = await finappApi.patch<Category>(
        `/categories/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(`❌ Error actualizando categoría ${id}:`, error);
      throw error;
    }
  },

  restore: async (id: string): Promise<void> => {
    try {
      await finappApi.patch(`/categories/${id}/restore`);
    } catch (error) {
      console.error(`❌ Error restaurando categoría ${id}:`, error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await finappApi.delete(`/categories/${id}`);
    } catch (error) {
      console.error(`❌ Error eliminando categoría ${id}:`, error);
      throw error;
    }
  },
};
