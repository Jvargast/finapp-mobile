import React, { useEffect, useState } from "react";
import { Sheet, YStack, Text, Input, Button, XStack, Spinner } from "tamagui";
import { Transaction } from "../../types/transaction.types";
import { TransactionActions } from "../../actions/transactionActions";
import { CategorySelector } from "./CategorySelector";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { Calendar, Check } from "@tamagui/lucide-icons";
import { NavigationProp } from "@react-navigation/native";

interface EditTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction;
  navigation: NavigationProp<any>;
}

export const EditTransactionSheet = ({
  open,
  onOpenChange,
  transaction,
  navigation,
}: EditTransactionSheetProps) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [date, setDate] = useState(new Date());

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || "");
      setCategoryId(transaction.categoryId);
      setDate(new Date(transaction.date));
    }
  }, [open, transaction]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await TransactionActions.updateTransaction(transaction.id, {
        amount: Number(amount),
        description,
        categoryId,
        date: date.toISOString(),
      });
      onOpenChange(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Sheet
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[85]}
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
        <Sheet.Frame padding="$4" space="$5" backgroundColor="$background">
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize="$6" fontWeight="800">
              Editar Movimiento
            </Text>
            {isSaving ? (
              <Spinner color="$brand" />
            ) : (
              <Button
                size="$3"
                circular
                chromeless
                icon={<Check size={24} color="$brand" />}
                onPress={handleSave}
              />
            )}
          </XStack>

          <YStack space="$4">
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
                color={transaction.type === "EXPENSE" ? "$red10" : "$green10"}
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
                Nota
              </Text>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Sin descripción"
                backgroundColor="$gray2"
              />
            </YStack>

            <YStack flex={1}>
              <Text
                fontSize={11}
                color="$gray9"
                fontWeight="700"
                textTransform="uppercase"
                marginBottom="$2"
              >
                Categoría
              </Text>
              <YStack height={200}>
                <CategorySelector
                  selectedId={categoryId}
                  onSelect={setCategoryId}
                  navigation={navigation}
                />
              </YStack>
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
