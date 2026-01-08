export enum GoalType {
  SAVING = "SAVING",
  DEBT = "DEBT",
  INVESTMENT = "INVESTMENT",
  PURCHASE = "PURCHASE",
}

export interface SavingsAnalysis {
  type: "SAVINGS_ANALYSIS" | "SAVING_SIMPLE" | "PURCHASE_GOAL";
  monthsLeft: number;
  requiredMonthly: number;
  yourCapacity?: number; 
  status: "ON_TRACK" | "AT_RISK" | "COMPLETED";
  advice: string;
}

export interface EmergencyFundAnalysis {
  type: "EMERGENCY_FUND_ANALYSIS";
  monthsCovered: number;
  status: "ON_TRACK" | "AT_RISK" | "EXCELLENT";
  advice: string;
}

export interface DebtAnalysis {
  type: "DEBT_ANALYSIS" | "DEBT_PAYOFF" | "DEBT_TRAP";
  monthsToFree?: number;
  monthlyPayment?: number;
  status: "PLANNING" | "CRITICAL" | "IMPOSSIBLE";
  advice: string;
}

export interface InvestmentAnalysis {
  type:
    | "INVESTMENT_ANALYSIS"
    | "RETIREMENT_ANALYSIS"
    | "INVESTMENT_GROWTH"
    | "RETIREMENT_PLAN";
  projectedAmount: number;
  interestEarned: number;
  isGoalMet: boolean;
  monthlyContribution: number;
  status: "ON_TRACK" | "NEEDS_ACTION";
  advice: string;
}

export type GoalAnalysis =
  | SavingsAnalysis
  | EmergencyFundAnalysis
  | DebtAnalysis
  | InvestmentAnalysis;

export interface FinancialGoal {
  id: string;
  name: string;
  type: GoalType;
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
  targetAmount: number;
  currentAmount?: number;
  deadline: string; 
  interestRate?: number;
}
