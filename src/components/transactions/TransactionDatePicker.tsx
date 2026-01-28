import React, { useState, useMemo } from "react";
import {
  Sheet,
  YStack,
  XStack,
  Text,
  Button,
  Circle,
  ScrollView,
} from "tamagui";
import {
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
} from "@tamagui/lucide-icons";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: Date;
  onChange: (date: Date) => void;
}

export const TransactionDatePicker = ({
  open,
  onOpenChange,
  value,
  onChange,
}: Props) => {
  const [viewDate, setViewDate] = useState(new Date(value));

  const daysInMonth = useMemo(() => {
    return new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0
    ).getDate();
  }, [viewDate]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    onChange(newDate);
    onOpenChange(false);
  };

  const setToday = () => {
    const today = new Date();
    onChange(today);
    setViewDate(today);
    onOpenChange(false);
  };

  const weekDays = ["D", "L", "M", "M", "J", "V", "S"];
  const monthName = viewDate.toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[55]}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />
      <Sheet.Frame
        padding="$4"
        space="$4"
        backgroundColor="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
        >
          <Button
            circular
            size="$3"
            chromeless
            onPressIn={handlePrevMonth}
            icon={<ChevronLeft size={20} color="$gray10" />}
          />

          <YStack alignItems="center">
            <Text
              fontSize="$5"
              fontWeight="800"
              textTransform="capitalize"
              color="$color"
            >
              {monthName}
            </Text>
            <Button
              size="$2"
              chromeless
              padding={0}
              height={20}
              onPressIn={setToday}
            >
              <Text fontSize={11} color="$blue10" fontWeight="600">
                Ir a Hoy
              </Text>
            </Button>
          </YStack>

          <Button
            circular
            size="$3"
            chromeless
            onPressIn={handleNextMonth}
            icon={<ChevronRight size={20} color="$gray10" />}
          />
        </XStack>

        <XStack justifyContent="space-around" marginBottom="$2">
          {weekDays.map((d, i) => (
            <Text
              key={i}
              width={40}
              textAlign="center"
              fontSize={12}
              color="$gray9"
              fontWeight="700"
            >
              {d}
            </Text>
          ))}
        </XStack>

        <YStack flex={1}>
          <XStack flexWrap="wrap" justifyContent="flex-start">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <YStack key={`empty-${i}`} width={`${100 / 7}%`} height={45} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isSelected =
                value.getDate() === day &&
                value.getMonth() === viewDate.getMonth() &&
                value.getFullYear() === viewDate.getFullYear();

              const isToday =
                new Date().getDate() === day &&
                new Date().getMonth() === viewDate.getMonth() &&
                new Date().getFullYear() === viewDate.getFullYear();

              return (
                <YStack
                  key={day}
                  width={`${100 / 7}%`}
                  height={45}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Button
                    circular
                    size="$4"
                    backgroundColor={isSelected ? "$color" : "transparent"}
                    borderWidth={isToday && !isSelected ? 1 : 0}
                    borderColor="$color"
                    onPressIn={() => handleSelectDay(day)}
                    chromeless={!isSelected}
                    padding={0}
                  >
                    <Text
                      fontSize={14}
                      fontWeight={isSelected || isToday ? "700" : "400"}
                      color={isSelected ? "$background" : "$color"}
                    >
                      {day}
                    </Text>
                  </Button>
                </YStack>
              );
            })}
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
