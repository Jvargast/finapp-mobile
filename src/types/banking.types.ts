export type BankingCandidate = {
  id: string;
  amount: number;
  direction?: string | null;
  occurredAt?: string | null;
  merchant?: string | null;
  description?: string | null;
  last4?: string | null;
  accountId?: string | null;
  account?: {
    id?: string | null;
    name?: string | null;
    last4?: string | null;
  } | null;
  categoryId?: string | null;
  suggestedCategoryId?: string | null;
  suggestedBudgetId?: string | null;
  suggestedCategory?: {
    id?: string;
    name?: string;
    icon?: string;
    color?: string;
  } | null;
  email?: {
    from?: string | null;
    subject?: string | null;
    snippet?: string | null;
  } | null;
  status?: string | null;
  source?: string | null;
};

export type BankingCandidateOverrides = {
  accountId?: string | null;
  categoryId?: string | null;
  amount?: number | null;
  occurredAt?: string | null;
  description?: string | null;
  merchant?: string | null;
};
