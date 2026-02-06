import React, { memo } from "react";
import { YStack, XStack, Text, Stack, Image } from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";
import {
  Wallet,
  Wifi,
  Link as LinkIcon,
  CheckCircle,
} from "@tamagui/lucide-icons";
import { Account } from "../../../types/account.types";
import { BANK_SKINS } from "../../../constants/bankSkins";
import { getBankSkinKey } from "../../../utils/formatSkinColor";

interface AccountCardProps {
  account: Account | any;
  index: number;
  isActive: boolean;
  onPress: () => void;
  isStacked?: boolean;
}

export const AccountCard = memo(
  ({
    account,
    index,
    isActive,
    onPress,
    isStacked = false,
  }: AccountCardProps) => {
    const isConnected = !!account.bankLinkId;
    const DEFAULT_COLOR = "#1E293B";
    const color = (account.color || "").toUpperCase();
    const isHex = color.startsWith("#");
    const isDefaultHex = isHex && color === DEFAULT_COLOR;

    const colorIsSkinKey =
      account.color &&
      !account.color.startsWith("#") &&
      (BANK_SKINS as any)[account.color];
    const instSkinKey = getBankSkinKey(account.institution);
    const instHasSkin =
      instSkinKey &&
      instSkinKey !== "DEFAULT" &&
      (BANK_SKINS as any)[instSkinKey];

    const skinKey =
      (colorIsSkinKey ? account.color : null) ||
      (instHasSkin ? instSkinKey : "DEFAULT");

    let skin = (BANK_SKINS as any)[skinKey] || BANK_SKINS.DEFAULT;

    if (isHex && !isDefaultHex && !colorIsSkinKey && !instHasSkin) {
      skin = {
        ...BANK_SKINS.DEFAULT,
        type: "color",
        value: account.color,
        logoAsset: null,
      };
    }

    const CategoryIcon = account.icon || Wallet;

    const displayBalance =
      typeof account.balance === "number" ||
      (typeof account.balance === "string" && !account.balance.includes("$"))
        ? new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: account.currency || "CLP",
          }).format(Number(account.balance))
        : account.balance;

    const fallbackBg =
      skin.type === "color" ? skin.value : skin.colors?.[0] || "#1E293B";

    /* console.log(
      "institution:",
      account.institution,
      "skinKey:",
      skinKey,
      "color:",
      account.color,
    ); */

    return (
      <Stack
        width={260}
        height={160}
        backgroundColor={fallbackBg}
        borderRadius="$8"
        overflow="hidden"
        justifyContent="space-between"
        onPressIn={onPress}
        y={isActive ? 1 : 0}
        rotate={isActive ? "0deg" : "0deg"}
        shadowColor={fallbackBg}
        shadowRadius={isActive ? 20 : 10}
        shadowOffset={{ width: 0, height: isActive ? 10 : 5 }}
        shadowOpacity={isActive ? 0.6 : 0.4}
        marginRight={isStacked ? -110 : 10}
        zIndex={isActive ? 1000 : index}
        borderWidth={1}
        borderColor={
          isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.1)"
        }
      >
        {skin.type === "gradient" && (
          <LinearGradient
            colors={skin.colors}
            start={skin.start}
            end={skin.end}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 0,
            }}
          />
        )}

        {skin.logoAsset && (
          <Image
            source={skin.logoAsset}
            position="absolute"
            right={-30}
            bottom={-30}
            width={180}
            height={180}
            opacity={0.15}
            resizeMode="contain"
            tintColor="white"
            zIndex={1}
          />
        )}
        <XStack
          position="absolute"
          top={12}
          right={12}
          zIndex={3}
          backgroundColor="rgba(0,0,0,0.25)"
          borderRadius="$10"
          paddingVertical="$1"
          paddingHorizontal="$2"
          alignItems="center"
          space="$2"
          borderWidth={1}
          borderColor="rgba(255,255,255,0.2)"
        >
          {isConnected ? (
            <>
              <LinkIcon size={14} color="rgba(255,255,255,0.9)" />
              <Text
                color="rgba(255,255,255,0.9)"
                fontSize={11}
                fontWeight="800"
              >
                Conectada
              </Text>
            </>
          ) : (
            <>
              <CheckCircle size={14} color="rgba(255,255,255,0.85)" />
              <Text
                color="rgba(255,255,255,0.85)"
                fontSize={11}
                fontWeight="800"
              >
                Manual
              </Text>
            </>
          )}
        </XStack>

        <YStack padding="$4" flex={1} justifyContent="space-between" zIndex={2}>
          <XStack justifyContent="space-between" alignItems="flex-start">
            {account.type === "CASH" || account.type === "WALLET" ? (
              <Stack
                backgroundColor="rgba(255,255,255,0.2)"
                padding="$2"
                borderRadius="$4"
              >
                <CategoryIcon size={18} color="white" />
              </Stack>
            ) : (
              <Stack
                backgroundColor="rgba(255,255,255,0.15)"
                width={35}
                height={25}
                borderRadius={4}
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.3)"
              >
                <Stack
                  width={20}
                  height={15}
                  borderRightWidth={1}
                  borderLeftWidth={1}
                  borderColor="rgba(255,255,255,0.2)"
                />
              </Stack>
            )}

            {skin.logoAsset ? (
              <Image
                source={skin.logoAsset}
                width={60}
                height={30}
                resizeMode="contain"
                tintColor="white"
              />
            ) : (
              account.brand && (
                <Text
                  color="rgba(255,255,255,0.5)"
                  fontWeight="900"
                  fontStyle="italic"
                  fontSize={16}
                >
                  {account.institution ?? account.brand ?? "Banco"}
                </Text>
              )
            )}
          </XStack>

          <YStack>
            <XStack space="$2" alignItems="center">
              <Text
                color="rgba(255,255,255,0.8)"
                fontSize={10}
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Saldo Disponible
              </Text>
              {isConnected && (
                <Wifi
                  size={16}
                  color="rgba(255,255,255,0.6)"
                  style={{ transform: [{ rotate: "90deg" }] }}
                />
              )}
            </XStack>

            <Text
              color={skin.textColor || "white"}
              fontSize="$7"
              fontWeight="800"
              letterSpacing={0.5}
              textShadowColor="rgba(0,0,0,0.2)"
              textShadowRadius={4}
            >
              {displayBalance}
            </Text>
          </YStack>

          <XStack justifyContent="space-between" alignItems="center">
            <Text
              color="white"
              fontSize="$3"
              fontWeight="700"
              maxWidth={160}
              numberOfLines={1}
            >
              {account.name}
            </Text>
            {account.last4 && (
              <Text
                color="rgba(255,255,255,0.7)"
                fontSize={12}
                fontFamily="$mono"
                letterSpacing={2}
              >
                •••• {account.last4}
              </Text>
            )}
          </XStack>
        </YStack>
      </Stack>
    );
  },
);
