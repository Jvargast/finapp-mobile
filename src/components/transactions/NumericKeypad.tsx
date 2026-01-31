import React, { memo } from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { Delete, Check } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  onPress: (val: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
}

const KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  [".", "0", "DEL"],
];

const KeyButton = memo(
  ({
    children,
    onPress,
  }: {
    children: React.ReactNode;
    onPress: () => void;
  }) => (
    <Button
      flex={1}
      height={50} 
      backgroundColor="transparent"
      onPress={onPress}
      pressStyle={{ backgroundColor: "$gray3" }}
      borderRadius="$8"
      chromeless
    >
      {children}
    </Button>
  )
);

export const NumericKeypad = memo(({ onPress, onDelete, onConfirm }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <YStack
      paddingHorizontal="$4"
      paddingBottom={Math.max(insets.bottom, 20)}
      space="$2"
    >
      <YStack space="$1.5">
        {KEYS.map((row, i) => (
          <XStack key={i} space="$2" justifyContent="space-between">
            {row.map((key) => {
              if (key === "DEL") {
                return (
                  <KeyButton key={key} onPress={onDelete}>
                    <Delete size={24} color="$gray10" strokeWidth={2} />
                  </KeyButton>
                );
              }
              return (
                <KeyButton key={key} onPress={() => onPress(key)}>
                  <Text fontSize={28} fontWeight="400" color="$color">
                    {key}
                  </Text>
                </KeyButton>
              );
            })}
          </XStack>
        ))}
      </YStack>

      <Button
        size="$5"
        backgroundColor="$red10"
        pressStyle={{ opacity: 0.9 }}
        onPress={onConfirm}
        borderRadius="$8"
        animation="quick"
        shadowColor="$red10"
        shadowRadius={4}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.2}
        icon={<Check size={22} color="white" strokeWidth={3} />}
      >
        <Text color="white" fontWeight="800" fontSize="$5" letterSpacing={1}>
          CONFIRMAR
        </Text>
      </Button>
    </YStack>
  );
});
