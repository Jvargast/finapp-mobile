import { FamilyService } from "../services/familyService";
import { useFamilyStore } from "../stores/useFamilyStore";
import { UserActions } from "./userActions";

export const FamilyActions = {
  loadFamilyGroup: async () => {
    const store = useFamilyStore.getState();
    store.setLoading(true);

    try {
      const data = await FamilyService.getMyGroup();
      store.setFamilyData(data);
    } catch (error) {
      console.error("Error cargando grupo familiar:", error);
    } finally {
      store.setLoading(false);
    }
  },

  generateCode: async () => {
    try {
      const { code } = await FamilyService.generateInviteCode();
      useFamilyStore.getState().setInviteCode(code);
      return code;
    } catch (error) {
      console.error("Error generando código:", error);
      throw error;
    }
  },

  joinFamily: async (code: string) => {
    const store = useFamilyStore.getState();
    store.setLoading(true);

    try {
      await FamilyService.joinFamily(code);

      await FamilyActions.loadFamilyGroup();

      await UserActions.refreshProfile();

      return true;
    } catch (error) {
      console.error("Error uniéndose a la familia:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  leaveGroup: async () => {
    const store = useFamilyStore.getState();
    store.setLoading(true);

    try {
      await FamilyService.leaveGroup();
      store.resetFamily();
      await UserActions.refreshProfile();
      return true;
    } catch (error) {
      console.error("Error saliendo del grupo:", error);
      throw error;
    } finally {
      store.setLoading(false);
    }
  },

  removeMember: async (memberId: string) => {
    const store = useFamilyStore.getState();
    store.removeMember(memberId);
    try {
      await FamilyService.removeMember(memberId);
    } catch (error) {
      console.error("Error expulsando miembro:", error);
      await FamilyActions.loadFamilyGroup();

      throw error;
    }
  },

  rotateCode: async () => {
    try {
      const { code } = await FamilyService.rotateInviteCode();

      useFamilyStore.getState().setInviteCode(code);

      return code;
    } catch (error) {
      console.error("Error rotando código:", error);
      throw error;
    }
  },
};
