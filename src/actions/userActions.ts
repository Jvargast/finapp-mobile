import { AuthService } from "../services/authService";
import { UserService } from "../services/userService";
import { useUserStore } from "../stores/useUserStore";

export const UserActions = {
  completeSetup: async (settings: any) => {
    try {
      const payload = {
        currency: settings.currency,
        initialBalance: parseFloat(settings.initialBalance) || 0,
        mainGoal: settings.mainGoal,
      };

      const updatedUser = await UserService.setupUser(payload);

      useUserStore.getState().setUser(updatedUser);
    } catch (error) {
      console.error("Error en setup:", error);
      throw error;
    }
  },

  updatePreferences: async (newPrefs: any) => {
    const currentUser = useUserStore.getState().user;
    if (!currentUser) return;

    useUserStore.getState().setUser({
      ...currentUser,
      preferences: { ...currentUser.preferences, ...newPrefs },
    });

    try {
      const updatedUserResponse = await UserService.updatePreferences(newPrefs);
      useUserStore.getState().setUser(updatedUserResponse);
    } catch (error) {
      console.error("Error guardando preferencias", error);
      useUserStore.getState().setUser(currentUser);
      throw error;
    }
  },

  refreshProfile: async () => {
    try {
      const freshUser = await AuthService.getMe();
      useUserStore.getState().setUser(freshUser);
    } catch (error) {
      console.warn("No se pudo refrescar el perfil (quizás offline)", error);
    }
  },

  changePassword: async (currentPass: string, newPass: string) => {
    try {
      await UserService.changePassword(currentPass, newPass);
    } catch (error) {
      console.error("Error cambiando contraseña", error);
      throw error;
    }
  },

  updateProfile: async (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
  }) => {
    const currentUser = useUserStore.getState().user;
    if (!currentUser) return;

    useUserStore.getState().setUser({ ...currentUser, ...data });

    try {
      await UserService.updateProfile(data);
    } catch (error: any) {
      console.log(
        "❌ ERROR VALIDACIÓN:",
        JSON.stringify(error.response?.data, null, 2)
      );

      useUserStore.getState().setUser(currentUser);
      throw error;
    }
  },

  uploadAvatar: async (imageResult: any) => {
    if (!imageResult.assets || imageResult.assets.length === 0) return;

    const asset = imageResult.assets[0];

    const formData = new FormData();

    formData.append("file", {
      uri: asset.uri,
      name: asset.fileName || `avatar-${Date.now()}.jpg`, 
      type: asset.mimeType || "image/jpeg", 
    } as any); 

    try {
      const updatedUser = await UserService.uploadAvatar(formData);

      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        useUserStore.getState().setUser({
          ...currentUser,
          ...updatedUser,
        });
      }

      console.log("Avatar actualizado con éxito");
    } catch (error) {
      console.error("Error subiendo avatar:", error);
      throw error;
    }
  },

  requestSensitiveChange: async (
    field: "EMAIL" | "PHONE",
    newValue: string
  ) => {
    try {
      return await UserService.requestSensitiveChange(field, newValue);
    } catch (error) {
      console.error(`Error solicitando cambio de ${field}`, error);
      throw error;
    }
  },

  verifySensitiveChange: async (
    field: "EMAIL" | "PHONE",
    newValue: string,
    code: string
  ) => {
    try {
      await UserService.verifySensitiveChange(field, newValue, code);

      await UserActions.refreshProfile();
    } catch (error) {
      console.error(`Error verificando cambio de ${field}`, error);
      throw error;
    }
  },
};
