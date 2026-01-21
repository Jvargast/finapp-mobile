import React, { useEffect } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { YStack, Text, Spinner, Button, XStack, /* LinearGradient */ } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import { useBudgetStore } from "../../stores/useBudgetStore";
import { MonthSelector } from "../../components/budget/MonthSelector";
import { BudgetCard } from "../../components/budget/BudgetCard";
import { BudgetActions } from "../../actions/budgetActions";

export default function BudgetScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const {
    budgets,
    isLoading,
    selectedMonth,
    selectedYear,
    totalBudgeted,
    totalSpent,
  } = useBudgetStore();

  useEffect(() => {
    BudgetActions.loadBudgets();
  }, []);

  const handleChangeDate = (m: number, y: number) => {
    BudgetActions.changeDate(m, y);
  };

  const globalPercentage =
    totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const handleCreate = () => {
    navigation.navigate("CreateBudget");
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <MonthSelector
        currentMonth={selectedMonth}
        currentYear={selectedYear}
        onChange={handleChangeDate}
        loading={isLoading}
      />

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
        <YStack paddingHorizontal="$4" space="$5">
          <YStack
            borderRadius="$8"
            overflow="hidden"
            backgroundColor="$gray2"
            padding="$5"
            space="$2"
            borderWidth={1}
            borderColor="$gray4"
          >
            <Text
              fontSize="$3"
              fontWeight="700"
              color="$gray10"
              letterSpacing={1}
            >
              RESUMEN MENSUAL
            </Text>
            <XStack alignItems="baseline" space="$1">
              <Text fontSize={36} fontWeight="900" color="$color">
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(totalSpent)}
              </Text>
              <Text fontSize="$4" color="$gray11" fontWeight="500">
                gastados
              </Text>
            </XStack>

            <Text fontSize="$3" color="$gray10">
              de un total presupuestado de{" "}
              <Text color="$color" fontWeight="700">
                {new Intl.NumberFormat("es-CL", {
                  style: "currency",
                  currency: "CLP",
                }).format(totalBudgeted)}
              </Text>
            </Text>

            <YStack
              height={6}
              backgroundColor="$gray5"
              borderRadius="$10"
              marginTop="$2"
              overflow="hidden"
            >
              <YStack
                height="100%"
                width={`${Math.min(globalPercentage, 100)}%`}
                backgroundColor={globalPercentage > 100 ? "$red9" : "$blue9"}
              />
            </YStack>
          </YStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$5" fontWeight="800" color="$color">
              Mis Presupuestos
            </Text>
            <Button size="$2" chromeless color="$blue10" onPress={handleCreate}>
              Gestionar
            </Button>
          </XStack>

          {budgets.length === 0 && !isLoading ? (
            <YStack
              padding="$8"
              alignItems="center"
              justifyContent="center"
              space="$4"
              opacity={0.6}
            >
              <Text fontSize={40}>📉</Text>
              <Text textAlign="center" color="$gray10">
                No tienes presupuestos para este mes.{"\n"}¡Crea uno para
                empezar a ahorrar!
              </Text>
            </YStack>
          ) : (
            budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onPress={() => navigation.navigate("BudgetDetail", { budget })}
              />
            ))
          )}
        </YStack>
      </ScrollView>

      <Button
        position="absolute"
        bottom={insets.bottom + 20}
        right={20}
        size="$6"
        circular
        backgroundColor="$color"
        elevation={10}
        icon={<Plus size={28} color="$background" />}
        onPress={handleCreate}
        pressStyle={{ scale: 0.9 }}
      />
    </YStack>
  );
}
