import { ExpenseModel } from "../types/expense.types";

export const normalizeExpenseModel = (
  value?: string | null,
): ExpenseModel => (value === "FIXED" ? "FIXED" : "VARIABLE");

export const isExpenseDirection = (direction?: string | null) => {
  const value = (direction || "").toUpperCase();
  if (!value) return null;
  if (
    value.includes("OUT") ||
    value.includes("DEBIT") ||
    value.includes("EXPENSE") ||
    value.includes("PURCHASE")
  ) {
    return true;
  }
  if (
    value.includes("IN") ||
    value.includes("CREDIT") ||
    value.includes("INCOME") ||
    value.includes("DEPOSIT")
  ) {
    return false;
  }
  return null;
};

export const isExpenseCandidate = (
  direction?: string | null,
  amount?: number | null,
) => {
  const fromDirection = isExpenseDirection(direction);
  if (fromDirection !== null) return fromDirection;
  if (Number.isFinite(amount) && Number(amount) < 0) return true;
  return false;
};
