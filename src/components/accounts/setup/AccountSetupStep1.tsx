import React from "react";
import { YStack, XStack, Text, Button, Image } from "tamagui";
import { UseFormReturn } from "react-hook-form";
import { AccountTypeSelector } from "../AccountTypeSelector";
import { CurrencySelector } from "../CurrencySelector";
import { FormInput } from "../../ui/FormInput";
import { Step1Form } from "../../../screens/accounts/accountSetup.types";

interface AccountSetupStep1Props {
  form: UseFormReturn<Step1Form>;
  isSaving: boolean;
  onSave: () => void;
  onOpenBankSheet: () => void;
  selectedBankLogo?: any;
}

export const AccountSetupStep1 = ({
  form,
  isSaving,
  onSave,
  onOpenBankSheet,
  selectedBankLogo,
}: AccountSetupStep1Props) => {
  return (
    <YStack space="$4">
      <AccountTypeSelector
        value={form.watch("type")}
        onChange={(val) => form.setValue("type", val as any)}
      />

      <YStack space="$2">
        <Text fontWeight="700" fontSize="$3" color="$gray11">
          Banco (opcional)
        </Text>
        <Button
          size="$5"
          variant="outlined"
          borderWidth={1}
          borderColor="$borderColor"
          justifyContent="space-between"
          onPress={onOpenBankSheet}
        >
          <XStack alignItems="center" space="$2">
            {selectedBankLogo && (
              <Image
                source={selectedBankLogo}
                width={24}
                height={24}
                resizeMode="contain"
              />
            )}
            <Text color={form.watch("institution") ? "$color" : "$gray10"}>
              {form.watch("institution") || "Seleccionar banco..."}
            </Text>
          </XStack>
          <Text color="$gray9">Cambiar</Text>
        </Button>
      </YStack>

      <FormInput
        control={form.control}
        name="name"
        label="Nombre de la cuenta"
        placeholder="Ej: Cuenta Sueldo"
      />

      <FormInput
        control={form.control}
        name="last4"
        label="Últimos 4 digitos (opcional)"
        placeholder="1234"
        keyboardType="numeric"
      />

      <CurrencySelector
        value={form.watch("currency")}
        onChange={(val) => form.setValue("currency", val as any)}
      />

      <Button
        size="$6"
        backgroundColor="$brand"
        color="white"
        fontWeight="800"
        onPress={onSave}
        disabled={isSaving}
        opacity={isSaving ? 0.7 : 1}
      >
        {isSaving ? "Guardando..." : "Guardar y continuar"}
      </Button>
    </YStack>
  );
};
