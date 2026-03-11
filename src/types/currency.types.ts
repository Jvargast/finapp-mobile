export const CURRENCY_CODES = [
  "CLP",
  "USD",
  "EUR",
  "CAD",
  "UF",
  "BTC",
  "GBP",
] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export const DEFAULT_CURRENCY: CurrencyCode = "CLP";

export const isCurrencyCode = (value: unknown): value is CurrencyCode => {
  return (
    typeof value === "string" &&
    (CURRENCY_CODES as readonly string[]).includes(value)
  );
};
