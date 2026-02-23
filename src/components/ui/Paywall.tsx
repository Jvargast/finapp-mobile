import React from "react";
import { YStack, Text, Button } from "tamagui";

interface PaywallProps {
  title?: string;
  description?: string;
  onUpgrade: () => void;
  onBack?: () => void;
}

export const Paywall = ({
  title = "Requiere Wou+",
  description = "Esta funcionalidad está disponible solo para usuarios Wou+.",
  onUpgrade,
  onBack,
}: PaywallProps) => {
  return (
    <YStack
      flex={1}
      padding="$6"
      space="$4"
      justifyContent="center"
      alignItems="center"
    >
      <Text fontSize="$7" fontWeight="900" textAlign="center">
        {title}
      </Text>
      <Text fontSize="$4" color="$gray10" textAlign="center">
        {description}
      </Text>

      <Button
        size="$6"
        backgroundColor="$brand"
        color="white"
        fontWeight="800"
        width="100%"
        onPress={onUpgrade}
      >
        Mejorar a Wou+
      </Button>

      {onBack && (
        <Button
          size="$5"
          backgroundColor="$color2"
          color="$color"
          fontWeight="700"
          width="100%"
          onPress={onBack}
        >
          Volver
        </Button>
      )}
    </YStack>
  );
};
