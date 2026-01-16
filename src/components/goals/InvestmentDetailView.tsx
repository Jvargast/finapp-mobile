import React, { useMemo } from "react";
import { YStack, XStack, Text, Card, Progress } from "tamagui";
import {
  TrendingUp,
  Sprout,
  PiggyBank,
  CheckCircle2,
} from "@tamagui/lucide-icons";
import { GoalTransaction, InvestmentAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { isSameMonth, isSameYear } from "date-fns";

interface InvestmentDetailViewProps {
  analysis: InvestmentAnalysis;
  currency: string;
  transactions?: GoalTransaction[];
}

export const InvestmentDetailView = ({
  analysis,
  currency,
  transactions = [],
}: InvestmentDetailViewProps) => {
  const paidThisMonth = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return isSameMonth(txDate, now) && isSameYear(txDate, now);
      })
      .reduce((sum, tx) => {
        const val = Number(tx.amount);
        return tx.type === "DEPOSIT" ? sum + val : sum - val;
      }, 0);
  }, [transactions]);

  const monthlyTarget = analysis.monthlyContribution || 1;
  const monthProgress = Math.min((paidThisMonth / monthlyTarget) * 100, 100);
  const isMonthMet = paidThisMonth >= monthlyTarget;

  const projectedMonths = analysis.monthsProjection || 12;
  const projectionDate = new Date();
  projectionDate.setMonth(projectionDate.getMonth() + projectedMonths);

  const dateString = projectionDate.toLocaleDateString("es-CL", {
    month: "long",
    year: "numeric",
  });
  return (
    <YStack space="$4">
      <YStack
        padding="$4"
        backgroundColor="$purple2"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$purple4"
      >
        <XStack justifyContent="space-between" alignItems="flex-start">
          <YStack>
            <Text
              fontSize="$3"
              color="$purple11"
              fontWeight="600"
              letterSpacing={1}
              textTransform="uppercase"
            >
              Proyección ({projectedMonths} Meses)
            </Text>
            <Text
              fontSize="$9"
              fontWeight="900"
              color="$purple10"
              marginTop="$1"
            >
              {formatGoalAmount(analysis.projectedAmount, currency)}
            </Text>
            <Text fontSize="$3" color="$purple11" opacity={0.8}>
              Estimado para {dateString}
            </Text>
          </YStack>

          <XStack
            alignItems="center"
            space="$2"
            backgroundColor="$gray6"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
          >
            <TrendingUp size={14} color="$purple10" />
            <Text fontSize={11} color="$purple11" fontWeight="700">
              {analysis.isGoalMet ? "SUPERÁVIT 🚀" : "EN CAMINO"}
            </Text>
          </XStack>
        </XStack>
      </YStack>

      <Card
        bordered
        padding="$3.5"
        backgroundColor="$gray2"
        borderColor="$gray5"
      >
        <XStack justifyContent="space-between" marginBottom="$2">
          <Text fontSize="$3" fontWeight="700" color="$gray11">
            Tu Aporte de{" "}
            {new Date().toLocaleDateString("es-CL", { month: "long" })}
          </Text>
          {isMonthMet && <CheckCircle2 size={16} color="$green9" />}
        </XStack>

        <XStack alignItems="baseline" space="$2">
          <Text
            fontSize="$6"
            fontWeight="900"
            color={isMonthMet ? "$green9" : "$gray12"}
          >
            {formatGoalAmount(paidThisMonth, currency)}
          </Text>
          <Text fontSize="$3" color="$gray10">
            / {formatGoalAmount(monthlyTarget, currency)}
          </Text>
        </XStack>

        <Progress
          value={monthProgress}
          size="$2"
          marginTop="$3"
          backgroundColor="$gray4"
        >
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={isMonthMet ? "$green9" : "$purple9"}
          />
        </Progress>
        <Text fontSize={11} color="$gray10" marginTop="$2" textAlign="right">
          {isMonthMet
            ? "¡Excelente! Has cumplido tu cuota mensual."
            : `Te faltan ${formatGoalAmount(
                monthlyTarget - paidThisMonth,
                currency
              )} para cumplir el plan.`}
        </Text>
      </Card>

      <Card
        padding="$3"
        backgroundColor="$green2"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$green4"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <XStack alignItems="center" space="$3">
          <YStack backgroundColor="white" padding="$2" borderRadius="$10">
            <Sprout size={20} color="$green9" />
          </YStack>
          <YStack>
            <Text fontSize="$3" color="$green11" fontWeight="600">
              Interés Ganado
            </Text>
            <Text fontSize={10} color="$green11" opacity={0.8}>
              Dinero gratis por esperar
            </Text>
          </YStack>
        </XStack>
        <Text fontSize="$5" fontWeight="800" color="$green10">
          +{formatGoalAmount(analysis.interestEarned, currency)}
        </Text>
      </Card>

      <Text
        fontSize="$3"
        color="$gray11"
        textAlign="center"
        paddingHorizontal="$2"
        opacity={0.8}
      >
        {analysis.advice}
      </Text>
    </YStack>
  );
};
