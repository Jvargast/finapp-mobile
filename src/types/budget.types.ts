import { Currency } from "./goal.types";

export enum BudgetType {
  PERSONAL = "PERSONAL",
  SHARED = "SHARED",
}

export type BudgetRecurrenceUnit = "WEEKLY" | "MONTHLY";
export type BudgetAmountStrategy = "FIXED" | "PER_OCCURRENCE";

export interface BudgetTemplate {
  id: string;
  recurrenceUnit: BudgetRecurrenceUnit;
  interval: number;
  amountStrategy: BudgetAmountStrategy;
  startsAt: string;
  endsAt: string | null;
  isActive: boolean;
}

export interface BudgetProgress {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
}

export interface BudgetTransaction {
  id: string;
  amount: number | string; 
  date: string | Date;
  description?: string;
  type: "INCOME" | "EXPENSE";

  account?: {
    user?: {
      id: string;
      profile?: {
        firstName?: string;
        lastName?: string;
        avatarUrl?: string;
      };
    };
  };
}

export interface BudgetParticipant {
  id: string;
  role: "VIEWER" | "EDITOR";
  user: {
    id: string;
    email: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
}

export interface Budget {
  id: string;
  name?: string;
  amount: number;
  currency: Currency;
  month: number;
  year: number;
  categoryId: string;
  type: BudgetType;
  warningThreshold: number;
  shareToken?: string;
  isRollover: boolean;
  template?: BudgetTemplate | null;

  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };

  owner?: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
      plan?: string;
    };
  };

  progress: BudgetProgress;
  participants: BudgetParticipant[];
  transactions?: BudgetTransaction[];
}

export interface CreateBudgetParams {
  name?: string;
  amount: number;
  categoryId: string;
  month: number;
  year: number;
  currency?: Currency;
  type?: BudgetType;
  warningThreshold?: number;
  isRollover?: boolean;
  participantIds?: string[];
  isRecurring?: boolean;
  recurrenceUnit?: BudgetRecurrenceUnit;
  recurrenceInterval?: number;
  amountStrategy?: BudgetAmountStrategy;
  recurrenceEndsAt?: string | null;
}

export interface UpdateBudgetParams extends Partial<CreateBudgetParams> {
  applyToFuture?: boolean;
}
