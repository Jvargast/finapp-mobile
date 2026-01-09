import React from "react";
import { XStack, YStack, Text } from "tamagui"; 
import { GoBackButton } from "../ui/GoBackButton";

export const CreateGoalHeader = () => {

  return (
    <YStack marginBottom="$6" marginTop="$2">
      <XStack alignItems="center">
        <GoBackButton />

        <YStack marginLeft="$4" flex={1} justifyContent="center">
          <Text
            color="$brand"
            fontSize="$9"
            fontWeight="900"
            letterSpacing={-0.5}
            lineHeight="$9"
          >
            Nueva Meta
          </Text>
          <Text color="$gray10" fontSize="$3" marginTop="$1" fontWeight="500">
            Define tu próximo gran logro.
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
};
