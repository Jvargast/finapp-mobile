import React, { memo } from "react";
import { YStack, Text, Button } from "tamagui";
import { AccountSetupMethod } from "../../../types/account.types";

interface AccountSetupStep4Props {
  selectedMethod: AccountSetupMethod | null;
  isSaving: boolean;
  onFinish: () => void;
}

const getMethodLabel = (method: AccountSetupMethod | null) => {
  if (method === AccountSetupMethod.EMAIL_HISTORY)
    return "Gmail / Google (90 dias)";
  if (method === AccountSetupMethod.EMAIL_FORWARD) return "Reenvio de correos";
  if (method === AccountSetupMethod.STATEMENT) return "Cartola";
  return "Manual";
};

export const AccountSetupStep4 = memo(({
  selectedMethod,
  isSaving,
  onFinish,
}: AccountSetupStep4Props) => {
  return (
    <YStack space="$4">
      <Text fontSize="$5" fontWeight="800" color="$color">
        Configuración terminada
      </Text>
      <YStack
        backgroundColor="$color2"
        borderRadius="$6"
        padding="$4"
        space="$2"
      >
        <Text fontSize="$3" color="$gray10">
          Metodo elegido
        </Text>
        <Text fontSize="$4" fontWeight="800" color="$color">
          {getMethodLabel(selectedMethod)}
        </Text>
        <Text fontSize="$3" color="$gray10">
          Estado
        </Text>
        <Text fontSize="$4" fontWeight="800" color="$green10">
          Activo
        </Text>
      </YStack>

      <Button
        size="$6"
        backgroundColor="$brand"
        color="white"
        fontWeight="800"
        onPress={onFinish}
        disabled={isSaving}
        opacity={isSaving ? 0.7 : 1}
      >
        {isSaving ? "Finalizando..." : "Volver a mis cuentas"}
      </Button>
    </YStack>
  );
});
