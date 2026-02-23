import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  YStack,
  XStack,
  Text,
  ScrollView,
  Button,
  Circle,
  Spinner,
} from "tamagui";
import {
  PieChart,
  Landmark,
  Wallet,
  Banknote,
  Plus,
  RefreshCw,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { MainLayout } from "../../components/layout/MainLayout";
import { AccountCard } from "../../components/home/accounts/AccountCard";
import { useAccountStore } from "../../stores/useAccountStore";
import { Account } from "../../types/account.types";
import { AccountOptionsSheet } from "../../components/home/accounts/AccountOptionsSheet";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSubscription } from "../../hooks/useSubscription";
import { getAccountCategory } from "../../utils/formtatBankCategory";
import { FlatList, RefreshControl, InteractionManager } from "react-native";
import { PremiumSheet } from "../../components/ui/PremiumSheet";

const CAT_COLORS: Record<string, string> = {
  BANK: "$blue10",
  WALLET: "$purple10",
  CASH: "$green10",
  ALL: "$gray11",
};

const formatShort = (amount: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
};

export default function AccountsScreen() {
  const navigation = useNavigation<any>();
  const accounts = useAccountStore((state) => state.accounts);
  const insets = useSafeAreaInsets();
  const { canCreateAccount } = useSubscription();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cooldownUntilMs, setCooldownUntilMs] = useState<number | null>(null);
  const [cooldownLeftSec, setCooldownLeftSec] = useState(0);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [isListReady, setIsListReady] = useState(false);

  const COOLDOWN_MS = 60 * 1000;

  const isInCooldown =
    !!cooldownUntilMs && cooldownUntilMs > Date.now();

  useEffect(() => {
    if (!cooldownUntilMs) {
      setCooldownLeftSec(0);
      return;
    }

    const tick = () => {
      const msLeft = Math.max(0, cooldownUntilMs - Date.now());
      setCooldownLeftSec(Math.ceil(msLeft / 1000));
      if (msLeft <= 0) {
        setCooldownUntilMs(null);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [cooldownUntilMs]);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsListReady(true);
    });
    return () => task.cancel();
  }, []);

  const { totals, totalSum } = useMemo(() => {
    const t: Record<string, number> = { BANK: 0, WALLET: 0, CASH: 0, ALL: 0 };

    accounts.forEach((acc) => {
      const val = Number(acc.balance || 0);
      t.ALL += val;
      const cat = getAccountCategory(acc);
      if (t[cat] !== undefined) t[cat] += val;
    });

    return { totals: t, totalSum: t.ALL || 1 };
  }, [accounts]);

  const FILTERS = [
    { id: "ALL", label: "Todo", icon: PieChart, color: "$gray11" },
    { id: "BANK", label: "Bancos", icon: Landmark, color: CAT_COLORS.BANK },
    { id: "WALLET", label: "Digital", icon: Wallet, color: CAT_COLORS.WALLET },
    { id: "CASH", label: "Efectivo", icon: Banknote, color: CAT_COLORS.CASH },
  ];

  const filteredAccounts = useMemo(() => {
    if (activeFilter === "ALL") return accounts;
    return accounts.filter((acc) => getAccountCategory(acc) === activeFilter);
  }, [accounts, activeFilter]);

  const handleCardPress = useCallback((account: Account) => {
    setSelectedAccount(account);
    setSheetOpen(true);
  }, []);

  const accountPressHandlers = useMemo(() => {
    const handlers = new Map<string, () => void>();
    filteredAccounts.forEach((account) => {
      handlers.set(account.id, () => handleCardPress(account));
    });
    return handlers;
  }, [filteredAccounts, handleCardPress]);

  const renderAccountItem = useCallback(
    ({ item, index }: { item: Account; index: number }) => (
      <YStack alignItems="center">
        <AccountCard
          account={item}
          index={index}
          isActive={false}
          onPressIn={
            accountPressHandlers.get(item.id) ||
            (() => handleCardPress(item))
          }
        />
      </YStack>
    ),
    [accountPressHandlers, handleCardPress],
  );

  const handleConnectPress = useCallback(() => {
    if (!canCreateAccount) {
      setShowPremiumSheet(true);
      return;
    }
    navigation.navigate("AddAccount");
  }, [canCreateAccount, navigation]);

  const renderEmptyState = useCallback(() => {
    if (filteredAccounts.length > 0) return null;

    return (
      <YStack padding="$10" alignItems="center" opacity={0.8} space="$4">
        <PieChart size={40} color="$gray8" />
        <Text color="$gray10" textAlign="center">
          {activeFilter === "BANK"
            ? "No hay cuentas bancarias aún."
            : "Sin cuentas en esta categoría."}
        </Text>

        {activeFilter === "BANK" && (
          <Button
            themeInverse
            icon={<Landmark size={16} />}
            onPress={handleConnectPress}
          >
            Agregar cuentas
          </Button>
        )}
      </YStack>
    );
  }, [activeFilter, filteredAccounts.length, handleConnectPress]);

  const handleRefreshPress = async () => {
    if (isInCooldown) {
      return;
    }

    if (isSyncing) {
      return;
    }

    try {
      setIsSyncing(true);
      // TODO: reemplazar por refresh real de fuentes cuando estén listas.
      await Promise.all([
        new Promise((r) => setTimeout(r, 700)),
      ]);
      setCooldownUntilMs(Date.now() + COOLDOWN_MS);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <MainLayout noPadding={true}>
      <YStack
        space="$2"
        flex={1}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
      >
        <XStack alignItems="center" justifyContent="space-between">
          <XStack alignItems="center" space="$3" flexShrink={1}>
            <GoBackButton fallbackRouteName="Dashboard" />
            <Text fontSize="$6" fontWeight="900" numberOfLines={1}>
              Mis Cuentas
            </Text>
          </XStack>

          <XStack space="$2" alignItems="center" flexShrink={0}>
            <Button
              size="$3"
              width={40}
              height={40}
              padding={0}
              backgroundColor={isInCooldown ? "$gray3" : "$color2"}
              opacity={isInCooldown ? 0.7 : 1}
              borderRadius="$10"
              onPress={handleRefreshPress}
              disabled={isSyncing}
              pressStyle={{ opacity: 0.8 }}
              borderWidth={1}
              borderColor={"$borderColor"}
              icon={
                isSyncing ? (
                  <Spinner size="small" />
                ) : (
                  <RefreshCw
                    size={18}
                    color={isInCooldown ? "$gray9" : "$gray11"}
                  />
                )
              }
            />
            <Button
              size="$3"
              backgroundColor="$blue10"
              borderRadius="$10"
              icon={<Plus size={18} color="white" />}
              onPress={handleConnectPress}
              pressStyle={{ opacity: 0.8 }}
              borderWidth={0}
              borderColor="transparent"
              paddingHorizontal="$3"
              height={40}
            >
              <Text color="white" fontSize={12} fontWeight="700">
                Agregar
              </Text>
            </Button>
          </XStack>
        </XStack>

        <YStack space="$2" marginTop="$2">
          <XStack
            height={12}
            borderRadius="$10"
            overflow="hidden"
            backgroundColor="$color2"
            width="100%"
          >
            {totals.BANK > 0 && (
              <YStack
                flex={totals.BANK / totalSum}
                backgroundColor={CAT_COLORS.BANK}
              />
            )}
            {totals.WALLET > 0 && (
              <YStack
                flex={totals.WALLET / totalSum}
                backgroundColor={CAT_COLORS.WALLET}
              />
            )}
            {totals.CASH > 0 && (
              <YStack
                flex={totals.CASH / totalSum}
                backgroundColor={CAT_COLORS.CASH}
              />
            )}
          </XStack>

          <XStack justifyContent="space-between">
            <Text fontSize={10} color="$gray10" fontWeight="600">
              Distribución de Activos
            </Text>
            <Text fontSize={10} color="$gray10" fontWeight="600">
              100%
            </Text>
          </XStack>
        </YStack>

        <YStack height={50}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            <XStack space="$2">
              {FILTERS.map((filter) => {
                const isActive = activeFilter === filter.id;
                const amount = totals[filter.id] || 0;

                return (
                  <Button
                    key={filter.id}
                    size="$3.5"
                    backgroundColor={isActive ? "$color" : "$color2"}
                    onPress={() => setActiveFilter(filter.id)}
                    borderRadius="$8"
                    paddingHorizontal="$3"
                    borderWidth={1}
                    borderColor={isActive ? "$color" : "transparent"}
                    animation="quick"
                  >
                    <XStack space="$2" alignItems="center">
                      {filter.id !== "ALL" && (
                        <Circle size={6} backgroundColor={filter.color} />
                      )}

                      <Text
                        color={isActive ? "$background" : "$gray11"}
                        fontWeight={isActive ? "700" : "500"}
                        fontSize={12}
                      >
                        {filter.label}
                      </Text>

                      <Text
                        color={isActive ? "$background" : "$gray10"}
                        fontWeight="800"
                        fontSize={12}
                        opacity={isActive ? 1 : 0.7}
                      >
                        {filter.id === "ALL"
                          ? accounts.length
                          : formatShort(amount)}
                      </Text>
                    </XStack>
                  </Button>
                );
              })}
            </XStack>
          </ScrollView>
        </YStack>
        {cooldownLeftSec > 0 && (
          <Text fontSize={11} color="$gray10" marginTop="$1">
            Puedes refrescar en {cooldownLeftSec}s
          </Text>
        )}

        {isListReady ? (
          <FlatList
            data={filteredAccounts}
            keyExtractor={(item) => item.id}
            renderItem={renderAccountItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 100,
              flexGrow: filteredAccounts.length === 0 ? 1 : undefined,
            }}
            refreshControl={
              <RefreshControl
                refreshing={isSyncing}
                onRefresh={handleRefreshPress}
              />
            }
            ItemSeparatorComponent={() => <YStack height="$4" />}
            ListEmptyComponent={renderEmptyState}
            initialNumToRender={4}
            windowSize={4}
            maxToRenderPerBatch={4}
            updateCellsBatchingPeriod={16}
            removeClippedSubviews={true}
          />
        ) : (
          <YStack padding="$6" alignItems="center" space="$3" opacity={0.7}>
            <Spinner size="large" color="$brand" />
            <Text fontSize="$3" color="$gray10">
              Cargando cuentas...
            </Text>
          </YStack>
        )}
      </YStack>
      <AccountOptionsSheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
        account={selectedAccount}
      />
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Límite de Cuentas Alcanzado"
        description="El plan gratuito permite hasta 2 cuentas. Pásate a WOU+ para agregar todas las que quieras."
      />
    </MainLayout>
  );
}
