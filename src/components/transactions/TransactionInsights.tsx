import React, { useMemo } from "react";
import { YStack, XStack, Text, Stack, Progress, Separator } from "tamagui";
import { TrendingUp, PieChart, AlertCircle } from "@tamagui/lucide-icons";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { Transaction } from "../../types/transaction.types";

interface TransactionInsightsProps {
  transaction: Transaction;
  budget?: Transaction["budget"];
}

export const TransactionInsights = ({
  transaction,
  budget,
}: TransactionInsightsProps) => {
  const transactions = useTransactionStore((state) => state.transactions);

  const categoryStats = useMemo(() => {
    const txDate = new Date(transaction.date);
    const month = txDate.getMonth();
    const year = txDate.getFullYear();

    const relevantTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return (
        d.getMonth() === month &&
        d.getFullYear() === year &&
        t.categoryId === transaction.categoryId &&
        (t.type === "EXPENSE" || t.type === "TRANSFER")
      );
    });

    const total = relevantTransactions.reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );
    const count = relevantTransactions.length;

    return { total, count };
  }, [transactions, transaction]);

  if (transaction.type === "INCOME") return null;

  const budgetLimit = Number(budget?.amount || 0);
  const currentAmount = Number(transaction.amount);

  const totalSpent = categoryStats.total;

  const currentPercent =
    budgetLimit > 0 ? (currentAmount / budgetLimit) * 100 : 0;

  const previousPercent =
    budgetLimit > 0 ? ((totalSpent - currentAmount) / budgetLimit) * 100 : 0;

  return (
    <YStack space="$4">
      <Text
        fontSize={13}
        fontWeight="700"
        color="$gray10"
        textTransform="uppercase"
      >
        Análisis del Gasto
      </Text>

      <YStack
        backgroundColor="$color2"
        borderRadius="$6"
        padding="$3"
        borderWidth={1}
        borderColor="$borderColor"
        space="$4"
      >
        {budget ? (
          <YStack space="$2">
            <XStack justifyContent="space-between">
              <XStack space="$2" alignItems="center">
                <PieChart size={16} color="$purple10" />
                <Text fontSize={12} color="$gray11" fontWeight="600">
                  Impacto en {budget.name}
                </Text>
              </XStack>
              <Text fontSize={12} color="$purple10" fontWeight="800">
                {currentPercent.toFixed(1)}%
              </Text>
            </XStack>
            <Stack
              height={8}
              backgroundColor="$gray4"
              borderRadius={10}
              overflow="hidden"
              position="relative"
            >
              <Stack
                position="absolute"
                left={0}
                height="100%"
                width={`${Math.min(previousPercent, 100)}%`}
                backgroundColor="$purple8"
                opacity={0.3}
              />

              <Stack
                position="absolute"
                left={`${Math.min(previousPercent, 100)}%`}
                height="100%"
                width={`${Math.min(currentPercent, 100 - previousPercent)}%`}
                backgroundColor="$purple10"
              />
            </Stack>
            <Text fontSize={10} color="$gray10" lineHeight={14}>
              Este movimiento consumió el{" "}
              <Text fontWeight="800">
                {((Number(transaction.amount) / budget.amount) * 100).toFixed(
                  1
                )}
                %
              </Text>{" "}
              de tu presupuesto mensual asignado.
            </Text>
          </YStack>
        ) : (
          <XStack space="$3" alignItems="center">
            <AlertCircle size={20} color="$gray8" />
            <Text fontSize={11} color="$gray10" flex={1}>
              Este gasto no tiene presupuesto asignado. ¿Consideraste crear uno
              para controlar {transaction.category?.name}?
            </Text>
          </XStack>
        )}

        <Separator borderColor="$borderColor" />

        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$3" alignItems="center" flex={1}>
            <Stack backgroundColor="$blue3" padding="$2" borderRadius="$8">
              <TrendingUp size={16} color="$blue10" />
            </Stack>
            <YStack>
              <Text fontSize={11} color="$gray10">
                Acumulado en {transaction.category?.name}
              </Text>
              <Text fontSize={13} fontWeight="700" color="$color">
                ${categoryStats.total.toLocaleString("es-CL")}{" "}
                <Text fontSize={11} fontWeight="400" color="$gray9">
                  ({categoryStats.count} gastos)
                </Text>
              </Text>
            </YStack>
          </XStack>
        </XStack>
      </YStack>
    </YStack>
  );
};
