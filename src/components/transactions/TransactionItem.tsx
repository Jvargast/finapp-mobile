import React from "react";
import { YStack, XStack, Text, Stack, Separator } from "tamagui";
import { getIcon } from "../../utils/iconMap";
import { Transaction } from "../../types/transaction.types";

interface TransactionItemProps {
  transaction: Transaction;
  isLast?: boolean;
  onPress?: (id: string) => void;
}

const getIconBg = (color: string | undefined) => {
  if (!color) return "$gray4";
  if (color.startsWith("#")) {
    return `${color}20`;
  }
  return "$gray3";
};

const formatCurrency = (amount: string | number, currency = "CLP") => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  if (isToday) return "Hoy";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";

  return date.toLocaleDateString("es-CL", { day: "numeric", month: "short" });
};

export const TransactionItem = ({
  transaction,
  isLast = false,
  onPress,
}: TransactionItemProps) => {
  const isExpense =
    transaction.type === "EXPENSE" || transaction.type === "TRANSFER";
  const Icon = getIcon(transaction.category?.icon || "HelpCircle");
  const categoryColor = transaction.category?.color || "#9CA3AF";
  const iconBg = getIconBg(transaction.category?.color);

  return (
    <YStack>
      <XStack
        paddingHorizontal="$3"
        paddingVertical="$3.5"
        alignItems="center"
        justifyContent="space-between"
        onPress={() => onPress?.(transaction.id)}
        pressStyle={{ backgroundColor: "rgba(0,0,0,0.02)" }}
      >
        <XStack space="$3" alignItems="center" flex={1} marginRight="$2">
          <Stack
            backgroundColor={iconBg}
            padding="$2.5"
            borderRadius="$10"
            justifyContent="center"
            alignItems="center"
          >
            <Icon size={20} color={categoryColor} strokeWidth={2.5} />
          </Stack>

          <YStack flex={1}>
            <Text
              fontSize="$3" 
              fontWeight="700"
              color="$color"
              numberOfLines={1}
            >
              {transaction.description ||
                transaction.category?.name ||
                "Movimiento"}
            </Text>
            <XStack space="$2" alignItems="center">
              <Text fontSize={11} color="$gray10" fontWeight="500">
                {formatDate(transaction.date)}
              </Text>
              <Stack
                width={3}
                height={3}
                borderRadius={2}
                backgroundColor="$gray8"
              />
              <Text fontSize={11} color="$gray10" fontWeight="500">
                {transaction.account?.name}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        <Text
          fontSize="$3" 
          fontWeight="800"
          color={isExpense ? "$red10" : "$green10"}
        >
          {isExpense ? "-" : "+"}{" "}
          {formatCurrency(transaction.amount, transaction.account?.currency)}
        </Text>
      </XStack>

      {!isLast && (
        <Separator
          borderColor="$borderColor"
          marginHorizontal="$4"
          opacity={0.5}
        />
      )}
    </YStack>
  );
};
