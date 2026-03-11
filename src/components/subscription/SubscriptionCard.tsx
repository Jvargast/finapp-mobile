import React from "react";
import { YStack, XStack, Text } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

interface SubscriptionCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  isSelected: boolean;
  onSelect: () => void;
  isBestValue?: boolean;
  badgeText?: string;
  highlights?: string[];
  footnote?: string | null;
}

export const SubscriptionCard = ({
  title,
  description,
  price,
  period,
  isSelected,
  onSelect,
  isBestValue,
  badgeText,
  highlights = [],
  footnote,
}: SubscriptionCardProps) => {
  return (
    <YStack
      borderWidth={2}
      borderColor={isSelected ? "#F59E0B" : "$gray8"}
      backgroundColor={isSelected ? "rgba(245, 158, 11, 0.05)" : "$gray2"}
      borderRadius="$6"
      padding="$4"
      onPress={onSelect}
      marginBottom="$4"
      position="relative"
    >
      {isBestValue && (
        <YStack
          position="absolute"
          top={-12}
          right={16}
          backgroundColor="#6D28D9"
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$4"
        >
          <Text color="white" fontSize={10} fontWeight="800">
            {badgeText || "Incluye ventajas Plus"}
          </Text>
        </YStack>
      )}

      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$2"
      >
        <Text fontSize="$6" fontWeight="800" color="$color">
          {title}
        </Text>
        {isSelected && (
          <YStack backgroundColor="#F59E0B" borderRadius={20} padding={4}>
            <Check size={12} color="black" />
          </YStack>
        )}
      </XStack>

      <Text color="$gray10" fontSize="$3" marginBottom="$3" lineHeight={20}>
        {description}
      </Text>

      <Text color="$gray11" fontSize={12} marginBottom="$3">
        {price}
        {period}
      </Text>

      {highlights.length > 0 && (
        <YStack marginTop="$2" space="$2">
          {highlights.map((highlight) => (
            <XStack key={highlight} space="$2" alignItems="center">
              <YStack backgroundColor="#F59E0B" borderRadius={20} padding={4}>
                <Check size={10} color="#111827" />
              </YStack>
              <Text color="$gray11" fontSize={13} flex={1}>
                {highlight}
              </Text>
            </XStack>
          ))}
        </YStack>
      )}

      {footnote ? (
        <Text color="$gray9" fontSize={11} marginTop="$3">
          {footnote}
        </Text>
      ) : null}
    </YStack>
  );
};
