import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Sidebar } from "../components/layout/Sidebar";
import EditPreferenceScreen from "../screens/profile/EditPreferenceScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import { useTheme } from "tamagui";
import { GoalsScreen } from "../screens/goals/GoalsScreen";
import { CreateGoalScreen } from "../screens/goals/CreateGoalScreen";
import { GoalDetailScreen } from "../screens/goals/GoalDetailScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerGroup() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        drawerStyle: {
          width: "80%",
          backgroundColor: "#F8FAFC",
        },
      }}
    >
      <Drawer.Screen name="Dashboard" component={HomeScreen} />
    </Drawer.Navigator>
  );
}

export default function MainNavigator() {
  const theme = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeDrawer" component={DrawerGroup} />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "Mi Perfil",
          headerBackTitle: "Volver",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
          headerShadowVisible: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="EditPreference"
        component={EditPreferenceScreen}
        options={{
          headerShown: true,
          title: "Editar",
          headerBackTitle: "Atrás",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
          headerShadowVisible: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Configuración",
          headerShown: true,
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: "Cambiar Contraseña",
          headerBackTitle: "Volver",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: true,
          title: "Editar Perfil",
          animation: "slide_from_bottom",
          headerTintColor: "$color",
          headerStyle: { backgroundColor: theme.brand.val },
        }}
      />
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateGoal"
        component={CreateGoalScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
