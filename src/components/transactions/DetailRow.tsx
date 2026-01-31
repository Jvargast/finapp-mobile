import React from "react";
import { XStack, YStack, Text, Stack } from "tamagui";

interface DetailRowProps {
  icon: any;
  label: string;
  value: string;
  subValue?: string;
  isLast?: boolean;
}

export const DetailRow = ({
  icon: Icon,
  label,
  value,
  subValue,
}: DetailRowProps) => {
  return (
    <XStack alignItems="center" space="$4" paddingVertical="$3">
      <Stack
        backgroundColor="$gray3"
        padding="$2.5"
        borderRadius="$10"
        alignItems="center"
        justifyContent="center"
      >
        <Icon size={20} color="$gray10" strokeWidth={2} />
      </Stack>

      <YStack flex={1}>
        <Text
          fontSize={11}
          color="$gray9"
          fontWeight="600"
          textTransform="uppercase"
          letterSpacing={0.5}
        >
          {label}
        </Text>
        <Text fontSize="$4" color="$color" fontWeight="600" marginTop={2}>
          {value}
        </Text>
        {subValue && (
          <Text fontSize={12} color="$gray10" marginTop={2}>
            {subValue}
          </Text>
        )}
      </YStack>
    </XStack>
  );
};
