import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import { YStack, Text, Button, XStack, Stack, useThemeName } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import Svg, { Rect, Circle as SvgCircle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useBudgetStore } from "../../stores/useBudgetStore";
import { BudgetActions } from "../../actions/budgetActions";
import { BudgetCard } from "../../components/budget/BudgetCard";
import { MonthlySummary } from "../../components/budget/MonthlySummary";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { MonthSelector } from "../../components/budget/MonthSelector";
import { BudgetEntrySheet } from "../../components/budget/BudgetEntrySheet";

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");

  const [isEntrySheetOpen, setIsEntrySheetOpen] = useState(false);

  const {
    budgets,
    isLoading,
    selectedMonth,
    selectedYear,
    totalBudgeted,
    totalSpent,
  } = useBudgetStore();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        BudgetActions.loadBudgets();
        setIsReady(true);
      }, 50);
    });

    return () => task.cancel();
  }, []);

  const renderedBudgets = useMemo(() => {
    if (budgets.length === 0 && !isLoading) {
      const glyphPalette = {
        bg: isDark ? "#111827" : "#F8FAFC",
        border: isDark ? "rgba(148, 163, 184, 0.25)" : "#E2E8F0",
        wallet: isDark ? "#0B1220" : "#FFFFFF",
        walletStroke: isDark ? "rgba(226, 232, 240, 0.45)" : "#CBD5E1",
        flap: isDark ? "#1F2937" : "#F1F5F9",
        coin: isDark ? "#FBBF24" : "#F59E0B",
        coinInner: isDark ? "#FDE68A" : "#FDBA74",
        accent: isDark ? "#A5B4FC" : "#8BA7F2",
      };

      return (
        <YStack
          padding="$8"
          alignItems="center"
          justifyContent="center"
          space="$4"
          opacity={0.6}
        >
          <Stack
            width={64}
            height={64}
            borderRadius={32}
            backgroundColor="transparent"
            borderWidth={1}
            borderColor={glyphPalette.border}
            alignItems="center"
            justifyContent="center"
          >
            <Svg width={56} height={56} viewBox="0 0 64 64">
              <Rect
                x={6}
                y={6}
                width={52}
                height={52}
                rx={16}
                fill={glyphPalette.bg}
              />
              <Rect
                x={16}
                y={30}
                width={32}
                height={20}
                rx={6}
                fill={glyphPalette.wallet}
                stroke={glyphPalette.walletStroke}
                strokeWidth={2}
              />
              <Rect
                x={20}
                y={24}
                width={24}
                height={10}
                rx={5}
                fill={glyphPalette.flap}
                stroke={glyphPalette.walletStroke}
                strokeWidth={2}
              />
              <SvgCircle cx={46} cy={20} r={6} fill={glyphPalette.coin} />
              <SvgCircle cx={46} cy={20} r={2.5} fill={glyphPalette.coinInner} />
              <SvgCircle cx={42} cy={40} r={2} fill={glyphPalette.accent} />
              <Path
                d="M22 40h14"
                stroke={glyphPalette.accent}
                strokeWidth={2}
                strokeLinecap="round"
              />
              <Path
                d="M22 45h10"
                stroke={glyphPalette.accent}
                strokeWidth={2}
                strokeLinecap="round"
              />
            </Svg>
          </Stack>
          <Text textAlign="center" color="$gray10" maxWidth={260}>
            No tienes presupuestos para este mes.{"\n"}¡Crea uno para empezar a
            ahorrar!
          </Text>
        </YStack>
      );
    }

    return budgets.map((budget) => (
      <BudgetCard
        key={budget.id}
        budget={budget}
        onPress={() => navigation.navigate("BudgetDetail", { budget })}
      />
    ));
  }, [budgets, isLoading, navigation]);

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" space="$3">
          <GoBackButton />
          <Text fontSize="$5" fontWeight="800" color="$color">
            Presupuestos
          </Text>
        </XStack>

        <MonthSelector
          currentMonth={selectedMonth}
          currentYear={selectedYear}
          onChange={(m, y) => BudgetActions.changeDate(m, y)}
          loading={isLoading}
        />
      </XStack>
      {!isReady ? (
        <YStack flex={1} alignItems="center" justifyContent="center">
          <ActivityIndicator size="small" color="#F59E0B" />
        </YStack>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={BudgetActions.loadBudgets}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <YStack paddingHorizontal="$4" space="$5" marginTop="$2">
            <MonthlySummary
              totalSpent={totalSpent}
              totalBudgeted={totalBudgeted}
            />

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$5" fontWeight="700" color="$gray11">
                Detalle por Categoría
              </Text>
            </XStack>

            <YStack space="$4">{renderedBudgets}</YStack>
          </YStack>
        </ScrollView>
      )}

      <Button
        position="absolute"
        bottom={insets.bottom + 20}
        right={20}
        size="$6"
        circular
        backgroundColor="$color"
        elevation={10}
        shadowColor="$shadowColor"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        icon={<Plus size={28} color="$background" />}
        onPress={() => setIsEntrySheetOpen(true)}
      />
      <BudgetEntrySheet
        open={isEntrySheetOpen}
        onOpenChange={setIsEntrySheetOpen}
      />
    </YStack>
  );
}
