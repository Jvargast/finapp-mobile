import React, { useState } from "react";
import { YStack, XStack, Text, Button, Spinner, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { FintocActions } from "../../actions/fintocActions";

export default function ConnectBankScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isLinking, setIsLinking] = useState(false);

  const openFintoc = async () => {
    if (isLinking) return;
    try {
      setIsLinking(true);
      const widgetToken = await FintocActions.startLinking();
      navigation.navigate("FintocWidget", { widgetToken });
    } catch (e) {
      console.error("❌ Error iniciando Fintoc", e);
    } finally {
      setIsLinking(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} paddingTop={insets.top}>
        <XStack
          alignItems="center"
          padding="$4"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderColor="rgba(0,0,0,0.08)"
        >
          <Button
            circular
            size="$3"
            chromeless
            icon={<ChevronLeft size={28} />}
            onPress={() => navigation.goBack()}
          />
          <Text fontSize="$4" fontWeight="800">
            Conectar Banco
          </Text>
          <Button size="$3" chromeless width={40} />
        </XStack>

        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$6"
        >
          <Text fontSize="$5" fontWeight="700" textAlign="center">
            Conecta tu banco de forma segura
          </Text>

          <Text
            marginTop="$2"
            color="$gray10"
            textAlign="center"
            marginBottom="$6"
          >
            Serás redirigido a tu banco para autorizar el acceso
          </Text>

          <Button
            size="$5"
            theme="green"
            onPress={openFintoc}
            disabled={isLinking}
            opacity={isLinking ? 0.7 : 1}
          >
            {isLinking ? "Conectando..." : "Conectar banco"}
          </Button>
        </YStack>

        {isLinking && (
          <YStack
            position="absolute"
            fullscreen
            zIndex={999}
            backgroundColor="rgba(0,0,0,0.5)"
            justifyContent="center"
            alignItems="center"
          >
            <Spinner size="large" />
            <Text marginTop="$4" color="white">
              Preparando conexión…
            </Text>
          </YStack>
        )}
      </YStack>
    </Theme>
  );
}
