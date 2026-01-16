import React from "react";
import { XStack, Button, Text } from "tamagui";
import { Currency } from "../../types/goal.types";

interface CurrencySelectorProps {
  value: Currency;
  onChange: (value: string) => void;
}

export const CurrencySelector = ({
  value,
  onChange,
}: CurrencySelectorProps) => {
  const CURRENCIES: Currency[] = ["CLP", "USD", "EUR"];

  return (
    <XStack space="$2" marginTop="$2">
      {CURRENCIES.map((currency) => {
        const isSelected = value === currency;
        return (
          <Button
            key={currency}
            size="$2"
            chromeless={!isSelected}
            backgroundColor={isSelected ? "$color2" : "transparent"}
            borderColor={isSelected ? "$brand" : "$gray8"}
            borderWidth={1}
            onPress={() => onChange(currency)}
          >
            <Text
              fontSize={12}
              fontWeight={isSelected ? "800" : "600"}
              color={isSelected ? "$brand" : "$gray10"}
            >
              {currency}
            </Text>
          </Button>
        );
      })}
    </XStack>
  );
};
