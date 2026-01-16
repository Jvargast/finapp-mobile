import React from "react";
import { YStack, XStack, Text, Card, Progress, Separator } from "tamagui";
import {
  Palmtree,
  Hourglass,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  CheckCircle2,
} from "@tamagui/lucide-icons";
import { formatGoalAmount } from "../../utils/formatMoney";
import { InvestmentAnalysis, GoalTransaction } from "../../types/goal.types";

interface RetirementDetailViewProps {
  analysis: InvestmentAnalysis;
  currency: string;
  transactions?: GoalTransaction[];
  deadline?: string | Date;
}

export const RetirementDetailView = ({
  analysis,
  currency,
}: RetirementDetailViewProps) => {
  console.log(analysis);
  const projectedTotal = analysis.projectedAmount || 0;

  const currentTotal = analysis.currentAmount || 0;
  const monthlyContribution = analysis.recommendedMonthly || 0;
  const monthsLeft = analysis.monthsLeft || 0;

  const totalUserContribution = currentTotal + monthlyContribution * monthsLeft;
  const totalInterestEarned = Math.max(
    0,
    projectedTotal - totalUserContribution
  );

  const yearsLeft = (monthsLeft / 12).toFixed(1);
  const percentageAchieved = Math.min(
    (projectedTotal / (analysis.targetAmount || 1)) * 100,
    100
  );

  const isTrack = analysis.status === "ON_TRACK";

  return (
    <YStack space="$4">
      <Card
        bordered
        padding="$4"
        backgroundColor="$slate2"
        borderColor="$slate4"
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
        >
          <XStack alignItems="center" space="$2">
            <Palmtree size={18} color="$slate11" />
            <Text fontSize="$3" fontWeight="800" color="$slate11">
              Fondo de Retiro Proyectado
            </Text>
          </XStack>

          <YStack alignItems="flex-end">
            <Text fontSize={11} color="$slate10" fontWeight="600">
              META: {formatGoalAmount(analysis.targetAmount || 0, currency)}
            </Text>
          </YStack>
        </XStack>

        <Text fontSize={32} fontWeight="900" color="$slate12" lineHeight={36}>
          {formatGoalAmount(projectedTotal, currency)}
        </Text>

        <Text
          fontSize="$3"
          color={isTrack ? "$green11" : "$orange11"}
          marginBottom="$4"
          fontWeight="600"
        >
          {isTrack
            ? "🚀 Vas camino a superar tu meta"
            : "⚠️ Podría faltarte capital al final"}
        </Text>

        <YStack space="$2">
          <XStack justifyContent="space-between">
            <Text fontSize={11} color="$slate10">
              Progreso proyectado
            </Text>
            <Text fontSize={11} color="$slate10">
              {percentageAchieved.toFixed(0)}%
            </Text>
          </XStack>
          <Progress
            value={percentageAchieved}
            size="$2"
            backgroundColor="$slate5"
          >
            <Progress.Indicator
              animation="bouncy"
              backgroundColor={isTrack ? "$green9" : "$orange9"}
            />
          </Progress>
        </YStack>
      </Card>

      <XStack space="$3">
        <Card flex={1} padding="$3" backgroundColor="$background" bordered>
          <PiggyBank size={20} color="$gray10" marginBottom="$2" />
          <Text fontSize={11} color="$gray10" marginBottom={2}>
            Tu Aporte Total
          </Text>
          <Text fontSize="$5" fontWeight="800" color="$gray12">
            {formatGoalAmount(totalUserContribution, currency)}
          </Text>
          <Text fontSize={10} color="$gray9" marginTop={4}>
            Capital propio
          </Text>
        </Card>

        <Card
          flex={1}
          padding="$3"
          backgroundColor="$purple2"
          borderColor="$purple4"
          borderWidth={1}
        >
          <TrendingUp size={20} color="$purple10" marginBottom="$2" />
          <Text fontSize={11} color="$purple11" marginBottom={2}>
            Ganancia Interés
          </Text>
          <Text fontSize="$5" fontWeight="800" color="$purple11">
            {formatGoalAmount(totalInterestEarned, currency)}
          </Text>
          <Text fontSize={10} color="$purple10" marginTop={4}>
            Dinero "gratis" generado
          </Text>
        </Card>
      </XStack>

      <XStack
        backgroundColor="$slate3"
        padding="$3"
        borderRadius="$4"
        alignItems="center"
        space="$3"
      >
        <Hourglass size={24} color="$slate10" />
        <YStack flex={1}>
          <Text fontSize="$3" fontWeight="700" color="$slate12">
            Faltan {yearsLeft} años
          </Text>
          <Text fontSize="$2" color="$slate11">
            Para llegar a tu fecha de libertad financiera.
          </Text>
        </YStack>
      </XStack>

      <YStack
        backgroundColor={isTrack ? "$green2" : "$orange2"}
        padding="$4"
        borderRadius="$4"
        space="$2"
        borderLeftWidth={4}
        borderLeftColor={isTrack ? "$green9" : "$orange9"}
      >
        <XStack space="$2" alignItems="center">
          {isTrack ? (
            <CheckCircle2 size={16} color="$green11" />
          ) : (
            <AlertTriangle size={16} color="$orange11" />
          )}
          <Text
            fontSize="$3"
            fontWeight="700"
            color={isTrack ? "$green11" : "$orange11"}
          >
            Análisis de Jubilación
          </Text>
        </XStack>
        <Text
          fontSize="$3"
          color={isTrack ? "$green12" : "$orange12"}
          lineHeight={20}
        >
          {analysis.advice}
        </Text>
      </YStack>
    </YStack>
  );
};
