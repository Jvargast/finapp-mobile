import React from "react";
import { XStack, YStack, Text, Button } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { DisplayHeading } from "../../ui/DisplayHeading";

interface AccountSetupHeaderProps {
  onBack: () => void;
}

export const AccountSetupHeader = ({ onBack }: AccountSetupHeaderProps) => {
  return (
    <XStack alignItems="center" space="$3">
      <Button circular size="$3" chromeless onPress={onBack} icon={ChevronLeft} />
      <YStack>
        <DisplayHeading fontSize="$6" fontWeight="400" lineHeight={26}>
          Configurar cuenta
        </DisplayHeading>
        <Text fontSize="$3" color="$gray10">
          Completa los pasos para activar la sincronizacion
        </Text>
      </YStack>
    </XStack>
  );
};
