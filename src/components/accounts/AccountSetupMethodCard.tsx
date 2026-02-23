import React from "react";
import { YStack, XStack, Text, Circle } from "tamagui";
import { Pressable, Platform } from "react-native";
import { Lock } from "@tamagui/lucide-icons";

interface AccountSetupMethodCardProps {
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
  isSelected?: boolean;
  disabled?: boolean;
  onPress: () => void;
}

export const AccountSetupMethodCard = ({
  title,
  description,
  icon: Icon,
  color,
  bg,
  isSelected = false,
  disabled = false,
  onPress,
}: AccountSetupMethodCardProps) => {
  const isAndroid = Platform.OS === "android";
  const cardBg = disabled ? "$gray2" : "$background";
  const border = disabled ? "$gray5" : isSelected ? "$brand" : "$borderColor";
  const iconBg = disabled ? "$gray3" : bg;
  const iconColor = disabled ? "$gray9" : color;
  const titleColor = disabled ? "$gray10" : "$color";
  const descriptionColor = disabled ? "$gray9" : "$gray10";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => ({
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
        opacity: disabled ? 0.8 : 1,
      })}
    >
      <XStack
        alignItems="center"
        backgroundColor={cardBg}
        borderWidth={1}
        borderColor={border}
        borderRadius="$8"
        padding="$4"
        space="$3"
        position="relative"
        elevation={disabled || isAndroid ? 0 : isSelected ? 4 : 2}
        shadowColor="$shadowColor"
        shadowRadius={disabled || isAndroid ? 0 : isSelected ? 8 : 4}
        shadowOpacity={disabled || isAndroid ? 0 : isSelected ? 0.15 : 0.08}
      >
        <Circle size="$4.5" backgroundColor={iconBg}>
          <Icon size={20} color={iconColor} />
        </Circle>
        <YStack flex={1} space="$1">
          <Text fontSize="$4" fontWeight="800" color={titleColor}>
            {title}
          </Text>
          <Text fontSize="$3" color={descriptionColor}>
            {description}
          </Text>
        </YStack>
        {disabled && (
          <XStack
            position="absolute"
            top="$2"
            right="$2"
            alignItems="center"
            space="$1"
          >
            <Lock size={12} color="$gray9" />
            <Text fontSize="$2" color="$gray9" fontWeight="700">
              Bloqueado
            </Text>
          </XStack>
        )}
      </XStack>
    </Pressable>
  );
};
