import React from "react";
import { YStack, XStack, Text, Card, Progress, Circle } from "tamagui";
import {
  CalendarClock,
  Unlock,
  TrendingDown,
  Banknote,
  ShieldAlert,
} from "@tamagui/lucide-icons";
import { DebtAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";

interface DebtDetailViewProps {
  analysis: DebtAnalysis;
  currency: string;
}

export const DebtDetailView = ({ analysis, currency }: DebtDetailViewProps) => {
  const isCritical =
    analysis.status === "CRITICAL" ||
    analysis.status === "IMPOSSIBLE" ||
    analysis.status === "PLANNING";
  const isOnTrack =
    analysis.status === "ON_TRACK" || analysis.status === "COMPLETED";

  const months = analysis.monthsToFree || 0;
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + months);

  const dateString = freedomDate.toLocaleDateString("es-CL", {
    month: "short",
    year: "numeric",
  });

  const timeString =
    months > 12
      ? `${Math.floor(months / 12)}a ${months % 12}m`
      : `${months} Meses`;

  const mainColor = isOnTrack ? "$green9" : "$red9";
  const softColor = isOnTrack ? "$green2" : "$red2";
  const textColor = isOnTrack ? "$green11" : "$red11";

  return (
    <YStack space="$3">
      <XStack space="$3">
        <Card
          flex={1}
          backgroundColor={softColor}
          borderColor="transparent"
          borderRadius="$6"
          padding="$3.5"
          justifyContent="space-between"
        >
          <XStack justifyContent="space-between" alignItems="flex-start">
            <YStack
              backgroundColor="white"
              borderRadius="$10"
              padding="$2"
              opacity={0.8}
            >
              {isOnTrack ? (
                <Unlock size={18} color={mainColor} />
              ) : (
                <CalendarClock size={18} color={mainColor} />
              )}
            </YStack>
            {isOnTrack && (
              <Text
                fontSize={10}
                fontWeight="800"
                color={textColor}
                textTransform="uppercase"
              >
                OPTIMIZADO
              </Text>
            )}
          </XStack>

          <YStack marginTop="$2">
            <Text fontSize="$2" color="$gray11" fontWeight="600">
              Libertad Financiera
            </Text>
            <Text
              fontSize="$7"
              fontWeight="900"
              color={mainColor}
              lineHeight={32}
            >
              {timeString}
            </Text>
            <Text fontSize="$3" color="$gray10" fontWeight="500">
              {months > 0 ? `Meta: ${dateString}` : "Calculando..."}
            </Text>
          </YStack>
        </Card>
        <Card
          flex={1}
          backgroundColor="$gray2"
          borderRadius="$6"
          padding="$3.5"
          justifyContent="space-between"
        >
          <YStack
            alignSelf="flex-start"
            backgroundColor="white"
            borderRadius="$10"
            padding="$2"
          >
            <Banknote size={18} color="$gray11" />
          </YStack>

          <YStack marginTop="$2">
            <Text fontSize="$2" color="$gray11" fontWeight="600">
              Debes Pagar
            </Text>
            <Text
              fontSize="$6"
              fontWeight="900"
              color="$gray12"
              letterSpacing={-0.5}
              lineHeight={32}
            >
              {formatGoalAmount(analysis.monthlyPayment || 0, currency)}
            </Text>
            <Text fontSize={10} color="$gray9" fontWeight="600">
              MENSUAL SUGERIDO
            </Text>
          </YStack>
        </Card>
      </XStack>

      <YStack
        backgroundColor="white"
        borderWidth={1}
        borderColor="$gray4"
        borderRadius="$6"
        padding="$4"
        space="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" alignItems="center">
            <TrendingDown size={16} color="$gray11" />
            <Text fontSize="$3" fontWeight="700" color="$gray11">
              Velocidad de Pago
            </Text>
          </XStack>
          <Text fontSize="$3" fontWeight="700" color={mainColor}>
            {isOnTrack ? "Acelerada 🚀" : "Mínima ⚠️"}
          </Text>
        </XStack>

        <YStack>
          <Progress
            value={isOnTrack ? 85 : 30}
            size="$3"
            backgroundColor="$gray3"
          >
            <Progress.Indicator
              backgroundColor={mainColor}
              animation="bouncy"
            />
          </Progress>
          <XStack justifyContent="space-between" marginTop="$1.5">
            <Text fontSize={10} color="$gray9" fontWeight="600">
              PAGO MÍNIMO
            </Text>
            <Text fontSize={10} color="$gray9" fontWeight="600">
              LIBERTAD TOTAL
            </Text>
          </XStack>
        </YStack>
      </YStack>
      <XStack
        backgroundColor={isCritical ? "$red2" : "$blue2"}
        padding="$3.5"
        borderRadius="$6"
        space="$3"
        borderLeftWidth={4}
        borderLeftColor={isCritical ? "$red9" : "$blue9"}
        alignItems="flex-start"
      >
        <YStack marginTop={2}>
          {isCritical ? (
            <ShieldAlert size={20} color="$red9" />
          ) : (
            <Circle size={8} backgroundColor="$blue9" marginTop={6} />
          )}
        </YStack>

        <YStack flex={1} space="$1">
          <Text
            fontSize="$3"
            fontWeight="800"
            color={isCritical ? "$red11" : "$blue11"}
          >
            {isCritical ? "Acción Requerida" : "Recomendación Nova"}
          </Text>
          <Text
            fontSize="$3"
            color={isCritical ? "$red11" : "$blue11"}
            lineHeight={20}
            opacity={0.9}
          >
            {analysis.advice}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
};
