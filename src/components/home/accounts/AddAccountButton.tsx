import React from "react";
import { YStack, Text, Stack } from "tamagui";
import { Plus, Lock } from "@tamagui/lucide-icons";

interface AddAccountButtonProps {
  onPress: () => void;
  isStacked?: boolean;
  isLocked?: boolean;
}

export const AddAccountButton = ({
  onPress,
  isStacked = false,
  isLocked = false,
}: AddAccountButtonProps) => {
  return (
    <Stack
      width={70}
      height={160}
      justifyContent="center"
      alignItems="center"
      backgroundColor="$background"
      borderRadius="$8"
      borderStyle="dashed"
      borderWidth={2}
      borderColor={isLocked ? "$gray5" : "$gray6"}
      onPress={onPress}
      pressStyle={{ opacity: 0.7, scale: 0.95 }}
      animation="bouncy"
      marginRight={isStacked ? 15 : 10}
      zIndex={0}
      opacity={isLocked ? 0.8 : 1}
    >
      <YStack alignItems="center" space="$2">
        <Stack
          backgroundColor={isLocked ? "$gray3" : "$color2"}
          padding="$2.5"
          borderRadius="$10"
          shadowColor="$shadowColor"
          shadowRadius={4}
          shadowOpacity={0.1}
        >
          {isLocked ? (
            <Lock size={20} color="$gray9" />
          ) : (
            <Plus size={22} color="$brand" />
          )}
        </Stack>

        <Text
          fontSize={10}
          fontWeight="700"
          color={isLocked ? "$gray9" : "$brand"}
        >
          {isLocked ? "Límite" : "Crear"}
        </Text>
      </YStack>
    </Stack>
  );
};
