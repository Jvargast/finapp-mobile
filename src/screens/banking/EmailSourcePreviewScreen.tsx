import { useMemo } from "react";
import { YStack, XStack, Text, Button, Card, ScrollView } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Receipt, CheckCircle2 } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";

type PreviewItem = {
  id: string;
  merchant: string;
  amount: string;
  date: string;
};

export default function EmailSourcePreviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const sourceId = route.params?.sourceId as string | undefined;

  const preview = useMemo<PreviewItem[]>(
    () => [
      {
        id: "tx-01",
        merchant: "Mercado Libre",
        amount: "$ 42.990",
        date: "2026-02-04",
      },
      {
        id: "tx-02",
        merchant: "Uber",
        amount: "$ 8.450",
        date: "2026-02-03",
      },
      {
        id: "tx-03",
        merchant: "Starbucks",
        amount: "$ 5.990",
        date: "2026-02-03",
      },
    ],
    [],
  );

  const handleSync = () => {
    navigation.navigate("EmailSourceSync", { sourceId });
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
          <GoBackButton fallbackRouteName="EmailSourceConnect" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Vista previa
            </Text>
            <Text fontSize="$3" color="$gray10">
              Revisa los movimientos antes de sincronizar.
            </Text>
          </YStack>
        </XStack>

        <Card bordered padding="$4" backgroundColor="$background" space="$2">
          <XStack alignItems="center" space="$3">
            <Receipt size={20} color="$blue10" />
            <YStack flex={1}>
              <Text fontWeight="800" fontSize="$4">
                Fuente
              </Text>
              <Text fontSize="$3" color="$gray10">
                {sourceId || "Fuente sin ID"}
              </Text>
            </YStack>
            <CheckCircle2 size={18} color="$green10" />
          </XStack>
        </Card>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$3">
            {preview.map((item) => (
              <Card key={item.id} bordered padding="$4" backgroundColor="$background">
                <XStack alignItems="center" justifyContent="space-between">
                  <YStack space="$1">
                    <Text fontWeight="800">{item.merchant}</Text>
                    <Text fontSize="$2" color="$gray10">
                      {item.date}
                    </Text>
                  </YStack>
                  <Text fontWeight="800" color="$color">
                    {item.amount}
                  </Text>
                </XStack>
              </Card>
            ))}
          </YStack>
        </ScrollView>

        <Button
          size="$5"
          backgroundColor="$blue10"
          borderRadius="$8"
          onPress={handleSync}
        >
          <Text color="white" fontWeight="700">
            Sincronizar movimientos
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
