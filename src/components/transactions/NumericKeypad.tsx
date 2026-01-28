import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { Delete, Check } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import * as Haptics from "expo-haptics";

interface Props {
  onPress: (val: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
}

export const NumericKeypad = ({ onPress, onDelete, onConfirm }: Props) => {
  const insets = useSafeAreaInsets();

  const handlePress = (val: string) => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(val);
  };

  const handleDelete = () => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete();
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    [".", "0", "DEL"],
  ];

  return (
    <YStack
      paddingHorizontal="$4"
      paddingBottom={Math.max(insets.bottom, 20)}
      space="$2"
    >
      <YStack space="$1.5">
        {keys.map((row, i) => (
          <XStack key={i} space="$2" justifyContent="space-between">
            {row.map((key) => {
              if (key === "DEL") {
                return (
                  <KeyButton key={key} onPress={handleDelete}>
                    <Delete size={24} color="$gray10" strokeWidth={2} />
                  </KeyButton>
                );
              }
              return (
                <KeyButton key={key} onPress={() => handlePress(key)}>
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
        animation="bouncy"
        shadowColor="$red10"
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 3 }}
        shadowOpacity={0.4}
        icon={<Check size={22} color="white" strokeWidth={3} />}
      >
        <Text color="white" fontWeight="800" fontSize="$5" letterSpacing={1}>
          CONFIRMAR
        </Text>
      </Button>
    </YStack>
  );
};

const KeyButton = ({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) => (
  <Button
    flex={1}
    height={45}
    backgroundColor="transparent"
    onPress={onPress}
    pressStyle={{ backgroundColor: "$gray3" }}
    borderRadius="$8"
    chromeless
    animation="quick"
  >
    {children}
  </Button>
);
