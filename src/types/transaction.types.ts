import { Budget } from "./budget.types";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface TransactionFilters {
  month?: number;
  year?: number;
  accountId?: string;
  type?: TransactionType;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionParams {
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  description?: string;
  date?: string;
  budgetId?: string;
  externalId?: string;
  destinationAccountId?: string;
}

export interface UpdateTransactionParams
  extends Partial<CreateTransactionParams> {}

export interface Transaction {
  id: string;
  amount: string;
  type: TransactionType;
  description: string | null;
  date: string;

  accountId: string;
  categoryId: string;
  budgetId: string | null;

  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  account?: {
    id: string;
    name: string;
    currency: string;
    type: string;
  };

  budget?: Budget | null;

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedTransactionsResponse {
  data: Transaction[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
}
