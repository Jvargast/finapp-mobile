import React, { memo, useMemo } from "react";
import { ScrollView, YStack, Text } from "tamagui";
import { useAccountStore } from "../../stores/useAccountStore";
import { LayoutGrid } from "@tamagui/lucide-icons";
import { AccountCard } from "../home/accounts/AccountCard";

interface Props {
  selectedAccountId: string | null;
  onSelect: (id: string | null) => void;
}

export const AccountFilterCarousel = memo(
  ({ selectedAccountId, onSelect }: Props) => {
    const accounts = useAccountStore((state) => state.accounts);

    const totalBalance = useMemo(() => {
      return accounts.reduce((acc, curr) => acc + Number(curr.balance), 0);
    }, [accounts]);

    const allAccountsCard = useMemo(
      () => ({
        id: "ALL",
        name: "Todas las Cuentas",
        balance: totalBalance,
        color: "#000",
        type: "ALL",
        icon: LayoutGrid,
        currency: "CLP",
      }),
      [totalBalance]
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
            onPress={() => onSelect(null)}
            isStacked={false}
          />

          {accounts.map((account, index) => (
            <AccountCard
              key={account.id}
              account={account}
              index={index}
              isActive={selectedAccountId === account.id}
              onPress={() => onSelect(account.id)}
              isStacked={false}
            />
          ))}
        </ScrollView>
      </YStack>
    );
  }
);
