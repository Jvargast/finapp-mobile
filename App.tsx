import "react-native-gesture-handler";
import { View, Text } from "react-native";
import { useFonts } from "expo-font";
import { TamaguiProvider, Theme } from "tamagui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import config from "./tamagui.config";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./src/navigation/RootNavigator";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { GlobalToast } from "./src/components/ui/GlobalToast";
import { useUserStore } from "./src/stores/useUserStore";
import { usePushNotifications } from "./src/hooks/usePushNotifications";

const queryClient = new QueryClient();

export default function App() {
  const colorScheme = useColorScheme();
  const user = useUserStore((state) => state.user);
  usePushNotifications();
  const isDarkMode = user?.preferences?.darkMode ?? colorScheme === "dark";
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
    console.log("--> CARGANDO FUENTES...");
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

  console.log(isDarkMode ? "--> MODO OSCURO" : "--> MODO CLARO");

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <TamaguiProvider config={config}>
          <Theme name={currentTheme}>
            <SafeAreaProvider>
              <GlobalToast />
              <StatusBar style={isDarkMode ? "light" : "dark"} />
              <RootNavigator />
            </SafeAreaProvider>
          </Theme>
        </TamaguiProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
