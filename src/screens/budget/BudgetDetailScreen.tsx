import React, { useCallback, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { YStack, useTheme, Text } from "tamagui";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BudgetActions } from "../../actions/budgetActions";
import { Budget } from "../../types/budget.types";
import { BudgetDetailHeader } from "../../components/budget/BudgetDetailHeader";
import { BudgetProgressCard } from "../../components/budget/BudgetProgressCard";
import { BudgetParticipantsSection } from "../../components/budget/BudgetParticipantsSection";
import { EditBudgetSheet } from "../../components/budget/EditBudgetSheet";
import { useUserStore } from "../../stores/useUserStore";
import { BudgetHistorySection } from "../../components/budget/BudgetHistorySection";
import { creationDate } from "../../utils/formatDate";

export default function BudgetDetailScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();

  const user = useUserStore((state) => state.user);

  const { budget: initialBudget } = route.params;

  const [budget, setBudget] = useState<Budget>(initialBudget);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchBudgetDetail = useCallback(async () => {
    try {
      const data = await BudgetActions.getBudgetById(initialBudget.id);
      setBudget(data);
    } catch (error) {
      console.log("Error refrescando presupuesto");
    }
  }, [initialBudget.id]);

  useFocusEffect(
    useCallback(() => {
      fetchBudgetDetail();
    }, [fetchBudgetDetail])
  );

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchBudgetDetail();
    setIsRefreshing(false);
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <BudgetDetailHeader
        title={budget.name || budget.category.name}
        subtitle={`Creado el ${creationDate(budget)}`}
        onSettingsPress={() => setIsEditOpen(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <YStack paddingHorizontal="$4" space="$5" marginTop="$4">
          <BudgetProgressCard budget={budget} />

          <BudgetParticipantsSection
            budget={budget}
            onUpdate={fetchBudgetDetail}
            currentUserId={user?.id}
          />

          <BudgetHistorySection budget={budget} />
        </YStack>
      </ScrollView>

      <EditBudgetSheet
        open={isEditOpen}
        onOpenChange={(open) => {
          setIsEditOpen(open);
          if (!open) fetchBudgetDetail();
        }}
        budget={budget}
        currentUserId={user?.id}
      />
    </YStack>
  );
}
