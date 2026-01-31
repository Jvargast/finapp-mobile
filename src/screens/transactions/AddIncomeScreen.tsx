import React, { useState, useEffect } from "react";
import { YStack, XStack, Text, Input, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Calendar } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { NumericKeypad } from "../../components/transactions/NumericKeypad";
import { CategorySelector } from "../../components/transactions/CategorySelector";
import { useToastStore } from "../../stores/useToastStore";
import { TransactionActions } from "../../actions/transactionActions";
import { AccountSelector } from "../../components/transactions/AccountSelector";
import { useAccountStore } from "../../stores/useAccountStore";
import { ScrollView } from "react-native-gesture-handler";
import { TransactionDatePicker } from "../../components/transactions/TransactionDatePicker";

export default function AddIncomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const showToast = useToastStore((state) => state.showToast);
  const accounts = useAccountStore((state) => state.accounts);

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);

  const [selectedAccountId, setSelectedAccountId] = useState(() =>
    accounts.length > 0 ? accounts[0].id : ""
  );

  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [date, setDate] = useState(new Date());

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
      showToast("Selecciona dónde depositar", "error");
      return;
    }
    if (!selectedCategory) {
      showToast("Selecciona una categoría", "error");
      return;
    }

    try {
      await TransactionActions.createTransaction({
        amount: Number(amount),
        type: "INCOME",
        accountId: selectedAccountId,
        categoryId: selectedCategory,
        description: description,
        date: date.toISOString(),
      });

      showToast("Ingreso registrado correctamente", "success");
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
          onPressIn={() => navigation.goBack()}
        />
        <XStack alignItems="center" space="$2">
          <Text fontSize="$4" fontWeight="800" color="$gray11">
            Nuevo Ingreso
          </Text>
        </XStack>
        <Button size="$3" chromeless width={40} />
      </XStack>

      <YStack
        paddingVertical="$2"
        justifyContent="center"
        alignItems="center"
        space="$2"
      >
        <Text
          fontSize="$9"
          fontWeight="900"
          color="$green10"
          textAlign="center"
        >
          +${amount}
        </Text>
        <Button
          size="$2"
          chromeless
          icon={<Calendar size={14} color="$gray10" />}
          color="$gray10"
          onPressIn={() => setDatePickerOpen(true)}
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
      >
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          space="$6"
        >
          <XStack paddingHorizontal="$4">
            <Input
              placeholder="Descripción (Ej: Sueldo, Regalo...)"
              value={description}
              onChangeText={setDescription}
              backgroundColor="$gray2"
              borderWidth={0}
              borderRadius="$4"
              color="$color"
              fontWeight="500"
              style={{ fontSize: 14 }}
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
                Depositar en
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
            navigation={navigation}
          />
        </ScrollView>

        <NumericKeypad
          onPress={handleKeyPress}
          onDelete={handleDelete}
          onConfirm={handleSave}
          confirmColor="$green10"
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
