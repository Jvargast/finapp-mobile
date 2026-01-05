import { useEffect, useState } from "react";
import {
  YStack,
  Text,
  Button,
  Switch,
  ScrollView,
  Circle,
  XStack,
  Spacer,
} from "tamagui";
import {
  Moon,
  Bell,
  Shield,
  Lock,
  LogOut,
  Coins,
  Target,
  ChevronRight,
  HelpCircle,
  FileText,
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/useUserStore";
import { AuthActions } from "../../actions/authActions";
import { UserActions } from "../../actions/userActions";

const SettingItem = ({
  icon: Icon,
  color,
  label,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  isDestructive,
}: any) => (
  <Button
    unstyled
    onPress={hasSwitch ? undefined : onPress}
    backgroundColor="white"
    paddingVertical="$4"
    paddingHorizontal="$4"
    flexDirection="row"
    alignItems="center"
    borderBottomWidth={1}
    borderBottomColor="#F1F5F9"
    pressStyle={{ backgroundColor: "#F8FAFC" }}
  >
    <Circle size="$2.5" backgroundColor={`${color}15`}>
      <Icon size={18} color={color} />
    </Circle>
    <Text
      fontSize={15}
      color={isDestructive ? "#EF4444" : "#1E293B"}
      fontWeight="500"
      marginLeft="$3"
      flex={1}
    >
      {label}
    </Text>
    <XStack alignItems="center" space="$2">
      {value && (
        <Text fontSize={14} color="#64748B">
          {value}
        </Text>
      )}
      {hasSwitch && (
        <Switch
          size="$3"
          checked={switchValue}
          onCheckedChange={onSwitchChange}
          backgroundColor={switchValue ? "#4F46E5" : "#E2E8F0"}
          borderWidth={0}
        >
          <Switch.Thumb animation="bouncy" backgroundColor="white" />
        </Switch>
      )}
      {!hasSwitch && <ChevronRight size={18} color="#CBD5E1" />}
    </XStack>
  </Button>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Text
    fontSize={12}
    color="#64748B"
    fontWeight="700"
    marginTop="$5"
    marginBottom="$2"
    marginLeft="$4"
    textTransform="uppercase"
    letterSpacing={1}
  >
    {title}
  </Text>
);

export default function SettingsScreen() {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<any>();

  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      const notifValue =
        user.preferences.notifications !== undefined
          ? user.preferences.notifications
          : true;

      setNotifications(notifValue);
      setDarkMode(user.preferences.darkMode ?? false);
    }
  }, [user]);

  const handleTogglePreference = async (
    key: string,
    value: boolean,
    setter: any
  ) => {
    setter(value);

    try {
      await UserActions.updatePreferences({ [key]: value });
    } catch (error) {
      setter(!value);
      Alert.alert("Error", "No se pudo guardar la configuración.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => AuthActions.logout(),
      },
    ]);
  };

  return (
    <YStack flex={1} backgroundColor="#F8FAFC">
      <ScrollView>
        <YStack paddingBottom="$8">
          <SectionTitle title="Preferencias de la App" />
          <YStack
            backgroundColor="white"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="#F1F5F9"
          >
            <SettingItem
              icon={Coins}
              color="#F59E0B"
              label="Moneda Principal"
              value={user?.preferences?.currency || "CLP"}
              onPress={() =>
                navigation.navigate("EditPreference", { type: "currency" })
              }
            />
            <SettingItem
              icon={Target}
              color="#10B981"
              label="Objetivo Financiero"
              value={
                user?.preferences?.mainGoal === "save"
                  ? "Ahorrar"
                  : user?.preferences?.mainGoal === "invest"
                  ? "Invertir"
                  : "Controlar"
              }
              onPress={() =>
                navigation.navigate("EditPreference", { type: "goal" })
              }
            />
            <SettingItem
              icon={Moon}
              color="#8B5CF6"
              label="Modo Oscuro"
              hasSwitch
              switchValue={darkMode}
              onSwitchChange={(val: boolean) =>
                handleTogglePreference("darkMode", val, setDarkMode)
              }
            />
            <SettingItem
              icon={Bell}
              color="#F59E0B"
              label="Notificaciones"
              hasSwitch
              switchValue={notifications}
              onSwitchChange={(val: boolean) =>
                handleTogglePreference("notifications", val, setNotifications)
              }
            />
          </YStack>

          <SectionTitle title="Seguridad" />
          <YStack
            backgroundColor="white"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="#F1F5F9"
          >
            <SettingItem
              icon={Shield}
              color="#1E293B"
              label="Biometría (FaceID)"
              hasSwitch
              switchValue={biometrics}
              onSwitchChange={setBiometrics}
            />
            <SettingItem
              icon={Lock}
              color="#1E293B"
              label="Cambiar Contraseña"
              onPress={() => navigation.navigate("ChangePassword")}
            />
          </YStack>

          <SectionTitle title="Soporte y Legal" />
          <YStack
            backgroundColor="white"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="#F1F5F9"
          >
            <SettingItem
              icon={HelpCircle}
              color="#64748B"
              label="Centro de Ayuda"
              onPress={() => {}}
            />
            <SettingItem
              icon={FileText}
              color="#64748B"
              label="Términos y Privacidad"
              onPress={() => {}}
            />
          </YStack>

          <Spacer size="$6" />

          <YStack
            backgroundColor="white"
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="#F1F5F9"
          >
            <SettingItem
              icon={LogOut}
              color="#EF4444"
              label="Cerrar Sesión"
              isDestructive
              onPress={handleLogout}
            />
          </YStack>

          <YStack marginTop="$4" alignItems="center">
            <Text
              color="#EF4444"
              fontSize={13}
              fontWeight="600"
              onPress={() => Alert.alert("Zona de Peligro")}
            >
              Eliminar mi cuenta
            </Text>
            <Text marginTop="$4" fontSize={11} color="#94A3B8">
              Nova App v1.0.0 (Build 2025)
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}
