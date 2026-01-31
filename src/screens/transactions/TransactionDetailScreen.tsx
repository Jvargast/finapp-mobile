import React, { useEffect, useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Separator,
  Stack,
  Spinner,
} from "tamagui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChevronLeft,
  Trash2,
  Edit3,
  Calendar,
  FileText,
  Wallet,
} from "@tamagui/lucide-icons";
import { useTransactionStore } from "../../stores/useTransactionStore";
import { TransactionActions } from "../../actions/transactionActions";
import { getIcon } from "../../utils/iconMap";
import { DetailRow } from "../../components/transactions/DetailRow";
import { TransactionInsights } from "../../components/transactions/TransactionInsights";
import { EditTransactionSheet } from "../../components/transactions/EditTransactionSheet";
import { DangerModal } from "../../components/ui/DangerModal";

export default function TransactionDetailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { transactionId } = route.params || {};

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (transactionId) {
      TransactionActions.getTransactionDetail(transactionId);
    }
  }, [transactionId]);

  const transaction = useTransactionStore(
    (state) =>
      state.transactions.find((t) => t.id === transactionId) ||
      state.recentTransactions.find((t) => t.id === transactionId)
  );
  const isLoading = useTransactionStore((state) => state.isLoading);

  if (!transaction) {
    if (isLoading) {
      return (
        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          backgroundColor="$background"
        >
          <Spinner size="large" color="$brand" />
        </YStack>
      );
    }
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        backgroundColor="$background"
      >
        <Text>Movimiento no encontrado</Text>
        <Button onPress={() => navigation.goBack()}>Volver</Button>
      </YStack>
    );
  }

  const isExpense =
    transaction.type === "EXPENSE" || transaction.type === "TRANSFER";
  const Icon = getIcon(transaction.category?.icon || "HelpCircle");
  const categoryColor = transaction.category?.color || "$gray8";

  const formattedAmount = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(Number(transaction.amount));

  const dateObj = new Date(transaction.date);
  const formattedDate = dateObj.toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const onConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await TransactionActions.deleteTransaction(transaction.id);

      setIsDeleteModalOpen(false);

      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate("HomeDrawer");
      }
    } catch (error) {
      console.log("Error eliminando", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <XStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        justifyContent="space-between"
        alignItems="center"
        zIndex={10}
      >
        <Button
          circular
          size="$3"
          chromeless
          onPress={() => navigation.goBack()}
          icon={<ChevronLeft size={28} color="$color" />}
        />
        <XStack space="$2">
          <Button
            circular
            size="$3"
            chromeless
            icon={<Edit3 size={20} color="$color" />}
            onPress={() => setIsEditOpen(true)}
          />
          <Button
            circular
            size="$3"
            chromeless
            icon={<Trash2 size={20} color="$red10" />}
            onPress={() => setIsDeleteModalOpen(true)}
          />
        </XStack>
      </XStack>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$8" space="$6">
          <YStack alignItems="center" marginTop="$4" space="$4">
            <Stack
              width={80}
              height={80}
              borderRadius={40}
              backgroundColor={`${categoryColor}20`}
              alignItems="center"
              justifyContent="center"
              shadowColor={categoryColor}
              shadowRadius={20}
              shadowOpacity={0.3}
            >
              <Icon size={40} color={categoryColor} strokeWidth={2} />
            </Stack>
            <YStack alignItems="center" space="$1">
              <Text
                fontSize="$9"
                fontWeight="900"
                color={isExpense ? "$color" : "$green10"}
              >
                {isExpense ? "-" : "+"}
                {formattedAmount}
              </Text>
              <Text fontSize="$5" color="$gray11" fontWeight="600">
                {transaction.category?.name}
              </Text>
            </YStack>
          </YStack>

          <Separator
            marginVertical="$1"
            borderColor="$borderColor"
            opacity={0.5}
          />

          <YStack space="$2">
            <DetailRow
              icon={Calendar}
              label="Fecha y Hora"
              value={formattedDate}
              subValue={formattedTime}
            />
            <DetailRow
              icon={Wallet}
              label={isExpense ? "Pagado con" : "Depositado en"}
              value={transaction.account?.name || "Cuenta desconocida"}
              subValue={transaction.account?.currency}
            />
            {transaction.description ? (
              <DetailRow
                icon={FileText}
                label="Nota"
                value={transaction.description}
              />
            ) : null}
          </YStack>

          <TransactionInsights
            transaction={transaction}
            budget={transaction.budget}
          />

          <YStack alignItems="center">
            <Text fontSize={10} color="$gray8" fontFamily="$mono">
              ID: {transaction.id.split("-")[0].toUpperCase()} • WouFinance
            </Text>
          </YStack>
        </YStack>
      </ScrollView>
      {transaction && (
        <EditTransactionSheet
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          transaction={transaction}
          navigation={navigation}
        />
      )}
      <DangerModal
        visible={isDeleteModalOpen}
        onClose={() => !isDeleting && setIsDeleteModalOpen(false)} 
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
        title="¿Eliminar movimiento?"
        message={
          <YStack space="$2">
            <Text color="$colorQwerty" textAlign="center" fontSize={14}>
              Se revertirá el saldo en tu cuenta asociada.
            </Text>
            <Text color="$gray10" textAlign="center" fontSize={12}>
              Esta acción es permanente y no se puede deshacer.
            </Text>
          </YStack>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </YStack>
  );
}
