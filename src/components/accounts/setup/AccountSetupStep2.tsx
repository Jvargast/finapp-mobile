import React, { memo } from "react";
import { YStack, Text } from "tamagui";
import { Mail, Send, FileText } from "@tamagui/lucide-icons";
import { AccountSetupMethod } from "../../../types/account.types";
import { AccountSetupMethodCard } from "../AccountSetupMethodCard";
import { ContinueButton } from "../../ui/ContinueButton";

interface AccountSetupStep2Props {
  selectedMethod: AccountSetupMethod | null;
  isSaving: boolean;
  onSelectMethod: (method: AccountSetupMethod) => void;
  onContinue: () => void;
  isEmailHistoryLocked?: boolean;
}

export const AccountSetupStep2 = memo(({
  selectedMethod,
  isSaving,
  onSelectMethod,
  onContinue,
  isEmailHistoryLocked = false,
}: AccountSetupStep2Props) => {
  const isLockedSelection =
    isEmailHistoryLocked &&
    selectedMethod === AccountSetupMethod.EMAIL_HISTORY;
  const emailHistoryDescription = isEmailHistoryLocked
    ? "Ya está configurado. Reinicia desde Detalles para cambiarlo."
    : "Importa movimientos recientes desde correos.";

  return (
    <YStack space="$4">
      <Text fontSize="$4" fontWeight="800" color="$color">
        Elige como llenar esta cuenta
      </Text>

      <AccountSetupMethodCard
        title="Importar desde Gmail/Google (90 dias)"
        description={emailHistoryDescription}
        icon={Mail}
        color="#2563EB"
        bg="#EFF6FF"
        isSelected={selectedMethod === AccountSetupMethod.EMAIL_HISTORY}
        disabled={isEmailHistoryLocked}
        onPress={() => onSelectMethod(AccountSetupMethod.EMAIL_HISTORY)}
      />

      <AccountSetupMethodCard
        title="Reenvio de correos (casi tiempo real)"
        description="Configura un alias para reenviar emails del banco."
        icon={Send}
        color="#7C3AED"
        bg="#F5F3FF"
        isSelected={selectedMethod === AccountSetupMethod.EMAIL_FORWARD}
        onPress={() => onSelectMethod(AccountSetupMethod.EMAIL_FORWARD)}
      />

      <AccountSetupMethodCard
        title="Subir cartola"
        description="Carga tu archivo y importa movimientos."
        icon={FileText}
        color="#059669"
        bg="#ECFDF5"
        isSelected={selectedMethod === AccountSetupMethod.STATEMENT}
        onPress={() => onSelectMethod(AccountSetupMethod.STATEMENT)}
      />

      <ContinueButton
        label="Continuar"
        isLoading={isSaving}
        loadingLabel="Guardando..."
        onPress={onContinue}
        disabled={!selectedMethod || isSaving || isLockedSelection}
      />
    </YStack>
  );
});
