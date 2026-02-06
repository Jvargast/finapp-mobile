import { create } from "zustand";
import { BankLink } from "../types/fintoc.types";

interface FintocState {
  links: BankLink[];
  isLoading: boolean;

  syncAllCooldownUntilMs: number | null;
  setSyncAllCooldownUntilMs: (until: number | null) => void;

  setLinks: (links: BankLink[]) => void;
  addLink: (link: BankLink) => void;
  removeLink: (id: string) => void;
  updateLink: (link: BankLink) => void;
  upsertLink: (link: BankLink) => void;
  setLoading: (loading: boolean) => void;
}

const dedupeById = (links: BankLink[]) => {
  const map = new Map<string, BankLink>();
  for (const l of links) map.set(l.id, l);
  return Array.from(map.values());
};

export const useFintocStore = create<FintocState>((set) => ({
  links: [],
  isLoading: false,
  syncAllCooldownUntilMs: null,
  setSyncAllCooldownUntilMs: (until) => set({ syncAllCooldownUntilMs: until }),
  
  setLinks: (links) => set({ links: dedupeById(links) }),

  addLink: (link) =>
    set((state) => {
      const exists = state.links.some((l) => l.id === link.id);
      if (exists) {
        return { links: state.links.map((l) => (l.id === link.id ? link : l)) };
      }
      return { links: [link, ...state.links] };
    }),

  removeLink: (id) =>
    set((state) => ({
      links: state.links.filter((l) => l.id !== id),
    })),

  updateLink: (updatedLink) =>
    set((state) => ({
      links: state.links.map((l) =>
        l.id === updatedLink.id ? { ...l, ...updatedLink } : l,
      ),
    })),

  upsertLink: (link) =>
    set((state) => {
      const idx = state.links.findIndex((l) => l.id === link.id);
      if (idx === -1) return { links: [link, ...state.links] };

      const next = [...state.links];
      next[idx] = { ...next[idx], ...link };
      return { links: next };
    }),

  setLoading: (isLoading) => set({ isLoading }),
}));
