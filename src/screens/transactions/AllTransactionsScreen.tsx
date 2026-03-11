import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FlatList, RefreshControl } from "react-native";
import { YStack, XStack, Text, View, Separator, Spinner, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";

import { MonthYearSelector } from "../../components/ui/MonthYearSelector";
import { AccountFilterCarousel } from "../../components/transactions/AccountFilterCarousel";
import { TransactionItem } from "../../components/transactions/TransactionItem";
import { Transaction } from "../../types/transaction.types";
import { useUserStore } from "../../stores/useUserStore";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { TransactionActions } from "../../actions/transactionActions";
import { ExpenseModelFilter } from "../../types/expense.types";
import {
  convertAmount,
  formatCurrencyAmount,
  resolveTransactionCurrency,
} from "../../utils/currency";

interface AllTransactionsScreenProps {
  embedded?: boolean;
  backgroundColor?: string;
  accountId?: string | null;
}

const PAGE_SIZE = 50;

const dedupeTransactionsById = (items: Transaction[]) => {
  const seen = new Set<string>();
  const unique: Transaction[] = [];

  items.forEach((item) => {
    if (!item?.id) {
      unique.push(item);
      return;
    }
    if (seen.has(item.id)) return;
    seen.add(item.id);
    unique.push(item);
  });

  return unique;
};

export default function AllTransactionsScreen({
  embedded = false,
  backgroundColor = "$background",
  accountId,
}: AllTransactionsScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = useUserStore((state) => state.user);
  const displayCurrency = useUserStore(
    (state) => state.user?.preferences?.currency || "CLP"
  );
  const lastUpdatedTransaction = useTransactionStore(
    (state) => state.lastUpdatedTransaction
  );

  const initialAccountId = accountId ?? route.params?.accountId ?? null;
  const [date, setDate] = useState(new Date());
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    initialAccountId
  );
  const [expenseModelFilter, setExpenseModelFilter] =
    useState<ExpenseModelFilter>("ALL");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (initialAccountId !== selectedAccountId) {
      setSelectedAccountId(initialAccountId);
    }
  }, [initialAccountId, selectedAccountId]);

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);

  const stats = useMemo(() => {
    if (!transactions.length) return { income: 0, expense: 0 };
    return transactions.reduce(
      (acc, t) => {
        const sourceCurrency = resolveTransactionCurrency(t);
        const amt = convertAmount(
          Number(t.amount),
          sourceCurrency,
          displayCurrency
        );
        if (t.type === "INCOME") acc.income += amt;
        else if (t.type === "EXPENSE") acc.expense += amt;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [displayCurrency, transactions]);

  const buildFilters = useCallback(
    (
      overrideAccountId?: string | null,
      overrideDate?: Date,
      overrideExpenseModel?: ExpenseModelFilter,
    ) => {
      const queryAccount =
        overrideAccountId !== undefined ? overrideAccountId : selectedAccountId;
      const queryDate = overrideDate || date;
      const queryExpenseModel =
        overrideExpenseModel !== undefined
          ? overrideExpenseModel
          : expenseModelFilter;

      return {
        month: queryDate.getMonth() + 1,
        year: queryDate.getFullYear(),
        accountId: queryAccount || undefined,
        expenseModel:
          queryExpenseModel === "ALL" ? undefined : queryExpenseModel,
      };
    },
    [date, expenseModelFilter, selectedAccountId]
  );

  const fetchPage = useCallback(
    async (options?: {
      overrideAccountId?: string | null;
      overrideDate?: Date;
      overrideExpenseModel?: ExpenseModelFilter;
      reset?: boolean;
      showLoading?: boolean;
      clear?: boolean;
    }) => {
      if (!user?.id) return;

      const {
        overrideAccountId,
        overrideDate,
        overrideExpenseModel,
        reset = false,
        showLoading = true,
        clear = false,
      } = options || {};

      const filters = buildFilters(
        overrideAccountId,
        overrideDate,
        overrideExpenseModel,
      );
      const nextOffset = reset ? 0 : offsetRef.current;

      if (reset) {
        if (clear) setTransactions([]);
        setOffset(0);
        setHasMore(true);
        setTotalCount(null);
        if (showLoading) setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      try {
        const response = await TransactionActions.getFilteredTransactionsPaged({
          ...filters,
          limit: PAGE_SIZE,
          offset: nextOffset,
        });
        const list = Array.isArray(response) ? response : response?.data || [];
        const metaTotal = Array.isArray(response) ? undefined : response?.meta?.total;

        setTransactions((prev) =>
          dedupeTransactionsById(reset ? list : [...prev, ...list])
        );

        const newOffset = nextOffset + list.length;
        setOffset(newOffset);

        if (typeof metaTotal === "number") {
          setTotalCount(metaTotal);
          setHasMore(newOffset < metaTotal);
        } else {
          setTotalCount(null);
          setHasMore(list.length === PAGE_SIZE);
        }
      } catch (error) {
        console.error("Error cargando transacciones:", error);
      } finally {
        if (reset) {
          setIsLoading(false);
        } else {
          setIsFetchingMore(false);
        }
      }
    },
    [user?.id, buildFilters]
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPage({ reset: true, showLoading: false });
    setIsRefreshing(false);
  };

  const handleAccountSelect = (id: string | null) => {
    if (id === selectedAccountId) return;
    setSelectedAccountId(id);
    fetchPage({
      overrideAccountId: id,
      reset: true,
      showLoading: true,
      clear: true,
    });
  };

  const handleDateChange = (newDate: Date) => {
    setDate(newDate);
    fetchPage({
      overrideDate: newDate,
      reset: true,
      showLoading: true,
      clear: true,
    });
  };

  const handleExpenseModelChange = (value: ExpenseModelFilter) => {
    if (value === expenseModelFilter) return;
    setExpenseModelFilter(value);
    fetchPage({
      overrideExpenseModel: value,
      reset: true,
      showLoading: true,
      clear: true,
    });
  };

  const handleLoadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || isLoading || isRefreshing) return;
    fetchPage();
  }, [fetchPage, hasMore, isFetchingMore, isLoading, isRefreshing]);

  const matchesCurrentFilters = useCallback(
    (tx: Transaction) => {
      const txDate = new Date(tx.date);
      const monthMatch = txDate.getMonth() + 1 === date.getMonth() + 1;
      const yearMatch = txDate.getFullYear() === date.getFullYear();
      const accountMatch = selectedAccountId
        ? tx.accountId === selectedAccountId
        : true;
      const expenseModelMatch =
        expenseModelFilter === "ALL"
          ? true
          : tx.type === "EXPENSE" && tx.expenseModel === expenseModelFilter;
      return monthMatch && yearMatch && accountMatch && expenseModelMatch;
    },
    [date, selectedAccountId, expenseModelFilter]
  );

  useEffect(() => {
    if (!lastUpdatedTransaction) return;
    setTransactions((prev) => {
      const idx = prev.findIndex((t) => t.id === lastUpdatedTransaction.id);
      const shouldInclude = matchesCurrentFilters(lastUpdatedTransaction);

      if (!shouldInclude) {
        if (idx === -1) return prev;
        return prev.filter((t) => t.id !== lastUpdatedTransaction.id);
      }

      if (idx === -1) {
        const next = dedupeTransactionsById([lastUpdatedTransaction, ...prev]);
        next.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return next;
      }

      const next = [...prev];
      next[idx] = lastUpdatedTransaction;
      next.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      return next;
    });
  }, [lastUpdatedTransaction, matchesCurrentFilters]);

  useFocusEffect(
    useCallback(() => {
      const refreshBackground = async () => {
        await fetchPage({ reset: true, showLoading: true });
      };
      refreshBackground();
    }, [fetchPage])
  );

  const isInitialLoading = isLoading && transactions.length === 0;
  const totalLabel = typeof totalCount === "number" ? totalCount : transactions.length;

  return (
    <YStack
      flex={1}
      backgroundColor={backgroundColor}
      paddingTop={embedded ? 8 : insets.top}
    >
      <YStack marginBottom="$2">
        <MonthYearSelector date={date} onChange={handleDateChange} />
      </YStack>

      <YStack paddingHorizontal="$4" paddingVertical="$2">
        <Text fontSize={12} color="$gray10" textAlign="center">
          Balance del periodo:{" "}
          <Text
            fontWeight="800"
            color={stats.income >= stats.expense ? "$green10" : "$red10"}
          >
            {formatCurrencyAmount(stats.income - stats.expense, displayCurrency)}
          </Text>
        </Text>
      </YStack>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) =>
          item.id || `tx-${item.date}-${item.amount}-${index}`
        }
        renderItem={({ item }) => (
          <View paddingHorizontal="$4" marginBottom="$3">
            <TransactionItem
              transaction={item}
              onPress={() =>
                navigation.navigate("TransactionDetailScreen", {
                  transactionId: item.id,
                })
              }
            />
          </View>
        )}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          flexGrow: transactions.length === 0 ? 1 : undefined,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#6366F1"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <>
            <YStack marginBottom="$4" zIndex={10}>
              <AccountFilterCarousel
                selectedAccountId={selectedAccountId}
                onSelect={handleAccountSelect}
              />
              <XStack
                space="$2"
                paddingHorizontal="$4"
                marginTop="$3"
                marginBottom="$2"
              >
                {(
                  [
                    { id: "ALL", label: "Todos" },
                    { id: "FIXED", label: "Fijos" },
                    { id: "VARIABLE", label: "Variables" },
                  ] as const
                ).map((option) => {
                  const active = expenseModelFilter === option.id;
                  return (
                    <Button
                      key={option.id}
                      flex={1}
                      height={34}
                      borderRadius="$8"
                      borderWidth={1}
                      borderColor={active ? "$brand" : "$gray5"}
                      backgroundColor={active ? "$brand" : "$gray2"}
                      onPress={() =>
                        handleExpenseModelChange(
                          option.id as ExpenseModelFilter,
                        )
                      }
                    >
                      <Text
                        fontSize={11}
                        fontWeight="800"
                        color={active ? "white" : "$gray11"}
                      >
                        {option.label.toUpperCase()}
                      </Text>
                    </Button>
                  );
                })}
              </XStack>
              <Separator borderColor="$gray4" marginHorizontal="$4" />

              <Text
                fontSize="$3"
                fontWeight="800"
                color="$gray11"
                marginLeft="$4"
                marginTop="$4"
                marginBottom="$2"
              >
                {isInitialLoading
                  ? "Cargando..."
                  : `Movimientos (${totalLabel})`}
              </Text>
            </YStack>
          </>
        }
        ListEmptyComponent={
          isInitialLoading ? (
            <YStack padding="$8" alignItems="center">
              <Spinner size="large" color="$brand" />
            </YStack>
          ) : (
            <YStack padding="$10" alignItems="center">
              <Text color="$gray8">No hay movimientos.</Text>
            </YStack>
          )
        }
        ListFooterComponent={
          isFetchingMore ? (
            <YStack paddingVertical="$4" alignItems="center">
              <Spinner size="small" color="$brand" />
            </YStack>
          ) : null
        }
        initialNumToRender={10}
        windowSize={5}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={16}
        removeClippedSubviews={true}
      />
    </YStack>
  );
}
