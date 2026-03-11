import { Currency } from "./goal.types";
import { ExpenseModel } from "./expense.types";

export type RecurrenceUnit = "MONTHLY" | "WEEKLY";
export type RecurringTransactionType = "INCOME" | "EXPENSE";
export type MonthlyRule = "DAY_OF_MONTH" | "LAST_DAY" | "LAST_BUSINESS_DAY";
export type BusinessDayAdjustment = "NONE" | "PREVIOUS";

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  currency: Currency;
  type: RecurringTransactionType;
  expenseModel?: ExpenseModel | null;
  accountId: string;
  categoryId: string;
  description?: string | null;
  merchant?: string | null;
  recurrenceUnit: RecurrenceUnit;
  interval?: number | null;
  monthlyRule?: MonthlyRule | null;
  businessDayAdjustment?: BusinessDayAdjustment | null;
  dayOfMonth?: number | null;
  weekday?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  nextRunAt?: string | null;
  lastRunAt?: string | null;
  isActive?: boolean;
  matchWindowDays?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecurringParams {
  name: string;
  amount: number;
  currency: Currency;
  type: RecurringTransactionType;
  expenseModel?: ExpenseModel;
  accountId: string;
  categoryId: string;
  description?: string | null;
  merchant?: string | null;
  recurrenceUnit: RecurrenceUnit;
  interval?: number;
  monthlyRule?: MonthlyRule | null;
  businessDayAdjustment?: BusinessDayAdjustment | null;
  dayOfMonth?: number | null;
  weekday?: number | null;
  startsAt?: string | null;
  endsAt?: string | null;
  matchWindowDays?: number | null;
  isActive?: boolean;
}

export interface UpdateRecurringParams extends Partial<CreateRecurringParams> {
  nextRunAt?: string | null;
  lastRunAt?: string | null;
}

export interface RecurringFilters {
  accountId?: string;
  isActive?: boolean;
  type?: RecurringTransactionType;
  expenseModel?: ExpenseModel;
}

export type RecurringStatusFilter = "ALL" | "ACTIVE" | "PAUSED";

export interface RecurringListFilters {
  search?: string;
  accountId?: string | null;
  type?: RecurringTransactionType | "ALL";
  expenseModel?: ExpenseModel | "ALL";
  recurrenceUnit?: RecurrenceUnit | "ALL";
  status?: RecurringStatusFilter;
}
