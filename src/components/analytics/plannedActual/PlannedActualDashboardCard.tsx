import React from "react";
import { LinearGradient } from "@tamagui/linear-gradient";
import { AlertTriangle, CheckCircle2, TrendingUp } from "@tamagui/lucide-icons";
import { Circle, Spinner, Stack, Text, XStack, YStack } from "tamagui";
import { formatCurrencyAmount } from "../../../utils/currency";
import { getIcon } from "../../../utils/iconMap";
import { PlannedActualChartRow } from "./PlannedActualChartRow";
import {
  PlannedActualCardColors,
  PlannedActualCategoryRow,
} from "./types";
import { DisplayHeading } from "../../ui/DisplayHeading";

interface PlannedActualDashboardCardProps {
  rows: PlannedActualCategoryRow[];
  isLoading: boolean;
  currency: string;
  monthLabel: string;
  scopeLabel: string;
  colors: PlannedActualCardColors;
}

const getStatusCopy = (variance: number, currency: string) => {
  if (variance > 0) {
    return `Estas sobre el plan por ${formatCurrencyAmount(variance, currency)}.`;
  }

  if (variance < 0) {
    return `Vas dejando ${formatCurrencyAmount(Math.abs(variance), currency)} de holgura.`;
  }

  return "El gasto va exactamente alineado con lo planificado.";
};

const getVarianceLabel = (value: number, currency: string) =>
  `${value >= 0 ? "+" : "-"}${formatCurrencyAmount(Math.abs(value), currency)}`;

const SummaryPill = ({
  label,
  value,
  color,
  soft,
}: {
  label: string;
  value: number;
  color: string;
  soft: string;
}) => (
  <YStack
    flex={1}
    minWidth={88}
    backgroundColor={soft}
    borderRadius="$6"
    borderWidth={1}
    borderColor={color}
    padding="$2.5"
    space="$0.5"
  >
    <Text fontSize={12} fontWeight="800" color={color}>
      {label}
    </Text>
    <Text fontSize="$4" fontWeight="900" color={color}>
      {value}
    </Text>
  </YStack>
);

const TableCell = ({
  children,
  align = "left",
  color,
  weight = "700",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
  color: string;
  weight?: "600" | "700" | "800";
}) => (
  <Text
    flex={1}
    fontSize={12}
    fontWeight={weight}
    color={color}
    textAlign={align}
  >
    {children}
  </Text>
);

