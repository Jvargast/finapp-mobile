import React from "react";
import { XStack, Text, Button } from "tamagui";
import { Settings } from "@tamagui/lucide-icons";
import { GoBackButton } from "../ui/GoBackButton";
import { YStack } from "tamagui";

interface BudgetDetailHeaderProps {
  title: string;
  subtitle?: string;
  onSettingsPress: () => void;
}

export const BudgetDetailHeader = ({
  title,
  subtitle,
  onSettingsPress,
}: BudgetDetailHeaderProps) => {
  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      paddingVertical="$2"
    >
      <XStack alignItems="center" space="$3">
        <GoBackButton />
        <YStack justifyContent="center">
          <Text
            fontSize="$5"
            fontWeight="800"
            color="$color"
            numberOfLines={1}
            maxWidth={220}
          >
            {title}
          </Text>
          {subtitle && (
            <Text fontSize="$3" color="$gray10" numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </YStack>
      </XStack>

      <Button
        size="$3"
        circular
        chromeless
        icon={<Settings size={24} color="$gray10" />}
        onPressIn={onSettingsPress}
      />
    </XStack>
  );
};
