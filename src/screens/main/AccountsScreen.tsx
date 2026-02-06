import React, { useState, useMemo, useEffect } from "react";
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
  Link as LinkIcon,
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
import { PremiumSheet } from "../../components/ui/PremiumSheet";
import { getAccountCategory } from "../../utils/formtatBankCategory";
import { FintocActions } from "../../actions/fintocActions";
import { useFintocStore } from "../../stores/useFintocStore";
import { SyncCooldownSheet } from "../../components/accounts/SyncCooldownSheet";
import { RefreshControl } from "react-native";

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
  const { isPro } = useSubscription();

  const [activeFilter, setActiveFilter] = useState("ALL");
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const syncAllCooldownUntilMs = useFintocStore(
    (s) => s.syncAllCooldownUntilMs,
  );
  const setSyncAllCooldownUntilMs = useFintocStore(
    (s) => s.setSyncAllCooldownUntilMs,
  );

  const [syncSheetOpen, setSyncSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<"syncing" | "done" | "cooldown">(
    "syncing",
  );
  const cooldownUntilMs = useFintocStore((s) => s.syncAllCooldownUntilMs);

  const [cooldownLeftSec, setCooldownLeftSec] = useState(0);

  const cooldownMsLeft = syncAllCooldownUntilMs
    ? Math.max(0, syncAllCooldownUntilMs - Date.now())
    : 0;

  const isInCooldown =
    isPro && !!syncAllCooldownUntilMs && syncAllCooldownUntilMs > Date.now();

  useEffect(() => {
    if (!syncAllCooldownUntilMs) return;

    const msLeft = syncAllCooldownUntilMs - Date.now();
    if (msLeft <= 0) {
      setSyncAllCooldownUntilMs(null);
      return;
    }

    const t = setTimeout(() => setSyncAllCooldownUntilMs(null), msLeft);
    return () => clearTimeout(t);
  }, [syncAllCooldownUntilMs, setSyncAllCooldownUntilMs]);

  useEffect(() => {
    if (!syncAllCooldownUntilMs) return;

    const msLeft = syncAllCooldownUntilMs - Date.now();
    if (msLeft <= 0) {
      setSyncAllCooldownUntilMs(null);
      return;
    }

    const t = setTimeout(() => setSyncAllCooldownUntilMs(null), msLeft);
    return () => clearTimeout(t);
  }, [syncAllCooldownUntilMs, setSyncAllCooldownUntilMs]);

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

  const handleCardPress = (account: Account) => {
    setSelectedAccount(account);
    setSheetOpen(true);
  };

  const handleConnectPress = () => {
    if (!isPro) {
      setShowPremiumSheet(true);
      return;
    }
    navigation.navigate("ConnectBank");
  };

  const handleRefreshPress = async () => {
    if (!isPro) return;

    if (isInCooldown) {
      setSheetMode("cooldown");
      setSyncSheetOpen(true);
      return;
    }

    if (isSyncing) {
      setSheetMode("syncing");
      setSyncSheetOpen(true);
      return;
    }

    try {
      setIsSyncing(true);
      setSheetMode("syncing");
      setSyncSheetOpen(true);

      const res = await FintocActions.syncAll();

      if (res?.status === "cooldown") {
        const until = Date.now() + (res.retryAfterMs ?? 0);
        setSyncAllCooldownUntilMs(until);
        setSheetMode("cooldown");
        return;
      }

      if (res?.status === "no_links") {
        setSyncSheetOpen(false);
        return;
      }

      setSheetMode("done");
      setTimeout(() => setSyncSheetOpen(false), 1200);
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
            {isPro && (
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
            )}
            <Button
              size="$3"
              backgroundColor={isPro ? "$blue10" : "$gray4"}
              borderRadius="$10"
              icon={<LinkIcon size={18} color={isPro ? "white" : "$gray10"} />}
              onPress={handleConnectPress}
              pressStyle={{ opacity: 0.8 }}
              borderWidth={isPro ? 0 : 1}
              borderColor={isPro ? "transparent" : "$borderColor"}
              paddingHorizontal="$3"
              height={40}
            >
              <Text
                color={isPro ? "white" : "$gray10"}
                fontSize={12}
                fontWeight="700"
              >
                Conectar
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

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            isPro ? (
              <RefreshControl
                refreshing={isSyncing}
                onRefresh={handleRefreshPress}
              />
            ) : undefined
          }
        >
          {filteredAccounts.length === 0 ? (
            <YStack padding="$10" alignItems="center" opacity={0.8} space="$4">
              <PieChart size={40} color="$gray8" />
              <Text color="$gray10" textAlign="center">
                {activeFilter === "BANK"
                  ? "No has conectado ningún banco aún."
                  : "Sin cuentas en esta categoría."}
              </Text>

              {activeFilter === "BANK" && (
                <Button
                  themeInverse
                  icon={<Landmark size={16} />}
                  onPress={handleConnectPress}
                >
                  {isPro
                    ? "Conectar mi Banco"
                    : "Desbloquear Conexión Bancaria"}
                </Button>
              )}
            </YStack>
          ) : (
            <YStack space="$4">
              {filteredAccounts.map((account, index) => (
                <YStack key={account.id} alignItems="center">
                  <AccountCard
                    account={account}
                    index={index}
                    isActive={false}
                    onPress={() => handleCardPress(account)}
                  />
                </YStack>
              ))}
            </YStack>
          )}
        </ScrollView>
      </YStack>
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Conecta tus Bancos"
        description="Olvídate de ingresar gastos a mano. Sincroniza tus cuentas bancarias automáticamente con Wou+."
      />
      <AccountOptionsSheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
        account={selectedAccount}
      />
      <SyncCooldownSheet
        open={syncSheetOpen}
        onOpenChange={setSyncSheetOpen}
        mode={isInCooldown ? "cooldown" : sheetMode}
        cooldownUntilMs={syncAllCooldownUntilMs}
      />
    </MainLayout>
  );
}
