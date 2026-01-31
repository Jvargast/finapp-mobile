import React, { useState, useEffect, useMemo } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Input, Button, Sheet } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Calendar } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { NumericKeypad } from "../../components/transactions/NumericKeypad";
import { TransactionDatePicker } from "../../components/transactions/TransactionDatePicker";
import { TransferRouteSelector } from "../../components/transactions/TransferRouteSelector";
import { AccountSelector } from "../../components/transactions/AccountSelector";
import { useToastStore } from "../../stores/useToastStore";
import { useAccountStore } from "../../stores/useAccountStore";
import { TransactionActions } from "../../actions/transactionActions";
import { useCategoryStore } from "../../stores/useCategoryStore";

export default function AddTransferScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const showToast = useToastStore((state) => state.showToast);
  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoryStore((state) => state.categories);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [amount, setAmount] = useState("0");
  const [description, setDescription] = useState("");
  const [originAccountId, setOriginAccountId] = useState(() =>
    accounts.length > 0 ? accounts[0].id : ""
  );

  const [destinationAccountId, setDestinationAccountId] = useState(() => {
    if (accounts.length > 1) {
      const firstId = accounts[0].id;
      const nextAccount = accounts.find((a) => a.id !== firstId);
      return nextAccount ? nextAccount.id : firstId;
    }
    return accounts.length > 0 ? accounts[0].id : "";
  });

  const [selectionMode, setSelectionMode] = useState<
    "ORIGIN" | "DESTINATION" | null
  >(null);

  const originAccount = useMemo(
    () => accounts.find((a) => a.id === originAccountId),
    [originAccountId, accounts]
  );
  const destinationAccount = useMemo(
    () => accounts.find((a) => a.id === destinationAccountId),
    [destinationAccountId, accounts]
  );

  const handleKeyPress = (val: string) => {
    if (val === "." && amount.includes(".")) return;
    if (amount === "0" && val !== ".") setAmount(val);
    else if (amount.replace(".", "").length < 9)
      setAmount((prev) => prev + val);
  };

  const handleDelete = () => {
    if (amount.length === 1) setAmount("0");
    else setAmount((prev) => prev.slice(0, -1));
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    if (amount === "0") {
      showToast("Ingresa un monto válido", "error");
      return;
    }
    if (!originAccountId) {
      showToast("Selecciona la cuenta de origen", "error");
      return;
    }
    if (!destinationAccountId) {
      showToast("Selecciona la cuenta de destino", "error");
      return;
    }
    if (originAccountId === destinationAccountId) {
      showToast("La cuenta de destino debe ser diferente", "error");
      return;
    }

    const transferCategory =
      categories.find((c) => c.type === "TRANSFER") || categories[0];

    if (!transferCategory) {
      showToast("Error crítico: No hay categorías configuradas", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await TransactionActions.createTransaction({
        amount: Number(amount),
        type: "TRANSFER",
        accountId: originAccountId,
        destinationAccountId: destinationAccountId,
        categoryId: transferCategory.id,
        description: description.trim() || "Transferencia",
        date: date.toISOString(),
      });

      showToast("Transferencia realizada", "success");
      navigation.goBack();
    } catch (error) {
      console.error("Error creando transferencia:", error);
      showToast("Error al realizar la transferencia", "error");
      setIsSubmitting(false);
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
          Transferir
        </Text>
        <Button size="$3" chromeless width={40} />
      </XStack>

      <YStack
        paddingVertical="$2"
        justifyContent="center"
        alignItems="center"
        space="$2"
      >
        <Text fontSize="$9" fontWeight="900" color="$blue10" textAlign="center">
          ${Number(amount).toLocaleString("es-CL")}
        </Text>
        <Button
          size="$2"
          chromeless
          icon={<Calendar size={14} color="$gray10" />}
          color="$gray10"
          onPress={() => setDatePickerOpen(true)}
        >
          {date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
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
        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <XStack paddingHorizontal="$4" marginBottom="$4">
            <Input
              placeholder="Nota (Opcional)"
              value={description}
              onChangeText={setDescription}
              backgroundColor="$gray2"
              borderWidth={0}
              borderRadius="$4"
              color="$color"
              fontWeight="500"
              fontSize={13}
            />
          </XStack>

          <TransferRouteSelector
            originAccount={originAccount}
            destinationAccount={destinationAccount}
            onPressOrigin={() => setSelectionMode("ORIGIN")}
            onPressDestination={() => setSelectionMode("DESTINATION")}
          />
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

      <Sheet
        forceRemoveScrollEnabled={isDatePickerOpen}
        modal
        open={!!selectionMode}
        onOpenChange={(open) => !open && setSelectionMode(null)}
        snapPoints={[40]}
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
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <YStack space="$4">
            <Text fontSize="$6" fontWeight="800" textAlign="center">
              {selectionMode === "ORIGIN"
                ? "Seleccionar Origen"
                : "Seleccionar Destino"}
            </Text>

            <AccountSelector
              accounts={accounts.filter((acc) => {
                if (selectionMode === "ORIGIN")
                  return acc.id !== destinationAccountId;
                if (selectionMode === "DESTINATION")
                  return acc.id !== originAccountId;
                return true;
              })}
              selectedId={
                selectionMode === "ORIGIN"
                  ? originAccountId
                  : destinationAccountId
              }
              onSelect={(id) => {
                if (selectionMode === "ORIGIN") setOriginAccountId(id);
                else setDestinationAccountId(id);
                setSelectionMode(null);
              }}
            />
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </YStack>
  );
}
