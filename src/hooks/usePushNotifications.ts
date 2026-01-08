import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useUserStore } from "../stores/useUserStore";
import { NotificationService } from "../services/notificationService";

export const usePushNotifications = () => {
  const { user } = useUserStore();

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!user) return;

    const register = async () => {
      const token =
        await NotificationService.registerForPushNotificationsAsync();
      if (token) {
        console.log("📲 Token listo:", token);
        await NotificationService.updateUserToken(token);
      }
    };

    register();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("🔔 Notificación recibida:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("👆 Tocaste la notificación:", response);
      });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
    };
  }, [user]);
};
