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

const dedupeAccountsById = (accounts: Account[]) => {
  const map = new Map<string, Account>();
  const noIdAccounts: Account[] = [];

  accounts.forEach((account) => {
    if (!account?.id) {
      noIdAccounts.push(account);
      return;
    }
    map.set(account.id, account);
  });

  return [...Array.from(map.values()), ...noIdAccounts];
};

const getTotalBalance = (accounts: Account[]) =>
  accounts.reduce((sum, acc) => sum + Number(acc.balance || 0), 0);

export const useAccountStore = create<AccountState>((set, get) => ({
  accounts: [],
  isLoading: false,
  totalBalance: 0,

  setAccounts: (accounts) => {
    const uniqueAccounts = dedupeAccountsById(accounts);
    set({ accounts: uniqueAccounts, totalBalance: getTotalBalance(uniqueAccounts) });
  },

  addAccount: (account) => {
    const current = get().accounts;
    const newAccounts = dedupeAccountsById([...current, account]);
    set({ accounts: newAccounts, totalBalance: getTotalBalance(newAccounts) });
  },
  updateAccount: (updatedAccount: Account) => {
    const current = get().accounts;
    const exists = current.some((acc) => acc.id === updatedAccount.id);
    const updated = exists
      ? current.map((acc) =>
          acc.id === updatedAccount.id ? updatedAccount : acc
        )
      : [...current, updatedAccount];
    const newAccounts = dedupeAccountsById(updated);
    set({ accounts: newAccounts, totalBalance: getTotalBalance(newAccounts) });
  },

  removeAccount: (id) => {
    const current = get().accounts;
    const newAccounts = current.filter((acc) => acc.id !== id);
    set({ accounts: newAccounts, totalBalance: getTotalBalance(newAccounts) });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
