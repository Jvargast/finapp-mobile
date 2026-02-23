import React from "react";
import { XStack, YStack, Text, Button } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";

interface AccountSetupHeaderProps {
  onBack: () => void;
}

export const AccountSetupHeader = ({ onBack }: AccountSetupHeaderProps) => {
  return (
    <XStack alignItems="center" space="$3">
      <Button circular size="$3" chromeless onPress={onBack} icon={ChevronLeft} />
      <YStack>
        <Text fontSize="$6" fontWeight="900">
          Configurar cuenta
        </Text>
        <Text fontSize="$3" color="$gray10">
          Completa los pasos para activar la sincronizacion
        </Text>
      </YStack>
    </XStack>
  );
};
