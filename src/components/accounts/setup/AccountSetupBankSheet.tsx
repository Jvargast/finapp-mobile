import React from "react";
import { Sheet, XStack, YStack, Text, Button, ScrollView, Image } from "tamagui";
import { BANK_CATALOG } from "../../../constants/bankCatalog";

interface AccountSetupBankSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectBank: (bankName: string) => void;
}

export const AccountSetupBankSheet = ({
  open,
  onOpenChange,
  onSelectBank,
}: AccountSetupBankSheetProps) => {
  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[70]}
      dismissOnSnapToBottom
      zIndex={100_000}
    >
      <Sheet.Overlay />
      <Sheet.Frame padding="$4" backgroundColor="$background">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$5" fontWeight="800">
            Selecciona tu banco
          </Text>
          <Button size="$3" chromeless onPress={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </XStack>
        <ScrollView marginTop="$4">
          <YStack space="$3">
            {BANK_CATALOG.CL.banks.map((bank) => (
              <Button
                key={bank.name}
                size="$5"
                variant="outlined"
                borderWidth={1}
                borderColor="$borderColor"
                justifyContent="flex-start"
                onPress={() => {
                  onSelectBank(bank.name);
                  onOpenChange(false);
                }}
              >
                <XStack alignItems="center" space="$2">
                  {bank.logo && (
                    <Image
                      source={bank.logo}
                      width={24}
                      height={24}
                      resizeMode="contain"
                    />
                  )}
                  <Text fontWeight="700">{bank.name}</Text>
                </XStack>
              </Button>
            ))}
          </YStack>
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};
