import React, { useState } from "react";
import { ScrollView, YStack, XStack, Text, Button, Spinner } from "tamagui";
import { CreditCard, Wallet, Landmark, Banknote } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { AccountCard } from "./accounts/AccountCard";
import { AddAccountButton } from "./accounts/AddAccountButton";
import { useAccountStore } from "../../stores/useAccountStore";
import { PremiumSheet } from "../ui/PremiumSheet";

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

const formatCurrency = (amount: number, currency: string = "CLP") => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "CLP" ? 0 : 2,
    maximumFractionDigits: currency === "CLP" ? 0 : 2,
  }).format(amount);
};

export const AccountsCarousel = () => {
  const navigation = useNavigation<any>();
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);

  const accounts = useAccountStore((state) => state.accounts);
  const MAX_ACCOUNTS = 3;
  const currentCount = accounts.length;
  const isLimitReached = currentCount >= MAX_ACCOUNTS;
  const isLoading = useAccountStore((state) => state.isLoading);

  console.log(accounts);

  const USE_STACKED_VIEW = true;

  const handleCardPress = (id: string) => {
    setActiveCardId((prev) => (prev === id ? null : id));
  };

  return (
    <YStack space="$4" marginBottom="$4" marginTop="$4">
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        paddingHorizontal="$4"
      >
        <YStack>
          <Text fontSize="$5" fontWeight="800" color="$color">
            Mis Cuentas
          </Text>
          <XStack alignItems="center" space="$1.5">
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
        </YStack>
        <Button
          size="$2"
          chromeless
          color="$brand"
          fontWeight="700"
          onPress={() => navigation.navigate("Accounts")}
        >
          Ver todas
        </Button>
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
                if (isLimitReached) {
                  setShowPremiumSheet(true);
                } else {
                  navigation.navigate("AddAccount");
                }
              }}
              isStacked={USE_STACKED_VIEW}
              isLocked={isLimitReached}
            />
            {accounts.map((account, index) => {
              const isLastItem = index === accounts.length - 1;
              const accountForUI = {
                ...account,
                balance: formatCurrency(
                  Number(account.balance || 0),
                  account.currency || "CLP"
                ),
                icon: getIconByType(account.type),
                color: account.color ? account.color : "#1E293B",
              };

              return (
                <AccountCard
                  key={account.id}
                  account={accountForUI}
                  index={index}
                  isActive={activeCardId === account.id}
                  onPress={() => handleCardPress(account.id)}
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
        description="El plan gratuito permite hasta 3 cuentas. Pásate a WOU+ para agregar todas las que quieras."
      />
    </YStack>
  );
};
