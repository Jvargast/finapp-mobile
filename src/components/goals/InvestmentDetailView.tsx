import React from "react";
import { YStack, XStack, Text, Card } from "tamagui";
import { TrendingUp, Sprout, PiggyBank } from "@tamagui/lucide-icons";
import { InvestmentAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";

interface InvestmentDetailViewProps {
  analysis: InvestmentAnalysis;
  currency: string;
}

export const InvestmentDetailView = ({
  analysis,
  currency,
}: InvestmentDetailViewProps) => {
  return (
    <YStack space="$4">
      <YStack
        alignItems="center"
        padding="$4"
        backgroundColor="$purple2"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$purple4"
      >
        <Text
          fontSize="$3"
          color="$purple11"
          fontWeight="600"
          letterSpacing={1}
          textTransform="uppercase"
        >
          Proyección a futuro
        </Text>
        <Text fontSize="$9" fontWeight="900" color="$purple10" marginTop="$1">
          {formatGoalAmount(analysis.projectedAmount, currency)}
        </Text>
        <XStack
          alignItems="center"
          space="$2"
          marginTop="$2"
          backgroundColor="rgba(255,255,255,0.5)"
          paddingHorizontal="$2"
          borderRadius="$4"
        >
          <TrendingUp size={16} color="$purple10" />
          <Text fontSize="$3" color="$purple11" fontWeight="600">
            {analysis.isGoalMet ? "Meta Superada 🚀" : "En proceso 🌱"}
          </Text>
        </XStack>
      </YStack>

      <XStack space="$3">
        <Card flex={1} padding="$3" backgroundColor="$gray2" borderRadius="$4">
          <PiggyBank size={20} color="$gray10" marginBottom="$2" />
          <Text fontSize="$2" color="$gray10">
            Tu Aporte Mensual
          </Text>
          <Text fontSize="$4" fontWeight="800" color="$gray12">
            {formatGoalAmount(analysis.monthlyContribution, currency)}
          </Text>
        </Card>

        <Card
          flex={1}
          padding="$3"
          backgroundColor="$green2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$green4"
        >
          <Sprout size={20} color="$green9" marginBottom="$2" />
          <Text fontSize="$2" color="$green11" fontWeight="600">
            Ganancia (Interés)
          </Text>
          <Text fontSize="$4" fontWeight="800" color="$green10">
            +{formatGoalAmount(analysis.interestEarned, currency)}
          </Text>
        </Card>
      </XStack>

      <Text
        fontSize="$3"
        color="$gray11"
        lineHeight={22}
        textAlign="center"
        paddingHorizontal="$2"
      >
        {analysis.advice}
      </Text>
    </YStack>
  );
};
