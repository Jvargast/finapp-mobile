import React from "react";
import { XStack, YStack, Text, Separator } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";

interface BillingRowProps {
  label: string;
  value: string;
  icon?: any;
  onPress?: () => void;
  isDestructive?: boolean;
  hideSeparator?: boolean;
}

export const BillingRow = ({
  label,
  value,
  icon: Icon,
  onPress,
  isDestructive,
  hideSeparator,
}: BillingRowProps) => {
  return (
    <YStack>
      <XStack
        paddingVertical="$3.5"
        paddingHorizontal="$2"
        justifyContent="space-between"
        alignItems="center"
        onPress={onPress}
        pressStyle={
          onPress ? { opacity: 0.6, backgroundColor: "$gray2" } : undefined
        }
        borderRadius="$2"
      >
        <XStack space="$3" alignItems="center">
          {Icon && <Icon size={18} color="$gray10" />}
          <Text fontSize={14} color="$gray11" fontWeight="500">
            {label}
          </Text>
        </XStack>

        <XStack space="$2" alignItems="center">
          <Text
            fontSize={14}
            fontWeight={onPress ? "600" : "700"}
            color={isDestructive ? "$red10" : "$color"}
          >
            {value}
          </Text>
          {onPress && <ChevronRight size={16} color="$gray8" />}
        </XStack>
      </XStack>
      {!hideSeparator && <Separator borderColor="$gray3" />}
    </YStack>
  );
};
