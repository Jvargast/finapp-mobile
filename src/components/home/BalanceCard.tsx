import { YStack, Text, XStack, Button, Stack, Separator } from "tamagui";
import { Eye, EyeOff, CreditCard, Wallet } from "@tamagui/lucide-icons";
import { useState, useMemo } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { useAccountStore } from "../../stores/useAccountStore";

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
  const accounts = useAccountStore((state) => state.accounts);

  const targetCurrency = user?.preferences?.currency || "CLP";
  const rate = REF_RATES[targetCurrency] || 1;

  const { liquidTotal, creditTotal } = useMemo(() => {
    return accounts.reduce(
      (acc, account) => {
        const val = Number(account.balance || 0);
        if (account.isCredit) {
          acc.creditTotal += val;
        } else {
          acc.liquidTotal += val;
        }
        return acc;
      },
      { liquidTotal: 0, creditTotal: 0 }
    );
  }, [accounts]);

  const formatMoney = (amount: number) => {
    const value = amount * rate;
    if (targetCurrency === "BTC") return value.toFixed(8);

    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: targetCurrency === "CLP" ? 0 : 2,
      maximumFractionDigits: targetCurrency === "CLP" ? 0 : 2,
    }).format(value);
  };

  const symbol = getCurrencySymbol(targetCurrency);

  return (
    <Stack
      backgroundColor="#4F46E5"
      borderRadius="$8"
      padding="$5"
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
          <XStack space="$2" alignItems="center">
            <Text color="#C7D2FE" fontWeight="600" fontSize="$3">
              Liquidez Total
            </Text>
            <Stack
              backgroundColor="rgba(255,255,255,0.15)"
              paddingHorizontal="$1.5"
              borderRadius="$2"
            >
              <Text fontSize={10} color="#C7D2FE">
                Real
              </Text>
            </Stack>
          </XStack>

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
            {showBalance ? formatMoney(liquidTotal) : "••••••••"}
          </Text>

          {showBalance && (
            <Text color="#C7D2FE" fontSize="$3" fontWeight="600">
              {targetCurrency}
            </Text>
          )}
        </XStack>

        <XStack
          marginTop="$4"
          backgroundColor="rgba(0,0,0,0.2)"
          borderRadius="$4"
          padding="$2.5"
          space="$3"
          alignItems="center"
        >
          <YStack flex={1}>
            <XStack space="$1.5" alignItems="center" marginBottom={2}>
              <Wallet size={12} color="#A5F3FC" />
              <Text fontSize={10} color="#C7D2FE" fontWeight="600">
                TU DINERO
              </Text>
            </XStack>
            <Text fontSize="$4" fontWeight="700" color="white">
              {showBalance ? formatMoney(liquidTotal) : "••••"}
            </Text>
          </YStack>

          <Separator
            vertical
            minHeight={25}
            borderColor="rgba(255,255,255,0.2)"
          />

          <YStack flex={1}>
            <XStack space="$1.5" alignItems="center" marginBottom={2}>
              <CreditCard size={12} color="#FDBA74" />
              <Text fontSize={10} color="#FDBA74" fontWeight="600">
                EN TARJETAS
              </Text>
            </XStack>
            <Text fontSize="$4" fontWeight="700" color="white">
              {showBalance ? formatMoney(creditTotal) : "••••"}
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Stack>
  );
};

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
