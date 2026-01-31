import React from "react";
import { YStack, XStack, Text, Button, Progress, Stack } from "tamagui";
import {
  PieChart,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";

export const AnalyticsPreview = () => {
  const navigation = useNavigation<any>();

  const spentPercentage = 65;
  const monthName = new Date().toLocaleDateString("es-ES", { month: "long" });

  return (
    <YStack paddingHorizontal="$2" marginBottom="$4" marginTop="$2">
      <Stack
        borderRadius="$6"
        overflow="hidden"
        onPress={() => navigation.navigate("Analytics")}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        elevation={2}
        shadowColor="$shadowColor"
        shadowRadius={10}
        shadowOpacity={0.1}
      >
        <LinearGradient
          colors={["#1E293B", "#0F172A"]}
          start={[0, 0]}
          end={[1, 1]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <YStack padding="$4" space="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$2" alignItems="center">
              <Stack
                backgroundColor="rgba(96, 165, 250, 0.2)"
                padding="$1.5"
                borderRadius="$3"
              >
                <PieChart size={16} color="#60A5FA" />
              </Stack>
              <Text
                color="white"
                fontWeight="700"
                fontSize={14}
                textTransform="capitalize"
              >
                Análisis de {monthName}
              </Text>
            </XStack>
            <ChevronRight size={16} color="$gray8" />
          </XStack>

          <XStack justifyContent="space-between" alignItems="flex-end">
            <YStack>
              <Text
                color="$gray9"
                fontSize={11}
                fontWeight="500"
                marginBottom={2}
              >
                Gastos Totales
              </Text>
              <Text color="white" fontSize={22} fontWeight="800">
                $450.200
              </Text>
            </YStack>

            <XStack
              backgroundColor="rgba(16, 185, 129, 0.15)"
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={8}
              alignItems="center"
              space="$1"
            >
              <TrendingDown size={12} color="#34D399" />
              <Text color="#34D399" fontSize={11} fontWeight="700">
                -5%
              </Text>
            </XStack>
          </XStack>

          <YStack space="$1.5">
            <XStack justifyContent="space-between">
              <Text color="$gray8" fontSize={10}>
                Presupuesto usado
              </Text>
              <Text color="$gray8" fontSize={10}>
                {spentPercentage}%
              </Text>
            </XStack>
            <Progress
              value={spentPercentage}
              height={6}
              backgroundColor="$gray8"
            >
              <Progress.Indicator
                animation="bouncy"
                backgroundColor="#60A5FA"
              />
            </Progress>
          </YStack>
        </YStack>
      </Stack>
    </YStack>
  );
};
