import React, { useMemo } from "react";
import { YStack, XStack, Text, Card, Progress, Circle } from "tamagui";
import {
  CalendarClock,
  Unlock,
  TrendingDown,
  Banknote,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
} from "@tamagui/lucide-icons";
import { DebtAnalysis, GoalTransaction } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { isSameMonth, isSameYear } from "date-fns";

interface DebtDetailViewProps {
  analysis: DebtAnalysis;
  currency: string;
  transactions?: GoalTransaction[];
  deadline?: string | Date;
}

export const DebtDetailView = ({
  analysis,
  currency,
  transactions = [],
  deadline,
}: DebtDetailViewProps) => {
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

  const minQuota = analysis.minimumPayment || 0;
  const progress =
    minQuota > 0 ? Math.min((paidThisMonth / minQuota) * 100, 100) : 0;
  const isPaid = progress >= 100;
  const currentMonthName = new Date().toLocaleString("es-CL", {
    month: "long",
  });
  const { nextPaymentDate, isOverdue, daysUntilDue } = analysis;
  let headerColor = "$gray11";
  let badgeColor = "$gray4";
  let badgeTextColor = "$gray11";
  let badgeText = "PENDIENTE";
  let badgeIcon = <AlertTriangle size={12} color="$gray11" />;
  let cardBg = "$gray2";
  let cardBorder = "$gray5";

  if (isPaid) {
    headerColor = "$green11";
    badgeColor = "$green4";
    badgeTextColor = "$green11";
    badgeText = "AL DÍA ✅";
    badgeIcon = <CheckCircle2 size={12} color="$green11" />;
    cardBg = "$green2";
    cardBorder = "$green5";
  } else if (isOverdue) {
    headerColor = "$red11";
    badgeColor = "$red4";
    badgeTextColor = "$red11";
    badgeText = "¡VENCIDO! 🚨";
    badgeIcon = <ShieldAlert size={12} color="$red11" />;
    cardBg = "$red2";
    cardBorder = "$red5";
  } else if (daysUntilDue !== undefined && daysUntilDue <= 3) {
    headerColor = "$orange11";
    badgeColor = "$orange4";
    badgeTextColor = "$orange11";
    badgeText = `VENCE EN ${daysUntilDue} DÍAS ⏰`;
    cardBg = "$orange2";
    cardBorder = "$orange5";
  }

  const dueDateDisplay = nextPaymentDate
    ? new Date(nextPaymentDate).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
      })
    : null;

  const isCritical =
    analysis.status === "CRITICAL" || analysis.status === "IMPOSSIBLE";
  const isOnTrack =
    analysis.status === "ON_TRACK" || analysis.status === "COMPLETED";

  const months = analysis.monthsToFree || 0;
  const freedomDate = new Date();
  freedomDate.setMonth(freedomDate.getMonth() + months);

  const monthsCalc = analysis.monthsToFree || 0;
  const isUnknown = analysis.status === "UNKNOWN";
  const officialEndDate = deadline ? new Date(deadline) : null;
  const calculatedEndDate = new Date();
  calculatedEndDate.setMonth(calculatedEndDate.getMonth() + monthsCalc);

  let displayDate =
    isUnknown || monthsCalc === 0 ? officialEndDate : calculatedEndDate;

  if (!displayDate) displayDate = new Date();

  const dateString = displayDate.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const now = new Date();
  const monthsDiff =
    (displayDate.getFullYear() - now.getFullYear()) * 12 +
    (displayDate.getMonth() - now.getMonth());
  const finalMonths = Math.max(0, monthsDiff);

  let timeString = `${finalMonths} Meses`;
  if (finalMonths > 12) {
    timeString = `${Math.floor(finalMonths / 12)}a ${finalMonths % 12}m`;
  }

  const mainColor = isOnTrack ? "$green9" : "$red9";
  const softColor = isOnTrack ? "$green2" : "$red2";
  const textColor = isOnTrack ? "$green11" : "$red11";

  return (
    <YStack space="$3">
      <Card
        bordered
        borderWidth={1}
        borderColor={cardBorder}
        padding="$4"
        backgroundColor={cardBg}
      >
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$2"
        >
          <YStack>
            <Text
              fontSize="$3"
              fontWeight="800"
              color={headerColor}
              textTransform="capitalize"
            >
              Cuota de {currentMonthName}
            </Text>
            {!isPaid && dueDateDisplay && (
              <Text fontSize={11} color={headerColor} opacity={0.8}>
                Vence el {dueDateDisplay}
              </Text>
            )}
          </YStack>

          <XStack
            space="$1"
            alignItems="center"
            backgroundColor={badgeColor}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
          >
            {badgeIcon}
            <Text fontSize={10} fontWeight="bold" color={badgeTextColor}>
              {badgeText}
            </Text>
          </XStack>
        </XStack>

        <XStack alignItems="flex-end" space="$2">
          <Text
            fontSize="$8"
            fontWeight="900"
            color={isPaid ? "$green10" : headerColor}
          >
            {formatGoalAmount(paidThisMonth, currency)}
          </Text>
          <Text fontSize="$3" color={headerColor} marginBottom={4}>
            / {formatGoalAmount(minQuota, currency)}
          </Text>
        </XStack>

        <Progress
          value={progress}
          size="$2"
          backgroundColor="rgba(0,0,0,0.1)"
          marginTop="$2"
        >
          <Progress.Indicator
            backgroundColor={isPaid ? "$green9" : "$orange9"}
            animation="bouncy"
          />
        </Progress>
      </Card>

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
            {isOnTrack && monthsCalc > 0 && (
              <Text
                fontSize={10}
                fontWeight="800"
                color={textColor}
                textTransform="uppercase"
              >
                MEJORADO
              </Text>
            )}
          </XStack>

          <YStack marginTop="$2">
            <Text fontSize="$2" color="$gray11" fontWeight="600">
              Libertad Estimada
            </Text>
            <Text
              fontSize="$7"
              fontWeight="900"
              color={mainColor}
              lineHeight={32}
              adjustsFontSizeToFit
              numberOfLines={1}
            >
              {timeString}
            </Text>
            <Text fontSize="$3" color="$gray10" fontWeight="500">
              {monthsCalc > 0
                ? `Proyección: ${dateString}`
                : `Fecha pactada: ${dateString}`}
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
              Pago Inteligente
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
              PARA SALIR ANTES
            </Text>
          </YStack>
        </Card>
      </XStack>

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
            {isCritical ? "Acción Requerida" : "Análisis WOU Finance"}
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
