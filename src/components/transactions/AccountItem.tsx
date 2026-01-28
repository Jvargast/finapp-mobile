import React, { memo } from "react";
import { Pressable, Image } from "react-native";
import { YStack, Text } from "tamagui";
import { Wallet, Check, CreditCard } from "@tamagui/lucide-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Account } from "../../types/account.types";
import { getSkin } from "../../utils/getSkin";

interface AccountItemProps {
  account: Account;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const AccountItem = memo(
  ({ account, isSelected, onSelect }: AccountItemProps) => {
    const skin = getSkin(account);
    const isCash = account.type === "CASH" || account.type === "WALLET";
    const bg =
      skin.type === "color" ? (skin as any).value || "#1E293B" : "#1E293B";

    return (
      <Pressable onPress={() => onSelect(account.id)}>
        <YStack alignItems="center" space="$2" width={72}>
          <YStack
            width={72}
            height={45}
            shadowColor="$shadowColor"
            shadowRadius={isSelected ? 8 : 3}
            shadowOpacity={isSelected ? 0.3 : 0.1}
            shadowOffset={{ width: 0, height: 2 }}
            opacity={isSelected ? 1 : 0.7}
          >
            <YStack
              flex={1}
              borderRadius="$4"
              overflow="hidden"
              borderWidth={isSelected ? 2 : 1}
              borderColor={isSelected ? "$color" : "transparent"}
              backgroundColor={bg}
            >
              {skin.type === "gradient" ? (
                <LinearGradient
                  colors={skin.colors as [string, string, ...string[]]}
                  start={{ x: skin.start?.[0] ?? 0, y: skin.start?.[1] ?? 0 }}
                  end={{ x: skin.end?.[0] ?? 1, y: skin.end?.[1] ?? 1 }}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {skin.logoAsset && (
                    <Image
                      source={skin.logoAsset}
                      style={{ width: 30, height: 30, opacity: 0.9 }}
                      resizeMode="contain"
                    />
                  )}
                </LinearGradient>
              ) : (
                <YStack
                  flex={1}
                  backgroundColor={bg}
                  justifyContent="center"
                  alignItems="center"
                >
                  {isCash ? (
                    <Wallet size={20} color="white" opacity={0.8} />
                  ) : skin.logoAsset ? (
                    <Image
                      source={skin.logoAsset}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  ) : (
                    <CreditCard size={20} color="white" opacity={0.5} />
                  )}
                </YStack>
              )}
            </YStack>

            {isSelected && (
              <YStack position="absolute" top={-6} right={-6} zIndex={100}>
                <YStack
                  backgroundColor="$color"
                  borderRadius={20}
                  padding={3}
                  shadowColor="black"
                  shadowRadius={2}
                  shadowOpacity={0.2}
                >
                  <Check size={10} color="$background" />
                </YStack>
              </YStack>
            )}
          </YStack>

          <Text
            fontSize={10}
            fontWeight={isSelected ? "700" : "500"}
            color={isSelected ? "$color" : "$gray10"}
            numberOfLines={1}
            textAlign="center"
          >
            {account.name}
          </Text>
        </YStack>
      </Pressable>
    );
  },
  (prev, next) => {
    return (
      prev.isSelected === next.isSelected && prev.account.id === next.account.id
    );
  }
);
