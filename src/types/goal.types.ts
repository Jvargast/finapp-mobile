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
}

export interface EmergencyFundAnalysis extends BaseAnalysis {
  type: "EMERGENCY_FUND_ANALYSIS";
  monthsCovered: number;
}

export interface DebtAnalysis extends BaseAnalysis {
  type: "DEBT_ANALYSIS";
  monthsToFree?: number;
  monthlyPayment?: number;
}

export interface InvestmentAnalysis extends BaseAnalysis {
  type: "INVESTMENT_ANALYSIS" | "RETIREMENT_ANALYSIS";
  projectedAmount: number;
  interestEarned: number;
  isGoalMet: boolean;
  monthlyContribution: number;
}

export type GoalAnalysis =
  | SavingsAnalysis
  | EmergencyFundAnalysis
  | DebtAnalysis
  | InvestmentAnalysis
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
  deadline: string;
  interestRate?: number;
  isCompleted: boolean;

  analysis: GoalAnalysis;
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
}
