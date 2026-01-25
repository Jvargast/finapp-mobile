import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  RefreshControl,
  InteractionManager,
  ActivityIndicator,
} from "react-native";
import { YStack, Text, Button, XStack } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
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
      return (
        <YStack
          padding="$8"
          alignItems="center"
          justifyContent="center"
          space="$4"
          opacity={0.6}
        >
          <Text fontSize={40}>📉</Text>
          <Text textAlign="center" color="$gray10">
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
