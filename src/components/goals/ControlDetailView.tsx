import React from "react";
import { YStack, XStack, Text, Card, Progress } from "tamagui";
import {
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Wallet,
  AlertTriangle,
} from "@tamagui/lucide-icons";
import { ControlAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";

interface ControlDetailViewProps {
  analysis: ControlAnalysis;
  currency: string;
}

export const ControlDetailView = ({
  analysis,
  currency,
}: ControlDetailViewProps) => {
  const { spent, limit, remaining, percentage, status, advice } = analysis;
  let colorTheme = "$green";
  let Icon = CheckCircle2;

  if (status === "CRITICAL") {
    colorTheme = "$red";
    Icon = AlertCircle;
  } else if (status === "AT_RISK") {
    colorTheme = "$orange";
    Icon = AlertTriangle;
  }

  const isOverLimit = remaining < 0;

  return (
    <YStack space="$3">
      <Card bordered padding="$4" backgroundColor="$background">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
        >
          <Text fontSize="$3" fontWeight="700" color="$gray11">
            Consumo del Presupuesto
          </Text>
          <XStack
            backgroundColor={`${colorTheme}3`}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
            alignItems="center"
            space="$1.5"
          >
            <Icon size={12} color={`${colorTheme}10`} />
            <Text fontSize={11} fontWeight="800" color={`${colorTheme}10`}>
              {percentage}% USADO
            </Text>
          </XStack>
        </XStack>

        <XStack alignItems="baseline" space="$2">
          <Text fontSize="$9" fontWeight="900" color="$color">
            {formatGoalAmount(spent, currency)}
          </Text>
          <Text fontSize="$3" color="$gray10">
            de {formatGoalAmount(limit, currency)}
          </Text>
        </XStack>

        <Progress
          value={Math.min(percentage, 100)}
          size="$3"
          marginTop="$3"
          backgroundColor="$gray3"
        >
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={isOverLimit ? "$red9" : `${colorTheme}9`}
          />
        </Progress>
      </Card>

      <XStack space="$3">
        <Card
          flex={1}
          padding="$3"
          backgroundColor={isOverLimit ? "$red2" : "$green2"}
          borderRadius="$6"
        >
          <Wallet
            size={20}
            color={isOverLimit ? "$red9" : "$green9"}
            marginBottom="$2"
          />
          <Text
            fontSize="$2"
            color={isOverLimit ? "$red11" : "$green11"}
            fontWeight="600"
          >
            {isOverLimit ? "Excedido por" : "Disponible"}
          </Text>
          <Text
            fontSize="$6"
            fontWeight="900"
            color={isOverLimit ? "$red10" : "$green10"}
          >
            {formatGoalAmount(Math.abs(remaining), currency)}
          </Text>
        </Card>

        <Card flex={1} padding="$3" backgroundColor="$blue2" borderRadius="$6">
          <TrendingUp size={20} color="$blue9" marginBottom="$2" />
          <Text fontSize="$2" color="$blue11" fontWeight="600">
            Límite Total
          </Text>
          <Text fontSize="$6" fontWeight="900" color="$blue10">
            {formatGoalAmount(limit, currency)}
          </Text>
        </Card>
      </XStack>

      <YStack
        backgroundColor={`${colorTheme}2`}
        padding="$3.5"
        borderRadius="$6"
        borderLeftWidth={4}
        borderLeftColor={`${colorTheme}9`}
        space="$2"
      >
        <Text fontSize="$3" fontWeight="800" color={`${colorTheme}11`}>
          Estado de Control
        </Text>
        <Text fontSize="$3" color={`${colorTheme}11`} lineHeight={20}>
          {advice}
        </Text>
      </YStack>
    </YStack>
  );
};
