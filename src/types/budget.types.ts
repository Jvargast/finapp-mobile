import { Currency } from "./goal.types";

export enum BudgetType {
  PERSONAL = "PERSONAL",
  SHARED = "SHARED",
}

export interface BudgetProgress {
  spent: number;
  remaining: number;
  percentage: number;
  isOverBudget: boolean;
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

  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };

  progress: BudgetProgress;
  participants: BudgetParticipant[];
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
}
