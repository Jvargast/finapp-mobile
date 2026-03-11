import React, { memo, useMemo, useState, useCallback } from "react";
import { ScrollView, YStack, Text } from "tamagui";
import { useFocusEffect } from "@react-navigation/native";
import { useAccountStore } from "../../stores/useAccountStore";
import { LayoutGrid } from "@tamagui/lucide-icons";
import { AccountCard } from "../home/accounts/AccountCard";
import { fetchMonthlyAccountBalances } from "../../utils/monthlyAccountBalances";

interface Props {
  selectedAccountId: string | null;
  onSelect: (id: string | null) => void;
}

export const AccountFilterCarousel = memo(
  ({ selectedAccountId, onSelect }: Props) => {
    const accounts = useAccountStore((state) => state.accounts);
    const [monthlyBalances, setMonthlyBalances] = useState<Record<string, number>>(
      {}
    );

    const { liquidBalance, creditBalance, netBalance } = useMemo(() => {
      const totals = accounts.reduce(
        (acc, curr) => {
          const value = Number(curr.balance || 0);
          const normalizedType = String(curr.type || "").toUpperCase();
          const isCredit =
            Boolean(curr.isCredit) ||
            normalizedType === "CREDIT_CARD" ||
            normalizedType === "CREDIT";

          if (isCredit) {
            acc.creditBalance += value;
          } else {
            acc.liquidBalance += value;
          }

          return acc;
        },
        { liquidBalance: 0, creditBalance: 0 }
      );

      return {
        ...totals,
        netBalance: totals.liquidBalance + totals.creditBalance,
      };
    }, [accounts]);

    const allAccountsCard = useMemo(
      () => ({
        id: "ALL",
        name: "Cuenta General",
        balance: liquidBalance,
        creditBalance,
        netBalance,
        color: "#000",
        type: "ALL",
        icon: LayoutGrid,
        currency: "CLP",
      }),
      [creditBalance, liquidBalance, netBalance]
    );

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
      <YStack space="$3" marginBottom="$2">
        <Text
          fontSize="$3"
          fontWeight="700"
          color="$gray10"
          paddingHorizontal="$4"
        >
          Filtrar por cuenta
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 25,
            paddingTop: 10,
            gap: 10,
          }}
          overflow="visible"
          removeClippedSubviews={true}
        >
          <AccountCard
            account={allAccountsCard}
            index={-1}
            isActive={selectedAccountId === null}
            onPressIn={() => onSelect(null)}
            isStacked={false}
          />

          {accounts.map((account, index) => {
            const normalizedType = String(account.type || "").toUpperCase();
            const isCashAccount = normalizedType === "CASH";
            const accountForUI = {
              ...account,
              balance: isCashAccount
                ? Number(account.balance || 0)
                : monthlyBalances[account.id] || 0,
              balanceLabel: isCashAccount
                ? "Saldo disponible"
                : "Balance del mes",
            };

            return (
              <AccountCard
                key={account.id}
                account={accountForUI}
                index={index}
                isActive={selectedAccountId === account.id}
                onPressIn={() => onSelect(account.id)}
                isStacked={false}
              />
            );
          })}
        </ScrollView>
      </YStack>
    );
  }
);
