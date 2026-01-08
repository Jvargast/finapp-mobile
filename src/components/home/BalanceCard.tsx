import { YStack, Text, XStack, Button, Stack } from "tamagui";
import { Eye, EyeOff, TrendingUp } from "@tamagui/lucide-icons";
import { useState, useMemo } from "react";
import { useUserStore } from "../../stores/useUserStore";

const BASE_BALANCE_CLP = 3500000;

const REF_RATES: Record<string, number> = {
  CLP: 1,
  USD: 0.0011,
  EUR: 0.001,
  UF: 0.000028,
  CAD: 0.0015,
  BTC: 0.000000012,
};

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const user = useUserStore((state) => state.user);

  const targetCurrency = user?.preferences?.currency || "CLP";

  const displayAmount = useMemo(() => {
    const rate = REF_RATES[targetCurrency] || 1;
    return BASE_BALANCE_CLP * rate;
  }, [targetCurrency]);

  const formattedBalance = useMemo(() => {
    if (targetCurrency === "BTC") return displayAmount.toFixed(8);

    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: targetCurrency === "CLP" ? 0 : 2,
      maximumFractionDigits: targetCurrency === "CLP" ? 0 : 2,
    }).format(displayAmount);
  }, [displayAmount, targetCurrency]);

  const getCurrencySymbol = (code: string) => {
    const symbols: Record<string, string> = {
      CLP: "$",
      USD: "US$",
      EUR: "€",
      CAD: "C$",
      UF: "UF",
      BTC: "₿",
    };
    return symbols[code] || code;
  };

  const symbol = getCurrencySymbol(targetCurrency);

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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showBalance ? (
              <Eye size={20} color="#C7D2FE" />
            ) : (
              <EyeOff size={20} color="#C7D2FE" />
            )}
          </Button>
        </XStack>

        <XStack
          alignItems="baseline"
          space="$1.5"
          marginTop="$2"
          maxWidth="100%"
        >
          {showBalance && (
            <Text color="#E0E7FF" fontSize="$6" fontWeight="700">
              {symbol}
            </Text>
          )}

          <Text
            color="white"
            fontSize="$9"
            fontWeight="900"
            lineHeight={56}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            flexShrink={1}
          >
            {showBalance ? formattedBalance : "••••••••"}
          </Text>

          {showBalance && (
            <Text color="#C7D2FE" fontSize="$3" fontWeight="600">
              {targetCurrency}
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
            Tu algoritmo va bien (+15%)
          </Text>
        </XStack>
      </YStack>
    </Stack>
  );
};
