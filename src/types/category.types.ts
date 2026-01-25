export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
  userId?: string | null;
  isActive: boolean;
}

export interface CreateCategoryParams {
  name: string;
  icon: string;
  color: string;
  type: TransactionType;
}

export interface UpdateCategoryParams extends Partial<CreateCategoryParams> {}
