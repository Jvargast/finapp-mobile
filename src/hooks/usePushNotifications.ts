import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useUserStore } from "../stores/useUserStore";
import { NotificationService } from "../services/notificationService";

export const usePushNotifications = () => {
  const userId = useUserStore((state) => state.user?.id ?? null);
  const storedPushToken = useUserStore((state) => state.user?.pushToken ?? null);

  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);
  const lastSyncedTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!userId) {
      lastSyncedTokenRef.current = null;
      return;
    }

    const register = async () => {
      const token =
        await NotificationService.registerForPushNotificationsAsync();

      if (!token) {
        return;
      }

      const syncKey = `${userId}:${token}`;

      if (storedPushToken === token || lastSyncedTokenRef.current === syncKey) {
        return;
      }

      console.log("📲 Token listo:", token);
      await NotificationService.updateUserToken(token);
      lastSyncedTokenRef.current = syncKey;
    };

    void register();

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
  }, [userId]);
};
