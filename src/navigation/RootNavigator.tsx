import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../stores/useAuthStore";
import { useUserStore } from "../stores/useUserStore";
import LoginScreen from "../screens/auth/LoginScreen";
import LoadingScreen from "../screens/LoadingScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import InitialSetupScreen from "../screens/auth/InitialSetupScreen";
import { useEffect } from "react";
import MainNavigator from "./MainNavigator";
import { AuthActions } from "../actions/authActions";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hasSeenOnboarding = useAuthStore((state) => state.hasSeenOnboarding);
  const isLoading = useAuthStore((state) => state.isLoading);
  const user = useUserStore((state) => state.user);

  const isSetupComplete = !!user?.preferences?.currency;

  useEffect(() => {
    AuthActions.checkAuth();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const isReallyAuthenticated = isAuthenticated && !!user;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isReallyAuthenticated ? (
          isSetupComplete ? (
            <Stack.Screen
              name="Main"
              component={MainNavigator}
              options={{ animation: "fade" }}
            />
          ) : (
            <Stack.Screen
              name="Setup"
              component={InitialSetupScreen}
              options={{ animation: "fade" }}
            />
          )
        ) : (
          <Stack.Group screenOptions={{ animation: "slide_from_right" }}>
            {!hasSeenOnboarding && (
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            )}

            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ animation: "fade" }}
            />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: "slide_from_bottom" }}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
