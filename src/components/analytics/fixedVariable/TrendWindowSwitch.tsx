import React from "react";
import { Button, Text, XStack } from "tamagui";
import { TrendWindowMonths } from "../../../hooks/analytics/useFixedVariableTrend";

const OPTIONS: { value: TrendWindowMonths; label: string }[] = [
  { value: 3, label: "3M" },
  { value: 6, label: "6M" },
];

interface TrendWindowSwitchProps {
  value: TrendWindowMonths;
  onChange: (next: TrendWindowMonths) => void;
  colors: {
    surface: string;
    accent: string;
    accentSoft: string;
    ink: string;
    muted: string;
  };
}

export const TrendWindowSwitch = ({
  value,
  onChange,
  colors,
}: TrendWindowSwitchProps) => {
  return (
    <XStack
      backgroundColor={colors.surface}
      borderWidth={1}
      borderColor={colors.accentSoft}
      borderRadius="$8"
      padding="$1"
      space="$1"
    >
      {OPTIONS.map((option) => {
        const isActive = value === option.value;

        return (
          <Button
            key={option.value}
            height={34}
            minWidth={58}
            borderRadius="$6"
            borderWidth={1}
            borderColor={isActive ? colors.accent : "transparent"}
            backgroundColor={isActive ? colors.accentSoft : "transparent"}
            onPress={() => onChange(option.value)}
            pressStyle={{ opacity: 0.9, scale: 0.98 }}
          >
            <Text
              fontSize={13}
              fontWeight="700"
              color={isActive ? colors.accent : colors.ink}
              letterSpacing={0.4}
            >
              {option.label}
            </Text>
          </Button>
        );
      })}
    </XStack>
  );
};
