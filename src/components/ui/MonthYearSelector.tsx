import React from "react";
import { XStack, Text, Button, useThemeName } from "tamagui";
import { ChevronLeft, ChevronRight } from "@tamagui/lucide-icons";

interface Props {
  date: Date;
  onChange: (newDate: Date) => void;
}

export const MonthYearSelector = ({ date, onChange }: Props) => {
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
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

  const monthName = date.toLocaleDateString("es-CL", { month: "long" });
  const label = `${monthName.toUpperCase()} DE ${date.getFullYear()}`;

  const pastel = {
    surface: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
    border: isDark ? "rgba(148, 163, 184, 0.35)" : "#E6DFD6",
    ink: isDark ? "#F8FAFC" : "#1F2937",
    icon: isDark ? "#E2E8F0" : "#1F2937",
  };

  return (
    <XStack
      justifyContent="center"
      alignItems="center"
      paddingHorizontal="$3"
      paddingVertical="$1"
    >
      <XStack
        alignItems="center"
        space="$4"
        paddingHorizontal="$2"
        paddingVertical="$1"
        borderRadius="$10"
      >
        <Button
          size="$3"
          circular
          backgroundColor={pastel.surface}
          borderWidth={1}
          borderColor={pastel.border}
          onPress={handlePrev}
          icon={<ChevronLeft size={16} color={pastel.icon} />}
        />

        <Text
          fontSize="$4"
          fontWeight="800"
          color={pastel.ink}
          letterSpacing={0.4}
          paddingHorizontal="$1"
        >
          {label}
        </Text>

        <Button
          size="$3"
          circular
          backgroundColor={pastel.surface}
          borderWidth={1}
          borderColor={pastel.border}
          onPress={handleNext}
          icon={<ChevronRight size={16} color={pastel.icon} />}
        />
      </XStack>
    </XStack>
  );
};
