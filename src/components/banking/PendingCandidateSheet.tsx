import React, { useEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  Sheet,
  YStack,
  XStack,
  Text,
  Input,
  Button,
} from "tamagui";
import {
  Calendar,
  X,
  Trash2,
  CheckCircle2,
  Users,
  Banknote,
  AlertCircle,
} from "@tamagui/lucide-icons";
import { NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Account } from "../../types/account.types";
import {
  BankingCandidate,
  BankingCandidateOverrides,
} from "../../types/banking.types";
import { TransactionDatePicker } from "../transactions/TransactionDatePicker";
import { CategorySelector } from "../transactions/CategorySelector";
import { AccountSelector } from "../transactions/AccountSelector";
import { sanitizeEmailSnippet } from "../../utils/sanitizeEmailSnippet";
import { useBudgetStore } from "../../stores/useBudgetStore";

interface PendingCandidateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: BankingCandidate | null;
  accounts: Account[];
  onConfirm: (
    id: string,
    overrides: BankingCandidateOverrides
  ) => Promise<void>;
  onIgnore: (id: string) => Promise<void>;
  navigation: NavigationProp<any>;
}

const ACTION_STYLES = {
  confirm: {
    bg: "#E7F8EF",
    border: "#B7E9CE",
    text: "#15803D",
  },
  ignore: {
    bg: "#FFE8E5",
    border: "#F7C6C0",
    text: "#B91C1C",
  },
};

