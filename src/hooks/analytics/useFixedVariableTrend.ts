import { useEffect, useState } from "react";
import { TransactionService } from "../../services/transactionService";
import { Transaction } from "../../types/transaction.types";
import { convertAmount, resolveTransactionCurrency } from "../../utils/currency";

const PAGE_SIZE = 100;
const trendCache = new Map<string, FixedVariableMonthData[]>();
const trendInFlight = new Map<string, Promise<FixedVariableMonthData[]>>();

export type TrendWindowMonths = 3 | 6;

export interface FixedVariableMonthData {
  id: string;
  month: number;
  year: number;
  label: string;
  shortLabel: string;
  fixed: number;
  variable: number;
  total: number;
  fixedPercent: number;
  variablePercent: number;
}

interface UseFixedVariableTrendParams {
  selectedMonth: number;
  selectedYear: number;
  displayCurrency: string;
  windowMonths: TrendWindowMonths;
  enabled?: boolean;
}

const toMonthRange = (
  selectedMonth: number,
  selectedYear: number,
  windowMonths: TrendWindowMonths
) => {
  const range: Date[] = [];
  const start = new Date(
    selectedYear,
    selectedMonth - 1 - (windowMonths - 1),
    1
  );

  for (let idx = 0; idx < windowMonths; idx += 1) {
    range.push(new Date(start.getFullYear(), start.getMonth() + idx, 1));
  }

  return range;
};

const formatMonthLabel = (date: Date) =>
  date.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });

const formatShortMonth = (date: Date) =>
  date
    .toLocaleDateString("es-CL", { month: "short" })
    .replace(".", "")
    .toUpperCase();

const toMonthId = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const safePercent = (value: number, total: number) => {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return (value / total) * 100;
};

const sumFixedVariableTotals = (
  transactions: Transaction[],
  displayCurrency: string
) =>
  transactions.reduce(
    (acc, tx) => {
      if (tx.type !== "EXPENSE") return acc;

      const sourceCurrency = resolveTransactionCurrency(tx);
      const convertedAmount = Math.abs(
        convertAmount(Number(tx.amount || 0), sourceCurrency, displayCurrency)
      );

      if (tx.expenseModel === "FIXED") {
        acc.fixed += convertedAmount;
      } else {
        // Older records can be uncategorized. We default them to variable.
        acc.variable += convertedAmount;
      }

      return acc;
    },
    { fixed: 0, variable: 0 }
  );

const fetchMonthBreakdown = async (
  month: number,
  year: number,
  displayCurrency: string
) => {
  let page = 1;
  let offset = 0;
  let keepLoading = true;
  let fixed = 0;
  let variable = 0;

  while (keepLoading) {
    const response = await TransactionService.getAll({
      month,
      year,
      limit: PAGE_SIZE,
      offset,
    });

    const { fixed: monthFixed, variable: monthVariable } = sumFixedVariableTotals(
      response.data || [],
      displayCurrency
    );

    fixed += monthFixed;
    variable += monthVariable;

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

  return { fixed, variable };
};

const createEmptySeries = (
  selectedMonth: number,
  selectedYear: number,
  windowMonths: TrendWindowMonths
) =>
  toMonthRange(selectedMonth, selectedYear, windowMonths).map((date) => ({
    id: toMonthId(date),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
    label: formatMonthLabel(date),
    shortLabel: formatShortMonth(date),
    fixed: 0,
    variable: 0,
    total: 0,
    fixedPercent: 0,
    variablePercent: 0,
  }));

const buildCacheKey = (
  selectedMonth: number,
  selectedYear: number,
  displayCurrency: string,
  windowMonths: TrendWindowMonths
) =>
  `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${windowMonths}-${displayCurrency}`;

const fetchTrendSeries = async (
  selectedMonth: number,
  selectedYear: number,
  displayCurrency: string,
  windowMonths: TrendWindowMonths
) => {
  const monthRange = toMonthRange(selectedMonth, selectedYear, windowMonths);

  const monthlyRows = await Promise.all(
    monthRange.map(async (date) => {
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const { fixed, variable } = await fetchMonthBreakdown(
        month,
        year,
        displayCurrency
      );
      const total = fixed + variable;
      return {
        id: toMonthId(date),
        month,
        year,
        label: formatMonthLabel(date),
        shortLabel: formatShortMonth(date),
        fixed,
        variable,
        total,
        fixedPercent: safePercent(fixed, total),
        variablePercent: safePercent(variable, total),
      };
    })
  );

  return monthlyRows;
};

export const useFixedVariableTrend = ({
  selectedMonth,
  selectedYear,
  displayCurrency,
  windowMonths,
  enabled = true,
}: UseFixedVariableTrendParams) => {
  const [data, setData] = useState<FixedVariableMonthData[]>(() =>
    createEmptySeries(selectedMonth, selectedYear, windowMonths)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false);
      setError(null);
      return;
    }

    const cacheKey = buildCacheKey(
      selectedMonth,
      selectedYear,
      displayCurrency,
      windowMonths
    );
    const cached = trendCache.get(cacheKey);

    if (cached) {
      setData(cached);
      setError(null);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const running =
          trendInFlight.get(cacheKey) ||
          fetchTrendSeries(
            selectedMonth,
            selectedYear,
            displayCurrency,
            windowMonths
          );

        if (!trendInFlight.has(cacheKey)) {
          trendInFlight.set(cacheKey, running);
        }

        const monthlyRows = await running;
        trendCache.set(cacheKey, monthlyRows);

        if (isActive) {
          setData(monthlyRows);
          setError(null);
        }
      } catch (loadError) {
        console.error("Error cargando tendencia fijo/variable", loadError);
        if (isActive) {
          setError("No se pudo cargar la tendencia");
          setData((prev) =>
            prev.length > 0
              ? prev
              : createEmptySeries(selectedMonth, selectedYear, windowMonths)
          );
        }
      } finally {
        trendInFlight.delete(cacheKey);
        if (isActive) setIsLoading(false);
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [displayCurrency, enabled, selectedMonth, selectedYear, windowMonths]);

  return {
    data,
    isLoading,
    error,
  };
};
