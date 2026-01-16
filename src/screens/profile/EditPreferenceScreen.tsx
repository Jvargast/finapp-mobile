import { YStack, Text, XStack, Circle, ScrollView } from "tamagui";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import Svg, { Path } from "react-native-svg";
import { Pressable } from "react-native";
import {
  Check,
  Target,
  ShieldCheck,
  Banknote,
  DollarSign,
  Euro,
  Bitcoin,
  Building,
  TrendingDown,
  Briefcase,
  TrendingUp,
  CreditCard,
  Home,
  PiggyBank,
} from "@tamagui/lucide-icons";
import { useUserStore } from "../../stores/useUserStore";
import { UserActions } from "../../actions/userActions";

type PreferenceType = "currency" | "goal";

interface OptionItem {
  id: string;
  label: string;
  symbol?: string;
  icon: any;
  color: string;
  desc: string;
}

const IconCAD = ({
  color = "black",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M12 2 L14.2 8.5 L19.5 8 L16.8 12.5 L20.5 16 L14.2 17.5 L12 16 L9.8 17.5 L3.5 16 L7.2 12.5 L4.5 8 L9.8 8.5 Z" />
    <Path d="M12 16 L12 22" />
  </Svg>
);

const IconUF = ({
  color = "black",
  size = 24,
}: {
  color?: string;
  size?: number;
}) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M3 10 L12 2 L21 10 V20 C21 21.1 20.1 22 19 22 H5 C3.9 22 3 21.1 3 20 V10 Z" />
    <Path d="M9 16 L12 13 L15 16 L19 11" />
    <Path d="M15 11 H19 V15" />
  </Svg>
);

const OPTIONS: Record<PreferenceType, OptionItem[]> = {
  currency: [
    {
      id: "CLP",
      label: "Peso Chileno",
      symbol: "CLP",
      icon: Banknote,
      color: "#10B981",
      desc: "Ideal si resides y gastas en Chile.",
    },
    {
      id: "UF",
      label: "Unidad de Fomento",
      symbol: "UF",
      icon: IconUF,
      color: "#F59E0B",
      desc: "Créditos hipotecarios y arriendos.",
    },
    {
      id: "USD",
      label: "Dólar Americano",
      symbol: "USD",
      icon: DollarSign,
      color: "#3B82F6",
      desc: "Estándar internacional.",
    },
    {
      id: "CAD",
      label: "Dólar Canadiense",
      symbol: "CAD",
      icon: IconCAD,
      color: "#EF4444",
      desc: "Para viajes o proyectos en Canadá.",
    },
    {
      id: "EUR",
      label: "Euro",
      symbol: "EUR",
      icon: Euro,
      color: "#6366F1",
      desc: "Para cuentas en Europa.",
    },
    {
      id: "BTC",
      label: "Bitcoin",
      symbol: "BTC",
      icon: Bitcoin,
      color: "#F7931A",
      desc: "Criptoactivos y ahorro digital.",
    },
  ],
  goal: [
    {
      id: "save",
      label: "Ahorrar Dinero",
      icon: PiggyBank,
      color: "#10B981",
      desc: "Crear fondo de emergencia o metas.",
    },
    {
      id: "debt",
      label: "Salir de Deudas",
      icon: CreditCard,
      color: "#EF4444",
      desc: "Eliminar créditos y cargas financieras.",
    },
    {
      id: "house",
      label: "Comprar Vivienda",
      icon: Home,
      color: "#3B82F6",
      desc: "Ahorro para el pie o casa propia.",
    },
    {
      id: "control",
      label: "Controlar Gastos",
      icon: ShieldCheck,
      color: "#F97316",
      desc: "Ordenar mis finanzas día a día.",
    },
    {
      id: "invest",
      label: "Invertir",
      icon: TrendingUp,
      color: "#8B5CF6",
      desc: "Hacer crecer mi patrimonio.",
    },
    {
      id: "retire",
      label: "Jubilación",
      icon: Briefcase,
      color: "#64748B",
      desc: "Preparar mi futuro a largo plazo.",
    },
  ],
};

export default function EditPreferenceScreen() {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<{ params: { type: PreferenceType } }, "params">>();
  const { type } = route.params;

  const user = useUserStore((state) => state.user);
  const currentVal =
    type === "currency"
      ? user?.preferences?.currency
      : user?.preferences?.mainGoal;

  const handleSelect = async (value: string) => {
    const payload =
      type === "currency" ? { currency: value } : { mainGoal: value };

    setTimeout(() => {
      UserActions.updatePreferences(payload);
      navigation.goBack();
    }, 150);
  };

  const data = OPTIONS[type];
  const headerSubtitle =
    type === "currency"
      ? "Elige la moneda principal para tus reportes."
      : "Personalizaremos tus consejos según esto.";

  return (
    <YStack flex={1} backgroundColor="$background">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text fontSize={14} color="$gray11" marginBottom="$5" lineHeight={20}>
          {headerSubtitle}
        </Text>

        <YStack space="$3">
          {data.map((item) => {
            const isSelected = currentVal === item.id;
            const Icon = item.icon;

            return (
              <Pressable
                key={item.id}
                onPress={() => handleSelect(item.id)}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <XStack
                  backgroundColor={isSelected ? "$blue3" : "$color2"}
                  borderWidth={1.5}
                  borderColor={isSelected ? "$brand" : "transparent"}
                  borderRadius="$6"
                  padding="$4"
                  alignItems="center"
                  animation="quick"
                  shadowColor="$shadowColor"
                  shadowRadius={isSelected ? 8 : 4}
                  shadowOffset={{ width: 0, height: isSelected ? 4 : 2 }}
                  shadowOpacity={isSelected ? 0.1 : 0.05}
                >
                  <Circle
                    size="$4.5"
                    backgroundColor={`${item.color}20`}
                    marginRight="$4"
                  >
                    <Icon size={22} color={item.color} />
                  </Circle>

                  <YStack flex={1}>
                    <Text
                      fontSize={16}
                      fontWeight={isSelected ? "700" : "600"}
                      color="$color"
                      marginBottom={2}
                    >
                      {item.label}
                    </Text>
                    <Text fontSize={12} color="$gray10" lineHeight={16}>
                      {item.desc}
                    </Text>
                  </YStack>

                  {isSelected ? (
                    <Circle
                      size={24}
                      backgroundColor="$brand"
                      animation="bouncy"
                    >
                      <Check size={14} color="white" />
                    </Circle>
                  ) : (
                    item.symbol && (
                      <Text fontSize={12} fontWeight="bold" color="$gray8">
                        {item.symbol}
                      </Text>
                    )
                  )}
                </XStack>
              </Pressable>
            );
          })}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
