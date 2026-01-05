import { YStack, Text, XStack, Circle, ScrollView, Stack } from "tamagui";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Pressable } from "react-native";
import {
  Check,
  Target,
  TrendingUp,
  ShieldCheck,
  Banknote,
  DollarSign,
  Euro,
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
      id: "USD",
      label: "Dólar Americano",
      symbol: "USD",
      icon: DollarSign,
      color: "#3B82F6",
      desc: "Estándar internacional.",
    },
    {
      id: "EUR",
      label: "Euro",
      symbol: "EUR",
      icon: Euro,
      color: "#6366F1",
      desc: "Para cuentas en Europa.",
    },
  ],
  goal: [
    {
      id: "save",
      label: "Ahorrar Dinero",
      icon: Target,
      color: "#EC4899",
      desc: "Crear fondo de emergencia o metas.",
    },
    {
      id: "control",
      label: "Controlar Gastos",
      icon: ShieldCheck,
      color: "#F59E0B",
      desc: "Salir de deudas y ordenar finanzas.",
    },
    {
      id: "invest",
      label: "Invertir",
      icon: TrendingUp,
      color: "#8B5CF6",
      desc: "Hacer crecer mi patrimonio a largo plazo.",
    },
  ],
};

export default function EditPreferenceScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: { type: PreferenceType } }, 'params'>>();
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
    <YStack flex={1} backgroundColor="#F8FAFC">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text fontSize={14} color="#64748B" marginBottom="$5" lineHeight={20}>
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
                  backgroundColor={isSelected ? "#EEF2FF" : "white"}
                  borderWidth={isSelected ? 1.5 : 1}
                  borderColor={isSelected ? "#4F46E5" : "transparent"}
                  borderRadius="$6"
                  padding="$4"
                  alignItems="center"
                  animation="quick"
                  shadowColor="#64748B"
                  shadowRadius={isSelected ? 8 : 4}
                  shadowOffset={{ width: 0, height: isSelected ? 4 : 2 }}
                  shadowOpacity={isSelected ? 0.1 : 0.05}
                >
                  <Circle
                    size="$4.5"
                    backgroundColor={
                      isSelected ? item.color : `${item.color}15`
                    }
                    marginRight="$4"
                  >
                    <Icon size={22} color={isSelected ? "white" : item.color} />
                  </Circle>

                  <YStack flex={1}>
                    <Text
                      fontSize={16}
                      fontWeight={isSelected ? "700" : "600"}
                      color="#1E293B"
                      marginBottom={2}
                    >
                      {item.label}
                    </Text>
                    <Text fontSize={12} color="#64748B" lineHeight={16}>
                      {item.desc}
                    </Text>
                  </YStack>

                  {isSelected ? (
                    <Circle
                      size={24}
                      backgroundColor="#4F46E5"
                      animation="bouncy"
                    >
                      <Check size={14} color="white" />
                    </Circle>
                  ) : (
                    item.symbol && (
                      <Text fontSize={12} fontWeight="bold" color="#CBD5E1">
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
