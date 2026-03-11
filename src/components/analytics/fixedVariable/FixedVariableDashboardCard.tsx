import React from "react";
import { Spinner, Text, XStack, YStack } from "tamagui";
import { formatCurrencyAmount } from "../../../utils/currency";
import {
  FixedVariableMonthData,
  TrendWindowMonths,
} from "../../../hooks/analytics/useFixedVariableTrend";
import { TrendWindowSwitch } from "./TrendWindowSwitch";
import { FixedVariableTrendRow } from "./FixedVariableTrendRow";
import { DisplayHeading } from "../../ui/DisplayHeading";

interface FixedVariableDashboardCardProps {
  data: FixedVariableMonthData[];
  isLoading: boolean;
  error?: string | null;
  currency: string;
  selectedWindow: TrendWindowMonths;
  onWindowChange: (value: TrendWindowMonths) => void;
  colors: {
    surface: string;
    page: string;
    border: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
    fixed: string;
    fixedSoft: string;
    variable: string;
    variableSoft: string;
  };
}

const safePercent = (value: number, total: number) => {
  if (!Number.isFinite(value) || !Number.isFinite(total) || total <= 0) return 0;
  return (value / total) * 100;
};

const percentDelta = (current: number, previous: number) => {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const formatDelta = (value: number) =>
  `${value > 0 ? "+" : ""}${Number(value.toFixed(1))}%`;

const getInsight = (
  current: FixedVariableMonthData | undefined,
  previous: FixedVariableMonthData | undefined
) => {
  if (!current || current.total <= 0) {
    return "Aun no hay gasto registrado para construir una tendencia.";
  }

  const fixedShare = safePercent(current.fixed, current.total);

  if (!previous || previous.total <= 0) {
    return `Tu base actual es ${Math.round(
      fixedShare
    )}% fija y ${Math.round(100 - fixedShare)}% variable.`;
  }

  const variableDelta = percentDelta(current.variable, previous.variable);
  const fixedDelta = percentDelta(current.fixed, previous.fixed);

  if (variableDelta >= 10) {
    return `Tus gastos variables subieron ${formatDelta(
      variableDelta
    )} vs el mes anterior.`;
  }

  if (variableDelta <= -10) {
    return `Buen ajuste: los variables bajaron ${formatDelta(variableDelta)}.`;
  }

  if (fixedShare >= 65) {
    return "El peso fijo es alto, revisa suscripciones y compromisos mensuales.";
  }

  if (fixedDelta <= -8) {
    return `Reduciste gastos fijos ${formatDelta(fixedDelta)} este periodo.`;
  }

  return "Tu mezcla fijo/variable esta estable frente al mes anterior.";
};

export const FixedVariableDashboardCard = ({
  data,
  isLoading,
  error,
  currency,
  selectedWindow,
  onWindowChange,
  colors,
}: FixedVariableDashboardCardProps) => {
  const current = data[data.length - 1];
  const previous = data.length > 1 ? data[data.length - 2] : undefined;
  const fixedShare = safePercent(current?.fixed || 0, current?.total || 0);
  const variableShare = safePercent(current?.variable || 0, current?.total || 0);
  const fixedToVariableRatio =
    (current?.variable || 0) > 0
      ? (current?.fixed || 0) / (current?.variable || 1)
      : null;
  const variableDelta = percentDelta(
    current?.variable || 0,
    previous?.variable || 0
  );
  const insight = getInsight(current, previous);

  return (
    <YStack
      width="100%"
      paddingHorizontal="$0.5"
      paddingVertical="$1"
      space="$3"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} paddingRight="$2" space="$1">
          <DisplayHeading
            fontSize="$6"
            fontWeight="400"
            color={colors.ink}
            lineHeight={26}
          >
            Fijo vs Variable
          </DisplayHeading>
          <Text fontSize={12} color={colors.muted}>
            Tendencia de gasto mensual
          </Text>
        </YStack>
        <TrendWindowSwitch
          value={selectedWindow}
          onChange={onWindowChange}
          colors={{
            surface: colors.surface,
            accent: colors.accent,
            accentSoft: colors.accentSoft,
            ink: colors.ink,
            muted: colors.muted,
          }}
        />
      </XStack>

      {isLoading ? (
        <YStack
          minHeight={170}
          alignItems="center"
          justifyContent="center"
          space="$2"
        >
          <Spinner size="small" color={colors.accent} />
          <Text fontSize="$3" color={colors.muted}>
            Actualizando tendencia...
          </Text>
        </YStack>
      ) : (
        <YStack space="$3">
          <XStack space="$2">
            <YStack
              flex={1}
              borderRadius="$8"
              backgroundColor={colors.fixedSoft}
              borderWidth={1}
              borderColor={colors.fixed}
              padding="$3"
              space="$1"
            >
              <Text fontSize={12} fontWeight="700" color={colors.fixed}>
                Gasto fijo
              </Text>
              <Text fontSize="$4" fontWeight="800" color={colors.ink}>
                {formatCurrencyAmount(current?.fixed || 0, currency)}
              </Text>
              <Text fontSize={12} color={colors.ink}>
                {Math.round(fixedShare)}% del mes
              </Text>
            </YStack>

            <YStack
              flex={1}
              borderRadius="$8"
              backgroundColor={colors.variableSoft}
              borderWidth={1}
              borderColor={colors.variable}
              padding="$3"
              space="$1"
            >
              <Text fontSize={12} fontWeight="700" color={colors.variable}>
                Gasto variable
              </Text>
              <Text fontSize="$4" fontWeight="800" color={colors.ink}>
                {formatCurrencyAmount(current?.variable || 0, currency)}
              </Text>
              <Text fontSize={12} color={colors.ink}>
                {Math.round(variableShare)}% del mes
              </Text>
            </YStack>
          </XStack>

          <YStack
            borderRadius="$8"
            backgroundColor={colors.page}
            padding="$3"
            space="$1"
          >
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={12} fontWeight="700" color={colors.ink}>
                Ratio fijo / variable
              </Text>
              <Text fontSize={12} fontWeight="800" color={colors.ink}>
                {fixedToVariableRatio === null
                  ? "Sin base"
                  : `${fixedToVariableRatio.toFixed(2)}x`}
              </Text>
            </XStack>
            <Text fontSize={12} color={colors.muted}>
              Variables vs mes anterior: {formatDelta(variableDelta)}
            </Text>
          </YStack>

          <YStack
            backgroundColor={colors.page}
            borderRadius="$8"
            padding="$3"
            space="$2.5"
          >
            <YStack space="$0.5">
              <Text fontSize={12} fontWeight="800" color={colors.ink}>
                Trayectoria mensual
              </Text>
              <Text fontSize={12} color={colors.muted}>
                Composición y total por cada mes.
              </Text>
            </YStack>

            <YStack space="$2">
              {data.map((row) => (
                <FixedVariableTrendRow
                  key={row.id}
                  monthData={row}
                  currency={currency}
                  colors={{
                    border: colors.border,
                    surface: colors.surface,
                    page: colors.page,
                    accent: colors.accent,
                    accentSoft: colors.accentSoft,
                    fixed: colors.fixed,
                    fixedSoft: colors.fixedSoft,
                    variable: colors.variable,
                    variableSoft: colors.variableSoft,
                    ink: colors.ink,
                    muted: colors.muted,
                  }}
                />
              ))}
            </YStack>
          </YStack>

          <YStack
            borderRadius="$8"
            backgroundColor={colors.accentSoft}
            borderWidth={1}
            borderColor={colors.accent}
            padding="$3"
            space="$1"
          >
            <Text fontSize={12} fontWeight="800" color={colors.accent}>
              INSIGHT
            </Text>
            <Text fontSize={12} color={colors.ink}>
              {error || insight}
            </Text>
          </YStack>
        </YStack>
      )}
    </YStack>
  );
};
