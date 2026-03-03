import React, { useCallback, useMemo, useState } from "react";
import { Pressable } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  YStack,
  XStack,
  Text,
  Progress,
  Stack,
  Spinner,
  useThemeName,
} from "tamagui";
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  TrendingDown,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "@tamagui/linear-gradient";
import { TransactionService } from "../../services/transactionService";
import { BudgetService } from "../../services/budgetService";
import { Transaction } from "../../types/transaction.types";
import { useUserStore } from "../../stores/useUserStore";
import { formatMoney } from "../../utils/formatMoney";

const PAGE_SIZE = 100;

type PreviewMetrics = {
  currentExpense: number;
  previousExpense: number;
  spentPercentage: number;
  hasBudget: boolean;
};

const EMPTY_METRICS: PreviewMetrics = {
  currentExpense: 0,
  previousExpense: 0,
  spentPercentage: 0,
  hasBudget: false,
};

const getMonthParts = (date: Date) => ({
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

const getPreviousMonthParts = (date: Date) => {
  const prev = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  return getMonthParts(prev);
};

const clampPercent = (value: number) => Math.min(100, Math.max(0, value));

const sumExpenseLike = (transactions: Transaction[]) =>
  transactions.reduce((acc, tx) => {
    if (tx.type !== "EXPENSE" && tx.type !== "TRANSFER") return acc;
    return acc + Math.abs(Number(tx.amount || 0));
  }, 0);

const fetchMonthlyExpenseTotal = async (month: number, year: number) => {
  let page = 1;
  let offset = 0;
  let total = 0;
  let keepLoading = true;

  while (keepLoading) {
    const response = await TransactionService.getAll({
      month,
      year,
      limit: PAGE_SIZE,
      offset,
    });

    total += sumExpenseLike(response.data || []);

    const lastPage = response.meta?.lastPage || page;
    const reachedLastPage = page >= lastPage;
    const reachedEndBySize = (response.data?.length || 0) < PAGE_SIZE;

    if (reachedLastPage || reachedEndBySize) {
      keepLoading = false;
    } else {
      page += 1;
      offset = (page - 1) * PAGE_SIZE;
    }
  }

  return total;
};

export const AnalyticsPreview = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const currency = useUserStore(
    (state) => state.user?.preferences?.currency || "CLP",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [metrics, setMetrics] = useState<PreviewMetrics>(EMPTY_METRICS);

  const loadPreview = useCallback(() => {
    let isActive = true;

    const run = async () => {
      setIsLoading(true);
      try {
        const now = new Date();
        const { month, year } = getMonthParts(now);
        const { month: prevMonth, year: prevYear } = getPreviousMonthParts(now);

        const [currentExpense, previousExpense, budgets] = await Promise.all([
          fetchMonthlyExpenseTotal(month, year),
          fetchMonthlyExpenseTotal(prevMonth, prevYear),
          BudgetService.getBudgets(month, year),
        ]);

        const totalBudgeted = budgets.reduce(
          (acc, budget) => acc + Number(budget.amount || 0),
          0,
        );
        const totalSpent = budgets.reduce(
          (acc, budget) => acc + Number(budget.progress?.spent || 0),
          0,
        );
        const spentPercentage =
          totalBudgeted > 0
            ? clampPercent((totalSpent / totalBudgeted) * 100)
            : 0;

        if (isActive) {
          setMetrics({
            currentExpense,
            previousExpense,
            spentPercentage,
            hasBudget: totalBudgeted > 0,
          });
        }
      } catch (error) {
        console.error("Error cargando preview de analítica", error);
        if (isActive) setMetrics(EMPTY_METRICS);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, []);

  useFocusEffect(loadPreview);

  const delta = useMemo(() => {
    if (metrics.previousExpense <= 0) {
      return metrics.currentExpense > 0 ? 100 : 0;
    }
    return (
      ((metrics.currentExpense - metrics.previousExpense) /
        metrics.previousExpense) *
      100
    );
  }, [metrics.currentExpense, metrics.previousExpense]);

  const deltaRounded = Number(delta.toFixed(1));
  const deltaLabel = `${deltaRounded > 0 ? "+" : ""}${deltaRounded}%`;
  const spendingImproved = deltaRounded <= 0;
  const budgetLabel = metrics.hasBudget
    ? `${Math.round(metrics.spentPercentage)}%`
    : "Sin presupuesto";
  const monthName = new Date().toLocaleDateString("es-ES", { month: "long" });

  const pastel = {
    cardStart: isDark ? "#1E2231" : "#F5F3FF",
    cardEnd: isDark ? "#2B2230" : "#FFF7ED",
    ink: isDark ? "#F8FAFC" : "#1F2937",
    muted: isDark ? "#CBD5E1" : "#6B7280",
    accent: isDark ? "#A5B4FC" : "#8BA7F2",
    accentSoft: isDark
      ? "rgba(165, 180, 252, 0.18)"
      : "rgba(139, 167, 242, 0.18)",
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
      <Pressable
        onPress={() => navigation.navigate("Analytics")}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.98 : 1 }],
          opacity: pressed ? 0.9 : 1,
        })}
      >
        <Stack
          borderRadius="$6"
          overflow="hidden"
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
                  borderColor={
                    isDark
                      ? "rgba(165, 180, 252, 0.3)"
                      : "rgba(139, 167, 242, 0.35)"
                  }
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
                {isLoading ? (
                  <Spinner size="small" color={pastel.accent} />
                ) : (
                  <Text color={pastel.ink} fontSize={22} fontWeight="800">
                    {formatMoney(metrics.currentExpense, currency)}
                  </Text>
                )}
              </YStack>

              <YStack alignItems="flex-end" space="$1">
                <XStack
                  backgroundColor={
                    spendingImproved ? pastel.trendUpBg : pastel.trendDownBg
                  }
                  paddingHorizontal={8}
                  paddingVertical={4}
                  borderRadius={8}
                  alignItems="center"
                  space="$1"
                >
                  {spendingImproved ? (
                    <TrendingDown size={12} color={pastel.trendUpText} />
                  ) : (
                    <TrendingUp size={12} color={pastel.trendDownText} />
                  )}
                  <Text
                    color={
                      spendingImproved
                        ? pastel.trendUpText
                        : pastel.trendDownText
                    }
                    fontSize={11}
                    fontWeight="700"
                  >
                    {deltaLabel}
                  </Text>
                </XStack>
                <Text color={pastel.muted} fontSize={10}>
                  vs mes anterior
                </Text>
              </YStack>
            </XStack>

            <YStack space="$1.5">
              <XStack justifyContent="space-between">
                <Text color={pastel.muted} fontSize={10}>
                  Presupuesto usado
                </Text>
                <Text color={pastel.muted} fontSize={10}>
                  {budgetLabel}
                </Text>
              </XStack>
              <Progress
                value={metrics.spentPercentage}
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
      </Pressable>
    </YStack>
  );
};
