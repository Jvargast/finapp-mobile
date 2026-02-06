import * as SecureStore from "expo-secure-store";
import { AuthService } from "../services/authService";
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";
import { useToastStore } from "../stores/useToastStore";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const mergeUser = (currentUser: any, incomingUser: any) => {
  if (!currentUser) return incomingUser;
  const mergedPreferences = {
    ...(currentUser.preferences || {}),
    ...(incomingUser?.preferences || {}),
  };

  return {
    ...currentUser,
    ...incomingUser,
    email: incomingUser?.email || currentUser.email,
    preferences: mergedPreferences,
  };
};

export const AuthActions = {
  login: async (email: string, password: string) => {
    try {
      const data = await AuthService.login(email, password);

      await SecureStore.setItemAsync("access_token", data.access_token);
      await SecureStore.setItemAsync("refresh_token", data.refresh_token);
      let resolvedUser = data.user;
      try {
        resolvedUser = await AuthService.getMe();
      } catch (e) {
        console.warn("No se pudo hidratar el perfil tras login", e);
      }

      const currentUser = useUserStore.getState().user;
      const mergedUser = mergeUser(currentUser, resolvedUser);
      useUserStore.getState().setUser({
        ...mergedUser,
        email: mergedUser?.email || email,
      });

      useAuthStore.getState().setAuthenticated(true);

      setTimeout(() => {
        useToastStore
          .getState()
          .showToast(`¡Hola de nuevo, ${data.user.firstName}!`, "success");
      }, 500);
    } catch (error) {
      console.error("Login falló", error);
      throw error;
    }
  },

  register: async (userData: any) => {
    try {
      const data = await AuthService.register(userData);

      await SecureStore.setItemAsync("access_token", data.access_token);
      await SecureStore.setItemAsync("refresh_token", data.refresh_token);

      let resolvedUser = data.user;
      try {
        resolvedUser = await AuthService.getMe();
      } catch (e) {
        console.warn("No se pudo hidratar el perfil tras registro", e);
      }

      const currentUser = useUserStore.getState().user;
      const mergedUser = mergeUser(currentUser, resolvedUser);
      useUserStore.getState().setUser({
        ...mergedUser,
        email: mergedUser?.email || userData.email,
      });
      useAuthStore.getState().setAuthenticated(true);
    } catch (error) {
      console.error("Registro falló", error);
      throw error;
    }
  },

  logout: async (silent = false) => {
    if (!silent) {
      useToastStore.getState().showToast("¡Hasta pronto! 👋", "info");
      await delay(500);

      try {
        await AuthService.logout();
      } catch (e) {
        console.warn("Error logout backend", e);
      }
    }

    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");

    useUserStore.getState().clearUser();
  },

  checkAuth: async () => {
    useAuthStore.getState().setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("access_token");

      const hasSeen = await SecureStore.getItemAsync("has_seen_onboarding");
      const hasSeenBool = hasSeen === "true";

      if (!token) {
        AuthActions.logout(true);
        useAuthStore.getState().setHasSeenOnboarding(hasSeenBool);
        return;
      }

      const user = await AuthService.getMe();

      useAuthStore.getState().setHasSeenOnboarding(hasSeenBool);
      const currentUser = useUserStore.getState().user;
      useUserStore.getState().setUser(mergeUser(currentUser, user));
      useAuthStore.getState().setAuthenticated(true);
    } catch (error) {
      console.log("Sesión expirada o inválida");
      const hasSeen = await SecureStore.getItemAsync("has_seen_onboarding");
      AuthActions.logout(true);
      useAuthStore.getState().setHasSeenOnboarding(hasSeen === "true");
    } finally {
      useAuthStore.getState().setLoading(false);
    }
  },

  finishOnboarding: async () => {
    try {
      await SecureStore.setItemAsync("has_seen_onboarding", "true");
      useAuthStore.getState().setHasSeenOnboarding(true);
    } catch (error) {
      console.error("Error guardando onboarding", error);
    }
  },
};
