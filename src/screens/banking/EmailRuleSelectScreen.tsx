import { useMemo } from "react";
import { YStack, XStack, Text, Button, Card, ScrollView } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronRight, Sparkles, ListChecks } from "@tamagui/lucide-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Pressable } from "react-native";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";

type RuleMock = {
  id: string;
  name: string;
  sender: string;
  description: string;
};

export default function EmailRuleSelectScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sourceId = route.params?.sourceId as string | undefined;

  const rules = useMemo<RuleMock[]>(
    () => [
      {
        id: "88cc90cd-f441-4c8f-b9e2-eee3268d299b",
        name: "Compras tarjeta Visa",
        sender: "notificaciones@banco-ejemplo.cl",
        description: "Extrae monto y comercio desde correos de Visa.",
      },
      {
        id: "2f8c11fd-031e-4b1a-9f41-2b443b6e2d82",
        name: "Transferencias entrantes",
        sender: "alertas@banco-ejemplo.cl",
        description: "Detecta depósitos y transferencias recibidas.",
      },
    ],
    [],
  );

  const handleCreateNew = () => {
    navigation.navigate("EmailRuleCreate", { sourceId });
  };

  const handleSelect = (rule: RuleMock) => {
    navigation.navigate("EmailRuleAttach", {
      sourceId,
      ruleId: rule.id,
      ruleName: rule.name,
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
          <GoBackButton fallbackRouteName="EmailSourceCreate" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Reglas de correo
            </Text>
            <Text fontSize="$3" color="$gray10">
              Selecciona una regla o crea una nueva.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background">
          <XStack alignItems="center" space="$3">
            <ListChecks size={20} color="$color" />
            <YStack flex={1}>
              <Text fontWeight="800" fontSize="$4">
                Fuente
              </Text>
              <Text fontSize="$3" color="$gray10">
                {sourceId || "Fuente sin ID"}
              </Text>
            </YStack>
          </XStack>
        </Card>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$3">
            {rules.map((rule) => (
              <Pressable
                key={rule.id}
                onPress={() => handleSelect(rule)}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Card bordered padding="$4" backgroundColor="$background">
                  <XStack alignItems="center" space="$3">
                    <Sparkles size={18} color="$blue10" />
                    <YStack flex={1} space="$1">
                      <Text fontWeight="800" fontSize="$4">
                        {rule.name}
                      </Text>
                      <Text fontSize="$2" color="$gray10">
                        {rule.sender}
                      </Text>
                      <Text fontSize="$3" color="$gray9">
                        {rule.description}
                      </Text>
                    </YStack>
                    <ChevronRight size={16} color="$gray9" />
                  </XStack>
                </Card>
              </Pressable>
            ))}
          </YStack>
        </ScrollView>

        <Button
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$8"
          onPress={handleCreateNew}
        >
          <Text color="white" fontWeight="700">
            Crear nueva regla
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
