import { Budget } from "./budget.types";
import { ExpenseModel } from "./expense.types";
import { CurrencyCode } from "./currency.types";

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface TransactionFilters {
  month?: number;
  year?: number;
  accountId?: string;
  type?: TransactionType;
  expenseModel?: ExpenseModel;
  limit?: number;
  offset?: number;
}

export interface CreateTransactionParams {
  amount: number;
  type: TransactionType;
  accountId: string;
  categoryId: string;
  currency?: CurrencyCode;
  expenseModel?: ExpenseModel;
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
  currency?: CurrencyCode | null;
  type: TransactionType;
  expenseModel?: ExpenseModel | null;
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
    currency: CurrencyCode;
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
