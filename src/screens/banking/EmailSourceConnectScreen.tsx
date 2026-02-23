import { YStack, XStack, Text, Button, Card } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MailCheck, ShieldCheck } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";

export default function EmailSourceConnectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sourceId = route.params?.sourceId as string | undefined;

  const handleConnect = () => {
    navigation.navigate("EmailSourcePreview", { sourceId });
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
          <GoBackButton fallbackRouteName="EmailRuleAttach" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Conectar correo
            </Text>
            <Text fontSize="$3" color="$gray10">
              Autorizaremos acceso para leer los movimientos.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background" space="$3">
          <XStack alignItems="center" space="$3">
            <MailCheck size={20} color="$blue10" />
            <YStack flex={1}>
              <Text fontWeight="800" fontSize="$4">
                Fuente
              </Text>
              <Text fontSize="$3" color="$gray10">
                {sourceId || "Fuente sin ID"}
              </Text>
            </YStack>
          </XStack>

          <XStack alignItems="center" space="$3">
            <ShieldCheck size={18} color="$gray10" />
            <Text fontSize="$3" color="$gray10">
              Solo lectura. Puedes desconectar cuando quieras.
            </Text>
          </XStack>
        </Card>

        <Button
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$8"
          onPress={handleConnect}
        >
          <Text color="white" fontWeight="700">
            Conectar correo (Mock)
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
