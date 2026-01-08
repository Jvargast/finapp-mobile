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
  Target,
  Settings,
  LogOut,
  Star,
  Landmark,
  ChevronRight,
  Building,
  Briefcase,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
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
  const isPro = user?.plan === "PRO" || user?.plan === "PREMIUM";

  const getGoalMenuItem = () => {
    switch (mainGoal) {
      case "invest":
        return { label: "Inversiones", icon: TrendingUp, route: "Goals" };

      case "debt":
        return { label: "Plan de Deudas", icon: TrendingDown, route: "Goals" };

      case "control":
        return {
          label: "Control de Gastos",
          icon: ShieldCheck,
          route: "Goals",
        };

      case "house":
        return { label: "Mi Casa Propia", icon: Building, route: "Goals" };

      case "retire":
        return { label: "Fondo de Retiro", icon: Briefcase, route: "Goals" };

      case "save":
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
    <YStack flex={1} backgroundColor="$background">
      <Pressable
        onPress={() => handleNavigate("Profile")}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
          backgroundColor: pressed ? "rgba(0,0,0,0.05)" : "transparent",
        })}
      >
        <YStack paddingTop="$8" paddingHorizontal="$5" paddingBottom="$4">
          <XStack space="$3" alignItems="center">
            <View
              padding={4}
              borderRadius={100}
              borderWidth={1}
              borderColor={isPro ? "#F59E0B" : "$brand"}
              borderStyle={isPro ? "solid" : "dashed"}
            >
              <Avatar circular size="$5">
                <Avatar.Image
                  src={user?.avatar || user?.avatarUrl}
                  width="100%"
                  height="100%"
                />
                <Avatar.Fallback
                  backgroundColor="$brand"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text color="white" fontWeight="bold" fontSize={18}>
                    {user?.firstName?.[0]?.toUpperCase() || "N"}
                  </Text>
                </Avatar.Fallback>
              </Avatar>
            </View>

            <YStack flex={1}>
              <Text
                fontWeight="800"
                fontSize={16}
                color="$color"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.firstName} {user?.lastName}
              </Text>
              <Text
                fontSize={12}
                color="$gray11"
                fontWeight="500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.email}
              </Text>
              <Text
                fontSize={12}
                color="$gray8"
                fontWeight="500"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                @{user?.username || "usuario"}
              </Text>
            </YStack>
          </XStack>
        </YStack>
      </Pressable>

      <Separator borderColor="$borderColor" marginHorizontal="$5" />

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 20 }}
      >
        <YStack paddingHorizontal="$3" space="$1">
          <Text
            fontSize={11}
            color="$gray10"
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
                backgroundColor={isActive ? "$brand" : "transparent"}
                pressStyle={{
                  backgroundColor: isActive ? "$brand" : "$color2",
                }}
                onPress={() => handleNavigate(item.route)}
                animation="quick"
              >
                <Icon size={20} color={isActive ? "white" : "$gray10"} />
                <Text
                  marginLeft="$3"
                  fontSize={15}
                  color={isActive ? "white" : "$color"}
                  fontWeight={isActive ? "700" : "500"}
                  flex={1}
                >
                  {item.label}
                </Text>

                {item.badge && !isActive && (
                  <View
                    backgroundColor="$blue3"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                  >
                    <Text fontSize={10} color="$brand" fontWeight="bold">
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
        borderColor="$borderColor"
        backgroundColor="$background"
      >
        <Button
          unstyled
          flexDirection="row"
          alignItems="center"
          padding="$3"
          borderRadius="$4"
          pressStyle={{ backgroundColor: "$color2" }}
          onPress={() => handleNavigate("Settings")}
        >
          <Settings size={20} color="$gray10" />
          <Text marginLeft="$3" fontSize={15} color="$color" fontWeight="500">
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
          pressStyle={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
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
