export type FamilyRole = "ADMIN" | "MEMBER" | "NONE";

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "PENDING";
}

export interface FamilyGroupData {
  role: FamilyRole;
  groupName?: string;
  adminName?: string;
  inviteCode?: string;
  members?: FamilyMember[];
  maxMembers?: number;
  usedSlots?: number;
}

export interface JoinFamilyResponse {
  success: boolean;
  message: string;
}
