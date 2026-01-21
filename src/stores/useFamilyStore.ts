import { create } from "zustand";
import {
  FamilyGroupData,
  FamilyMember,
  FamilyRole,
} from "../types/family.types";

interface FamilyState {
  role: FamilyRole;
  groupName: string | null;
  adminName: string | null;
  inviteCode: string | null;
  members: FamilyMember[];
  isLoading: boolean;
  maxMembers: number;
  usedSlots: number;
  setFamilyData: (data: FamilyGroupData) => void;
  setInviteCode: (code: string) => void;
  removeMember: (id: string) => void;
  resetFamily: () => void;
  setLoading: (loading: boolean) => void;
}

export const useFamilyStore = create<FamilyState>((set, get) => ({
  role: "NONE",
  groupName: null,
  adminName: null,
  inviteCode: null,
  members: [],
  isLoading: false,
  maxMembers: 5,
  usedSlots: 0,

  setFamilyData: (data) => {
    const calculatedSlots = data.members ? data.members.length : 0;

    set({
      role: data.role,
      groupName: data.groupName || null,
      adminName: data.adminName || null,
      inviteCode: data.inviteCode || null,
      members: data.members || [],
      maxMembers: data.maxMembers || 5,
      usedSlots: data.usedSlots ?? calculatedSlots,
    });
  },

  setInviteCode: (code) => {
    set({ inviteCode: code });
  },

  removeMember: (id) => {
    const currentMembers = get().members;
    const newMembers = currentMembers.filter((m) => m.id !== id);

    set({
      members: newMembers,
      usedSlots: newMembers.length,
    });
  },

  resetFamily: () => {
    set({
      role: "NONE",
      groupName: null,
      adminName: null,
      inviteCode: null,
      members: [],
      usedSlots: 0,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
