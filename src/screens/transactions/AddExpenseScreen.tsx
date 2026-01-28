import React, { useState, useEffect, useMemo } from "react";
import { YStack, XStack, Text, Input, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Calendar,
  Users,
  Banknote,
  AlertCircle,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { NumericKeypad } from "../../components/transactions/NumericKeypad";
import { CategorySelector } from "../../components/transactions/CategorySelector";
import { useToastStore } from "../../stores/useToastStore";
import { useBudgetStore } from "../../stores/useBudgetStore";
import { TransactionActions } from "../../actions/transactionActions";
import { AccountSelector } from "../../components/transactions/AccountSelector";
import { useAccountStore } from "../../stores/useAccountStore";
import { ScrollView } from "react-native-gesture-handler";
import { BudgetActions } from "../../actions/budgetActions";
import { TransactionDatePicker } from "../../components/transactions/TransactionDatePicker";

export default function AddExpenseScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const showToast = useToastStore((state) => state.showToast);
  const budgets = useBudgetStore((state) => state.budgets);
  const accounts = useAccountStore((state) => state.accounts);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState("");

  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts]);

  useEffect(() => {
    BudgetActions.loadBudgets();
  }, []);

  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1");
  const [date, setDate] = useState(new Date());

  const selectedBudget = useMemo(() => {
    if (!selectedCategory) return null;

    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();

    return (
      budgets.find(
        (b) =>
          b.category.id === selectedCategory &&
          b.month === currentMonth &&
          b.year === currentYear
      ) || null
    );
  }, [selectedCategory, budgets, date]);

  const handleKeyPress = (val: string) => {
    if (val === "." && amount.includes(".")) return;
    if (amount === "0" && val !== ".") {
      setAmount(val);
    } else {
      if (amount.replace(".", "").length < 9) {
        setAmount((prev) => prev + val);
      }
    }
  };

  const handleDelete = () => {
    if (amount.length === 1) {
      setAmount("0");
    } else {
      setAmount((prev) => prev.slice(0, -1));
    }
  };

  const handleSave = async () => {
    if (amount === "0") {
      showToast("Ingresa un monto válido", "error");
      return;
    }
    if (!selectedAccountId) {
      showToast("Selecciona una cuenta de pago", "error");
      return;
    }

    try {
      await TransactionActions.createTransaction({
        amount: Number(amount),
        type: "EXPENSE",
        accountId: selectedAccountId,
        categoryId: selectedCategory,
        budgetId: selectedBudget?.id,
        description: description,
        date: date.toISOString(),
      });

      showToast("Gasto registrado exitosamente", "success");
      navigation.goBack();
    } catch (error) {
      showToast("Error al guardar", "error");
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <XStack alignItems="center" padding="$4" justifyContent="space-between">
        <Button
          circular
          size="$3"
          chromeless
          icon={<ChevronLeft size={28} color="$color" />}
          onPress={() => navigation.goBack()}
        />
        <Text fontSize="$4" fontWeight="800" color="$gray11">
          Nuevo Gasto
        </Text>
        <Button size="$3" chromeless width={40} />
      </XStack>

      <YStack
        paddingVertical="$2"
        justifyContent="center"
        alignItems="center"
        space="$2"
      >
        <Text fontSize="$9" fontWeight="900" color="$red10" textAlign="center">
          -${amount}
        </Text>
        <Button
          size="$2"
          chromeless
          icon={<Calendar size={14} color="$gray10" />}
          color="$gray10"
          onPress={() => setDatePickerOpen(true)}
        >
          {date.toDateString() === new Date().toDateString()
            ? `Hoy, ${date.toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}`
            : date.toLocaleDateString("es-ES", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
        </Button>
      </YStack>

      <YStack
        flex={1}
        backgroundColor="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        paddingTop="$5"
        shadowColor="$shadowColor"
        shadowRadius={10}
        shadowOpacity={0.1}
        elevation={5}
        /* overflow="hidden" */
      >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          space="$6"
        >
          <XStack paddingHorizontal="$4">
            <Input
              placeholder="¿En qué gastaste? (Opcional)"
              value={description}
              onChangeText={setDescription}
              backgroundColor="$gray2"
              borderWidth={0}
              borderRadius="$4"
              color="$color"
              fontWeight="500"
              style={{ fontSize: 12 }}
            />
          </XStack>

          <YStack space="$2" marginBottom="$3">
            <XStack paddingHorizontal="$4" zIndex={0}>
              <Text
                fontSize={11}
                color="$gray9"
                fontWeight="700"
                textTransform="uppercase"
              >
                Pagar desde
              </Text>
            </XStack>
            <AccountSelector
              accounts={accounts}
              selectedId={selectedAccountId}
              onSelect={setSelectedAccountId}
            />
          </YStack>

          <CategorySelector
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {selectedBudget && (
            <YStack
              paddingHorizontal="$4"
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
                  selectedBudget.type === "SHARED" ? "$purple3" : "$blue3"
                }
                borderColor={
                  selectedBudget.type === "SHARED" ? "$purple8" : "$blue8"
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
                      selectedBudget.type === "SHARED" ? "$purple10" : "$blue10"
                    }
                    fontWeight="700"
                    fontSize={12}
                  >
                    {selectedBudget.name}
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

          {!selectedBudget && selectedCategory && (
            <YStack paddingHorizontal="$4" opacity={0.5}>
              <XStack space="$2" alignItems="center">
                <AlertCircle size={12} color="$gray8" />
                <Text fontSize={10} color="$gray8">
                  Este gasto no afectará ningún presupuesto.
                </Text>
              </XStack>
            </YStack>
          )}
        </ScrollView>
        <NumericKeypad
          onPress={handleKeyPress}
          onDelete={handleDelete}
          onConfirm={handleSave}
        />
      </YStack>
      <TransactionDatePicker
        open={isDatePickerOpen}
        onOpenChange={setDatePickerOpen}
        value={date}
        onChange={setDate}
      />
    </YStack>
  );
}
