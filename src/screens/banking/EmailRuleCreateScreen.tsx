import { useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Input,
  Separator,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";

export default function EmailRuleCreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sourceId = route.params?.sourceId as string | undefined;

  const [ruleName, setRuleName] = useState("Compras tarjeta Visa");
  const [sender, setSender] = useState("notificaciones@banco-ejemplo.cl");
  const [subject, setSubject] = useState("Compra aprobada");
  const [amountRegex, setAmountRegex] = useState("\\$\\s?([0-9.]+)");

  const handleCreate = () => {
    navigation.navigate("EmailRuleAttach", {
      sourceId,
      ruleId: "rule-mock-001",
      ruleName,
    });
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
              Crear regla
            </Text>
            <Text fontSize="$3" color="$gray10">
              Define cómo interpretar los correos.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background" space="$3">
          <YStack space="$2">
            <Text fontSize="$3" fontWeight="700" color="$gray10">
              Nombre de regla
            </Text>
            <Input
              value={ruleName}
              onChangeText={setRuleName}
              placeholder="Ej: Compras VISA"
            />
          </YStack>

          <Separator />

          <YStack space="$2">
            <Text fontSize="$3" fontWeight="700" color="$gray10">
              Remitente
            </Text>
            <Input
              value={sender}
              onChangeText={setSender}
              placeholder="alertas@banco.cl"
              autoCapitalize="none"
            />
          </YStack>

          <YStack space="$2">
            <Text fontSize="$3" fontWeight="700" color="$gray10">
              Asunto contiene
            </Text>
            <Input
              value={subject}
              onChangeText={setSubject}
              placeholder="Compra aprobada"
            />
          </YStack>

          <YStack space="$2">
            <Text fontSize="$3" fontWeight="700" color="$gray10">
              Regex de monto
            </Text>
            <Input
              value={amountRegex}
              onChangeText={setAmountRegex}
              placeholder="\\$\\s?([0-9.]+)"
              autoCapitalize="none"
            />
          </YStack>
        </Card>

        <Button
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$8"
          onPress={handleCreate}
        >
          <Text color="white" fontWeight="700">
            Guardar regla (Mock)
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
