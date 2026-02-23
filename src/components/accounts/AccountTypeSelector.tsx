import React from "react";
import { XStack, YStack, Button, Text } from "tamagui";
import {
  Landmark,
  Wallet,
  CreditCard,
  PiggyBank,
  Banknote,
  CircleDashed,
} from "@tamagui/lucide-icons";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AccountTypeSelector = ({
  value,
  onChange,
}: AccountTypeSelectorProps) => {
  const TYPES = [
    { id: "CHECKING", label: "Corriente", icon: Landmark, hint: "Banco" },
    { id: "SAVINGS", label: "Ahorro", icon: PiggyBank, hint: "Banco" },
    {
      id: "CREDIT_CARD",
      label: "Crédito",
      icon: CreditCard,
      hint: "Tarjeta",
    },
    { id: "OTHER", label: "Digital", icon: Wallet, hint: "Wallet" },
    { id: "CASH", label: "Efectivo", icon: Banknote, hint: "Cash" },
  ];

  return (
    <YStack space="$2">
      <XStack
        backgroundColor="$color2"
        padding="$2"
        borderRadius="$8"
        flexWrap="wrap"
        rowGap="$2"
        justifyContent="space-between"
      >
        {TYPES.map((type) => {
          const isSelected = value === type.id;
          return (
            <Button
              key={type.id}
              size="$4"
              flexGrow={1}
              flexBasis="48%"
              maxWidth="49%"
              backgroundColor={isSelected ? "$background" : "transparent"}
              borderWidth={1}
              borderColor={isSelected ? "$brand" : "transparent"}
              onPress={() => onChange(type.id)}
              shadowColor={isSelected ? "$shadowColor" : "transparent"}
              shadowRadius={isSelected ? 6 : 0}
              shadowOpacity={isSelected ? 0.12 : 0}
              paddingVertical="$3"
              paddingHorizontal="$2"
              justifyContent="flex-start"
            >
              <XStack space="$2" alignItems="center">
                <type.icon size={18} color={isSelected ? "$brand" : "$gray10"} />
                <YStack>
                  <Text
                    fontSize={12}
                    fontWeight={isSelected ? "800" : "600"}
                    color={isSelected ? "$color" : "$gray10"}
                  >
                    {type.label}
                  </Text>
                  <XStack alignItems="center" space="$1">
                    <CircleDashed
                      size={10}
                      color={isSelected ? "$brand" : "$gray8"}
                    />
                    <Text fontSize={10} color={isSelected ? "$gray10" : "$gray9"}>
                      {type.hint}
                    </Text>
                  </XStack>
                </YStack>
              </XStack>
            </Button>
          );
        })}
      </XStack>
    </YStack>
  );
};
