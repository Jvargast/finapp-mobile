import React from "react";
import { YStack, XStack, Text, Button, Spinner } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { TransactionItem } from "../transactions/TransactionItem";

export const RecentTransactions = () => {
  const navigation = useNavigation<any>();
  const transactions = useTransactionStore(
    (state) => state.recentTransactions || []
  );
  const isLoading = useTransactionStore((state) => state.isLoading);

  return (
    <YStack space="$4" paddingHorizontal="$2" marginBottom="$6">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="800" color="$color">
          Últimos Movimientos
        </Text>
        <Button
          size="$2"
          chromeless
          color="$brand"
          fontWeight="700"
          onPress={() => navigation.navigate("AllTransactionsScreen")}
        >
          Ver todo
        </Button>
      </XStack>

      {isLoading && transactions.length === 0 ? (
        <YStack padding="$4" alignItems="center">
          <Spinner size="small" color="$brand" />
        </YStack>
      ) : transactions.length === 0 ? (
        <YStack
          backgroundColor="$color2"
          padding="$6"
          borderRadius="$6"
          alignItems="center"
          justifyContent="center"
        >
          <Text color="$gray10" fontSize="$3">
            No hay movimientos recientes
          </Text>
        </YStack>
      ) : (
        <YStack
          backgroundColor="$color2"
          borderRadius="$8"
          paddingVertical="$2"
          shadowColor="$shadowColor"
          shadowRadius={10}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.05}
        >
          {transactions.map((tx, index) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              isLast={index === transactions.length - 1}
              onPress={(id) => console.log("Detalle", id)}
            />
          ))}
        </YStack>
      )}
    </YStack>
  );
};
