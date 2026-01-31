import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { YStack, Text, View, Separator, Spinner } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { MonthYearSelector } from "../../components/ui/MonthYearSelector";
import { AccountFilterCarousel } from "../../components/transactions/AccountFilterCarousel";
import { TransactionItem } from "../../components/transactions/TransactionItem";
import { Transaction } from "../../types/transaction.types";
import { useUserStore } from "../../stores/useUserStore";
import { TransactionActions } from "../../actions/transactionActions";

export default function AllTransactionsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const user = useUserStore((state) => state.user);

  const [date, setDate] = useState(new Date());
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    null
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const stats = useMemo(() => {
    if (!transactions.length) return { income: 0, expense: 0 };
    return transactions.reduce(
      (acc, t) => {
        const amt = Number(t.amount);
        if (t.type === "INCOME") acc.income += amt;
        else if (t.type === "EXPENSE" || t.type === "TRANSFER")
          acc.expense += amt;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const fetchData = async (
    overrideAccountId?: string | null,
    overrideDate?: Date,
    shouldShowGlobalLoading = true 
  ) => {
    if (!user?.id) return;

    const queryAccount =
      overrideAccountId !== undefined ? overrideAccountId : selectedAccountId;
    const queryDate = overrideDate || date;

    if (shouldShowGlobalLoading) setIsLoading(true);

    try {
      const data = await TransactionActions.getFilteredTransactions({
        month: queryDate.getMonth() + 1,
        year: queryDate.getFullYear(),
        accountId: queryAccount || undefined,
        limit: 100,
      });
      setTransactions(data);
    } catch (error) {
      console.error("Error cargando transacciones:", error);
    } finally {
      if (shouldShowGlobalLoading) setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchData(selectedAccountId, date, false);
    setIsRefreshing(false);
  };

  const handleAccountSelect = (id: string | null) => {
    if (id === selectedAccountId) return;
    setTransactions([]);
    setIsLoading(true);
    setSelectedAccountId(id);
    fetchData(id, date, true);
  };

  const handleDateChange = (newDate: Date) => {
    setTransactions([]);
    setIsLoading(true);
    setDate(newDate);
    fetchData(selectedAccountId, newDate);
  };

  useFocusEffect(
    useCallback(() => {
      const refreshBackground = async () => {
        await fetchData();
      };
      refreshBackground();
    }, [user?.id, date, selectedAccountId])
  );

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <MonthYearSelector date={date} onChange={handleDateChange} />

      <YStack paddingHorizontal="$4" paddingVertical="$2">
        <Text fontSize={12} color="$gray10" textAlign="center">
          Balance del periodo:{" "}
          <Text
            fontWeight="800"
            color={stats.income >= stats.expense ? "$green10" : "$red10"}
          >
            ${(stats.income - stats.expense).toLocaleString("es-CL")}
          </Text>
        </Text>
      </YStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6366F1"
          />
        }
      >
        <YStack marginBottom="$4" zIndex={10}>
          <AccountFilterCarousel
            selectedAccountId={selectedAccountId}
            onSelect={handleAccountSelect}
          />
          <Separator borderColor="$gray4" marginHorizontal="$4" />

          <Text
            fontSize="$3"
            fontWeight="800"
            color="$gray11"
            marginLeft="$4"
            marginTop="$4"
            marginBottom="$2"
          >
            {isLoading && transactions.length === 0
              ? "Cargando..."
              : `Movimientos (${transactions.length})`}
          </Text>
        </YStack>

        {isLoading && transactions.length === 0 ? (
          <YStack padding="$8" alignItems="center">
            <Spinner size="large" color="$brand" />
          </YStack>
        ) : (
          <YStack space="$0">
            {transactions.length > 0 ? (
              transactions.map((item) => (
                <View key={item.id} paddingHorizontal="$4" marginBottom="$3">
                  <TransactionItem
                    transaction={item}
                    onPress={() =>
                      navigation.navigate("TransactionDetailScreen", {
                        transactionId: item.id,
                      })
                    }
                  />
                </View>
              ))
            ) : (
              <YStack padding="$10" alignItems="center">
                <Text color="$gray8">No hay movimientos.</Text>
              </YStack>
            )}
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
