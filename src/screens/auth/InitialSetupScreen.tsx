import { useState } from "react";
import {
  YStack,
  Text,
  Button,
  Input,
  XStack,
  Stack,
  ScrollView,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  ArrowRight,
  Coins,
  Target,
  TrendingUp,
  ShieldAlert,
  Wallet,
  Banknote,
  DollarSign,
  Euro,
} from "@tamagui/lucide-icons";
import { useUserStore } from "../../stores/useUserStore";
import { UserActions } from "../../actions/userActions";
import LoadingScreen from "../LoadingScreen";

const CURRENCIES = [
  {
    code: "CLP",
    symbol: "$",
    name: "Peso",
    color: "#E11D48",
    bg: "#FFF1F2",
    icon: Banknote,
  },
  {
    code: "USD",
    symbol: "$",
    name: "Dólar",
    color: "#16A34A",
    bg: "#F0FDF4",
    icon: DollarSign,
  },
  {
    code: "EUR",
    symbol: "€",
    name: "Euro",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: Euro,
  },
];

const GOALS = [
  {
    id: "save",
    label: "Ahorrar",
    description: "Para metas futuras",
    icon: Target,
    color: "#059669",
  },
  {
    id: "control",
    label: "Controlar",
    description: "Reducir gastos",
    icon: ShieldAlert,
    color: "#D97706",
  },
  {
    id: "invest",
    label: "Invertir",
    description: "Crecer capital",
    icon: TrendingUp,
    color: "#7C3AED",
  },
];

