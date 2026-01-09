import React from "react";
import { ScrollView, XStack, Text, Stack, YStack } from "tamagui";
import {
  Banknote,
  DollarSign,
  Euro,
  Bitcoin,
  Coins,
  Globe,
} from "@tamagui/lucide-icons";

const CURRENCIES = [
  { id: "CLP", label: "Peso", symbol: "$", icon: Banknote, color: "#10B981" },
  { id: "UF", label: "UF", symbol: "UF", icon: Coins, color: "#F59E0B" },
  {
    id: "USD",
    label: "Dólar",
    symbol: "US$",
    icon: DollarSign,
    color: "#3B82F6",
  },
  { id: "EUR", label: "Euro", symbol: "€", icon: Euro, color: "#6366F1" },
  { id: "CAD", label: "Canadá", symbol: "C$", icon: Globe, color: "#EF4444" },
  { id: "BTC", label: "Bitcoin", symbol: "₿", icon: Bitcoin, color: "#F7931A" },
];

interface GoalCurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
}

export const GoalCurrencySelector = ({
  value,
  onChange,
}: GoalCurrencySelectorProps) => {
  return (
    <YStack space="$2" marginBottom="$2">
      <Text fontSize="$3" color="$gray11" fontWeight="600" marginLeft="$1">
        Moneda de la meta
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 2 }}
      >
        <XStack space="$2.5">
          {CURRENCIES.map((item) => {
            const isSelected = value === item.id;
            const Icon = item.icon;

            return (
              <Stack
                key={item.id}
                onPress={() => onChange(item.id)}
                backgroundColor={isSelected ? item.color : "$gray2"}
                paddingVertical="$2"
                paddingHorizontal="$3"
                borderRadius="$4"
                borderWidth={1}
                borderColor={isSelected ? item.color : "transparent"}
                pressStyle={{ opacity: 0.9 }}
                flexDirection="row"
                alignItems="center"
                space="$2"
              >
                <Icon
                  size={16}
                  color={isSelected ? "white" : "$gray10"}
                  strokeWidth={2.5}
                />

                <Text
                  color={isSelected ? "white" : "$gray11"}
                  fontWeight={isSelected ? "700" : "600"}
                  fontSize="$3"
                >
                  {item.id}
                </Text>
              </Stack>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
};
