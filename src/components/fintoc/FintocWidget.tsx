import React from "react";
import FintocWidgetNative from "@fintoc/fintoc-react-native";
import { YStack, Text } from "tamagui";

const PUBLIC_KEY = process.env.EXPO_PUBLIC_FINTOC_PK;

interface FintocWidgetProps {
  onSuccess: (publicToken: string) => void;
  onExit: () => void;
}

export const FintocWidget: React.FC<FintocWidgetProps> = ({
  onSuccess,
  onExit,
}) => {
  if (!PUBLIC_KEY) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text color="$red10">Falta la API Key en .env</Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <FintocWidgetNative
        publicKey={PUBLIC_KEY}
        holderType="individual"
        product="movements"
        onSuccess={(success: any) => {
          console.log("✅ Éxito Fintoc:", success);
          onSuccess(success.id);
        }}
        onExit={() => {
          console.log("👋 Usuario salió");
          onExit();
        }}
        onError={(error: any) => {
          console.error("❌ Error Fintoc:", error);
        }}
      />
    </YStack>
  );
};
