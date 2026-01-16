import React, { useCallback, useState } from "react";
import { ScrollView, RefreshControl } from "react-native";
import {
  YStack,
  Text,
  Button,
  XStack,
  Card,
  Progress,
  useTheme,
} from "tamagui";
import { useRoute } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Plus, Sparkles } from "@tamagui/lucide-icons";
import { GoalService } from "../../services/goalService";
import { FinancialGoal, GoalType } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { GoalDetailHeader } from "../../components/goals/GoalDetailHeader";
import { SavingsDetailView } from "../../components/goals/SavingsDetailView";
import { InvestmentDetailView } from "../../components/goals/InvestmentDetailView";
import { DebtDetailView } from "../../components/goals/DebtDetailView";
import { GoalParticipantsSection } from "../../components/goals/GoalParticipantsSection";
import { GoalTransactionSheet } from "../../components/goals/GoalTransactionSheet";
import { GoalActivitySection } from "../../components/goals/GoalActivitySection";
import { ControlDetailView } from "../../components/goals/ControlDetailView";
import { RetirementDetailView } from "../../components/goals/RetirementDetailView";

const THEME_BY_TYPE = {
  [GoalType.SAVING]: {
    primary: "$green9",
    soft: "$green2",
    border: "$green4",
    contrast: "white",
  },
  [GoalType.DEBT]: {
    primary: "$red9",
    soft: "$red2",
    border: "$red4",
    contrast: "white",
  },
  [GoalType.HOUSING]: {
    primary: "$blue9",
    soft: "$blue2",
    border: "$blue4",
    contrast: "white",
  },
  [GoalType.INVESTMENT]: {
    primary: "$purple9",
    soft: "$purple2",
    border: "$purple4",
    contrast: "white",
  },
  [GoalType.RETIREMENT]: {
    primary: "$slate9",
    soft: "$slate2",
    border: "$slate4",
    contrast: "white",
  },
  [GoalType.CONTROL]: {
    primary: "$orange9",
    soft: "$orange2",
    border: "$orange4",
    contrast: "white",
  },
};

