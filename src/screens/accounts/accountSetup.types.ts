export type Step1Form = {
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH" | "OTHER";
  currency: "CLP" | "USD";
  institution?: string;
  last4?: string;
};
