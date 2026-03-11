import { YStack, Text, XStack, Button, Stack, useThemeName } from "tamagui";
import {
  Eye,
  EyeOff,
  CreditCard,
  Banknote,
  Landmark,
} from "@tamagui/lucide-icons";
import { useState, useMemo, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";
import { useAccountStore } from "../../stores/useAccountStore";
import { Account } from "../../types/account.types";
import { TransactionService } from "../../services/transactionService";
import {
  convertAmount,
  getCurrencySymbol,
  getFractionDigits,
  resolveCurrency,
  resolveTransactionCurrency,
} from "../../utils/currency";
import { getBalancePalette, withAlpha } from "../../theme/appVisuals";

const PAGE_SIZE = 100;

const getMonthParts = (date: Date) => ({
  month: date.getMonth() + 1,
  year: date.getFullYear(),
});

const sumMovementType = (type: string, amount: number) => {
  const value = Math.abs(Number(amount || 0));
  if (type === "INCOME") return { income: value, expense: 0 };
  if (type === "EXPENSE")
    return { income: 0, expense: value };
  return { income: 0, expense: 0 };
};

const resolveBaseCurrencyFromAccounts = (accounts: Account[]) => {
  const orderedCandidates = [
    accounts.find((account) => {
      const type = String(account.type || "").toUpperCase();
      const isCredit =
        Boolean(account.isCredit) ||
        type === "CREDIT_CARD" ||
        type === "CREDIT";
      return !isCredit && type !== "CASH";
    })?.currency,
    accounts.find((account) => String(account.type || "").toUpperCase() === "CASH")
      ?.currency,
    accounts[0]?.currency,
    "CLP",
  ];

  return resolveCurrency(orderedCandidates.find(Boolean));
};

const capitalize = (value: string) =>
  value.length > 0 ? value.charAt(0).toUpperCase() + value.slice(1) : value;

export const BalanceCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [monthlyDebitTotal, setMonthlyDebitTotal] = useState(0);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const accounts = useAccountStore((state) => state.accounts);
  const baseCurrency = useMemo(
    () => resolveBaseCurrencyFromAccounts(accounts),
    [accounts]
  );

  const { cashTotal, creditTotal } = useMemo(() => {
    return accounts.reduce(
      (acc, account) => {
        const val = convertAmount(
          Number(account.balance || 0),
          account.currency,
          baseCurrency
        );
        const type = (account.type || "").toUpperCase();
        const isCredit =
          Boolean(account.isCredit) ||
          type === "CREDIT_CARD" ||
          type === "CREDIT";

        if (isCredit) {
          acc.creditTotal += val;
          return acc;
        }

        if (type === "CASH") {
          acc.cashTotal += val;
        }
        return acc;
      },
      { cashTotal: 0, creditTotal: 0 }
    );
  }, [accounts, baseCurrency]);

  const monthlyNet = monthlyIncome - monthlyExpense;
  const monthBalanceWithCash = monthlyNet + cashTotal;
  const now = new Date();
  const monthLabel = capitalize(
    now.toLocaleDateString("es-CL", { month: "long" })
  );

  const loadCurrentMonthBalance = useCallback(() => {
    let isActive = true;

    const run = async () => {
      setIsMonthlyLoading(true);
      try {
        const today = new Date();
        const { month, year } = getMonthParts(today);
        const accountMetaById = new Map(
          accounts.map((account) => {
            const normalizedType = String(account.type || "").toUpperCase();
            const isCredit =
              Boolean(account.isCredit) ||
              normalizedType === "CREDIT_CARD" ||
              normalizedType === "CREDIT";
            const isCash = normalizedType === "CASH";
            return [account.id, { isCredit, isCash }] as const;
          }),
        );

        let page = 1;
        let offset = 0;
        let income = 0;
        let expense = 0;
        let debitMonthTotal = 0;
        let keepLoading = true;

        while (keepLoading) {
          const response = await TransactionService.getAll({
            month,
            year,
            limit: PAGE_SIZE,
            offset,
          });

          (response.data || []).forEach((tx) => {
            const sourceCurrency = resolveTransactionCurrency(tx);
            const convertedAmount = convertAmount(
              Number(tx.amount || 0),
              sourceCurrency,
              baseCurrency
            );
            const totals = sumMovementType(tx.type, convertedAmount);
            income += totals.income;
            expense += totals.expense;

            const accountMeta = accountMetaById.get(tx.accountId);
            const txAccountType = String(tx.account?.type || "").toUpperCase();
            const isCredit =
              Boolean(accountMeta?.isCredit) ||
              txAccountType === "CREDIT_CARD" ||
              txAccountType === "CREDIT";
            const isCash = Boolean(accountMeta?.isCash) || txAccountType === "CASH";
            const isDebit = !isCredit && !isCash;

            if (!isDebit) return;

            const amount = Math.abs(convertedAmount);
            if (tx.type === "INCOME") debitMonthTotal += amount;
            if (tx.type === "EXPENSE" || tx.type === "TRANSFER")
              debitMonthTotal -= amount;
          });

          const lastPage = response.meta?.lastPage || page;
          const reachedLastPage = page >= lastPage;
          const reachedEndBySize = (response.data?.length || 0) < PAGE_SIZE;

          if (reachedLastPage || reachedEndBySize) {
            keepLoading = false;
          } else {
            page += 1;
            offset = (page - 1) * PAGE_SIZE;
          }
        }

        if (!isActive) return;
        setMonthlyIncome(income);
        setMonthlyExpense(expense);
        setMonthlyDebitTotal(debitMonthTotal);
      } catch (error) {
        if (!isActive) return;
        setMonthlyIncome(0);
        setMonthlyExpense(0);
        setMonthlyDebitTotal(0);
      } finally {
        if (isActive) setIsMonthlyLoading(false);
      }
    };

    run();

    return () => {
      isActive = false;
    };
  }, [accounts, baseCurrency]);

  useFocusEffect(loadCurrentMonthBalance);

  const formatAmount = (amount: number) => {
    const fractionDigits = getFractionDigits(baseCurrency);
    const value = Number.isFinite(amount) ? amount : 0;
    return new Intl.NumberFormat("es-CL", {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value);
  };

  const symbol = getCurrencySymbol(baseCurrency);
  const palette = useMemo(() => getBalancePalette(isDark), [isDark]);

  const breakdownItems = [
    {
      id: "debit",
      label: "Débito",
      icon: Landmark,
      color: palette.accent,
      soft: palette.accentSoft,
      value: monthlyDebitTotal,
    },
    {
      id: "cash",
      label: "Efectivo",
      icon: Banknote,
      color: palette.positive,
      soft: withAlpha(palette.positive, isDark ? 0.16 : 0.14, palette.surface),
      value: cashTotal,
    },
    {
      id: "credit",
      label: "Crédito",
      icon: CreditCard,
      color: palette.neutral,
      soft: withAlpha(palette.neutral, isDark ? 0.16 : 0.14, palette.surface),
      value: creditTotal,
    },
  ] as const;

  const monthlySummaryItems = [
    {
      id: "income",
      label: "Ingresos",
      value: monthlyIncome,
      color: palette.positive,
    },
    {
      id: "expense",
      label: "Gastos",
      value: monthlyExpense,
      color: palette.negative,
    },
    {
      id: "net",
      label: "Neto",
      value: monthlyNet,
      color: monthlyNet >= 0 ? palette.positive : palette.negative,
    },
  ] as const;

  return (
    <Stack
      position="relative"
      overflow="hidden"
      borderRadius="$8"
      backgroundColor={palette.start}
      borderWidth={1}
      borderColor={palette.border}
      shadowColor={palette.shadow}
      shadowOpacity={isDark ? 0.32 : 0.12}
      shadowRadius={16}
      shadowOffset={{ width: 0, height: 8 }}
      marginBottom="$6"
    >
      <LinearGradient
        colors={[palette.start, palette.end]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      />

      <Stack
        top={-22}
        right={-12}
        width={116}
        height={116}
        borderRadius={999}
        position="absolute"
        backgroundColor={palette.glow}
      />
      <Stack
        bottom={-28}
        left={-18}
        width={124}
        height={124}
        borderRadius={999}
        position="absolute"
        backgroundColor={palette.glowSoft}
      />

      <YStack padding="$4" space="$2.5">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2" alignItems="center">
            <Text color={palette.muted} fontWeight="700" fontSize={12} letterSpacing={0.45}>
              BALANCE DEL MES
            </Text>
            <Stack
              backgroundColor={palette.surface}
              borderRadius="$3"
              borderWidth={1}
              borderColor={palette.surfaceBorder}
              paddingHorizontal="$2"
              paddingVertical="$1"
            >
              <Text fontSize={12} color={palette.accent} fontWeight="700">
                {monthLabel}
              </Text>
            </Stack>
          </XStack>

          <Button
            size="$3"
            circular
            backgroundColor={palette.surface}
            borderWidth={1}
            borderColor={palette.surfaceBorder}
            onPress={() => setShowBalance(!showBalance)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            pressStyle={{ opacity: 0.9 }}
          >
            {showBalance ? (
              <Eye size={18} color={palette.muted} />
            ) : (
              <EyeOff size={18} color={palette.muted} />
            )}
          </Button>
        </XStack>

        <XStack alignItems="baseline" space="$1.5" maxWidth="100%">
          {showBalance && (
            <Text color={palette.muted} fontSize="$5" fontWeight="700">
              {symbol}
            </Text>
          )}

          <Text
            color={palette.ink}
            fontSize="$7"
            fontWeight="900"
            lineHeight={42}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.6}
            flexShrink={1}
          >
            {showBalance
              ? isMonthlyLoading
                ? "..."
                : formatAmount(monthBalanceWithCash)
              : "••••••••"}
          </Text>

          {showBalance && (
            <Text color={palette.muted} fontSize="$3" fontWeight="700">
              {baseCurrency}
            </Text>
          )}
        </XStack>

        <XStack
          backgroundColor={palette.surface}
          borderRadius="$5"
          borderWidth={1}
          borderColor={palette.surfaceBorder}
          overflow="hidden"
        >
          {monthlySummaryItems.map((item, index) => (
            <XStack key={item.id} flex={1} alignItems="stretch">
              <YStack
                flex={1}
                minWidth={0}
                alignItems="center"
                paddingHorizontal="$2"
                paddingVertical="$2.5"
                space="$1"
              >
                <Text color={palette.ink} fontSize={12} fontWeight="700">
                  {item.label}
                </Text>
                <Text
                  color={item.color}
                  fontSize="$3"
                  fontWeight="800"
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.72}
                >
                  {showBalance ? formatAmount(item.value) : "••••"}
                </Text>
              </YStack>
              {index < monthlySummaryItems.length - 1 && (
                <Stack width={1} backgroundColor={palette.surfaceBorder} />
              )}
            </XStack>
          ))}
        </XStack>

        <XStack
          backgroundColor={palette.surface}
          borderRadius="$5"
          borderWidth={1}
          borderColor={palette.surfaceBorder}
          overflow="hidden"
        >
          {breakdownItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <XStack
                key={item.id}
                flex={1}
                alignItems="stretch"
              >
                <YStack
                  flex={1}
                  minWidth={0}
                  alignItems="center"
                  paddingHorizontal="$2"
                  paddingVertical="$2.5"
                  space="$1"
                >
                  <XStack space="$1.5" alignItems="center">
                    <Stack
                      width={18}
                      height={18}
                      borderRadius={9}
                      alignItems="center"
                      justifyContent="center"
                      backgroundColor={item.soft}
                    >
                      <Icon size={10} color={item.color} />
                    </Stack>
                    <Text
                      fontSize={12}
                      color={palette.ink}
                      fontWeight="700"
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  </XStack>
                  <Text
                    fontSize="$3"
                    fontWeight="800"
                    color={palette.ink}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.7}
                  >
                    {showBalance ? formatAmount(item.value) : "••••"}
                  </Text>
                </YStack>
                {index < breakdownItems.length - 1 && (
                  <Stack width={1} backgroundColor={palette.surfaceBorder} />
                )}
              </XStack>
            );
          })}
        </XStack>
      </YStack>
    </Stack>
  );
};
