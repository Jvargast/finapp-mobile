import { YStack, XStack, Text, Button, Card, Separator } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Link2, CheckCircle2 } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";

export default function EmailRuleAttachScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sourceId = route.params?.sourceId as string | undefined;
  const ruleId = route.params?.ruleId as string | undefined;
  const ruleName = route.params?.ruleName as string | undefined;

  const handleAttach = () => {
    navigation.navigate("EmailSourceConnect", { sourceId, ruleId });
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
          <GoBackButton fallbackRouteName="EmailRuleSelect" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Adjuntar regla
            </Text>
            <Text fontSize="$3" color="$gray10">
              Confirma antes de conectar tu correo.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background">
          <XStack alignItems="center" space="$3">
            <Link2 size={20} color="$blue10" />
            <YStack flex={1} space="$1">
              <Text fontWeight="800" fontSize="$4">
                Fuente
              </Text>
              <Text fontSize="$3" color="$gray10">
                {sourceId || "Fuente sin ID"}
              </Text>
            </YStack>
          </XStack>

          <Separator marginVertical="$4" />

          <XStack alignItems="center" space="$3">
            <CheckCircle2 size={20} color="$green10" />
            <YStack flex={1} space="$1">
              <Text fontWeight="800" fontSize="$4">
                Regla
              </Text>
              <Text fontSize="$3" color="$gray10">
                {ruleName || "Regla sin nombre"}
              </Text>
              <Text fontSize="$2" color="$gray9">
                {ruleId || "Regla sin ID"}
              </Text>
            </YStack>
          </XStack>
        </Card>

        <Button
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$8"
          onPress={handleAttach}
        >
          <Text color="white" fontWeight="700">
            Adjuntar regla (Mock)
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
