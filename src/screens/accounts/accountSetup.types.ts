import { CurrencyCode } from "../../types/currency.types";

export type Step1Form = {
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH" | "OTHER";
  currency: CurrencyCode;
  institution?: string;
  last4?: string;
};
