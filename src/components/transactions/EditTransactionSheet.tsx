import React, { useEffect, useState } from "react";
import { InteractionManager } from "react-native";
import { Sheet, YStack, Text, Input, Button, XStack, Spinner } from "tamagui";
import { Transaction } from "../../types/transaction.types";
import { TransactionActions } from "../../actions/transactionActions";
import { CategorySelector } from "./CategorySelector";
import { TransactionDatePicker } from "./TransactionDatePicker";
import { Calendar, Check } from "@tamagui/lucide-icons";
import { NavigationProp } from "@react-navigation/native";
import { ExpenseModel } from "../../types/expense.types";

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
  const [expenseModel, setExpenseModel] = useState<ExpenseModel>("VARIABLE");

  const [isDatePickerOpen, setDatePickerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && transaction) {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description || "");
      setCategoryId(transaction.categoryId);
      setDate(new Date(transaction.date));
      setExpenseModel(transaction.expenseModel === "FIXED" ? "FIXED" : "VARIABLE");
    }
  }, [open, transaction]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Parameters<typeof TransactionActions.updateTransaction>[1] = {
        amount: Number(amount),
        description,
        categoryId,
        date: date.toISOString(),
      };

      if (transaction.type === "EXPENSE") {
        payload.expenseModel = expenseModel;
      }

      await TransactionActions.updateTransaction(transaction.id, {
        ...payload,
      });
      onOpenChange(false);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCategory = () => {
    onOpenChange(false);
    InteractionManager.runAfterInteractions(() => {
      navigation.navigate("ManageCategories");
    });
  };

  if (!open || !transaction) {
    return null;
  }

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

            {transaction.type === "EXPENSE" && (
              <YStack>
                <Text
                  fontSize={11}
                  color="$gray9"
                  fontWeight="700"
                  textTransform="uppercase"
                  marginBottom="$2"
                >
                  Modelo de gasto
                </Text>
                <XStack space="$2">
                  <Button
                    flex={1}
                    height={40}
                    borderRadius="$4"
                    backgroundColor={expenseModel === "FIXED" ? "$brand" : "$gray2"}
                    borderWidth={1}
                    borderColor={expenseModel === "FIXED" ? "$brand" : "$gray5"}
                    onPress={() => setExpenseModel("FIXED")}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="800"
                      color={expenseModel === "FIXED" ? "white" : "$gray11"}
                    >
                      FIJO
                    </Text>
                  </Button>
                  <Button
                    flex={1}
                    height={40}
                    borderRadius="$4"
                    backgroundColor={
                      expenseModel === "VARIABLE" ? "$brand" : "$gray2"
                    }
                    borderWidth={1}
                    borderColor={expenseModel === "VARIABLE" ? "$brand" : "$gray5"}
                    onPress={() => setExpenseModel("VARIABLE")}
                  >
                    <Text
                      fontSize="$3"
                      fontWeight="800"
                      color={expenseModel === "VARIABLE" ? "white" : "$gray11"}
                    >
                      VARIABLE
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            )}

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
                  onAddCategory={handleAddCategory}
                  transactionType={transaction.type}
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
