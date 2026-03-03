import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { AppState, View, Text, useColorScheme } from "react-native";
import { enableScreens, enableFreeze } from "react-native-screens";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from "./tamagui.config";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalToast } from "./src/components/ui/GlobalToast";
import { useUserStore } from "./src/stores/useUserStore";
import { usePushNotifications } from "./src/hooks/usePushNotifications";
import { useThemePreferencesStore } from "./src/stores/useThemePreferencesStore";
import { PortalProvider } from "@tamagui/portal";
import { TamaguiProvider, Theme } from "tamagui";

const queryClient = new QueryClient();
const AUTO_THEME_REFRESH_MS = 60 * 1000;

const isNightTime = (startHour: number, endHour: number) => {
  const currentHour = new Date().getHours();

  if (startHour === endHour) return true;
  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  }

  return currentHour >= startHour || currentHour < endHour;
};

const useAutoDarkMode = (
  enabled: boolean,
  startHour: number,
  endHour: number
) => {
  const [isDark, setIsDark] = useState(() => isNightTime(startHour, endHour));

  useEffect(() => {
    if (!enabled) return;

    const syncTheme = () => setIsDark(isNightTime(startHour, endHour));
    syncTheme();

    const intervalId = setInterval(syncTheme, AUTO_THEME_REFRESH_MS);
    const appStateSubscription = AppState.addEventListener("change", (state) => {
      if (state === "active") syncTheme();
    });

    return () => {
      clearInterval(intervalId);
      appStateSubscription.remove();
    };
  }, [enabled, startHour, endHour]);

  return isDark;
};

enableScreens();
enableFreeze(true);

export default function App() {
  const colorScheme = useColorScheme();
  const user = useUserStore((state) => state.user);
  const localAutoDarkMode = useThemePreferencesStore((state) => state.autoDarkMode);
  const darkStartHour = useThemePreferencesStore((state) => state.darkStartHour);
  const darkEndHour = useThemePreferencesStore((state) => state.darkEndHour);
  const hydrateThemePreferences = useThemePreferencesStore(
    (state) => state.hydrate
  );

  useEffect(() => {
    hydrateThemePreferences();
  }, [hydrateThemePreferences]);

  usePushNotifications();
  const autoDarkMode = user?.preferences?.autoDarkMode ?? localAutoDarkMode;
  const scheduledDarkMode = useAutoDarkMode(
    autoDarkMode,
    darkStartHour,
    darkEndHour
  );
  const isDarkMode = autoDarkMode
    ? scheduledDarkMode
    : user?.preferences?.darkMode ?? colorScheme === "dark";
  const currentTheme = isDarkMode ? "dark" : "light";

  const [loaded, error] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (error) {
    console.error("Error cargando fuentes:", error);
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "red" }}>
          Error cargando fuentes: {error.message}
        </Text>
      </View>
    );
  }

  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "yellow",
        }}
      >
        <Text>Cargando Fuentes...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <PortalProvider shouldAddRootHost>
            <Theme name={currentTheme}>
              <SafeAreaProvider>
                <GlobalToast />
                <StatusBar style={isDarkMode ? "light" : "dark"} />
                <RootNavigator />
              </SafeAreaProvider>
            </Theme>
          </PortalProvider>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