export const PlannedActualDashboardCard = ({
  rows,
  isLoading,
  currency,
  monthLabel,
  scopeLabel,
  colors,
}: PlannedActualDashboardCardProps) => {
  const totalPlanned = rows.reduce((sum, row) => sum + row.planned, 0);
  const totalActual = rows.reduce((sum, row) => sum + row.actual, 0);
  const variance = totalActual - totalPlanned;
  const utilization = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;
  const maxValue = rows.reduce(
    (max, row) => Math.max(max, row.actual, row.planned),
    0
  );
  const overRows = rows.filter((row) => row.status === "OVER");
  const riskRows = rows.filter((row) => row.status === "RISK");
  const onTrackRows = rows.filter((row) => row.status === "ON_TRACK");
  const topOverspend = [...rows]
    .filter((row) => row.variance > 0)
    .sort((a, b) => b.variance - a.variance)[0];
  const bestControlled = [...rows]
    .filter((row) => row.variance < 0)
    .sort((a, b) => a.variance - b.variance)[0];
  const heroTone =
    variance > 0 ? colors.danger : variance < 0 ? colors.good : colors.accent;
  const utilizationWidth =
    totalPlanned > 0 ? `${Math.min(utilization, 100)}%` : "0%";

  if (isLoading) {
    return (
      <YStack
        width="100%"
        minHeight={280}
        alignItems="center"
        justifyContent="center"
        space="$2"
      >
        <Spinner size="small" color={colors.accent} />
        <Text fontSize="$3" color={colors.muted}>
          Cruzando presupuestos con gasto real...
        </Text>
      </YStack>
    );
  }

  if (rows.length === 0) {
    return (
      <YStack width="100%" paddingHorizontal="$0.5" paddingVertical="$1">
        <YStack
          backgroundColor={colors.surface}
          borderRadius="$10"
          borderWidth={1}
          borderColor={colors.border}
          padding="$4"
          space="$2"
        >
          <DisplayHeading
            fontSize="$6"
            fontWeight="400"
            color={colors.ink}
            lineHeight={26}
          >
            Presupuesto planificado vs real
          </DisplayHeading>
          <Text fontSize="$3" color={colors.muted}>
            No hay presupuestos para esta combinacion de mes y filtros.
          </Text>
        </YStack>
      </YStack>
    );
  }

  return (
    <YStack
      width="100%"
      paddingHorizontal="$0.5"
      paddingVertical="$1"
      space="$3"
    >
      <Stack
        overflow="hidden"
        borderRadius="$10"
        borderWidth={1}
        borderColor={colors.border}
      >
        <LinearGradient
          colors={[colors.heroStart, colors.heroEnd]}
          start={[0, 0]}
          end={[1, 1]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <Stack
          position="absolute"
          top={-36}
          right={-26}
          width={148}
          height={148}
          borderRadius={999}
          backgroundColor={colors.glow}
        />
        <Stack
          position="absolute"
          bottom={-54}
          left={-24}
          width={180}
          height={180}
          borderRadius={999}
          backgroundColor={colors.glowSoft}
        />

        <YStack padding="$4" space="$4">
          <XStack alignItems="flex-start" justifyContent="space-between" space="$3">
            <YStack flex={1} space="$1">
              <DisplayHeading
                fontSize="$6"
                fontWeight="400"
                color={colors.ink}
                lineHeight={26}
              >
                Presupuesto planificado vs real
              </DisplayHeading>
              <Text fontSize="$3" color={colors.muted}>
                {monthLabel} · {scopeLabel}
              </Text>
            </YStack>

            <Circle
              size={44}
              backgroundColor="rgba(255,255,255,0.48)"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.4)"
            >
              {variance > 0 ? (
                <AlertTriangle size={18} color={heroTone} />
              ) : variance < 0 ? (
                <CheckCircle2 size={18} color={heroTone} />
              ) : (
                <TrendingUp size={18} color={heroTone} />
              )}
            </Circle>
          </XStack>

          <XStack alignItems="flex-end" justifyContent="space-between" space="$3">
            <YStack flex={1} space="$1">
              <Text fontSize={12} fontWeight="800" color={colors.muted}>
                GASTO REAL
              </Text>
              <Text fontSize={34} fontWeight="900" color={colors.ink} numberOfLines={1}>
                {formatCurrencyAmount(totalActual, currency)}
              </Text>
              <Text fontSize="$3" color={colors.ink}>
                de {formatCurrencyAmount(totalPlanned, currency)} planificados
              </Text>
            </YStack>

            <YStack
              alignItems="flex-end"
              backgroundColor="rgba(255,255,255,0.48)"
              borderWidth={1}
              borderColor="rgba(255,255,255,0.58)"
              borderRadius="$6"
              padding="$2.5"
              space="$0.5"
            >
              <Text fontSize={12} fontWeight="800" color={heroTone}>
                DELTA TOTAL
              </Text>
              <Text fontSize="$4" fontWeight="900" color={heroTone}>
                {getVarianceLabel(variance, currency)}
              </Text>
            </YStack>
          </XStack>

          <YStack space="$1.5">
            <XStack alignItems="center" justifyContent="space-between">
              <Text fontSize={12} fontWeight="700" color={colors.muted}>
                Consumo del plan
              </Text>
              <Text fontSize={12} fontWeight="800" color={colors.ink}>
                {Math.round(utilization)}%
              </Text>
            </XStack>
            <Stack
              height={12}
              backgroundColor="rgba(255,255,255,0.42)"
              borderRadius={999}
              overflow="hidden"
            >
              <Stack
                height="100%"
                width={utilizationWidth}
                backgroundColor={heroTone}
                borderRadius={999}
              />
            </Stack>
            <Text fontSize={12} color={colors.ink}>
              {getStatusCopy(variance, currency)}
            </Text>
          </YStack>

          <XStack space="$2">
            <SummaryPill
              label="En linea"
              value={onTrackRows.length}
              color={colors.good}
              soft={colors.goodSoft}
            />
            <SummaryPill
              label="En riesgo"
              value={riskRows.length}
              color={colors.warn}
              soft={colors.warnSoft}
            />
            <SummaryPill
              label="Excedidos"
              value={overRows.length}
              color={colors.danger}
              soft={colors.dangerSoft}
            />
          </XStack>
        </YStack>
      </Stack>

      <YStack
        backgroundColor={colors.surface}
        borderRadius="$10"
        borderWidth={1}
        borderColor={colors.border}
        padding="$4"
        space="$3"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <YStack flex={1} paddingRight="$3">
            <Text fontSize="$4" fontWeight="800" color={colors.ink}>
              Lectura visual por categoria
            </Text>
            <Text fontSize={12} color={colors.muted}>
              Comparacion directa entre lo previsto y lo ya consumido.
            </Text>
          </YStack>
          <Text fontSize={12} fontWeight="700" color={colors.ink}>
            Top {Math.min(rows.length, 6)}
          </Text>
        </XStack>

        <YStack space="$2.5">
          {rows.slice(0, 6).map((row) => (
            <PlannedActualChartRow
              key={row.id}
              row={row}
              currency={currency}
              maxValue={maxValue}
              colors={colors}
            />
          ))}
        </YStack>
      </YStack>

      <YStack
        backgroundColor={colors.surface}
        borderRadius="$10"
        borderWidth={1}
        borderColor={colors.border}
        padding="$4"
        space="$3"
      >
        <YStack space="$1">
          <Text fontSize="$4" fontWeight="800" color={colors.ink}>
            Tabla por categoria
          </Text>
          <Text fontSize={12} color={colors.muted}>
            Plan, ejecucion y desviacion para cada presupuesto activo del mes.
          </Text>
        </YStack>

        <XStack
          alignItems="center"
          paddingBottom="$1.5"
          borderBottomWidth={1}
          borderBottomColor={colors.border}
          space="$2"
        >
          <Text flex={1.8} fontSize={12} fontWeight="800" color={colors.muted}>
            CATEGORIA
          </Text>
          <TableCell color={colors.muted} align="right" weight="800">
            PLAN
          </TableCell>
          <TableCell color={colors.muted} align="right" weight="800">
            REAL
          </TableCell>
          <TableCell color={colors.muted} align="right" weight="800">
            DELTA
          </TableCell>
        </XStack>

        <YStack space="$2">
          {rows.map((row) => {
            const Icon = getIcon(row.icon || "HelpCircle");

            return (
              <XStack
                key={row.id}
                alignItems="center"
                space="$2"
                paddingVertical="$1.5"
                borderBottomWidth={1}
                borderBottomColor={colors.border}
              >
                <XStack flex={1.8} alignItems="center" space="$2.5">
                  <Circle
                    size={28}
                    backgroundColor={colors.page}
                    borderWidth={1}
                    borderColor={row.color}
                  >
                    <Icon size={14} color={row.color} strokeWidth={2} />
                  </Circle>
                  <YStack flex={1} minWidth={0}>
                    <Text
                      fontSize={12}
                      fontWeight="800"
                      color={colors.ink}
                      numberOfLines={1}
                    >
                      {row.name}
                    </Text>
                    <Text fontSize={12} color={colors.muted}>
                      {Math.round(row.utilization)}% usado
                    </Text>
                  </YStack>
                </XStack>

                <TableCell color={colors.ink} align="right">
                  {formatCurrencyAmount(row.planned, currency)}
                </TableCell>
                <TableCell color={colors.ink} align="right">
                  {formatCurrencyAmount(row.actual, currency)}
                </TableCell>
                <TableCell
                  color={
                    row.status === "OVER"
                      ? colors.danger
                      : row.status === "RISK"
                        ? colors.warn
                        : colors.good
                  }
                  align="right"
                  weight="800"
                >
                  {getVarianceLabel(row.variance, currency)}
                </TableCell>
              </XStack>
            );
          })}
        </YStack>
      </YStack>

      <YStack
        backgroundColor={colors.accentSoft}
        borderRadius="$10"
        borderWidth={1}
        borderColor={colors.accent}
        padding="$4"
        space="$2"
      >
        <Text fontSize={12} fontWeight="800" color={colors.accent}>
          INSIGHT
        </Text>
        <Text fontSize="$3" color={colors.ink}>
          {topOverspend
            ? `${topOverspend.name} es la categoria mas tensionada con ${getVarianceLabel(
                topOverspend.variance,
                currency
              )} sobre el plan.`
            : "Todavia no hay categorias sobre el plan este mes."}
        </Text>
        <Text fontSize="$3" color={colors.ink}>
          {bestControlled
            ? `${bestControlled.name} va mejor controlada con ${formatCurrencyAmount(
                Math.abs(bestControlled.variance),
                currency
              )} de margen disponible.`
            : "Cuando una categoria quede bajo su plan, la mostraremos aqui."}
        </Text>
      </YStack>
    </YStack>
  );
};
