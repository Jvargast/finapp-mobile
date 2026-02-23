import { Currency } from "./goal.types";

export enum AccountSetupStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
}

export enum AccountSetupMethod {
  EMAIL_HISTORY = "EMAIL_HISTORY",
  EMAIL_FORWARD = "EMAIL_FORWARD",
  STATEMENT = "STATEMENT",
}

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
  setupStatus?: AccountSetupStatus | null;
  setupMethod?: AccountSetupMethod | null;
  firstSyncedAt?: string | Date | null;

  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
