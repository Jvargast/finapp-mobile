import { YStack, Text, XStack, Button, Stack } from "tamagui";
import { Eye, EyeOff, TrendingUp } from "@tamagui/lucide-icons";
import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";

const MOCK_BALANCE = {
  amount: "30.000",
  currency: "$",
  trend: "+15%",
};

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);

  const user = useUserStore((state) => state.user);

  const currencyCode = user?.preferences?.currency || "CLP";

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      EUR: "€",
      USD: "$",
      CLP: "$",
      GBP: "£",
      JPY: "¥",
    };
    return symbols[code] || code;
  };

  const symbol = getCurrencySymbol(currencyCode);

  return (
    <Stack
      backgroundColor="#4F46E5"
      borderRadius="$8"
      padding="$5"
      elevation={10}
      shadowColor="#4F46E5"
      shadowOpacity={0.4}
      shadowRadius={15}
      shadowOffset={{ width: 0, height: 8 }}
      marginBottom="$6"
      overflow="hidden"
    >
      <Stack
        position="absolute"
        top={-20}
        right={-20}
        width={150}
        height={150}
        borderRadius={75}
        backgroundColor="#FFFFFF"
        opacity={0.1}
      />

      <YStack space="$1">
        <XStack justifyContent="space-between" alignItems="center">
          <Text color="#C7D2FE" fontWeight="600" fontSize="$3">
            Balance Total
          </Text>
          <Button
            size="$2"
            circular
            unstyled
            onPress={() => setShowBalance(!showBalance)}
            opacity={0.8}
          >
            {showBalance ? (
              <Eye size={20} color="#C7D2FE" />
            ) : (
              <EyeOff size={20} color="#C7D2FE" />
            )}
          </Button>
        </XStack>

        <XStack alignItems="flex-end" space="$2" marginTop="$2">
          <Text color="white" fontSize="$9" fontWeight="900" lineHeight={48}>
            {showBalance ? `${symbol} ${MOCK_BALANCE.amount}` : "••••••"}
          </Text>

          {/* Opcional: Mostrar el código pequeño al lado si quieres ser explícito */}
          {showBalance && (
            <Text
              color="#C7D2FE"
              fontSize="$3"
              fontWeight="600"
              marginBottom="$2"
            >
              {currencyCode}
            </Text>
          )}
        </XStack>

        <XStack
          backgroundColor="rgba(255,255,255,0.2)"
          alignSelf="flex-start"
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$4"
          marginTop="$3"
          space="$1"
          alignItems="center"
        >
          <TrendingUp size={14} color="#A5F3FC" />
          <Text color="#A5F3FC" fontSize="$2" fontWeight="bold">
            {MOCK_BALANCE.trend} vs mes anterior
          </Text>
        </XStack>
      </YStack>
    </Stack>
  );
};
