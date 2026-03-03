import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { FlatList, RefreshControl } from "react-native";
import { YStack, Text, View, Separator, Spinner } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";

import { MonthYearSelector } from "../../components/ui/MonthYearSelector";
import { AccountFilterCarousel } from "../../components/transactions/AccountFilterCarousel";
import { TransactionItem } from "../../components/transactions/TransactionItem";
import { Transaction } from "../../types/transaction.types";
import { useUserStore } from "../../stores/useUserStore";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { TransactionActions } from "../../actions/transactionActions";

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
  const lastUpdatedTransaction = useTransactionStore(
    (state) => state.lastUpdatedTransaction
  );

  const initialAccountId = accountId ?? route.params?.accountId ?? null;
  const [date, setDate] = useState(new Date());
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(
    initialAccountId
  );
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
        const amt = Number(t.amount);
        if (t.type === "INCOME") acc.income += amt;
        else if (t.type === "EXPENSE" || t.type === "TRANSFER")
          acc.expense += amt;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const buildFilters = useCallback(
    (overrideAccountId?: string | null, overrideDate?: Date) => {
      const queryAccount =
        overrideAccountId !== undefined ? overrideAccountId : selectedAccountId;
      const queryDate = overrideDate || date;

      return {
        month: queryDate.getMonth() + 1,
        year: queryDate.getFullYear(),
        accountId: queryAccount || undefined,
      };
    },
    [date, selectedAccountId]
  );

  const fetchPage = useCallback(
    async (options?: {
      overrideAccountId?: string | null;
      overrideDate?: Date;
      reset?: boolean;
      showLoading?: boolean;
      clear?: boolean;
    }) => {
      if (!user?.id) return;

      const {
        overrideAccountId,
        overrideDate,
        reset = false,
        showLoading = true,
        clear = false,
      } = options || {};

      const filters = buildFilters(overrideAccountId, overrideDate);
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
      return monthMatch && yearMatch && accountMatch;
    },
    [date, selectedAccountId]
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
            ${(stats.income - stats.expense).toLocaleString("es-CL")}
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
