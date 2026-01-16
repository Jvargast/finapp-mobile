import React, { useState, useEffect } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  ScrollView,
  Sheet,
  Switch,
  Label,
  Image,
} from "tamagui";
import { ChevronLeft, ChevronDown } from "@tamagui/lucide-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MainLayout } from "../../components/layout/MainLayout";
import { FormInput } from "../../components/ui/FormInput";
import { AccountTypeSelector } from "../../components/accounts/AccountTypeSelector";
import { CurrencySelector } from "../../components/accounts/CurrencySelector";
import { AccountCard } from "../../components/home/accounts/AccountCard";
import { useAccountForm } from "../../hooks/accounts/useAccountForm";
import { BANK_CATALOG } from "../../constants/bankCatalog";
import { KeyboardAvoidingView, Platform } from "react-native";
import { Account } from "../../types/account.types";

export default function AddAccountScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const accountToEdit: Account | undefined = route.params?.accountToEdit;
  const { form, submit, isSubmitting, setValue, watch, isEditing } =
    useAccountForm(accountToEdit);
  const [isBankSheetOpen, setIsBankSheetOpen] = useState(false);

  useEffect(() => {
    if (isEditing && accountToEdit) {
      setValue("name", accountToEdit.name);
      setValue("balance", String(accountToEdit.balance));
      setValue("currency", accountToEdit.currency as any);
      setValue("type", accountToEdit.type as any);
      setValue("color", accountToEdit.color);
      setValue("institution", accountToEdit.institution || "");
      setValue("isCredit", accountToEdit.isCredit || false);
    }
  }, [isEditing, accountToEdit, setValue]);

  const formValues = watch();

  const previewAccount: any = {
    id: accountToEdit?.id || "preview",
    userId: "me",
    createdAt: new Date(),
    updatedAt: new Date(),
    name: formValues.name || accountToEdit?.name || "Nueva Cuenta",
    balance: formValues.balance || 0,
    currency: (formValues.currency as any) || "CLP",
    type: (formValues.type as any) || "BANK",
    color: formValues.color || "DEFAULT",
    institution: formValues.institution || null,
    isCredit: formValues.isCredit || false,
    last4: accountToEdit?.last4 || "8888",
  };

  const selectedBankData = BANK_CATALOG.CL.banks.find(
    (b) => b.name === formValues.institution
  );

  return (
    <MainLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 5 }}
        >
          <XStack alignItems="center" space="$3" marginBottom="$4">
            <Button
              circular
              size="$3"
              chromeless
              onPress={() => navigation.goBack()}
              icon={ChevronLeft}
            />
            <Text fontSize="$6" fontWeight="800">
              {isEditing ? "Editar Cuenta" : "Nueva Cuenta"}
            </Text>
          </XStack>

          <YStack space="$5" paddingHorizontal="$2" paddingBottom="$10">
            <YStack alignItems="center" marginBottom="$2">
              <Text
                fontSize={10}
                color="$gray10"
                marginBottom="$2"
                textTransform="uppercase"
                letterSpacing={1}
              >
                {isEditing ? "Vista previa" : "Así se verá tu tarjeta"}
              </Text>

              <AccountCard
                key={previewAccount.color}
                account={previewAccount as any}
                index={0}
                isActive={true}
                onPress={() => {}}
              />
            </YStack>

            <AccountTypeSelector
              value={formValues.type}
              onChange={(val) => setValue("type", val as any)}
            />

            {(formValues.type === "BANK" || formValues.type === "WALLET") && (
              <YStack space="$4">
                <YStack space="$2">
                  <Text fontWeight="700" fontSize="$3" color="$gray11">
                    Institución
                  </Text>
                  <Button
                    size="$5"
                    variant="outlined"
                    borderWidth={1}
                    borderColor="$borderColor"
                    justifyContent="space-between"
                    onPress={() => setIsBankSheetOpen(true)}
                  >
                    <XStack alignItems="center" space="$2">
                      {selectedBankData?.logo && (
                        <Image
                          source={selectedBankData.logo}
                          width={24}
                          height={24}
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        color={formValues.institution ? "$color" : "$gray10"}
                      >
                        {formValues.institution || "Seleccionar Banco..."}
                      </Text>
                    </XStack>

                    <ChevronDown size={16} color="$gray10" />
                  </Button>
                </YStack>

                {formValues.color === "DEFAULT" ? (
                  <XStack
                    alignItems="center"
                    space="$4"
                    backgroundColor="$color2"
                    padding="$3"
                    borderRadius="$4"
                  >
                    <Label
                      flex={1}
                      fontWeight="600"
                      htmlFor="is-credit-switch"
                      fontSize="$3"
                    >
                      ¿Es Tarjeta de Crédito / Deuda?
                    </Label>
                    <Switch
                      id="is-credit-switch"
                      size="$3"
                      checked={formValues.isCredit}
                      onCheckedChange={(checked) =>
                        setValue("isCredit", checked)
                      }
                    >
                      <Switch.Thumb animation="bouncy" />
                    </Switch>
                  </XStack>
                ) : (
                  <XStack
                    padding="$3"
                    backgroundColor="$color2"
                    borderRadius="$4"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text color="$gray11" fontSize="$3" fontWeight="600">
                      Tipo de producto
                    </Text>
                    <XStack space="$2" alignItems="center">
                      <Text
                        color={formValues.isCredit ? "$red10" : "$green10"}
                        fontWeight="800"
                      >
                        {formValues.isCredit ? "CRÉDITO" : "DÉBITO"}
                      </Text>
                      <Text fontSize={10} color="$gray9">
                        (Automático)
                      </Text>
                    </XStack>
                  </XStack>
                )}
              </YStack>
            )}

            <FormInput
              control={form.control}
              name="name"
              label="Alias de la tarjeta"
              placeholder={
                formValues.type === "CASH"
                  ? "Ej: Caja Chica"
                  : "Ej: Gastos Diarios"
              }
            />

            <YStack>
              <FormInput
                control={form.control}
                name="balance"
                label="Saldo actual"
                placeholder="0"
                keyboardType="numeric"
                isCurrency
              />
              <CurrencySelector
                value={formValues.currency}
                onChange={(val) => setValue("currency", val as any)}
              />
            </YStack>

            <Button
              size="$6"
              backgroundColor={isEditing ? "$blue10" : "$brand"}
              color="white"
              fontWeight="800"
              marginTop="$4"
              onPress={submit}
              disabled={isSubmitting}
              opacity={isSubmitting ? 0.7 : 1}
            >
              {isSubmitting
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Confirmar Cuenta"}
            </Button>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>

      <Sheet
        modal
        open={isBankSheetOpen}
        onOpenChange={setIsBankSheetOpen}
        snapPoints={[70]}
        dismissOnSnapToBottom
        zIndex={100_000}
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <Sheet.Handle />
          <Text
            fontSize="$5"
            fontWeight="800"
            marginBottom="$4"
            textAlign="center"
          >
            Elige tu Banco
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <YStack space="$6" paddingBottom="$8">
              {BANK_CATALOG.CL.banks.map((bank) => (
                <YStack key={bank.id} space="$3">
                  <XStack
                    alignItems="center"
                    space="$3"
                    borderBottomWidth={1}
                    borderColor="$gray4"
                    paddingBottom="$2"
                  >
                    {bank.logo && (
                      <Image
                        source={bank.logo}
                        width={28}
                        height={28}
                        resizeMode="contain"
                      />
                    )}
                    <Text
                      fontSize="$4"
                      fontWeight="800"
                      color="$gray11"
                      borderBottomWidth={1}
                      borderColor="$gray4"
                      paddingBottom="$1"
                    >
                      {bank.name}
                    </Text>
                  </XStack>

                  {bank.products.debit.length > 0 && (
                    <YStack space="$2">
                      <Text
                        fontSize={10}
                        color="$gray9"
                        fontWeight="700"
                        textTransform="uppercase"
                      >
                        Débito
                      </Text>
                      <XStack flexWrap="wrap" gap="$2">
                        {bank.products.debit.map((option) => (
                          <Button
                            key={option.id}
                            size="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            backgroundColor="$color2"
                            onPress={() => {
                              setValue("color", option.id);
                              setValue("institution", bank.name);
                              setValue("name", option.label);
                              setValue("isCredit", false);
                              setIsBankSheetOpen(false);
                            }}
                          >
                            <Text fontSize={12}>{option.label}</Text>
                          </Button>
                        ))}
                      </XStack>
                    </YStack>
                  )}

                  {bank.products.credit.length > 0 && (
                    <YStack space="$2">
                      <Text
                        fontSize={10}
                        color="$gray9"
                        fontWeight="700"
                        textTransform="uppercase"
                      >
                        Crédito
                      </Text>
                      <XStack flexWrap="wrap" gap="$2">
                        {bank.products.credit.map((option) => (
                          <Button
                            key={option.id}
                            size="$3"
                            borderWidth={1}
                            borderColor="$borderColor"
                            backgroundColor="$color2"
                            onPress={() => {
                              setValue("color", option.id);
                              setValue("institution", bank.name);
                              setValue("name", option.label);
                              setValue("isCredit", true);
                              setIsBankSheetOpen(false);
                            }}
                          >
                            <Text fontSize={12}>{option.label}</Text>
                          </Button>
                        ))}
                      </XStack>
                    </YStack>
                  )}
                </YStack>
              ))}
            </YStack>
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </MainLayout>
  );
}
