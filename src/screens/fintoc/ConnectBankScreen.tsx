import React, { useState } from "react";
import { Alert } from "react-native";
import { YStack, XStack, Text, Button, Spinner, Theme } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { FintocWidget } from "../../components/fintoc/FintocWidget";
import { FintocActions } from "../../actions/fintocActions";

export default function ConnectBankScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [isLinking, setIsLinking] = useState(false);

  const handleSuccess = async (publicToken: string) => {
    setIsLinking(true);
    try {
      await FintocActions.createLink(publicToken);

      Alert.alert("¡Conectado!", "Tus movimientos se están descargando.", [
        { text: "Genial", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsLinking(false);
    }
  };

  return (
    <Theme name="light">
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
        <XStack
          alignItems="center"
          padding="$4"
          justifyContent="space-between"
          borderBottomWidth={1}
          borderColor="$gray4"
        >
          <Button
            circular
            size="$3"
            chromeless
            icon={<ChevronLeft size={28} color="$color" />}
            onPress={() => navigation.goBack()}
          />
          <Text fontSize="$4" fontWeight="800" color="$gray11">
            Conectar Banco
          </Text>
          <Button size="$3" chromeless width={40} />
        </XStack>

        <FintocWidget
          onSuccess={handleSuccess}
          onExit={() => navigation.goBack()}
        />

        {isLinking && (
          <YStack
            position="absolute"
            fullscreen
            backgroundColor="rgba(0,0,0,0.7)"
            justifyContent="center"
            alignItems="center"
            zIndex={20}
          >
            <YStack
              backgroundColor="$background"
              padding="$6"
              borderRadius="$6"
              alignItems="center"
              elevation={5}
              width={260}
            >
              <Spinner size="large" color="$green10" />
              <Text marginTop="$4" fontWeight="700" textAlign="center">
                Vinculando cuentas...
              </Text>
              <Text
                fontSize={12}
                color="$gray10"
                textAlign="center"
                marginTop="$2"
              >
                Esto tomará unos segundos
              </Text>
            </YStack>
          </YStack>
        )}
      </YStack>
    </Theme>
  );
}
