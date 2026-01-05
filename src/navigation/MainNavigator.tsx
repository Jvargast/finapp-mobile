import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/main/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { Sidebar } from "../components/layout/Sidebar";
import EditPreferenceScreen from "../screens/profile/EditPreferenceScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ChangePasswordScreen from "../screens/settings/ChangePasswordScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";

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
          headerTintColor: "#1E293B",
          headerStyle: { backgroundColor: "#F8FAFC" },
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
          headerTintColor: "#1E293B",
          headerStyle: { backgroundColor: "#F8FAFC" },
          headerShadowVisible: false,
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Configuración", headerShown: true }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={{
          headerShown: true,
          title: "Cambiar Contraseña",
          headerBackTitle: "Volver",
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
      {/* Aquí agregarías Notifications, etc. en el futuro */}
    </Stack.Navigator>
  );
}
