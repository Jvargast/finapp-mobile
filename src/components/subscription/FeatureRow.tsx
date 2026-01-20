import React from "react";
import { XStack, YStack, Text, Circle } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

interface FeatureRowProps {
  icon: any;
  title: string;
  description: string;
}

export const FeatureRow = ({
  icon: Icon,
  title,
  description,
}: FeatureRowProps) => {
  return (
    <XStack space="$4" alignItems="center" marginBottom="$4">
      <Circle size={40} backgroundColor="rgba(245, 158, 11, 0.1)">
        <Icon size={20} color="#F59E0B" />
      </Circle>
      <YStack flex={1}>
        <Text color="white" fontWeight="700" fontSize="$4">
          {title}
        </Text>
        <Text color="$gray9" fontSize="$3">
          {description}
        </Text>
      </YStack>
    </XStack>
  );
};
