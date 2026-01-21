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
  Separator,
} from "tamagui";
import {
  Moon,
  Bell,
  Shield,
  Lock,
  LogOut,
  Coins,
  Target,
  HelpCircle,
  FileText,
  TrendingDown,
  Building,
  ShieldCheck,
  Briefcase,
  TrendingUp,
  CreditCard,
  Home,
  PiggyBank,
  UserMinus,
  HeartHandshake,
  Star,
  Crown,
  Users,
  Gift,
} from "@tamagui/lucide-icons";
import { Alert, Linking } from "react-native";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useUserStore } from "../../stores/useUserStore";
import { AuthActions } from "../../actions/authActions";
import { UserActions } from "../../actions/userActions";
import { registerForPushNotificationsAsync } from "../../utils/notifications";
import { useToastStore } from "../../stores/useToastStore";
import { UserService } from "../../services/userService";
import { DangerModal } from "../../components/ui/DangerModal";
import { SectionTitle } from "../../components/ui/SectionTitle";
import { SettingItem } from "../../components/settings/SettingItem";
import { JoinFamilySheet } from "../../components/family/JoinFamilySheet";

const GOAL_LABELS: Record<string, string> = {
  save: "Ahorrar Dinero",
  debt: "Salir de Deudas",
  house: "Comprar Vivienda",
  control: "Controlar Gastos",
  invest: "Invertir",
  retire: "Jubilación",
};

const GOAL_CONFIG: Record<string, { label: string; icon: any; color: string }> =
  {
    save: {
      label: "Ahorrar Dinero",
      icon: PiggyBank,
      color: "#10B981",
    },
    debt: {
      label: "Salir de Deudas",
      icon: CreditCard,
      color: "#EF4444",
    },
    house: {
      label: "Comprar Vivienda",
      icon: Home,
      color: "#3B82F6",
    },
    control: {
      label: "Controlar Gastos",
      icon: ShieldCheck,
      color: "#F97316",
    },
    invest: {
      label: "Invertir",
      icon: TrendingUp,
      color: "#8B5CF6",
    },
    retire: {
      label: "Jubilación",
      icon: Briefcase,
      color: "#64748B",
    },
  };

