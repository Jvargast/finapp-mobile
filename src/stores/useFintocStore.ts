import { create } from "zustand";
import { BankLink } from "../types/fintoc.types";

interface FintocState {
  links: BankLink[];
  isLoading: boolean;

  setLinks: (links: BankLink[]) => void;
  addLink: (link: BankLink) => void;
  removeLink: (id: string) => void;
  updateLink: (link: BankLink) => void;
  setLoading: (loading: boolean) => void;
}

export const useFintocStore = create<FintocState>((set) => ({
  links: [],
  isLoading: false,

  setLinks: (links) => set({ links }),

  addLink: (link) =>
    set((state) => ({
      links: [link, ...state.links],
    })),

  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((l) => l.id !== id),
    })),

  updateLink: (updatedLink) =>
    set((state) => ({
      links: state.links.map((l) =>
        l.id === updatedLink.id ? updatedLink : l
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),
}));
