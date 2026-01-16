import { create } from "zustand";
import { Account } from "../types/account.types";

interface AccountState {
  accounts: Account[];
  isLoading: boolean;
  totalBalance: number;
  setAccounts: (accounts: Account[]) => void;
  addAccount: (account: Account) => void;
  updateAccount: (account: Account) => void;
  removeAccount: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  isLoading: false,
  totalBalance: 0,

  setAccounts: (accounts) => {
    const total = accounts.reduce((sum, acc) => sum + Number(acc.balance), 0);
    set({ accounts, totalBalance: total });
  },

  addAccount: (account) => {
    const current = get().accounts;
    const newAccounts = [...current, account];
    const total = newAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );
    set({ accounts: newAccounts, totalBalance: total });
  },
  updateAccount: (updatedAccount: Account) => {
    const current = get().accounts;

    const newAccounts = current.map((acc) =>
      acc.id === updatedAccount.id ? updatedAccount : acc
    );
    const total = newAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );
    set({ accounts: newAccounts, totalBalance: total });
  },

  removeAccount: (id) => {
    const current = get().accounts;
    const newAccounts = current.filter((acc) => acc.id !== id);
    const total = newAccounts.reduce(
      (sum, acc) => sum + Number(acc.balance),
      0
    );
    set({ accounts: newAccounts, totalBalance: total });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
