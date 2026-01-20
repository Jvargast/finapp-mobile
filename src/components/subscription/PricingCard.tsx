import React from "react";
import { XStack, YStack, Text, Stack } from "tamagui";
import { CheckCircle2, Circle } from "@tamagui/lucide-icons";

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  isSelected: boolean;
  onSelect: () => void;
  badge?: string;
  saveLabel?: string;
}

export const PricingCard = ({
  title,
  price,
  period,
  isSelected,
  onSelect,
  badge,
  saveLabel,
}: PricingCardProps) => {
  return (
    <YStack
      onPress={onSelect}
      flex={1}
      borderWidth={2}
      borderColor={isSelected ? "#F59E0B" : "$borderColor"}
      backgroundColor={isSelected ? "rgba(245, 158, 11, 0.1)" : "transparent"}
      borderRadius="$6"
      padding="$3"
      pressStyle={{ opacity: 0.9, backgroundColor: "$gray4" }}
      position="relative"
    >
      {badge && (
        <Stack
          position="absolute"
          top={-10}
          right={10}
          backgroundColor="#F59E0B"
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$4"
          zIndex={10}
        >
          <Text fontSize={10} fontWeight="800" color="#000000">
            {badge}
          </Text>
        </Stack>
      )}

      <XStack
        justifyContent="space-between"
        width="100%"
        alignItems="center"
        marginBottom="$2"
      >
        <Text
          color={isSelected ? "#F59E0B" : "$gray11"}
          fontWeight="800"
          fontSize="$3"
          textTransform="uppercase"
        >
          {title}
        </Text>
        {isSelected ? (
          <CheckCircle2 size={20} color="#F59E0B" />
        ) : (
          <Circle size={20} color="$gray8" />
        )}
      </XStack>

      <YStack alignItems="flex-start">
        <XStack alignItems="baseline">
          <Text color="$color" fontSize="$7" fontWeight="900">
            {price}
          </Text>
          <Text color="$gray10" fontSize="$3" marginLeft="$1">
            /{period}
          </Text>
        </XStack>

        {saveLabel && (
          <Text color="#4ADE80" fontSize={11} fontWeight="700" marginTop="$1">
            {saveLabel}
          </Text>
        )}
      </YStack>
    </YStack>
  );
};
