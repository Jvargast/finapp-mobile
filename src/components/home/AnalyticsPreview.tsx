import React from "react";
import { YStack, XStack, Text, Progress, Stack, useThemeName } from "tamagui";
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";

export const AnalyticsPreview = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");

  const spentPercentage = 65;
  const delta = -5;
  const isPositive = delta >= 0;
  const deltaLabel = `${isPositive ? "+" : ""}${delta}%`;
  const monthName = new Date().toLocaleDateString("es-ES", { month: "long" });

  const pastel = {
    cardStart: isDark ? "#1E2231" : "#F5F3FF",
    cardEnd: isDark ? "#2B2230" : "#FFF7ED",
    ink: isDark ? "#F8FAFC" : "#1F2937",
    muted: isDark ? "#CBD5E1" : "#6B7280",
    accent: isDark ? "#A5B4FC" : "#8BA7F2",
    accentSoft: isDark ? "rgba(165, 180, 252, 0.18)" : "rgba(139, 167, 242, 0.18)",
    trendUpBg: "rgba(16, 185, 129, 0.14)",
    trendUpText: "#10B981",
    trendDownBg: "rgba(248, 113, 113, 0.16)",
    trendDownText: "#EF4444",
    progressBg: isDark ? "rgba(148, 163, 184, 0.2)" : "rgba(31, 41, 55, 0.12)",
    glow: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)",
    glowSoft: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.35)",
  };

  return (
    <YStack marginBottom="$4" marginTop="$2">
      <Stack
        borderRadius="$6"
        overflow="hidden"
        onPress={() => navigation.navigate("Analytics")}
        pressStyle={{ scale: 0.98, opacity: 0.9 }}
        animation="quick"
        elevation={2}
        shadowColor={isDark ? "#000000" : "#E2E8F0"}
        shadowRadius={isDark ? 14 : 10}
        shadowOpacity={isDark ? 0.35 : 0.1}
      >
        <LinearGradient
          colors={[pastel.cardStart, pastel.cardEnd]}
          start={[0, 0]}
          end={[1, 1]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />
        <Stack
          position="absolute"
          top={-20}
          right={-30}
          width={120}
          height={120}
          borderRadius={60}
          backgroundColor={pastel.glow}
          opacity={0.8}
        />
        <Stack
          position="absolute"
          bottom={-30}
          left={-20}
          width={140}
          height={140}
          borderRadius={70}
          backgroundColor={pastel.glowSoft}
          opacity={0.6}
        />

        <YStack padding="$4" space="$3">
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$2" alignItems="center">
              <Stack
                backgroundColor={pastel.accentSoft}
                padding="$1.5"
                borderRadius="$3"
                borderWidth={1}
                borderColor={isDark ? "rgba(165, 180, 252, 0.3)" : "rgba(139, 167, 242, 0.35)"}
              >
                <Sparkles size={16} color={pastel.accent} />
              </Stack>
              <Text
                color={pastel.ink}
                fontWeight="700"
                fontSize={14}
                textTransform="capitalize"
              >
                Análisis de {monthName}
              </Text>
            </XStack>
            <ChevronRight size={16} color={pastel.muted} />
          </XStack>

          <XStack justifyContent="space-between" alignItems="flex-end">
            <YStack>
              <Text
                color={pastel.muted}
                fontSize={11}
                fontWeight="500"
                marginBottom={2}
              >
                Gastos Totales
              </Text>
              <Text color={pastel.ink} fontSize={22} fontWeight="800">
                $450.200
              </Text>
            </YStack>

            <XStack
              backgroundColor={isPositive ? pastel.trendUpBg : pastel.trendDownBg}
              paddingHorizontal={8}
              paddingVertical={4}
              borderRadius={8}
              alignItems="center"
              space="$1"
            >
              {isPositive ? (
                <TrendingUp size={12} color={pastel.trendUpText} />
              ) : (
                <TrendingDown size={12} color={pastel.trendDownText} />
              )}
              <Text
                color={isPositive ? pastel.trendUpText : pastel.trendDownText}
                fontSize={11}
                fontWeight="700"
              >
                {deltaLabel}
              </Text>
            </XStack>
          </XStack>

          <YStack space="$1.5">
            <XStack justifyContent="space-between">
              <Text color={pastel.muted} fontSize={10}>
                Presupuesto usado
              </Text>
              <Text color={pastel.muted} fontSize={10}>
                {spentPercentage}%
              </Text>
            </XStack>
            <Progress
              value={spentPercentage}
              height={6}
              backgroundColor={pastel.progressBg}
            >
              <Progress.Indicator
                animation="bouncy"
                backgroundColor={pastel.accent}
              />
            </Progress>
          </YStack>
        </YStack>
      </Stack>
    </YStack>
  );
};
