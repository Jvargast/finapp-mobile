import React from "react";
import { XStack, Button, Text, YStack } from "tamagui";
import { ChevronLeft, ChevronRight, Calendar } from "@tamagui/lucide-icons";

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
  const date = new Date(currentYear, currentMonth - 1);
  const monthName = date.toLocaleString("es-CL", { month: "long" });

  const handlePrev = () => {
    if (currentMonth === 1) onChange(12, currentYear - 1);
    else onChange(currentMonth - 1, currentYear);
  };

  const handleNext = () => {
    if (currentMonth === 12) onChange(1, currentYear + 1);
    else onChange(currentMonth + 1, currentYear);
  };

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$2"
      backgroundColor="$background"
    >
      <Button
        size="$3"
        circular
        chromeless
        icon={ChevronLeft}
        onPress={handlePrev}
        disabled={loading}
      />

      <YStack alignItems="center">
        <XStack space="$2" alignItems="center">
          <Text
            textTransform="capitalize"
            fontSize="$6"
            fontWeight="900"
            color="$color"
          >
            {monthName}
          </Text>
          <Text fontSize="$6" fontWeight="300" color="$gray10">
            {currentYear}
          </Text>
        </XStack>
        {new Date().getMonth() + 1 === currentMonth &&
          new Date().getFullYear() === currentYear && (
            <XStack
              backgroundColor="$blue3"
              paddingHorizontal="$2"
              borderRadius="$4"
              marginTop="$1"
            >
              <Text fontSize={10} color="$blue10" fontWeight="700">
                ACTUAL
              </Text>
            </XStack>
          )}
      </YStack>

      <Button
        size="$3"
        circular
        chromeless
        icon={ChevronRight}
        onPress={handleNext}
        disabled={loading}
      />
    </XStack>
  );
};
