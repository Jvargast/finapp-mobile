import { ExpenseModel } from "./expense.types";
import { CurrencyCode } from "./currency.types";

export type BankingCandidate = {
  id: string;
  amount: number;
  currency?: CurrencyCode | null;
  direction?: string | null;
  occurredAt?: string | null;
  merchant?: string | null;
  description?: string | null;
  last4?: string | null;
  accountId?: string | null;
  account?: {
    id?: string | null;
    name?: string | null;
    last4?: string | null;
    currency?: CurrencyCode | null;
  } | null;
  categoryId?: string | null;
  expenseModel?: ExpenseModel | null;
  suggestedCategoryId?: string | null;
  suggestedBudgetId?: string | null;
  suggestedExpenseModel?: ExpenseModel | null;
  suggestedCategory?: {
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
  } | null;
  email?: {
    from?: string | null;
    subject?: string | null;
    snippet?: string | null;
  } | null;
  status?: string | null;
  source?: string | null;
};

export type BankingCandidateOverrides = {
  accountId?: string | null;
  categoryId?: string | null;
  expenseModel?: ExpenseModel | null;
  amount?: number | null;
  occurredAt?: string | null;
  description?: string | null;
  merchant?: string | null;
};
