import React from "react";
import { YStack, Text, Button, XStack } from "tamagui";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";

interface MonthSelectorProps {
  currentMonth: number;
  currentYear: number;
  onChange: (month: number, year: number) => void;
  loading?: boolean;
}

export const MonthSelector = ({
  currentMonth,
  currentYear,
  onChange,
  loading,
}: MonthSelectorProps) => {
  const handlePrev = () => {
    if (currentMonth === 1) onChange(12, currentYear - 1);
    else onChange(currentMonth - 1, currentYear);
  };

  const handleNext = () => {
    if (currentMonth === 12) onChange(1, currentYear + 1);
    else onChange(currentMonth + 1, currentYear);
  };

  const monthName = new Date(currentYear, currentMonth - 1)
    .toLocaleString("es-CL", { month: "short" })
    .toUpperCase()
    .replace(".", "");

  return (
    <XStack
      backgroundColor="$gray3"
      borderRadius="$10"
      paddingVertical="$1.5"
      paddingHorizontal="$1.5"
      alignItems="center"
      space="$1"
    >
      <Button
        size="$2"
        circular
        chromeless
        icon={<ChevronLeft size={16} color="$gray10" />}
        onPress={handlePrev}
        disabled={loading}
        pressStyle={{ backgroundColor: "$gray5" }}
      />

      <YStack alignItems="center" width={50}>
        <Text fontSize={11} fontWeight="800" color="$color">
          {monthName}
        </Text>
        <Text fontSize={9} color="$gray10" fontWeight="600">
          {currentYear}
        </Text>
      </YStack>

      <Button
        size="$2"
        circular
        chromeless
        icon={<ChevronRight size={16} color="$gray10" />}
        onPress={handleNext}
        disabled={loading}
        pressStyle={{ backgroundColor: "$gray5" }}
      />
    </XStack>
  );
};
