import React, { useState } from "react";
import { Sheet, YStack, Text, Button, Input, Label, XStack } from "tamagui";
import { Trash2, Save, LogOut } from "@tamagui/lucide-icons";
import { Budget } from "../../types/budget.types";
import { BudgetActions } from "../../actions/budgetActions";
import { useToastStore } from "../../stores/useToastStore";
import { DangerModal } from "../../components/ui/DangerModal";
import { useNavigation } from "@react-navigation/native";

interface EditBudgetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget;
  currentUserId?: string;
}

export const EditBudgetSheet = ({
  open,
  onOpenChange,
  budget,
  currentUserId,
}: EditBudgetSheetProps) => {
  const navigation = useNavigation<any>();
  const showToast = useToastStore((state) => state.showToast);

  const [name, setName] = useState(budget.name || budget.category.name);
  const [amount, setAmount] = useState(String(budget.amount));
  const [isSaving, setIsSaving] = useState(false);

  const [showDangerModal, setShowDangerModal] = useState(false);
  const [isProcessingDanger, setIsProcessingDanger] = useState(false);

  const isOwner = currentUserId && budget.owner?.id === currentUserId;

  const handleUpdate = async () => {
    if (!isOwner) return;
    setIsSaving(true);
    try {
      await BudgetActions.updateBudget(budget.id, {
        name,
        amount: Number(amount),
      });
      showToast("Presupuesto actualizado", "success");
      onOpenChange(false);
    } catch (error) {
      showToast("Error al actualizar", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDangerAction = async () => {
    setIsProcessingDanger(true);
    try {
      if (isOwner) {
        await BudgetActions.deleteBudget(budget.id);
        showToast("Presupuesto eliminado", "success");
      } else {
        await BudgetActions.leaveBudget(budget.id);
        showToast("Has salido del presupuesto", "success");
      }

      setShowDangerModal(false);
      navigation.goBack();
    } catch (error) {
      showToast("Ocurrió un error", "error");
    } finally {
      setIsProcessingDanger(false);
    }
  };

  return (
    <>
      <Sheet
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[55]}
        dismissOnSnapToBottom
        zIndex={100000}
        moveOnKeyboardChange={true}
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" space="$4" backgroundColor="$background">
          <Text
            fontSize="$6"
            fontWeight="800"
            textAlign="center"
            color="$color"
          >
            {isOwner ? "Editar Presupuesto" : "Detalles del Presupuesto"}
          </Text>

          <YStack space="$2">
            <Label color="$gray11">Nombre</Label>
            <Input
              value={name}
              onChangeText={setName}
              backgroundColor={isOwner ? "$gray2" : "$gray3"}
              borderColor="$gray4"
              editable={!!isOwner}
              opacity={isOwner ? 1 : 0.6}
              color="$color"
            />
          </YStack>

          <YStack space="$2" marginBottom="$4">
            <Label color="$gray11">Monto Límite</Label>
            <Input
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              backgroundColor={isOwner ? "$gray2" : "$gray3"}
              borderColor="$gray4"
              editable={!!isOwner}
              opacity={isOwner ? 1 : 0.6}
            />
          </YStack>

          {isOwner && (
            <Button
              theme="active"
              backgroundColor="$color"
              color="$background"
              icon={isSaving ? undefined : Save}
              onPress={handleUpdate}
              disabled={isSaving}
            >
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          )}

          <YStack borderColor="$gray4" paddingTop="$4">
            <Button
              variant="outlined"
              borderColor={isOwner ? "$red5" : "$orange5"}
              color={isOwner ? "$red10" : "$orange10"}
              icon={isOwner ? Trash2 : LogOut}
              onPressIn={() => setShowDangerModal(true)}
            >
              {isOwner ? "Eliminar Presupuesto" : "Salir del Grupo"}
            </Button>

            {!isOwner && (
              <Text
                fontSize={11}
                color="$gray9"
                textAlign="center"
                marginTop="$2"
              >
                Solo el administrador puede editar los montos.
              </Text>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <DangerModal
        visible={showDangerModal}
        onClose={() => setShowDangerModal(false)}
        onConfirm={handleDangerAction}
        isLoading={isProcessingDanger}
        title={isOwner ? "¿Eliminar Presupuesto?" : "¿Salir del Presupuesto?"}
        message={
          isOwner
            ? "Esta acción es irreversible y eliminará el historial para todos los participantes."
            : "Perderás el acceso a este presupuesto compartido. Podrás volver a entrar si te invitan nuevamente."
        }
        confirmText={isOwner ? "Sí, eliminar" : "Sí, salir"}
        cancelText="Cancelar"
      />
    </>
  );
};
