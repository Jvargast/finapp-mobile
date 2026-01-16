import React from "react";
import { ScrollView, XStack, YStack, Stack, Image, Text } from "tamagui";
import { BANK_SKINS } from "../../constants/bankSkins";

const AVAILABLE_BANKS = [
  BANK_SKINS.BCH_BLUE,
  BANK_SKINS.SANTANDER_RED,
  BANK_SKINS.CMR_GREEN,
  BANK_SKINS.MACH_PURPLE,
  BANK_SKINS.ITAU_ORANGE,
  BANK_SKINS.ESTADO_ORANGE,
];

interface BankSelectorProps {
  selectedSkinId: string;
  onSelect: (skinId: string) => void;
}

export const BankSelector = ({
  selectedSkinId,
  onSelect,
}: BankSelectorProps) => {
  return (
    <YStack space="$3">
      <Text fontWeight="700" fontSize="$3" color="$gray11">
        Selecciona tu Institución
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <XStack space="$3" paddingVertical="$2">
          {AVAILABLE_BANKS.map((bank) => {
            const isSelected = selectedSkinId === bank.id;

            return (
              <YStack key={bank.id} alignItems="center" space="$2">
                <Stack
                  width={60}
                  height={60}
                  borderRadius="$4"
                  backgroundColor={
                    bank.type === "color" ? bank.value : bank.colors[0]
                  }
                  alignItems="center"
                  justifyContent="center"
                  onPress={() => onSelect(bank.id)}
                  borderWidth={isSelected ? 3 : 0}
                  borderColor="$brand"
                  overflow="hidden"
                >
                  {bank.logoAsset ? (
                    <Image
                      source={bank.logoAsset}
                      width={40}
                      height={40}
                      resizeMode="contain"
                    />
                  ) : (
                    <Text color="white" fontWeight="800">
                      W
                    </Text>
                  )}
                </Stack>
                <Text
                  fontSize={10}
                  color="$gray10"
                  maxWidth={70}
                  textAlign="center"
                  numberOfLines={1}
                >
                  {bank.name}
                </Text>
              </YStack>
            );
          })}
        </XStack>
      </ScrollView>
    </YStack>
  );
};