export default function SettingsScreen() {
  const user = useUserStore((state) => state.user);
  const navigation = useNavigation<any>();
  const { showToast } = useToastStore();

  const [showJoinSheet, setShowJoinSheet] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [biometrics, setBiometrics] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      const notifValue = user.preferences.notifications ?? true;
      setNotifications(notifValue);
      setDarkMode(user.preferences.darkMode ?? false);
    }
  }, [user]);

  const goalKey = user?.preferences?.mainGoal || "save";
  const currentGoal = GOAL_CONFIG[goalKey] || GOAL_CONFIG["save"];

  const userPlan = user?.plan || "FREE";
  const [leaveFamilyModalVisible, setLeaveFamilyModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const executeLeaveFamily = async () => {
    setIsProcessing(true);
    try {
      //await UserActions.leaveFamilyGroup();
      setLeaveFamilyModalVisible(false);
      showToast("Has salido del grupo familiar", "success");
      AuthActions.logout();
    } catch (error) {
      console.error("Error saliendo del grupo:", error);
      showToast("No se pudo salir del grupo.", "error");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleTogglePreference = async (
    key: string,
    value: boolean,
    setter: any
  ) => {
    setter(value);

    try {
      if (key === "notifications" && value === true) {
        console.log("🔔 Intentando activar notificaciones...");

        const token = await registerForPushNotificationsAsync();

        if (token) {
          await UserActions.updatePreferences({ [key]: value });
          await UserActions.registerPushToken(token);
        } else {
          setter(false);
          Alert.alert(
            "Permisos necesarios",
            "Para activar las notificaciones, necesitas dar permiso desde la configuración de tu celular.",
            [
              {
                text: "Cancelar",
                style: "cancel",
              },
              {
                text: "Ir a Ajustes",
                onPress: () => Linking.openSettings(),
              },
            ]
          );
          return;
        }
      } else {
        await UserActions.updatePreferences({ [key]: value });
      }
    } catch (error) {
      console.error(error);
      setter(!value);
      showToast("No se pudo guardar la configuración", "error");
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

  const executeDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await UserService.deleteAccount();
      setDeleteModalVisible(false);
      showToast("Tu cuenta ha sido eliminada permanentemente", "success");
      AuthActions.logout();
    } catch (error) {
      console.error("Error eliminando cuenta:", error);
      setIsDeleting(false);
      showToast("Error al eliminar cuenta. Intenta nuevamente.", "error");
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView>
        <YStack paddingBottom="$8">
          <SectionTitle title="Tu Plan Wou+" />
          <YStack
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            {userPlan === "FREE" && (
              <>
                <SettingItem
                  icon={Star}
                  color="#F59E0B"
                  label="Obtener Premium"
                  value="Ver Planes"
                  onPress={() => navigation.navigate("Subscription")}
                />

                <SettingItem
                  icon={Gift}
                  color="#8B5CF6"
                  label="Tengo código familiar"
                  value="Unirse"
                  onPress={() => setShowJoinSheet(true)}
                />
              </>
            )}

            {userPlan === "PRO" && (
              <SettingItem
                icon={Crown}
                color="#F59E0B"
                label="Suscripción Pro"
                value="Gestionar"
                onPress={() => navigation.navigate("SubscriptionDetails")}
              />
            )}

            {userPlan === "FAMILY_ADMIN" && (
              <SettingItem
                icon={Users}
                color="#F59E0B"
                label="Grupo Familiar"
                value="Gestionar Miembros"
                onPress={() => navigation.navigate("FamilyGroup")}
              />
            )}

            {userPlan === "FAMILY_MEMBER" && (
              <>
                <SettingItem
                  icon={HeartHandshake}
                  color="#F59E0B"
                  label="Plan Familiar"
                  value="Ver Miembros"
                  onPress={() => navigation.navigate("FamilyGroup")}
                />
                <SettingItem
                  icon={UserMinus}
                  color="#EF4444"
                  label="Salir del Grupo Familiar"
                  isDestructive
                  onPress={() => setLeaveFamilyModalVisible(true)}
                />
              </>
            )}
          </YStack>
          <SectionTitle title="Preferencias de la App" />
          <YStack
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
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
              icon={currentGoal.icon}
              color={currentGoal.color}
              label="Objetivo Financiero"
              value={currentGoal.label}
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
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <SettingItem
              icon={Shield}
              color="$gray11"
              label="Biometría (FaceID)"
              hasSwitch
              switchValue={biometrics}
              onSwitchChange={setBiometrics}
            />
            <SettingItem
              icon={Lock}
              color="$gray11"
              label="Cambiar Contraseña"
              onPress={() => navigation.navigate("ChangePassword")}
            />
          </YStack>

          <SectionTitle title="Soporte y Legal" />
          <YStack
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <SettingItem
              icon={HelpCircle}
              color="$gray11"
              label="Centro de Ayuda"
              onPress={() => {}}
            />
            <SettingItem
              icon={FileText}
              color="$gray11"
              label="Términos y Privacidad"
              onPress={() => {}}
            />
          </YStack>

          <Spacer size="$6" />

          <YStack
            borderTopWidth={1}
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <SettingItem
              icon={LogOut}
              color="#EF4444"
              label="Cerrar Sesión"
              isDestructive
              onPress={handleLogout}
            />
          </YStack>

          <YStack marginTop="$4" alignItems="center" marginBottom="$4">
            <Text
              color="#EF4444"
              fontSize={13}
              fontWeight="600"
              onPress={() => setDeleteModalVisible(true)}
            >
              Eliminar mi cuenta
            </Text>
            <Text marginTop="$4" fontSize={11} color="$color">
              WOU Finance v1.0.0 (Build 2025)
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
      <DangerModal
        visible={deleteModalVisible}
        onClose={() => !isDeleting && setDeleteModalVisible(false)}
        onConfirm={executeDeleteAccount}
        isLoading={isDeleting}
        title="¿Eliminar cuenta?"
        confirmText="Sí, eliminar todo"
        message={
          <Text
            fontSize={14}
            color="$colorQwerty"
            textAlign="center"
            lineHeight={20}
          >
            Esta acción es{" "}
            <Text fontWeight="700" color="#EF4444">
              permanente e irreversible
            </Text>
            .{"\n"}Se borrarán todos tus datos, transacciones y configuraciones.
          </Text>
        }
      />
      <DangerModal
        visible={leaveFamilyModalVisible}
        onClose={() => !isProcessing && setLeaveFamilyModalVisible(false)}
        onConfirm={executeLeaveFamily}
        isLoading={isProcessing}
        title="¿Salir del grupo?"
        confirmText="Sí, salir"
        message={
          <Text
            fontSize={14}
            color="$colorQwerty"
            textAlign="center"
            lineHeight={20}
          >
            Perderás acceso inmediato a los beneficios{" "}
            <Text fontWeight="700" color="#F59E0B">
              Premium
            </Text>{" "}
            compartidos por el administrador.
          </Text>
        }
      />
      <JoinFamilySheet open={showJoinSheet} onOpenChange={setShowJoinSheet} />
    </YStack>
  );
}
