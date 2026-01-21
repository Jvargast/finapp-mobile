import React, { useState } from "react";
import { Sheet, YStack, Text, Button, XStack } from "tamagui";
import {
  Pencil,
  Trash2,
  Landmark,
  Wallet,
  Banknote,
  X,
  Lock,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useAccountStore } from "../../../stores/useAccountStore";
import { DangerModal } from "../../ui/DangerModal";
import { Account } from "../../../types/account.types";
import { useSubscription } from "../../../hooks/useSubscription";
import { PremiumSheet } from "../../ui/PremiumSheet";
import { AccountActions } from "../../../actions/accountActions";
import { ActionModal } from "../../ui/ActionModal";

interface AccountOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: Account | null;
}

export const AccountOptionsSheet = ({
  open,
  onOpenChange,
  account,
}: AccountOptionsSheetProps) => {
  const { isPro, canEditCash } = useSubscription();
  const navigation = useNavigation<any>();

  const [showDangerModal, setShowDangerModal] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isCashAccount = account?.type?.toUpperCase() === "CASH";
  const isEditLocked = isCashAccount && !canEditCash;

  if (!account) return null;
  const getVisuals = (type: string = "BANK") => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "CASH":
        return { icon: Banknote, bg: "$green5", color: "$green11" };
      case "WALLET":
        return { icon: Wallet, bg: "$purple5", color: "$purple11" };
      default:
        return { icon: Landmark, bg: "$blue5", color: "$blue11" };
    }
  };

  const { icon: Icon, bg, color } = getVisuals(account.type);

  const formattedBalance = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: account.currency || "CLP",
  }).format(Number(account.balance));

  const handleEdit = () => {
    if (isEditLocked) {
      setShowPremiumSheet(true);
      return;
    }
    onOpenChange(false);
    navigation.navigate("AddAccount", { accountToEdit: account });
  };

  const handleDelete = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      await AccountActions.deleteAccount(account.id);
      setShowDangerModal(false);
      onOpenChange(false);
    } catch (error) {
      setShowErrorModal(true);
      setShowDangerModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[50]}
        dismissOnSnapToBottom
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0,0,0,0.4)"
        />

        <Sheet.Handle backgroundColor="$gray8" opacity={0.3} />

        <Sheet.Frame
          padding="$5"
          backgroundColor="$background"
          borderTopLeftRadius="$9"
          borderTopRightRadius="$9"
          space="$4"
        >
          <XStack justifyContent="center" alignItems="center" marginBottom="$4">
            <Text fontSize="$5" fontWeight="800" color="$gray11">
              Gestionar Cuenta
            </Text>
            <Button
              position="absolute"
              right={0}
              size="$3"
              circular
              chromeless
              icon={X}
              onPress={() => onOpenChange(false)}
            />
          </XStack>
          <XStack
            backgroundColor="$gray2"
            borderRadius="$6"
            padding="$3"
            alignItems="center"
            space="$3"
            borderWidth={1}
            borderColor="$gray4"
            marginBottom="$6"
          >
            <YStack
              backgroundColor={bg}
              width={48}
              height={48}
              borderRadius="$4"
              alignItems="center"
              justifyContent="center"
              borderWidth={1}
              borderColor="rgba(0,0,0,0.05)"
            >
              <Icon size={24} color={color} />
            </YStack>

            <YStack flex={1}>
              <Text
                fontWeight="800"
                fontSize="$4"
                color="$color"
                numberOfLines={1}
              >
                {account.name}
              </Text>
              <XStack alignItems="center" space="$2">
                <Text fontSize="$3" color="$gray10" fontWeight="500">
                  Saldo:
                </Text>
                <Text fontSize="$3" color="$gray11" fontWeight="700">
                  {formattedBalance}
                </Text>
              </XStack>
            </YStack>
          </XStack>
          <YStack space="$4">
            <Button
              size="$5"
              variant="outlined"
              borderColor={isEditLocked ? "$gray5" : "$blue4"}
              backgroundColor={isEditLocked ? "$gray2" : "$blue2"}
              icon={
                isEditLocked ? (
                  <Lock size={16} color="$gray8" />
                ) : (
                  <Pencil size={20} color="$blue10" />
                )
              }
              onPressIn={handleEdit}
              color={isEditLocked ? "$gray8" : "$blue10"}
              fontWeight="700"
              borderRadius="$10"
              opacity={isEditLocked ? 0.7 : 1}
            >
              {isEditLocked ? "Editar (WOU+)" : "Editar Detalles"}
            </Button>

            <Button
              size="$5"
              backgroundColor="$red2"
              borderColor="$red4"
              borderWidth={1}
              icon={<Trash2 size={20} color="$red10" />}
              onPressIn={() => setShowDangerModal(true)}
              color="$red10"
              fontWeight="700"
              borderRadius="$10"
            >
              Eliminar Cuenta
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
      <DangerModal
        visible={showDangerModal}
        onClose={() => setShowDangerModal(false)}
        onConfirm={handleDelete}
        isLoading={isLoading}
        title="¿Eliminar Cuenta?"
        message={`Estás a punto de eliminar "${account.name}". Se perderá el historial de saldo asociado a esta cuenta.`}
        confirmText="Sí, Eliminar"
        cancelText="Cancelar"
      />
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Control de Efectivo Pro"
        description="La edición manual avanzada de cuentas de efectivo es una característica exclusiva de WOU+."
      />
      <ActionModal
        visible={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        onConfirm={() => setShowErrorModal(false)}
        title="Error de Eliminación"
        message="No pudimos eliminar la cuenta. Por favor verifica tu conexión a internet e inténtalo nuevamente."
        variant="error"
        confirmText="Entendido"
        singleButton={true}
      />
    </>
  );
};
