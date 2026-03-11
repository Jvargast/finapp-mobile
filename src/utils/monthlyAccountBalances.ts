import { TransactionService } from "../services/transactionService";
import { TransactionType } from "../types/transaction.types";

const PAGE_SIZE = 100;

const getMonthParts = (date: Date) => ({
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

const toSignedAmount = (type: TransactionType, rawAmount: number) => {
  const amount = Math.abs(Number(rawAmount || 0));
  if (type === "INCOME") return amount;
  if (type === "EXPENSE" || type === "TRANSFER") return -amount;
  return 0;
};

export const fetchMonthlyAccountBalances = async (date = new Date()) => {
  const { month, year } = getMonthParts(date);
  const balances: Record<string, number> = {};

  let page = 1;
  let offset = 0;
  let keepLoading = true;

  while (keepLoading) {
    const response = await TransactionService.getAll({
      month,
      year,
      limit: PAGE_SIZE,
      offset,
    });

    (response.data || []).forEach((tx) => {
      if (!tx.accountId) return;
      const signed = toSignedAmount(tx.type, Number(tx.amount || 0));
      balances[tx.accountId] = (balances[tx.accountId] || 0) + signed;
    });

    const lastPage = response.meta?.lastPage || page;
    const reachedLastPage = page >= lastPage;
    const reachedEndBySize = (response.data?.length || 0) < PAGE_SIZE;

    if (reachedLastPage || reachedEndBySize) {
      keepLoading = false;
    } else {
      page += 1;
      offset = (page - 1) * PAGE_SIZE;
    }
  }

  return balances;
};
