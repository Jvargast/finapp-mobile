import React from "react";
import { Circle, Stack, Text, XStack, YStack } from "tamagui";
import { formatCurrencyAmount } from "../../../utils/currency";
import { FixedVariableMonthData } from "../../../hooks/analytics/useFixedVariableTrend";

interface FixedVariableTrendRowProps {
  monthData: FixedVariableMonthData;
  currency: string;
  colors: {
    border: string;
    surface: string;
    page: string;
    accent: string;
    accentSoft: string;
    fixed: string;
    fixedSoft: string;
    variable: string;
    variableSoft: string;
    ink: string;
    muted: string;
  };
}

const formatPercent = (value: number) => `${Math.round(value)}%`;

export const FixedVariableTrendRow = ({
  monthData,
  currency,
  colors,
}: FixedVariableTrendRowProps) => {
  const total = monthData.total;
  const hasSpend = total > 0;
  const fixedWidth = total > 0 ? (monthData.fixed / total) * 100 : 0;
  const variableWidth = total > 0 ? 100 - fixedWidth : 0;
  const monthLabel = `${monthData.shortLabel} ${monthData.year}`;
  const monthTitle =
    monthData.label.charAt(0).toUpperCase() + monthData.label.slice(1);

  return (
    <YStack
      borderRadius="$10"
      backgroundColor={colors.surface}
      borderWidth={1}
      borderColor={colors.border}
      padding="$2.5"
      space="$2"
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" space="$2.5" flex={1} paddingRight="$2">
          <YStack
            backgroundColor={colors.accentSoft}
            borderRadius="$6"
            borderWidth={1}
            borderColor={colors.accent}
            paddingHorizontal="$1.5"
            paddingVertical="$1"
            minWidth={64}
            alignItems="center"
          >
            <Text
              fontSize={12}
              fontWeight="800"
              color={colors.accent}
              letterSpacing={0.5}
            >
              {monthLabel}
            </Text>
          </YStack>
          <YStack flex={1}>
            <Text fontSize={13} fontWeight="700" color={colors.ink} numberOfLines={1}>
              {monthTitle}
            </Text>
            <Text fontSize={12} color={colors.muted}>
              Total mensual
            </Text>
          </YStack>
        </XStack>

        <Text fontSize={13} fontWeight="800" color={colors.ink}>
          {formatCurrencyAmount(monthData.total, currency)}
        </Text>
      </XStack>

      <YStack space="$1.5">
        <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={12} fontWeight="700" color={colors.muted}>
            Composición
          </Text>
          <XStack alignItems="center" space="$2.5">
            <XStack alignItems="center" space="$1">
              <Circle size={5} backgroundColor={colors.fixed} />
              <Text fontSize={12} color={colors.ink} fontWeight="700">
                {formatPercent(monthData.fixedPercent)}
              </Text>
            </XStack>
            <XStack alignItems="center" space="$1">
              <Circle size={5} backgroundColor={colors.variable} />
              <Text fontSize={12} color={colors.ink} fontWeight="700">
                {formatPercent(monthData.variablePercent)}
              </Text>
            </XStack>
          </XStack>
        </XStack>
        <Stack
          height={8}
          borderRadius={999}
          backgroundColor={colors.page}
          overflow="hidden"
        >
          {hasSpend && (
            <XStack flex={1}>
              <Stack
                height="100%"
                width={`${Math.max(fixedWidth, 0)}%`}
                backgroundColor={colors.fixed}
              />
              <Stack
                height="100%"
                width={`${Math.max(variableWidth, 0)}%`}
                backgroundColor={colors.variable}
              />
            </XStack>
          )}
        </Stack>
      </YStack>

      {hasSpend ? (
        <XStack space="$2">
          <YStack
            flex={1}
            borderRadius="$6"
            backgroundColor={colors.fixedSoft}
            borderWidth={1}
            borderColor={colors.fixed}
            paddingVertical="$1.5"
            paddingHorizontal="$2"
            space="$0.5"
          >
            <Text fontSize={12} fontWeight="700" color={colors.fixed}>
              Gasto fijo
            </Text>
            <Text fontSize={12} fontWeight="800" color={colors.ink}>
              {formatCurrencyAmount(monthData.fixed, currency)}
            </Text>
          </YStack>

          <YStack
            flex={1}
            borderRadius="$6"
            backgroundColor={colors.variableSoft}
            borderWidth={1}
            borderColor={colors.variable}
            paddingVertical="$1.5"
            paddingHorizontal="$2"
            space="$0.5"
          >
            <Text fontSize={12} fontWeight="700" color={colors.variable}>
              Gasto variable
            </Text>
            <Text fontSize={12} fontWeight="800" color={colors.ink}>
              {formatCurrencyAmount(monthData.variable, currency)}
            </Text>
          </YStack>
        </XStack>
      ) : (
        <Text fontSize={12} color={colors.muted}>
          Sin movimientos en este mes
        </Text>
      )}
    </YStack>
  );
};