export const GoalDetailScreen = () => {
  const appTheme = useTheme();
  const insets = useSafeAreaInsets();
  const route = useRoute<any>();
  const [isTransactionOpen, setTransactionOpen] = useState(false);
  const { goalId, goal: initialGoal } = route.params;

  const [goal, setGoal] = useState<FinancialGoal>(initialGoal);
  const [isLoading, setIsLoading] = useState(false);

  const theme = THEME_BY_TYPE[goal.type] || THEME_BY_TYPE[GoalType.SAVING];
  const progressPercent = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  );

  const fetchGoalDetails = useCallback(async () => {
    try {
      const data = await GoalService.getById(goalId);
      setGoal(data);
    } catch (error) {
      console.error("Error actualizando meta", error);
    }
  }, [goalId]);

  useFocusEffect(
    useCallback(() => {
      fetchGoalDetails();
    }, [fetchGoalDetails])
  );

  const handleAddMoney = () => {
    setTransactionOpen(true);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: appTheme.background.val }}
      edges={["top", "left", "right"]}
    >
      <YStack flex={1}>
        <GoalDetailHeader
          title={goal.name}
          type={goal.type}
          goal={goal}
          onGoalUpdate={fetchGoalDetails}
        />

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={async () => {
                setIsLoading(true);
                await fetchGoalDetails();
                setIsLoading(false);
              }}
              tintColor="#000"
            />
          }
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 150,
          }}
        >
          <YStack
            paddingHorizontal="$4"
            space="$5"
            backgroundColor="$background"
          >
            <Card
              backgroundColor={theme.primary}
              borderRadius="$8"
              padding="$4"
              elevation={10}
              shadowColor={theme.primary}
              shadowOpacity={0.4}
              shadowRadius={15}
              animation="bouncy"
              marginTop="$2"
            >
              <YStack space="$4">
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack>
                    <Text
                      color="rgba(255,255,255,0.8)"
                      fontSize="$3"
                      fontWeight="600"
                      textTransform="uppercase"
                    >
                      Progreso Actual
                    </Text>
                    <Text
                      color="white"
                      fontSize="$9"
                      fontWeight="900"
                      letterSpacing={-1}
                    >
                      {progressPercent.toFixed(0)}%
                    </Text>
                  </YStack>
                  <YStack
                    backgroundColor="rgba(255,255,255,0.2)"
                    padding="$2"
                    borderRadius="$4"
                  >
                    <Text fontSize="$3" fontWeight="bold" color="white">
                      {goal.currency}
                    </Text>
                  </YStack>
                </XStack>
                <YStack>
                  <Progress
                    value={progressPercent}
                    size="$2"
                    backgroundColor="rgba(0,0,0,0.2)"
                  >
                    <Progress.Indicator
                      animation="bouncy"
                      backgroundColor="white"
                    />
                  </Progress>
                  <XStack justifyContent="space-between" marginTop="$2">
                    <Text
                      color="rgba(255,255,255,0.9)"
                      fontSize="$3"
                      fontWeight="600"
                    >
                      {formatGoalAmount(goal.currentAmount, goal.currency)}
                    </Text>
                    <Text color="rgba(255,255,255,0.6)" fontSize="$3">
                      de {formatGoalAmount(goal.targetAmount, goal.currency)}
                    </Text>
                  </XStack>
                </YStack>
              </YStack>
            </Card>

            <GoalParticipantsSection
              goal={goal}
              onGoalUpdate={fetchGoalDetails}
            />

            <GoalActivitySection goal={goal} />

            <YStack space="$4">
              <XStack alignItems="center" space="$2">
                <Sparkles size={16} color="$brand" />
                <Text fontSize="$5" fontWeight="800" color="$gray10">
                  Análisis Inteligente
                </Text>
              </XStack>
              <YStack animation="lazy" enterStyle={{ opacity: 0, y: 10 }}>
                {goal.type === GoalType.DEBT && (
                  <DebtDetailView
                    analysis={goal.analysis as any}
                    currency={goal.currency}
                    transactions={goal.goalTransactions}
                    deadline={goal.deadline}
                  />
                )}

                {(goal.type === GoalType.SAVING ||
                  goal.type === GoalType.HOUSING) && (
                  <SavingsDetailView
                    goalId={goalId}
                    analysis={goal.analysis as any}
                    currency={goal.currency}
                    isHousing={goal.type === GoalType.HOUSING}
                    transactions={goal.goalTransactions}
                    onGoalUpdate={fetchGoalDetails}
                    deadline={goal.deadline}
                  />
                )}

                {goal.type === GoalType.INVESTMENT  && (
                  <InvestmentDetailView
                    analysis={goal.analysis as any}
                    currency={goal.currency}
                    transactions={goal.goalTransactions}
                  />
                )}

                {goal.type === GoalType.RETIREMENT && (
                  <RetirementDetailView
                    analysis={goal.analysis as any}
                    currency={goal.currency}
                    transactions={goal.goalTransactions}
                    deadline={goal.deadline}
                  />
                )}

                {goal.type === GoalType.CONTROL && (
                  <ControlDetailView
                    analysis={goal.analysis as any}
                    currency={goal.currency}
                  />
                )}
              </YStack>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
      <YStack
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        padding="$4"
        backgroundColor="$background"
        borderTopWidth={1}
        borderColor="$gray4"
        paddingTop="$3"
        paddingBottom={insets.bottom > 0 ? insets.bottom + 10 : 20}
        elevation={20}
      >
        <Button
          size="$5"
          backgroundColor={theme.primary}
          color="white"
          icon={goal.type === GoalType.DEBT ? undefined : <Plus />}
          fontWeight="bold"
          onPressIn={handleAddMoney}
          borderRadius="$10"
          pressStyle={{
            backgroundColor: theme.primary,
            opacity: 0.8,
            scale: 0.98,
            borderColor: "transparent",
          }}
          shadowColor={theme.primary}
          shadowRadius={8}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          borderWidth={0}
        >
          {goal.type === GoalType.DEBT
            ? "Registrar Pago de Cuota"
            : "Abonar Dinero"}
        </Button>
      </YStack>
      <GoalTransactionSheet
        open={isTransactionOpen}
        onOpenChange={setTransactionOpen}
        goal={goal}
        onSuccess={fetchGoalDetails}
      />
    </SafeAreaView>
  );
};
