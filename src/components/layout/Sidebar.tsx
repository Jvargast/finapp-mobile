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
  Settings,
  LogOut,
  Star,
  Landmark,
  ChevronRight,
  Briefcase,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  PiggyBank,
  Crown,
  Users,
  HeartHandshake,
  Banknote,
} from "@tamagui/lucide-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { useUserStore } from "../../stores/useUserStore";
import { AuthActions } from "../../actions/authActions";

export const Sidebar = (props: any) => {
  const navigation = useNavigation<any>();
  const isPro = useUserStore((state) => state.isPro());
  const user = useUserStore((state) => state.user);

  const userPlan = user?.plan || "FREE";
  const state = props.state;
  const currentRoute = state.routes[state.index].name;

  const mainGoal = user?.preferences?.mainGoal || "save";

  const handleSubscriptionPress = () => {
    switch (userPlan) {
      case "FREE":
        navigation.navigate("Subscription");
        break;
      case "FAMILY_ADMIN":
        navigation.navigate("FamilyGroup");
        break;
      case "FAMILY_MEMBER":
      case "PRO":
      default:
        navigation.navigate("Settings");
        break;
    }
  };

  const renderSubscriptionCard = () => {
    if (userPlan === "FREE") {
      return (
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
          borderWidth={1}
          borderColor="$gray3"
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
              WOU+
            </Text>
          </XStack>
          <Text
            color="white"
            fontSize={14}
            fontWeight="600"
            marginBottom="$1"
            lineHeight={20}
          >
            Desbloquea todo el potencial.
          </Text>
          <Text color="#94A3B8" fontSize={12}>
            Automatización, IA y control total.
          </Text>
        </YStack>
      );
    }

    if (userPlan === "FAMILY_ADMIN") {
      return (
        <YStack
          borderRadius="$6"
          backgroundColor="rgba(245, 158, 11, 0.1)"
          padding="$4"
          borderWidth={1}
          borderColor="#F59E0B"
        >
          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginBottom="$2"
          >
            <XStack space="$2" alignItems="center">
              <Users size={18} color="#F59E0B" />
              <Text color="#F59E0B" fontWeight="800" fontSize={13}>
                FAMILIA WOU+
              </Text>
            </XStack>
            <View
              backgroundColor="#F59E0B"
              borderRadius="$4"
              paddingHorizontal={6}
              paddingVertical={2}
            >
              <Text color="black" fontSize={9} fontWeight="bold">
                ADMIN
              </Text>
            </View>
          </XStack>
          <Text color="$color" fontSize={13} fontWeight="600">
            Gestionar Grupo Familiar
          </Text>
          <Text color="$gray10" fontSize={11} marginTop={2}>
            Toca para invitar o editar miembros.
          </Text>
        </YStack>
      );
    }

    return (
      <YStack
        borderRadius="$6"
        backgroundColor="#1E293B"
        padding="$4"
        borderWidth={1}
        borderColor="rgba(245, 158, 11, 0.3)"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$1"
        >
          <XStack space="$2" alignItems="center">
            {userPlan === "FAMILY_MEMBER" ? (
              <HeartHandshake size={16} color="#F59E0B" />
            ) : (
              <Crown size={16} color="#F59E0B" fill="#F59E0B" />
            )}
            <Text color="white" fontWeight="800" fontSize={13}>
              PLAN ACTIVO
            </Text>
          </XStack>
          <View
            backgroundColor="rgba(245, 158, 11, 0.2)"
            borderRadius="$4"
            paddingHorizontal={6}
            paddingVertical={2}
          >
            <Text color="#F59E0B" fontSize={9} fontWeight="bold">
              {userPlan === "FAMILY_MEMBER" ? "MIEMBRO" : "VIP"}
            </Text>
          </View>
        </XStack>
        <Text color="$gray9" fontSize={11} marginTop="$1">
          {userPlan === "FAMILY_MEMBER"
            ? "Disfrutando beneficios del plan familiar."
            : "Tu suscripción WOU+ está activa."}
        </Text>
      </YStack>
    );
  };

  const getGoalMenuItem = () => {
    switch (mainGoal) {
      case "invest":
        return { label: "Inversiones", icon: TrendingUp, route: "Goals" };

      case "debt":
        return { label: "Plan de Deudas", icon: CreditCard, route: "Goals" };

      case "control":
        return {
          label: "Control de Gastos",
          icon: ShieldCheck,
          route: "Goals",
        };

      case "house":
        return { label: "Mi Casa Propia", icon: Home, route: "Goals" };

      case "retire":
        return { label: "Fondo de Retiro", icon: Briefcase, route: "Goals" };

      case "save":
      default:
        return { label: "Metas de Ahorro", icon: PiggyBank, route: "Goals" };
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
      id: "Budgets",
      label: "Presupuestos",
      icon: Banknote,
      route: "Budgets",
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
              padding={3}
              borderRadius={100}
              backgroundColor={isPro ? "#F59E0B" : "transparent"}
              borderWidth={isPro ? 0 : 1}
              borderColor={isPro ? undefined : "$brand"}
              borderStyle={isPro ? undefined : "dashed"}
              shadowColor={isPro ? "#F59E0B" : undefined}
              shadowRadius={isPro ? 8 : 0}
              shadowOpacity={0.5}
            >
              <Avatar
                circular
                size="$5"
                borderWidth={2}
                borderColor="$background"
              >
                <Avatar.Image
                  src={user?.avatar || undefined}
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
              <XStack alignItems="center" space="$2">
                <Text
                  fontWeight="800"
                  fontSize={16}
                  color="$color"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  flexShrink={1}
                >
                  {user?.firstName} {user?.lastName}
                </Text>

                {isPro && (
                  <View
                    backgroundColor="rgba(245, 158, 11, 0.15)"
                    paddingHorizontal={6}
                    paddingVertical={2}
                    borderRadius={4}
                    borderWidth={1}
                    borderColor="#F59E0B"
                    alignSelf="flex-start"
                  >
                    <Text fontSize={9} fontWeight="900" color="#F59E0B">
                      WOU+
                    </Text>
                  </View>
                )}
              </XStack>

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
            <Pressable onPress={handleSubscriptionPress}>
              {renderSubscriptionCard()}
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
