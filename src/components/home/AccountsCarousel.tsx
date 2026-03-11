import React, { useState, useCallback } from "react";
import { ScrollView, YStack, XStack, Text, Spinner } from "tamagui";
import { CreditCard, Landmark, Banknote } from "@tamagui/lucide-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AccountCard } from "./accounts/AccountCard";
import { AddAccountButton } from "./accounts/AddAccountButton";
import { useAccountStore } from "../../stores/useAccountStore";
import { PremiumSheet } from "../ui/PremiumSheet";
import { useSubscription } from "../../hooks/useSubscription";
import { PillButton } from "../ui/PillButton";
import { fetchMonthlyAccountBalances } from "../../utils/monthlyAccountBalances";
import { formatCurrencyAmount } from "../../utils/currency";
import { DisplayHeading } from "../ui/DisplayHeading";

const getIconByType = (type?: string) => {
  if (!type) return Landmark;

  const normalizedType = type.toUpperCase();
  switch (normalizedType) {
    case "CASH":
      return Banknote;
    case "WALLET":
      return CreditCard;
    case "INVESTMENT":
      return Landmark;
    default:
      return Landmark;
  }
};

export const AccountsCarousel = () => {
  const navigation = useNavigation<any>();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [monthlyBalances, setMonthlyBalances] = useState<Record<string, number>>(
    {}
  );

  const { isPro, canCreateAccount } = useSubscription();

  const accounts = useAccountStore((state) => state.accounts);
  const MAX_ACCOUNTS = 3;
  const currentCount = accounts.length;
  const isLimitReached = !isPro && currentCount >= MAX_ACCOUNTS;
  const isLoading = useAccountStore((state) => state.isLoading);

  const USE_STACKED_VIEW = true;

  const handleCardPress = (id: string) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const run = async () => {
        try {
          const balances = await fetchMonthlyAccountBalances();
          if (isActive) setMonthlyBalances(balances);
        } catch (error) {
          if (isActive) setMonthlyBalances({});
        }
      };

      run();

      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <YStack space="$4" marginBottom="$4" marginTop="$4">
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        paddingHorizontal="$4"
      >
        <YStack>
          <DisplayHeading fontSize="$6" fontWeight="400" color="$color">
            Mis Cuentas
          </DisplayHeading>

          <XStack alignItems="center" space="$1.5">
            {isPro ? (
              <XStack space="$1.5" alignItems="center">
                <YStack
                  width={6}
                  height={6}
                  borderRadius={3}
                  backgroundColor="#F59E0B"
                />
                <Text
                  fontSize={11}
                  color="#F59E0B"
                  fontWeight="700"
                  letterSpacing={0.5}
                >
                  Ilimitadas (Wou+)
                </Text>
              </XStack>
            ) : (
              <XStack space="$1.5" alignItems="center">
                <YStack
                  width={6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={isLimitReached ? "$red10" : "$green10"}
                />
                <Text
                  fontSize={11}
                  color="$gray10"
                  fontWeight="600"
                  letterSpacing={0.5}
                >
                  {currentCount} de {MAX_ACCOUNTS} disponibles
                </Text>
              </XStack>
            )}
          </XStack>
        </YStack>
        <PillButton
          label="Ver todas"
          onPress={() => navigation.navigate("Accounts")}
        />
      </XStack>

      {isLoading && accounts.length === 0 ? (
        <YStack height={160} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$brand" />
        </YStack>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          overflow="visible"
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingRight: 20,
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 20,
          }}
          decelerationRate="fast"
          snapToInterval={USE_STACKED_VIEW ? undefined : 270}
        >
          <XStack alignItems="center">
            <AddAccountButton
              onPress={() => {
                if (canCreateAccount) {
                  navigation.navigate("AddAccount");
                } else {
                  setShowPremiumSheet(true);
                }
              }}
              isStacked={USE_STACKED_VIEW}
              isLocked={!canCreateAccount}
            />
            {accounts.map((account, index) => {
              const isLastItem = index === accounts.length - 1;
              const normalizedType = String(account.type || "").toUpperCase();
              const isCashAccount = normalizedType === "CASH";
              const monthlyBalance = monthlyBalances[account.id] || 0;
              const accountForUI = {
                ...account,
                balance: formatCurrencyAmount(
                  isCashAccount ? Number(account.balance || 0) : monthlyBalance,
                  account.currency
                ),
                balanceLabel: isCashAccount
                  ? "Saldo disponible"
                  : "Balance del mes",
                icon: getIconByType(account.type),
                color: account.color ? account.color : "#1E293B",
              };

              return (
                <AccountCard
                  key={account.id}
                  account={accountForUI}
                  index={index}
                  isActive={activeCardId === account.id}
                  onPressIn={() => handleCardPress(account.id)}
                  isStacked={USE_STACKED_VIEW && !isLastItem}
                />
              );
            })}
          </XStack>
        </ScrollView>
      )}
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Límite de Cuentas Alcanzado"
        description="El plan gratuito permite hasta 2 cuentas. Pásate a WOU+ para agregar todas las que quieras."
      />
    </YStack>
  );
};
