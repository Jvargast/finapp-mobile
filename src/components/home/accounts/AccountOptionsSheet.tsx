import React, { useState } from "react";
import { Sheet, YStack, Text, Button, XStack } from "tamagui";
import {
  Pencil,
  Trash2,
  Landmark,
  Wallet,
  Banknote,
  Link,
  Eye,
  X,
  Lock,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useAccountStore } from "../../../stores/useAccountStore";
import { DangerModal } from "../../ui/DangerModal";
import {
  Account,
  AccountSetupMethod,
  AccountSetupStatus,
} from "../../../types/account.types";
import { useSubscription } from "../../../hooks/useSubscription";
import { PremiumSheet } from "../../ui/PremiumSheet";
import { AccountActions } from "../../../actions/accountActions";
import { ActionModal } from "../../ui/ActionModal";
import { FintocActions } from "../../../actions/fintocActions";
import { TransactionActions } from "../../../actions/transactionActions";
import { AccountService } from "../../../services/accountService";
import { useToastStore } from "../../../stores/useToastStore";

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
  const isLinkedToBank = !!account?.bankLinkId;
  const navigation = useNavigation<any>();
  const showToast = useToastStore((s) => s.showToast);

  const [showDangerModal, setShowDangerModal] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  if (!account) return null;
  const isCashAccount = account?.type?.toUpperCase() === "CASH";
  const isEditLocked = isCashAccount && !canEditCash;
  const setupStatus = account.setupStatus || null;
  const setupMethod = account.setupMethod || null;
  const isSetupPending = setupStatus === AccountSetupStatus.PENDING;
  const isSetupActive = setupStatus === AccountSetupStatus.ACTIVE;
  const getVisuals = (type: string = "BANK") => {
    const normalizedType = type.toUpperCase();
    switch (normalizedType) {
      case "CASH":
        return { icon: Banknote, bg: "$green5", color: "$green11" };
      case "WALLET":
      case "CREDIT_CARD":
      case "OTHER":
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

  const summarizeCleanup = (cleanup?: Record<string, any>) => {
    if (!cleanup || typeof cleanup !== "object") return null;
    const entries = Object.entries(cleanup).filter(
      ([, value]) => typeof value === "number",
    ) as [string, number][];
    if (entries.length === 0) return null;
    return entries
      .slice(0, 3)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" · ");
  };

  const handleEdit = () => {
    if (isEditLocked) {
      setShowPremiumSheet(true);
      return;
    }
    onOpenChange(false);
    navigation.navigate("AddAccount", { accountToEdit: account });
  };

  const handleSetupPress = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    onOpenChange(false);
    navigation.navigate("AccountSetup", {
      accountId: account.id,
      startAt: isSetupActive ? 3 : 1,
    });
  };

  const handleSyncPress = () => {
    if (!isPro) {
      setShowPaywall(true);
      return;
    }
    if (
      setupMethod === AccountSetupMethod.EMAIL_HISTORY &&
      account.firstSyncedAt
    ) {
      setIsSyncing(true);
      AccountService.syncEmailHistory(account.id)
        .then(() => {
          showToast("Sincronización iniciada", "success");
          onOpenChange(false);
        })
        .catch((error: any) => {
          const apiMessage =
            error?.response?.data?.message || error?.response?.data?.error;
          showToast(
            apiMessage ? String(apiMessage) : "No pudimos sincronizar",
            "error",
          );
        })
        .finally(() => setIsSyncing(false));
      return;
    }
    onOpenChange(false);
    navigation.navigate("AccountSetup", {
      accountId: account.id,
      startAt: 2,
    });
  };

  const handleManualMovement = () => {
    onOpenChange(false);
    navigation.navigate("AddExpense", { accountId: account.id });
  };

  const handleDelete = async () => {
    if (!account) return;

    setIsLoading(true);
    try {
      const result = await AccountActions.deleteAccount(account.id, {
        deleteSources: true,
        deleteIngestionArtifacts: true,
        deleteOrphanRules: true,
      });
      const cleanupSummary = summarizeCleanup(result?.cleanup);
      if (cleanupSummary) {
        showToast(`Cuenta eliminada (${cleanupSummary})`, "success");
      } else {
        showToast("Cuenta eliminada con limpieza completa", "success");
      }
      setShowDangerModal(false);
      onOpenChange(false);
    } catch (error) {
      setShowErrorModal(true);
      setShowDangerModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnectAndDelete = async () => {
    if (!account?.bankLinkId) return;

    setIsLoading(true);
    try {
      await FintocActions.disconnectLink(account.bankLinkId, true);

      await Promise.all([
        AccountActions.loadAccounts(),
        TransactionActions.loadTransactions(),
      ]);

      setShowDangerModal(false);
      onOpenChange(false);
    } catch (e) {
      setShowDangerModal(false);
      setShowErrorModal(true);
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
        snapPoints={[60]}
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
          padding="$4"
          backgroundColor="$background"
          borderTopLeftRadius="$9"
          borderTopRightRadius="$9"
          borderWidth={0}
          borderColor="transparent"
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
            borderColor="transparent"
            mb="$3"
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
          <Sheet.ScrollView
            showsVerticalScrollIndicator={false}
            backgroundColor="$background"
            contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
          >
            <YStack flex={1} justifyContent="flex-start" space="$4">
              <YStack space="$2">
                {isPro &&
                  !isCashAccount &&
                  (isSetupPending || isSetupActive) && (
                    <YStack space="$2">
                      {isSetupPending && (
                        <Button
                          size="$5"
                          backgroundColor="$brand"
                          icon={<Link size={20} color="white" />}
                          onPressIn={handleSetupPress}
                          color="white"
                          fontWeight="700"
                          borderRadius="$10"
                        >
                          Terminar configuracion
                        </Button>
                      )}
                  {isSetupActive && (
                    <>
                      <Button
                        size="$5"
                        backgroundColor="$blue10"
                        icon={<Link size={20} color="white" />}
                        onPressIn={handleSyncPress}
                        disabled={isSyncing}
                        opacity={isSyncing ? 0.7 : 1}
                        color="white"
                        fontWeight="700"
                        borderRadius="$10"
                      >
                        {setupMethod === AccountSetupMethod.STATEMENT
                          ? "Importar cartola"
                          : isSyncing
                            ? "Sincronizando..."
                            : "Sincronizar"}
                      </Button>
                    </>
                  )}
                    </YStack>
                  )}

                {!isCashAccount && (
                  <Button
                    size="$5"
                    backgroundColor="$purple2"
                    icon={<Eye size={20} color="$purple10" />}
                    onPressIn={() => {
                      onOpenChange(false);
                      navigation.navigate("AccountDetail", {
                        accountId: account.id,
                      });
                    }}
                    color="$purple10"
                    fontWeight="700"
                    borderRadius="$10"
                  >
                    Ver detalles
                  </Button>
                )}

                {!isPro && (
                  <Button
                    size="$5"
                    backgroundColor="$blue10"
                    icon={<Banknote size={20} color="white" />}
                    onPressIn={handleManualMovement}
                    color="white"
                    fontWeight="700"
                    borderRadius="$10"
                  >
                    Agregar movimiento manual
                  </Button>
                )}

                {!isCashAccount && (
                  <>
                    {!isLinkedToBank ? (
                      <>
                        <YStack space="$6">
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
                            {isEditLocked ? "Editar (WOU+)" : "Editar detalles"}
                          </Button>
                        </YStack>

                        <YStack space="$6" paddingTop="$2">
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
                            marginBottom="$-5"
                          >
                            Eliminar cuenta
                          </Button>

                          {!isCashAccount && (
                            <Text fontSize="$2" color="$gray9">
                              Elimina cuenta, fuentes, artefactos y reglas huérfanas.
                            </Text>
                          )}
                        </YStack>
                      </>
                    ) : (
                      <YStack space="$3">
                        <Text fontSize="$2" color="$gray10" fontWeight="700">
                          Banco conectado
                        </Text>

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
                          disabled={isLoading}
                          opacity={isLoading ? 0.7 : 1}
                        >
                          Desconectar y borrar cuentas importadas
                        </Button>

                        <Text fontSize="$2" color="$gray9">
                          Esto eliminará las cuentas importadas de esta
                          conexión.
                        </Text>
                      </YStack>
                    )}
                  </>
                )}
              </YStack>

              {isCashAccount && (
                <YStack space="$5" marginTop="$5" paddingBottom="$2">
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
                    {isEditLocked ? "Editar (WOU+)" : "Editar detalles"}
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
                    Eliminar cuenta
                  </Button>
                </YStack>
              )}
            </YStack>
          </Sheet.ScrollView>
        </Sheet.Frame>
      </Sheet>

      <DangerModal
        visible={showDangerModal}
        onClose={() => setShowDangerModal(false)}
        onConfirm={isLinkedToBank ? handleDisconnectAndDelete : handleDelete}
        isLoading={isLoading}
        title={
          isLinkedToBank
            ? "¿Desconectar y borrar definitivamente?"
            : "¿Eliminar cuenta de forma irreversible?"
        }
        message={
          isLinkedToBank
            ? `Vas a desconectar el banco y borrar las cuentas importadas de esta conexión. Esta acción es irreversible.`
            : `Estás a punto de eliminar "${account.name}". También se eliminarán fuentes, artefactos de ingestión y reglas huérfanas asociadas. Esta acción es irreversible.`
        }
        confirmText={
          isLinkedToBank
            ? "Sí, borrar definitivamente"
            : "Sí, eliminar definitivamente"
        }
        cancelText="Cancelar"
      />
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Control de Efectivo Pro"
        description="La edición manual avanzada de cuentas de efectivo es una característica exclusiva de WOU+."
      />
      <PremiumSheet
        open={showPaywall}
        onOpenChange={setShowPaywall}
        title="Requiere Wou+"
        description="La sincronización automática está disponible solo en WOU+."
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
