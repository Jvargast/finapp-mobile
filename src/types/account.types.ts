import { Currency } from "./goal.types";

export interface Account {
  id: string;
  name: string;
  type: string;
  balance: string | number;
  currency: Currency;
  color: string;

  institution?: string | null;
  skinId?: string | null;
  isCredit?: boolean;

  last4?: string | null;
  icon?: any;
  brand?: string | null;
  bankLinkId?: string | null;

  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
