import React from "react";
import { XStack, Text, Button } from "tamagui";
import { ChevronLeft, ChevronRight, Calendar } from "@tamagui/lucide-icons";

interface Props {
  date: Date;
  onChange: (newDate: Date) => void;
}

export const MonthYearSelector = ({ date, onChange }: Props) => {
  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    onChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    onChange(newDate);
  };

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      backgroundColor="$background"
      paddingHorizontal="$4"
      paddingVertical="$2"
    >
      <Button
        circular
        size="$3"
        chromeless
        icon={<ChevronLeft size={24} color="$gray10" />}
        onPress={handlePrev}
      />

      <XStack
        alignItems="center"
        space="$2"
        backgroundColor="$gray2"
        paddingHorizontal="$3"
        paddingVertical="$1.5"
        borderRadius="$8"
      >
        <Calendar size={14} color="$gray10" />
        <Text
          fontSize="$5"
          fontWeight="800"
          color="$color"
          textTransform="capitalize"
        >
          {date.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}
        </Text>
      </XStack>

      <Button
        circular
        size="$3"
        chromeless
        icon={<ChevronRight size={24} color="$gray10" />}
        onPress={handleNext}
      />
    </XStack>
  );
};
