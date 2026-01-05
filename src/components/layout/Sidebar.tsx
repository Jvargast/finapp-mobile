import {
  YStack,
  XStack,
  Text,
  Button,
  Avatar,
  Separator,
  Spacer,
  View,
} from "tamagui";
import {
  Home,
  TrendingUp,
  Target,
  Settings,
  LogOut,
  Star,
  ShieldAlert,
  Landmark,
  ChevronRight,
} from "@tamagui/lucide-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { useUserStore } from "../../stores/useUserStore";
import { AuthActions } from "../../actions/authActions";

export const Sidebar = (props: any) => {
  const navigation = useNavigation<any>();
  const user = useUserStore((state) => state.user);
  const state = props.state;
  const currentRoute = state.routes[state.index].name;

  const mainGoal = user?.preferences?.mainGoal || "save";

  const getGoalMenuItem = () => {
    switch (mainGoal) {
      case "invest":
        return { label: "Inversiones", icon: TrendingUp, route: "Investments" };
      case "control":
        return { label: "Plan de Deudas", icon: ShieldAlert, route: "Debts" };
      default:
        return { label: "Metas de Ahorro", icon: Target, route: "Goals" };
    }
  };

  const goalItem = getGoalMenuItem();

  const MAIN_MENU = [
    {
      id: "Dashboard",
      label: "Resumen General",
      icon: Home,
      route: "Dashboard",
    },
    {
      id: "Accounts",
      label: "Mis Bancos",
      icon: Landmark,
      route: "Accounts",
      badge: "PRO",
    },
    {
      id: "Goal",
      label: goalItem.label,
      icon: goalItem.icon,
      route: goalItem.route,
    },
  ];

  const handleNavigate = (screen: string) => {
    navigation.navigate(screen);
  };

  const handleLogout = () => {
    AuthActions.logout();
  };

  return (
    <YStack flex={1} backgroundColor="#F8FAFC">
      <Pressable
        onPress={() => handleNavigate("Profile")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          backgroundColor: pressed ? "#F1F5F9" : "transparent",
        })}
      >
        <YStack paddingTop="$8" paddingHorizontal="$5" paddingBottom="$4">
          <XStack space="$3" alignItems="center">
            <Avatar circular size="$5">
              <Avatar.Image
                src={user?.avatar || user?.avatarUrl}
                width="100%"
                height="100%"
              />
              <Avatar.Fallback
                backgroundColor="#4F46E5"
                alignItems="center"
                justifyContent="center"
              >
                <Text color="white" fontWeight="bold" fontSize={18}>
                  {user?.firstName?.[0]?.toUpperCase() || "N"}
                </Text>
              </Avatar.Fallback>
            </Avatar>
            <YStack flex={1}>
              <Text
                fontWeight="800"
                fontSize={16}
                color="#1E293B"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <Text
                fontSize={12}
                color="#64748B"
                fontWeight="500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.email}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Pressable>

      <Separator borderColor="#E2E8F0" marginHorizontal="$5" />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <YStack paddingHorizontal="$3" space="$1">
          <Text
            fontSize={11}
            color="#94A3B8"
            fontWeight="700"
            marginBottom="$2"
            paddingHorizontal="$3"
            textTransform="uppercase"
            letterSpacing={1}
          >
            Tu Dinero
          </Text>

          {MAIN_MENU.map((item) => {
            const isActive = currentRoute === item.route;
            const Icon = item.icon;

            return (
              <Button
                key={item.id}
                unstyled
                flexDirection="row"
                alignItems="center"
                paddingVertical={12}
                paddingHorizontal={16}
                borderRadius={12}
                backgroundColor={isActive ? "#4F46E5" : "transparent"}
                pressStyle={{
                  backgroundColor: isActive ? "#4338CA" : "#F1F5F9",
                }}
                onPress={() => handleNavigate(item.route)}
                animation="quick"
              >
                <Icon size={20} color={isActive ? "white" : "#64748B"} />
                <Text
                  marginLeft="$3"
                  fontSize={15}
                  color={isActive ? "white" : "#334155"}
                  fontWeight={isActive ? "700" : "500"}
                  flex={1}
                >
                  {item.label}
                </Text>

                {item.badge && !isActive && (
                  <View
                    backgroundColor="#EEF2FF"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text fontSize={10} color="#4F46E5" fontWeight="bold">
                      {item.badge}
                    </Text>
                  </View>
                )}
                {isActive && (
                  <ChevronRight size={16} color="white" opacity={0.5} />
                )}
              </Button>
            );
          })}

          <Spacer size="$6" />

          <YStack paddingHorizontal="$2">
            <Pressable onPress={() => handleNavigate("Subscription")}>
              <YStack
                borderRadius="$6"
                overflow="hidden"
                backgroundColor="#1E293B"
                padding="$4"
                position="relative"
                shadowColor="#000"
                shadowRadius={10}
                shadowOffset={{ width: 0, height: 5 }}
                shadowOpacity={0.2}
              >
                <View
                  position="absolute"
                  top={-20}
                  right={-20}
                  width={80}
                  height={80}
                  borderRadius={40}
                  backgroundColor="#F59E0B"
                  opacity={0.15}
                />

                <XStack alignItems="center" space="$2" marginBottom="$2">
                  <Star size={18} color="#F59E0B" fill="#F59E0B" />
                  <Text
                    color="#F59E0B"
                    fontWeight="bold"
                    fontSize={12}
                    letterSpacing={1}
                  >
                    NOVA PRO
                  </Text>
                </XStack>

                <Text
                  color="white"
                  fontSize={14}
                  fontWeight="600"
                  marginBottom="$1"
                  lineHeight={20}
                >
                  Conecta tus bancos automáticamente.
                </Text>

                <Text color="#94A3B8" fontSize={12}>
                  Deja de ingresar gastos a mano y toma el control real.
                </Text>
              </YStack>
            </Pressable>
          </YStack>
        </YStack>
      </DrawerContentScrollView>

      <YStack
        padding="$4"
        paddingBottom="$8"
        borderTopWidth={1}
        borderColor="#E2E8F0"
        backgroundColor="#F8FAFC"
      >
        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          padding="$3"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "#F1F5F9" }}
          onPress={() => handleNavigate("Settings")}
        >
          <Settings size={20} color="#64748B" />
          <Text marginLeft="$3" fontSize={15} color="#334155" fontWeight="500">
            Configuración
          </Text>
        </Button>

        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          padding="$3"
          marginTop="$1"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "#FEF2F2" }}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#EF4444" />
          <Text marginLeft="$3" fontSize={15} color="#EF4444" fontWeight="600">
            Cerrar Sesión
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
};
