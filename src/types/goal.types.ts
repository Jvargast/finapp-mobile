export enum GoalRole {
  OWNER = "OWNER",
  EDITOR = "EDITOR",
  VIEWER = "VIEWER",
}

export enum InvitationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export type GoalTransactionType = "DEPOSIT" | "WITHDRAW";

export interface GoalTransaction {
  id: string;
  amount: string | number;
  type: GoalTransactionType;
  date: string;
  userId: string;
  user: {
    id: string;
    profile?: {
      firstName?: string;
      lastName?: string;
      avatarUrl?: string;
    };
  };
}

export interface GoalParticipant {
  id: string;
  role: GoalRole;
  status: InvitationStatus;
  userId: string;
  joinedAt: string;
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

export enum GoalType {
  SAVING = "SAVING",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
  HOUSING = "HOUSING",
  CONTROL = "CONTROL",
  RETIREMENT = "RETIREMENT",
}

export type Currency = "CLP" | "USD" | "EUR" | "UF" | "CAD" | "BTC";

export interface BaseAnalysis {
  status:
    | "ON_TRACK"
    | "AT_RISK"
    | "COMPLETED"
    | "NEEDS_ACTION"
    | "CRITICAL"
    | "PLANNING"
    | "IMPOSSIBLE"
    | "UNKNOWN"
    | "NEUTRAL";
  advice: string;
  type?: string;
}

export interface UnknownAnalysis extends BaseAnalysis {
  status: "UNKNOWN" | "NEUTRAL";
}

export interface SavingsAnalysis extends BaseAnalysis {
  type: "SAVINGS_ANALYSIS";
  monthsLeft: number;
  requiredMonthly: number;
  yourCapacity: number;
  committedMonthly?: number;
}

export interface EmergencyFundAnalysis extends BaseAnalysis {
  type: "EMERGENCY_FUND_ANALYSIS";
  monthsCovered: number;
}

export interface InvestmentAnalysis extends BaseAnalysis {
  type: "INVESTMENT_ANALYSIS" | "RETIREMENT_ANALYSIS";
  projectedAmount: number;
  interestEarned: number;
  isGoalMet: boolean;
  monthlyContribution: number;
  monthsProjection?: number;
  currentAmount?: number;
  recommendedMonthly?: number;
  monthsLeft?: number;
  targetAmount?: number;
}

export interface DebtAnalysis extends BaseAnalysis {
  type: "DEBT_ANALYSIS";
  monthsToFree?: number;
  monthlyPayment?: number;
  minimumPayment?: number;
  nextPaymentDate?: string;
  isOverdue?: boolean;
  daysUntilDue?: number;
}

export interface ControlAnalysis extends BaseAnalysis {
  type: "CONTROL_ANALYSIS";
  spent: number;
  limit: number;
  remaining: number;
  percentage: number;
}

export type GoalAnalysis =
  | SavingsAnalysis
  | EmergencyFundAnalysis
  | DebtAnalysis
  | InvestmentAnalysis
  | ControlAnalysis
  | UnknownAnalysis;

export interface FinancialGoal {
  id: string;
  name: string;
  type: GoalType;
  currency: Currency;
  monthlyQuota?: number;
  estimatedYield?: number;
  targetAmount: number;
  currentAmount: number;
  shareToken?: string;
  deadline: string;
  interestRate?: number;
  isCompleted: boolean;
  monthlyDueDay?: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  analysis?: GoalAnalysis;
  participants?: GoalParticipant[];
  goalTransactions?: GoalTransaction[];
}

export interface CreateGoalPayload {
  name: string;
  type: GoalType;
  currency: Currency;
  monthlyQuota?: number;
  estimatedYield?: number;
  targetAmount: number;
  currentAmount?: number;
  deadline: string;
  interestRate?: number;
  monthlyDueDay?: number;
}

export interface JoinResponse {
  message: string;
  goalId: string;
  goalName?: string;
}
