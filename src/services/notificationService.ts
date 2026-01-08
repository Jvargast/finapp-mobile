import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import finappApi from "../api/finappApi";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  registerForPushNotificationsAsync: async () => {
    let token;

    if (!Device.isDevice) {
      console.log("Debes usar un dispositivo físico para Push Notifications");
      return null;
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permiso de notificaciones denegado.");
      return null;
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      });
      token = tokenData.data;
    } catch (error) {
      console.error("Error obteniendo token:", error);
    }

    return token;
  },

  updateUserToken: async (token: string) => {
    try {
      await finappApi.patch("/users/push-token", { pushToken: token });
      console.log("✅ Token actualizado en Backend");
    } catch (error) {
      console.error("❌ Error guardando token en backend:", error);
    }
  },
};
