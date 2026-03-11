import { formatCurrencyAmount } from "./currency";

export const formatMoney = (amount: number, currencyCode: string = "CLP") => {
  return formatCurrencyAmount(amount, currencyCode);
};

export const formatGoalAmount = (amount: number, currencyId: string) => {
  return formatCurrencyAmount(amount, currencyId);
};
