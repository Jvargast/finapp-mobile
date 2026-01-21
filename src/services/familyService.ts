import finappApi from "../api/finappApi";
import { FamilyGroupData, JoinFamilyResponse } from "../types/family.types";

export const FamilyService = {
  getMyGroup: async (): Promise<FamilyGroupData> => {
    const response = await finappApi.get("/family/my-group");
    return response.data;
  },

  generateInviteCode: async (): Promise<{ code: string }> => {
    const response = await finappApi.post("/family/invite-code");
    return response.data;
  },

  joinFamily: async (code: string): Promise<JoinFamilyResponse> => {
    const response = await finappApi.post("/family/join", { code });
    return response.data;
  },

  leaveGroup: async (): Promise<void> => {
    await finappApi.post("/family/leave");
  },

  removeMember: async (memberId: string): Promise<void> => {
    await finappApi.delete(`/family/members/${memberId}`);
  },

  rotateInviteCode: async (): Promise<{ code: string }> => {
    const response = await finappApi.post("/family/regenerate-code");
    return response.data;
  },
};