export const PendingCandidateSheet = ({
  open,
  onOpenChange,
  candidate,
  accounts,
  onConfirm,
  onIgnore,
  navigation,
}: PendingCandidateSheetProps) => {
  const insets = useSafeAreaInsets();
  const lastInitId = React.useRef<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [date, setDate] = useState(new Date());
  const budgets = useBudgetStore((state) => state.budgets);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);

  const defaultAccountId = useMemo(() => {
    const cash =
      accounts.find((acc) => acc.type?.toUpperCase() === "CASH") ||
      accounts.find((acc) => acc.type?.toUpperCase() === "WALLET") ||
      accounts[0];
    return cash?.id || "";
  }, [accounts]);

  const resolvedAccountId = useMemo(() => {
    if (accountId) return accountId;
    return defaultAccountId;
  }, [accountId, defaultAccountId]);

  const selectedBudget = useMemo(() => {
    if (!categoryId) return null;

    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    return (
      budgets.find(
        (b) =>
          b.category?.id === categoryId &&
          b.month === currentMonth &&
          b.year === currentYear
      ) || null
    );
  }, [budgets, categoryId, date]);

  useEffect(() => {
    if (!open) {
      lastInitId.current = null;
      return;
    }
    if (!candidate) return;
    if (lastInitId.current === candidate.id) return;
    lastInitId.current = candidate.id;
    setAmount(
      candidate.amount !== undefined && candidate.amount !== null
        ? String(candidate.amount)
        : ""
    );
    setDescription(candidate.description ?? "");
    setMerchant(candidate.merchant ?? "");
    setCategoryId(
      candidate.categoryId ||
        candidate.suggestedCategory?.id ||
        candidate.suggestedCategoryId ||
        ""
    );
    setAccountId(candidate.accountId || candidate.account?.id || defaultAccountId);
    setDate(candidate.occurredAt ? new Date(candidate.occurredAt) : new Date());
  }, [open, candidate?.id, accounts]);

  const handleConfirm = async () => {
    if (!candidate) return;
    setIsSaving(true);
    try {
      const overrides: BankingCandidateOverrides = {};
      const originalCategory =
        candidate.categoryId ||
        candidate.suggestedCategory?.id ||
        candidate.suggestedCategoryId ||
        "";
      const originalAccount = candidate.accountId || candidate.account?.id || "";
      const originalAmount = Number(candidate.amount ?? 0);
      const originalDate = candidate.occurredAt
        ? new Date(candidate.occurredAt).toISOString()
        : null;
      const nextAmount = amount ? Number(amount) : 0;
      const nextDate = date.toISOString();

      if (resolvedAccountId && resolvedAccountId !== originalAccount) {
        overrides.accountId = resolvedAccountId;
      }
      if (categoryId && categoryId !== originalCategory) {
        overrides.categoryId = categoryId;
      }
      if (Number.isFinite(nextAmount) && nextAmount !== originalAmount) {
        overrides.amount = nextAmount;
      }
      if (!originalDate || nextDate !== originalDate) {
        overrides.occurredAt = nextDate;
      }
      if ((candidate.description ?? "") !== description) {
        overrides.description = description || null;
      }
      if ((candidate.merchant ?? "") !== merchant) {
        overrides.merchant = merchant || null;
      }

      await onConfirm(candidate.id, overrides);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleIgnore = async () => {
    if (!candidate) return;
    setIsIgnoring(true);
    try {
      await onIgnore(candidate.id);
      onOpenChange(false);
    } finally {
      setIsIgnoring(false);
    }
  };

  if (!candidate) {
    return null;
  }

  const emailSnippet = sanitizeEmailSnippet(candidate.email?.snippet);

  return (
    <>
      <Sheet
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[90]}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame backgroundColor="$background">
          <YStack flex={1} padding="$4" space="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <YStack>
                <Text fontSize="$6" fontWeight="800">
                  Revisar movimiento
                </Text>
                <Text fontSize="$3" color="$gray10">
                  Ajusta los datos antes de confirmar.
                </Text>
              </YStack>
              <XStack space="$2" alignItems="center">
                <Button
                  size="$3"
                  circular
                  chromeless
                  icon={<Trash2 size={20} color="$red10" />}
                  onPress={handleIgnore}
                  disabled={isIgnoring}
                />
                <Button
                  size="$3"
                  circular
                  chromeless
                  icon={<X size={20} color="$gray10" />}
                  onPress={() => onOpenChange(false)}
                />
              </XStack>
            </XStack>

            <XStack>
              <XStack
                paddingHorizontal="$3"
                paddingVertical={3}
                borderRadius="$8"
                backgroundColor="#FFE7D6"
                borderWidth={1}
                borderColor="#F4C6A6"
              >
                <Text fontSize={10} fontWeight="700" color="#EA580C">
                  Pendiente
                </Text>
              </XStack>
            </XStack>

            <YStack flex={1}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                nestedScrollEnabled
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                <YStack space="$3">
                <YStack>
                  <Text
                    fontSize={11}
                    color="$gray9"
                    fontWeight="700"
                    textTransform="uppercase"
                    marginBottom="$2"
                  >
                    Monto
                  </Text>
                  <Input
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    fontSize="$8"
                    fontWeight="800"
                    color="$color"
                    borderWidth={0}
                    backgroundColor="transparent"
                    padding={0}
                  />
                </YStack>

                <YStack>
                  <Text
                    fontSize={11}
                    color="$gray9"
                    fontWeight="700"
                    textTransform="uppercase"
                    marginBottom="$2"
                  >
                    Fecha
                  </Text>
                  <Button
                    variant="outlined"
                    borderColor="$borderColor"
                    icon={<Calendar size={16} />}
                    justifyContent="flex-start"
                    onPress={() => setDatePickerOpen(true)}
                  >
                    {date.toLocaleDateString("es-CL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </Button>
                </YStack>

                <YStack>
                  <Text
                    fontSize={11}
                    color="$gray9"
                    fontWeight="700"
                    textTransform="uppercase"
                    marginBottom="$2"
                  >
                    Descripción
                  </Text>
                  <Input
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Sin descripción"
                    backgroundColor="$gray2"
                  />
                </YStack>

                <YStack>
                  <Text
                    fontSize={11}
                    color="$gray9"
                    fontWeight="700"
                    textTransform="uppercase"
                    marginBottom="$2"
                  >
                    Comercio
                  </Text>
                  <Input
                    value={merchant}
                    onChangeText={setMerchant}
                    placeholder="Sin comercio"
                    backgroundColor="$gray2"
                  />
                </YStack>

                <YStack>
                  <Text
                    fontSize={11}
                    color="$gray9"
                    fontWeight="700"
                    textTransform="uppercase"
                    marginBottom="$2"
                  >
                    Cuenta
                  </Text>
                  <AccountSelector
                    accounts={accounts}
                    selectedId={resolvedAccountId}
                    onSelect={setAccountId}
                  />
                </YStack>

                <YStack space="$2">
                  <CategorySelector
                    selectedId={categoryId}
                    onSelect={setCategoryId}
                    navigation={navigation}
                    embedded
                    showColors
                    onAddCategory={() => {
                      onOpenChange(false);
                      InteractionManager.runAfterInteractions(() => {
                        navigation.navigate("ManageCategories");
                      });
                    }}
                  />
                </YStack>

                {selectedBudget && (
                  <YStack
                    paddingHorizontal="$1"
                    animation="quick"
                    enterStyle={{ opacity: 0 }}
                  >
                    <Text
                      fontSize={10}
                      color="$gray9"
                      fontWeight="700"
                      marginBottom={4}
                      textTransform="uppercase"
                    >
                      Se descontará de:
                    </Text>
                    <Button
                      size="$3"
                      backgroundColor={
                        selectedBudget.type === "SHARED"
                          ? "$purple3"
                          : "$blue3"
                      }
                      borderColor={
                        selectedBudget.type === "SHARED"
                          ? "$purple8"
                          : "$blue8"
                      }
                      borderWidth={1}
                      borderRadius="$4"
                      justifyContent="flex-start"
                      icon={
                        selectedBudget.type === "SHARED" ? (
                          <Users size={16} color="$purple10" />
                        ) : (
                          <Banknote size={16} color="$blue10" />
                        )
                      }
                    >
                      <XStack
                        justifyContent="space-between"
                        flex={1}
                        alignItems="center"
                      >
                        <Text
                          color={
                            selectedBudget.type === "SHARED"
                              ? "$purple10"
                              : "$blue10"
                          }
                          fontWeight="700"
                          fontSize={12}
                        >
                          {selectedBudget.name ||
                            selectedBudget.category?.name ||
                            "Presupuesto"}
                        </Text>
                        <Text fontSize={10} color="$gray10">
                          Quedan $
                          {(
                            selectedBudget.amount -
                            (selectedBudget.progress?.spent || 0)
                          ).toLocaleString()}
                        </Text>
                      </XStack>
                    </Button>
                  </YStack>
                )}

                {!selectedBudget && categoryId && (
                  <YStack paddingHorizontal="$1" opacity={0.6}>
                    <XStack space="$2" alignItems="center">
                      <AlertCircle size={12} color="$gray8" />
                      <Text fontSize={10} color="$gray8">
                        Este gasto no afectará ningún presupuesto.
                      </Text>
                    </XStack>
                  </YStack>
                )}

                {candidate?.email && (
                  <YStack
                    backgroundColor="$gray1"
                    borderRadius="$8"
                    padding="$3"
                    borderWidth={1}
                    borderColor="$borderColor"
                    space="$1"
                  >
                    <Text fontSize={11} color="$gray9" fontWeight="700">
                      Correo original
                    </Text>
                    {candidate.email?.from && (
                      <Text fontSize={12} color="$gray11">
                        De: {candidate.email.from}
                      </Text>
                    )}
                    {candidate.email?.subject && (
                      <Text fontSize={12} color="$gray11">
                        Asunto: {candidate.email.subject}
                      </Text>
                    )}
                    {emailSnippet && (
                      <Text fontSize={11} color="$gray9">
                        {emailSnippet}
                      </Text>
                    )}
                  </YStack>
                )}
                </YStack>
              </ScrollView>
            </YStack>

            <YStack
              space="$2"
              marginTop="$2"
              paddingTop="$3"
              paddingBottom={Math.max(insets.bottom, 14)}
              borderTopWidth={1}
              borderColor="$borderColor"
              backgroundColor="$background"
              shadowColor="$shadowColor"
              shadowOpacity={0.08}
              shadowRadius={10}
              shadowOffset={{ width: 0, height: -4 }}
            >
              <Button
                height={52}
                borderRadius="$12"
                backgroundColor={ACTION_STYLES.confirm.bg}
                borderWidth={1}
                borderColor={ACTION_STYLES.confirm.border}
                disabled={isSaving}
                opacity={isSaving ? 0.7 : 1}
                pressStyle={{ opacity: 0.9 }}
                onPress={handleConfirm}
              >
                <XStack alignItems="center" space="$2">
                  <CheckCircle2 size={18} color={ACTION_STYLES.confirm.text} />
                  <Text
                    fontSize={15}
                    fontWeight="800"
                    color={ACTION_STYLES.confirm.text}
                  >
                    {isSaving ? "Confirmando..." : "Confirmar"}
                  </Text>
                </XStack>
              </Button>
              <Button
                height={52}
                borderRadius="$12"
                backgroundColor={ACTION_STYLES.ignore.bg}
                borderWidth={1}
                borderColor={ACTION_STYLES.ignore.border}
                disabled={isIgnoring}
                opacity={isIgnoring ? 0.7 : 1}
                pressStyle={{ opacity: 0.9 }}
                onPress={handleIgnore}
              >
                <XStack alignItems="center" space="$2">
                  <X size={16} color={ACTION_STYLES.ignore.text} />
                  <Text
                    fontSize={14}
                    fontWeight="700"
                    color={ACTION_STYLES.ignore.text}
                  >
                    {isIgnoring ? "Ignorando..." : "Ignorar"}
                  </Text>
                </XStack>
              </Button>
            </YStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <TransactionDatePicker
        open={isDatePickerOpen}
        onOpenChange={setDatePickerOpen}
        value={date}
        onChange={setDate}
      />
    </>
  );
};
