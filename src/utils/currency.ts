import {
  CurrencyCode,
  DEFAULT_CURRENCY,
  isCurrencyCode,
} from "../types/currency.types";

// Transitional static rates. Prefer backend-provided FX in a future phase.
// Value represents CLP per unit of currency.
const CLP_PER_UNIT: Record<CurrencyCode, number> = {
  CLP: 1,
  USD: 950,
  EUR: 1030,
  CAD: 690,
  GBP: 1210,
  UF: 39000,
  BTC: 85000000,
};

export const resolveCurrency = (
  currency?: string | null,
  fallback: CurrencyCode = DEFAULT_CURRENCY
): CurrencyCode => {
  if (isCurrencyCode(currency)) return currency;
  return fallback;
};

export const getFractionDigits = (currency: CurrencyCode): number => {
  if (currency === "CLP") return 0;
  if (currency === "BTC") return 8;
  if (currency === "UF") return 2;
  return 2;
};

export const convertAmount = (
  amount: number,
  fromCurrency?: string | null,
  toCurrency?: string | null
): number => {
  const from = resolveCurrency(fromCurrency);
  const to = resolveCurrency(toCurrency);
  if (!Number.isFinite(amount)) return 0;
  if (from === to) return amount;

  const clpValue = amount * CLP_PER_UNIT[from];
  return clpValue / CLP_PER_UNIT[to];
};

export const formatCurrencyAmount = (
  amount: number,
  currency?: string | null,
  locale = "es-CL"
): string => {
  const resolvedCurrency = resolveCurrency(currency);
  const value = Number.isFinite(amount) ? amount : 0;
  const fractionDigits = getFractionDigits(resolvedCurrency);

  if (resolvedCurrency === "UF") {
    const numberPart = new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
    return `UF ${numberPart}`;
  }

  if (resolvedCurrency === "BTC") {
    const numberPart = new Intl.NumberFormat(locale, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
    return `₿ ${numberPart}`;
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: resolvedCurrency,
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
};

export const getCurrencySymbol = (currency?: string | null): string => {
  const resolved = resolveCurrency(currency);
  const symbols: Record<CurrencyCode, string> = {
    CLP: "$",
    USD: "US$",
    EUR: "€",
    CAD: "C$",
    GBP: "£",
    UF: "UF",
    BTC: "₿",
  };
  return symbols[resolved] || resolved;
};

export const resolveTransactionCurrency = (transaction: {
  currency?: string | null;
  account?: { currency?: string | null } | null;
}): CurrencyCode => {
  return resolveCurrency(transaction.currency || transaction.account?.currency);
};
