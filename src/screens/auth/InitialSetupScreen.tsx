import { useState } from "react";
import {
  YStack,
  Text,
  Button,
  Input,
  XStack,
  Label,
  Stack,
  ScrollView,
} from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import {
  ArrowRight,
  Coins,
  Banknote,
  Target,
  TrendingUp,
  ShieldAlert,
} from "@tamagui/lucide-icons";
import { useUserStore } from "../../stores/useUserStore";
import { UserActions } from "../../actions/userActions";

const CURRENCIES = [
  { code: "CLP", symbol: "$", name: "Peso" },
  { code: "USD", symbol: "US$", name: "Dólar" },
  { code: "EUR", symbol: "€", name: "Euro" },
];

const GOALS = [
  { id: "save", label: "Ahorrar", icon: Target },
  { id: "control", label: "Controlar", icon: ShieldAlert },
  { id: "invest", label: "Invertir", icon: TrendingUp },
];

export default function InitialSetupScreen() {
  const user = useUserStore((state) => state.user);
  const insets = useSafeAreaInsets();

  const [selectedCurrency, setSelectedCurrency] = useState("CLP");
  const [selectedGoal, setSelectedGoal] = useState("save");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = async () => {
    const finalBalance = balance || "0";

    setLoading(true);
    await UserActions.completeSetup({
      currency: selectedCurrency,
      initialBalance: finalBalance,
      mainGoal: selectedGoal, 
    });
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
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
            <YStack flex={1} padding="$5" paddingBottom={insets.bottom + 20}>
              <YStack space="$4" marginTop="$2" marginBottom="$6">
                <Stack
                  backgroundColor="#EEF2FF"
                  alignSelf="flex-start"
                  padding="$3"
                  borderRadius="$12"
                >
                  <Coins size={32} color="#4F46E5" />
                </Stack>

                <YStack>
                  <Text
                    fontSize={32}
                    fontWeight="900"
                    color="#1E293B"
                    lineHeight={36}
                  >
                    ¡Hola, {user?.firstName || "Viajero"}! 👋
                  </Text>
                  <Text fontSize="$5" color="#64748B" marginTop="$2">
                    Personalicemos tu experiencia.
                  </Text>
                </YStack>
              </YStack>

              <YStack space="$6">
                <YStack space="$3">
                  <Label
                    fontSize="$3"
                    fontWeight="700"
                    color="#64748B"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    ¿Cuál es tu foco hoy?
                  </Label>
                  <XStack space="$3">
                    {GOALS.map((goal) => {
                      const isSelected = selectedGoal === goal.id;
                      return (
                        <Button
                          key={goal.id}
                          flex={1}
                          backgroundColor={isSelected ? "#4F46E5" : "white"}
                          borderWidth={1}
                          borderColor={isSelected ? "#4F46E5" : "#E2E8F0"}
                          onPress={() => setSelectedGoal(goal.id)}
                          padding="$3"
                          height={80} 
                          flexDirection="column" 
                          justifyContent="center"
                          animation="quick"
                          pressStyle={{ scale: 0.98 }}
                        >
                          <goal.icon
                            size={24}
                            color={isSelected ? "white" : "#64748B"}
                          />
                          <Text
                            color={isSelected ? "white" : "#1E293B"}
                            fontWeight="600"
                            fontSize="$2"
                            marginTop="$2"
                          >
                            {goal.label}
                          </Text>
                        </Button>
                      );
                    })}
                  </XStack>
                </YStack>

                <YStack space="$3">
                  <Label
                    fontSize="$3"
                    fontWeight="700"
                    color="#64748B"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    Tu Moneda
                  </Label>
                  <XStack space="$3">
                    {CURRENCIES.map((curr) => {
                      const isSelected = selectedCurrency === curr.code;
                      return (
                        <Button
                          key={curr.code}
                          flex={1}
                          backgroundColor={isSelected ? "#EEF2FF" : "white"}
                          borderWidth={1.5}
                          borderColor={isSelected ? "#4F46E5" : "#E2E8F0"}
                          onPress={() => setSelectedCurrency(curr.code)}
                          height={50}
                        >
                          <Text
                            color={isSelected ? "#4F46E5" : "#64748B"}
                            fontWeight="bold"
                          >
                            {curr.code}
                          </Text>
                        </Button>
                      );
                    })}
                  </XStack>
                </YStack>

                <YStack space="$3">
                  <Label
                    fontSize="$3"
                    fontWeight="700"
                    color="#64748B"
                    textTransform="uppercase"
                    letterSpacing={1}
                  >
                    Saldo Actual
                  </Label>
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
                    <Banknote size={28} color="#4F46E5" />
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
                      {
                        CURRENCIES.find((c) => c.code === selectedCurrency)
                          ?.code
                      }
                    </Text>
                  </XStack>
                  <Text fontSize="$2" color="#94A3B8" marginLeft="$2">
                    * Puedes dejarlo en 0 y sumarlo después.
                  </Text>
                </YStack>
              </YStack>
              <YStack marginTop="$8">
                <Button
                  onPress={handleFinish}
                  size="$5"
                  backgroundColor="#4F46E5"
                  borderRadius="$8"
                  height={56}
                  iconAfter={loading ? undefined : <ArrowRight />}
                  disabled={loading}
                  pressStyle={{ opacity: 0.9, scale: 0.98 }}
                >
                  <Text color="white" fontWeight="bold" fontSize="$5">
                    {loading ? "Configurando..." : "Comenzar Aventura"}
                  </Text>
                </Button>
              </YStack>
            </YStack>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
