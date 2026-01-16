import React from "react";
import { XStack, Button, Text } from "tamagui";
import { Landmark, Wallet, CreditCard } from "@tamagui/lucide-icons";

interface AccountTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const AccountTypeSelector = ({
  value,
  onChange,
}: AccountTypeSelectorProps) => {
  const TYPES = [
    { id: "BANK", label: "Banco", icon: Landmark },
    { id: "WALLET", label: "Digital", icon: CreditCard }, 
    { id: "CASH", label: "Efectivo", icon: Wallet },
  ];

  return (
    <XStack backgroundColor="$color2" padding="$1" borderRadius="$8" space="$1">
      {TYPES.map((type) => {
        const isSelected = value === type.id;
        return (
          <Button
            key={type.id}
            flex={1}
            size="$3"
            chromeless={!isSelected}
            backgroundColor={isSelected ? "$background" : "transparent"}
            onPress={() => onChange(type.id)}
            shadowColor={isSelected ? "$shadowColor" : "transparent"}
            shadowRadius={isSelected ? 5 : 0}
            shadowOpacity={isSelected ? 0.1 : 0}
          >
            <type.icon size={16} color={isSelected ? "$brand" : "$gray10"} />
            <Text
              fontSize={11}
              fontWeight={isSelected ? "700" : "500"}
              color={isSelected ? "$color" : "$gray10"}
            >
              {type.label}
            </Text>
          </Button>
        );
      })}
    </XStack>
  );
};
