import React, { memo, useMemo } from "react";
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

  const time = date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday = date.toDateString() === today.toDateString();
  if (isToday) {
    return `Hoy, ${time}`;
  }

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${time}`;
  }

  const datePart = date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });

  return `${datePart}, ${time}`;
};

export const TransactionItem = memo(
  ({ transaction, isLast = false, onPress }: TransactionItemProps) => {
    const {
      isExpense,
      Icon,
      categoryColor,
      iconBg,
      formattedDate,
      formattedAmount,
    } = useMemo(() => {
      return {
        isExpense:
          transaction.type === "EXPENSE" || transaction.type === "TRANSFER",
        Icon: getIcon(transaction.category?.icon || "HelpCircle"),
        categoryColor: transaction.category?.color || "#9CA3AF",
        iconBg: getIconBg(transaction.category?.color),
        formattedDate: formatDate(transaction.date),
        formattedAmount: formatCurrency(
          transaction.amount,
          transaction.account?.currency
        ),
      };
    }, [transaction]);

    return (
      <YStack>
        <XStack
          paddingHorizontal="$3"
          paddingVertical="$3.5"
          alignItems="center"
          justifyContent="space-between"
          onPress={() => onPress?.(transaction.id)}
          pressStyle={{ opacity: 0.7 }}
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

            <YStack flex={1} justifyContent="center">
              <Text
                fontSize="$3"
                fontWeight="700"
                color="$color"
                numberOfLines={1}
                lineHeight={20}
              >
                {transaction.description ||
                  transaction.category?.name ||
                  "Movimiento"}
              </Text>

              <XStack space="$1.5" alignItems="center">
                <Text
                  fontSize={11}
                  color="$gray10"
                  fontWeight="500"
                  numberOfLines={1}
                >
                  {formattedDate}
                </Text>

                <Stack
                  width={3}
                  height={3}
                  borderRadius={2}
                  backgroundColor="$gray8"
                  marginTop={1}
                />

                <Text
                  fontSize={11}
                  color="$gray10"
                  fontWeight="500"
                  numberOfLines={1}
                  flexShrink={1}
                >
                  {transaction.account?.name}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          <Text
            fontSize="$3"
            fontWeight="800"
            color={isExpense ? "$red10" : "$green10"}
            textAlign="right"
          >
            {isExpense ? "-" : "+"} {formattedAmount}
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
  },

  (prev, next) => {
    return (
      prev.transaction.id === next.transaction.id &&
      prev.transaction.amount === next.transaction.amount &&
      prev.transaction.description === next.transaction.description &&
      prev.isLast === next.isLast
    );
  }
);
