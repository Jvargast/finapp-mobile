import React from "react";
import { YStack, XStack, Text, Button, Separator, Circle } from "tamagui";
import {
  ChevronDown,
  ArrowDown,
  Landmark,
  CreditCard,
  Wallet,
} from "@tamagui/lucide-icons";
import { Account } from "../../types/account.types";

interface Props {
  originAccount?: Account;
  destinationAccount?: Account;
  onPressOrigin: () => void;
  onPressDestination: () => void;
}

export const TransferRouteSelector = ({
  originAccount,
  destinationAccount,
  onPressOrigin,
  onPressDestination,
}: Props) => {
  const getAccountIcon = (acc?: Account) => {
    if (!acc) return { Icon: Wallet, color: "$gray8" };
    if (acc.type === "BANK") return { Icon: Landmark, color: "$blue10" };
    if (acc.isCredit) return { Icon: CreditCard, color: "$purple10" };
    return { Icon: Wallet, color: "$green10" };
  };

  const Origin = getAccountIcon(originAccount);
  const Dest = getAccountIcon(destinationAccount);

  return (
    <YStack paddingHorizontal="$4" marginBottom="$4">
      <YStack
        backgroundColor="$gray2"
        borderRadius="$6"
        borderWidth={1}
        borderColor="$borderColor"
        overflow="hidden"
      >
        {/* SECCIÓN ORIGEN */}
        <Button
          unstyled
          onPress={onPressOrigin}
          pressStyle={{ backgroundColor: "$gray4" }}
          padding="$3.5"
          animation="quick"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <XStack space="$3" alignItems="center" flex={1}>
              <Circle size={40} backgroundColor="$background" elevation={1}>
                <Origin.Icon size={20} color={Origin.color} />
              </Circle>
              <YStack>
                <Text
                  fontSize={10}
                  color="$gray9"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  Desde (Origen)
                </Text>
                <Text fontSize={14} color="$color" fontWeight="700">
                  {originAccount?.name || "Seleccionar cuenta"}
                </Text>
                <Text fontSize={11} color="$gray10">
                  Saldo: $
                  {Number(originAccount?.balance || 0).toLocaleString("es-CL")}
                </Text>
              </YStack>
            </XStack>
            <ChevronDown size={20} color="$gray9" />
          </XStack>
        </Button>

        <XStack
          alignItems="center"
          height={20}
          justifyContent="center"
          zIndex={10}
        >
          <Separator width="40%" borderColor="$gray5" />
          <Circle
            size={24}
            backgroundColor="$gray2"
            borderWidth={1}
            borderColor="$gray5"
            marginHorizontal={-1}
          >
            <ArrowDown size={14} color="$blue9" />
          </Circle>
          <Separator width="40%" borderColor="$gray5" />
        </XStack>

        <Button
          unstyled
          onPress={onPressDestination}
          pressStyle={{ backgroundColor: "$gray4" }}
          padding="$3.5"
          animation="quick"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <XStack space="$3" alignItems="center" flex={1}>
              <Circle size={40} backgroundColor="$background" elevation={1}>
                <Dest.Icon size={20} color={Dest.color} />
              </Circle>
              <YStack>
                <Text
                  fontSize={10}
                  color="$gray9"
                  fontWeight="700"
                  textTransform="uppercase"
                >
                  Hacia (Destino)
                </Text>
                <Text fontSize={14} color="$color" fontWeight="700">
                  {destinationAccount?.name || "Seleccionar destino"}
                </Text>
                <Text fontSize={11} color="$gray10">
                  {destinationAccount?.institution || "Cuenta externa"}
                </Text>
              </YStack>
            </XStack>
            <ChevronDown size={20} color="$gray9" />
          </XStack>
        </Button>
      </YStack>
    </YStack>
  );
};