export default function InitialSetupScreen() {
  const user = useUserStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const [selectedCurrency, setSelectedCurrency] = useState("CLP");
  const [selectedGoal, setSelectedGoal] = useState("save");
  const [balance, setBalance] = useState("");

  const [isPreparing, setIsPreparing] = useState(false);

  const handleFinish = async () => {
    let cleanBalance = balance.replace(/[^0-9.,]/g, "").replace(",", ".");

    if (cleanBalance === "." || cleanBalance === "") {
      cleanBalance = "0";
    }

    setIsPreparing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    try {
      await UserActions.completeSetup({
        currency: selectedCurrency,
        initialBalance: cleanBalance,
        mainGoal: selectedGoal,
      });
    } catch (error) {
      console.error(error);
      setIsPreparing(false);
    }
  };

  if (isPreparing) {
    return <LoadingScreen />;
  }

  return (
    <YStack flex={1} backgroundColor="#F8FAFC">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <YStack
              flex={1}
              padding="$4"
              paddingTop={insets.top}
              paddingBottom={insets.bottom + 20}
            >
              <YStack space="$4" marginTop="$2" marginBottom="$6">
                <Stack
                  backgroundColor="#EEF2FF"
                  alignSelf="flex-start"
                  padding="$2"
                  borderRadius="$12"
                >
                  <Coins size={32} color="$brand" />
                </Stack>

                <YStack>
                  <Text
                    fontSize={28}
                    fontWeight="900"
                    color="#1E293B"
                    lineHeight={34}
                  >
                    Hola, {user?.firstName} 👋
                  </Text>
                  <Text fontSize="$4" color="#64748B" marginTop="$3">
                    Configuremos tu espacio financiero.
                  </Text>
                </YStack>
              </YStack>

              <YStack space="$6">
                <YStack space="$3">
                  <Text
                    fontSize="$3"
                    fontWeight="700"
                    color="#64748B"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    ¿Cuál es tu prioridad hoy?
                  </Text>

                  <XStack space="$3">
                    {GOALS.map((goal) => {
                      const isSelected = selectedGoal === goal.id;
                      const Icon = goal.icon;

                      return (
                        <YStack
                          key={goal.id}
                          flex={1}
                          onPress={() => setSelectedGoal(goal.id)}
                          height={100}
                          justifyContent="center"
                          alignItems="center"
                          borderRadius="$6"
                          borderWidth={1}
                          padding="$2"
                          backgroundColor={isSelected ? goal.color : "white"}
                          borderColor={isSelected ? goal.color : "#E2E8F0"}
                          pressStyle={{ opacity: 0.8, scale: 0.98 }}
                          elevation={isSelected ? 5 : 0}
                          shadowColor={isSelected ? goal.color : "transparent"}
                          shadowOpacity={0.3}
                          shadowRadius={8}
                          shadowOffset={{ width: 0, height: 4 }}
                        >
                          <Icon
                            size={28}
                            color={isSelected ? "white" : goal.color}
                            strokeWidth={2}
                          />

                          <Text
                            color={isSelected ? "white" : "#1E293B"}
                            fontWeight="700"
                            fontSize="$3"
                            marginTop="$2"
                            textAlign="center"
                          >
                            {goal.label}
                          </Text>

                          <Text
                            color={
                              isSelected ? "rgba(255,255,255,0.8)" : "#94A3B8"
                            }
                            fontSize={11}
                            fontWeight="500"
                            textAlign="center"
                            marginTop={2}
                          >
                            {goal.description}
                          </Text>
                        </YStack>
                      );
                    })}
                  </XStack>
                </YStack>

                <YStack space="$3">
                  <Text
                    fontSize="$3"
                    fontWeight="700"
                    color="#64748B"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    Tu Moneda Principal
                  </Text>

                  <XStack space="$3">
                    {CURRENCIES.map((curr) => {
                      const isSelected = selectedCurrency === curr.code;
                      const Icon = curr.icon;

                      return (
                        <XStack
                          key={curr.code}
                          flex={1}
                          onPress={() => setSelectedCurrency(curr.code)}
                          height={55}
                          justifyContent="center"
                          alignItems="center"
                          space="$2"
                          borderRadius="$8"
                          borderWidth={1.5}
                          backgroundColor={isSelected ? curr.bg : "white"}
                          borderColor={isSelected ? curr.color : "#E2E8F0"}
                          pressStyle={{ opacity: 0.6 }}
                        >
                          <Icon
                            size={18}
                            color={isSelected ? curr.color : "#94A3B8"}
                            strokeWidth={2.5}
                          />

                          <Text
                            color={isSelected ? curr.color : "#64748B"}
                            fontWeight={isSelected ? "800" : "600"}
                            fontSize="$3"
                          >
                            {curr.code}
                          </Text>
                        </XStack>
                      );
                    })}
                  </XStack>
                </YStack>

                <YStack space="$3">
                  <XStack justifyContent="space-between" alignItems="center">
                    <Text
                      fontSize="$3"
                      fontWeight="700"
                      color="#64748B"
                      textTransform="uppercase"
                      letterSpacing={1}
                    >
                      Saldo Inicial (Efectivo)
                    </Text>
                    <Stack
                      backgroundColor="#DCFCE7"
                      paddingHorizontal="$2"
                      borderRadius="$4"
                    >
                      <Text fontSize={10} color="#166534" fontWeight="bold">
                        OPCIONAL
                      </Text>
                    </Stack>
                  </XStack>

                  <XStack
                    alignItems="center"
                    backgroundColor="white"
                    borderWidth={1}
                    borderColor="#E2E8F0"
                    borderRadius="$6"
                    paddingHorizontal="$4"
                    height={70}
                    elevation={2}
                    shadowColor="#000"
                    shadowOpacity={0.05}
                  >
                    <Stack
                      backgroundColor="#F1F5F9"
                      padding="$2"
                      borderRadius="$4"
                    >
                      <Wallet size={24} color="$brand" />
                    </Stack>

                    <Input
                      flex={1}
                      unstyled
                      placeholder="0"
                      keyboardType="numeric"
                      value={balance}
                      onChangeText={setBalance}
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: "#1E293B",
                        marginLeft: 12,
                        height: "100%",
                      }}
                    />
                    <Text fontSize="$6" color="#94A3B8" fontWeight="600">
                      {selectedCurrency}
                    </Text>
                  </XStack>

                  <Text
                    fontSize="$2"
                    color="#64748B"
                    marginLeft="$1"
                    lineHeight={18}
                  >
                    Esto creará tu cuenta de{" "}
                    <Text fontWeight="700">Efectivo</Text>. Podrás conectar tus
                    bancos más tarde.
                  </Text>
                </YStack>
              </YStack>

              <YStack marginTop="auto" paddingTop="$5">
                <Button
                  onPress={handleFinish}
                  size="$5"
                  backgroundColor="#4F46E5"
                  borderRadius="$8"
                  height={56}
                  iconAfter={isPreparing ? undefined : <ArrowRight />}
                  disabled={isPreparing}
                  pressStyle={{ opacity: 0.9, scale: 0.98 }}
                  animation="bouncy"
                >
                  <Text color="white" fontWeight="bold" fontSize="$5">
                    {isPreparing ? "Configurando..." : "Comenzar Aventura"}
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </YStack>
  );
}
