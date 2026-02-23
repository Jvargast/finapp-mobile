import { useMemo, useState } from "react";
import { YStack, XStack, Text, Button, Card, Separator } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Mail, ShieldCheck, CheckCircle2 } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { useNavigation } from "@react-navigation/native";

export default function EmailSourceCreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [isCreated, setIsCreated] = useState(false);

  const sourceMock = useMemo(
    () => ({
      id: "d087154d-16ee-4b4b-8b72-f4ca7d483d8d",
      email: "movimientos@banco-ejemplo.cl",
      provider: "IMAP",
      status: "draft",
    }),
    [],
  );

  const handleCreate = () => {
    setIsCreated(true);
  };

  const handleContinue = () => {
    navigation.navigate("EmailRuleSelect", { sourceId: sourceMock.id });
  };

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom={insets.bottom + 20}
        space="$4"
      >
        <XStack alignItems="center" space="$3">
          <GoBackButton fallbackRouteName="AccountSources" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Email API
            </Text>
            <Text fontSize="$3" color="$gray10">
              Crea una fuente para importar movimientos desde tu correo.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background">
          <XStack alignItems="center" space="$3">
            <Mail size={22} color="$blue10" />
            <YStack flex={1}>
              <Text fontWeight="800" fontSize="$4">
                Fuente de correo
              </Text>
              <Text fontSize="$3" color="$gray10">
                {sourceMock.email}
              </Text>
            </YStack>
            <Text fontSize="$2" color="$gray9">
              {sourceMock.provider}
            </Text>
          </XStack>

          <Separator marginVertical="$4" />

          <YStack space="$2">
            <XStack alignItems="center" space="$2">
              <ShieldCheck size={16} color="$gray10" />
              <Text fontSize="$3" color="$gray10">
                Asegura el parsing con reglas antes de conectar.
              </Text>
            </XStack>
            <XStack alignItems="center" space="$2">
              <CheckCircle2 size={16} color="$gray10" />
              <Text fontSize="$3" color="$gray10">
                Vista previa disponible antes del sync final.
              </Text>
            </XStack>
          </YStack>
        </Card>

        <YStack space="$2">
          <Button
            size="$5"
            backgroundColor="$blue10"
            borderRadius="$8"
            onPress={handleCreate}
            disabled={isCreated}
            opacity={isCreated ? 0.7 : 1}
          >
            <Text color="white" fontWeight="700">
              {isCreated ? "Fuente creada (Mock)" : "Crear fuente (Mock)"}
            </Text>
          </Button>

          <Button
            size="$5"
            backgroundColor="$color2"
            borderRadius="$8"
            onPress={handleContinue}
            disabled={!isCreated}
            opacity={!isCreated ? 0.6 : 1}
          >
            <Text fontWeight="700" color="$color">
              Continuar a reglas
            </Text>
          </Button>
        </YStack>
      </YStack>
    </MainLayout>
  );
}
