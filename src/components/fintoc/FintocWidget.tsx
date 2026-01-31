import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { YStack, Spinner, Text } from "tamagui";

const FINTOC_URL = "https://webview.fintoc.com";
const PUBLIC_KEY = process.env.EXPO_PUBLIC_FINTOC_PK;

interface FintocWidgetProps {
  onSuccess: (publicToken: string) => void;
  onExit: () => void;
}

export const FintocWidget: React.FC<FintocWidgetProps> = ({
  onSuccess,
  onExit,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  if (!PUBLIC_KEY) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Text color="$red10" textAlign="center">
          Error: Falta configurar EXPO_PUBLIC_FINTOC_PK
        </Text>
      </YStack>
    );
  }

  const widgetUrl = `${FINTOC_URL}?public_key=${PUBLIC_KEY}&holder_type=individual&product=movements&mode=webview`;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log("📡 Fintoc Event:", data.type);

      if (data.type === "succeeded") {
        onSuccess(data.id);
      } else if (data.type === "exit") {
        onExit();
      }
    } catch (error) {
      console.error("Error parseando mensaje Fintoc", error);
    }
  };

  return (
    <YStack flex={1} position="relative">
      {isLoading && (
        <YStack
          position="absolute"
          fullscreen
          justifyContent="center"
          alignItems="center"
          zIndex={10}
          backgroundColor="$background"
        >
          <Spinner size="large" color="$blue10" />
        </YStack>
      )}

      <WebView
        source={{ uri: widgetUrl }}
        onMessage={handleMessage}
        onLoadEnd={() => setIsLoading(false)}
        style={{ flex: 1, backgroundColor: "transparent" }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </YStack>
  );
};
