import React from "react";
import { Circle, Stack, Text, XStack, YStack } from "tamagui";
import { formatCurrencyAmount } from "../../../utils/currency";
import { getIcon } from "../../../utils/iconMap";
import {
  PlannedActualCardColors,
  PlannedActualCategoryRow,
} from "./types";

const MIN_BAR_PERCENT = 4;

const toPercentWidth = (value: number, maxValue: number) => {
  if (!Number.isFinite(value) || value <= 0 || maxValue <= 0) return "0%";
  const percent = (value / maxValue) * 100;
  return `${Math.max(percent, MIN_BAR_PERCENT)}%`;
};

const getTone = (
  status: PlannedActualCategoryRow["status"],
  colors: PlannedActualCardColors
) => {
  switch (status) {
    case "OVER":
      return {
        color: colors.danger,
        soft: colors.dangerSoft,
        label: "Excedido",
      };
    case "RISK":
      return {
        color: colors.warn,
        soft: colors.warnSoft,
        label: "En riesgo",
      };
    default:
      return {
        color: colors.good,
        soft: colors.goodSoft,
        label: "En linea",
      };
  }
};

const formatDelta = (value: number, currency: string) =>
  `${value >= 0 ? "+" : "-"}${formatCurrencyAmount(Math.abs(value), currency)}`;

interface PlannedActualChartRowProps {
  row: PlannedActualCategoryRow;
  currency: string;
  maxValue: number;
  colors: PlannedActualCardColors;
}

export const PlannedActualChartRow = ({
  row,
  currency,
  maxValue,
  colors,
}: PlannedActualChartRowProps) => {
  const Icon = getIcon(row.icon || "HelpCircle");
  const tone = getTone(row.status, colors);

  return (
    <YStack
      backgroundColor={colors.page}
      borderRadius="$8"
      borderWidth={1}
      borderColor={colors.border}
      padding="$3"
      space="$2"
    >
      <XStack alignItems="center" justifyContent="space-between" space="$2">
        <XStack alignItems="center" space="$3" flex={1}>
          <Circle
            size={38}
            backgroundColor={colors.surface}
            borderWidth={1}
            borderColor={row.color}
          >
            <Icon size={18} color={row.color} strokeWidth={2} />
          </Circle>
          <YStack flex={1} minWidth={0}>
            <Text fontSize="$3" fontWeight="800" color={colors.ink} numberOfLines={1}>
              {row.name}
            </Text>
            <Text fontSize={12} color={colors.muted}>
              {tone.label} · {Math.round(row.utilization)}% del plan
            </Text>
          </YStack>
        </XStack>

        <YStack alignItems="flex-end">
          <Text fontSize="$4" fontWeight="800" color={colors.ink}>
            {formatCurrencyAmount(row.actual, currency)}
          </Text>
          <Text fontSize={12} color={colors.muted}>
            de {formatCurrencyAmount(row.planned, currency)}
          </Text>
        </YStack>
      </XStack>

      <YStack space="$1.5">
        <YStack space="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontWeight="700" color={colors.muted}>
              PLANIFICADO
            </Text>
            <Text fontSize={12} fontWeight="700" color={colors.muted}>
              {formatCurrencyAmount(row.planned, currency)}
            </Text>
          </XStack>
          <Stack
            height={8}
            backgroundColor={colors.surface}
            borderRadius={999}
            overflow="hidden"
          >
            <Stack
              height="100%"
              width={toPercentWidth(row.planned, maxValue)}
              backgroundColor={colors.accentSoft}
              borderRadius={999}
              borderWidth={1}
              borderColor={colors.accent}
            />
          </Stack>
        </YStack>

        <YStack space="$1">
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize={12} fontWeight="700" color={tone.color}>
              REAL
            </Text>
            <Text fontSize={12} fontWeight="700" color={tone.color}>
              {formatCurrencyAmount(row.actual, currency)}
            </Text>
          </XStack>
          <Stack
            height={10}
            backgroundColor={colors.surface}
            borderRadius={999}
            overflow="hidden"
          >
            <Stack
              height="100%"
              width={toPercentWidth(row.actual, maxValue)}
              backgroundColor={tone.color}
              borderRadius={999}
            />
          </Stack>
        </YStack>
      </YStack>

      <XStack alignItems="center" justifyContent="space-between">
        <Text fontSize={12} color={colors.muted}>
          Umbral {Math.round(row.warningThreshold)}%
        </Text>
        <Text fontSize={12} fontWeight="800" color={tone.color}>
          Delta {formatDelta(row.variance, currency)}
        </Text>
      </XStack>
    </YStack>
  );
};
