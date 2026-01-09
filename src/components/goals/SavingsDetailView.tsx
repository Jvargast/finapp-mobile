import React from "react";
import { YStack, XStack, Text, Card, Separator } from "tamagui";
import { Target, Wallet, TrendingUp } from "@tamagui/lucide-icons";
import { SavingsAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";

interface SavingsDetailViewProps {
  analysis: SavingsAnalysis;
  currency: string;
  isHousing?: boolean;
}

export const SavingsDetailView = ({
  analysis,
  currency,
  isHousing,
}: SavingsDetailViewProps) => {
  const gap = analysis.requiredMonthly - (analysis.yourCapacity || 0);
  const isFeasible = gap <= 0;

  return (
    <YStack space="$4">
      <XStack justifyContent="space-between" space="$2">
        <Card
          flex={1}
          padding="$3"
          backgroundColor="$blue2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$blue4"
        >
          <Target size={20} color="$blue9" marginBottom="$2" />
          <Text fontSize="$2" color="$blue11" fontWeight="600">
            Necesitas al mes
          </Text>
          <Text fontSize="$5" fontWeight="900" color="$blue10">
            {formatGoalAmount(analysis.requiredMonthly, currency)}
          </Text>
        </Card>

        <Card
          flex={1}
          padding="$3"
          backgroundColor={isFeasible ? "$green2" : "$orange2"}
          borderRadius="$4"
          borderWidth={1}
          borderColor={isFeasible ? "$green4" : "$orange4"}
        >
          <Wallet
            size={20}
            color={isFeasible ? "$green9" : "$orange9"}
            marginBottom="$2"
          />
          <Text
            fontSize="$2"
            color={isFeasible ? "$green11" : "$orange11"}
            fontWeight="600"
          >
            Tu capacidad real
          </Text>
          <Text
            fontSize="$5"
            fontWeight="900"
            color={isFeasible ? "$green10" : "$orange10"}
          >
            {formatGoalAmount(analysis.yourCapacity || 0, currency)}
          </Text>
        </Card>
      </XStack>

      <YStack
        backgroundColor="$gray2"
        padding="$4"
        borderRadius="$4"
        space="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" fontWeight="700" color="$gray11">
            Proyección {isHousing ? "Inmobiliaria" : "de Ahorro"}
          </Text>
          <Text fontSize="$3" color="$gray10">
            {analysis.monthsLeft} meses restantes
          </Text>
        </XStack>

        <Separator />

        <Text fontSize="$3" color="$gray11" lineHeight={22}>
          {analysis.advice}
        </Text>

        {!isFeasible && (
          <Text fontSize="$2" color="$red9" fontWeight="600" marginTop="$1">
            ⚠️ Te faltan {formatGoalAmount(gap, currency)} mensuales para llegar
            a tiempo.
          </Text>
        )}
      </YStack>
    </YStack>
  );
};
