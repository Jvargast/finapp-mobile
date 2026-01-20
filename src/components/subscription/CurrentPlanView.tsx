import React from "react";
import { YStack, Text, Button, Circle, XStack } from "tamagui";
import { Crown, Star, Calendar } from "@tamagui/lucide-icons";

export const CurrentPlanView = () => {
  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      space="$6"
      padding="$4"
    >
      <YStack
        width="100%"
        height={220}
        backgroundColor="#F59E0B"
        borderRadius="$8"
        padding="$5"
        justifyContent="space-between"
        shadowColor="$shadowColor"
        shadowRadius={20}
        shadowOpacity={0.3}
      >
        <XStack justifyContent="space-between" alignItems="flex-start">
          <Text fontSize="$8" fontWeight="900" color="#1E293B">
            WOU+
          </Text>
          <Crown size={32} color="#1E293B" />
        </XStack>

        <YStack>
          <Text fontSize="$3" color="#1E293B" opacity={0.8} fontWeight="600">
            MIEMBRO DESDE
          </Text>
          <Text fontSize="$5" color="#1E293B" fontWeight="800">
            ENERO 2026
          </Text>
        </YStack>

        <XStack alignItems="center" space="$2">
          <Star size={16} fill="#1E293B" color="#1E293B" />
          <Text fontSize="$3" color="#1E293B" fontWeight="700">
            PLAN PRO ACTIVO
          </Text>
        </XStack>
      </YStack>

      <YStack space="$2" alignItems="center" width="100%">
        <XStack space="$2" alignItems="center">
          <Calendar size={16} color="$gray10" />
          <Text color="$gray10">Próxima facturación: 16 Feb 2026</Text>
        </XStack>

        <Button
          variant="outlined"
          width="100%"
          borderColor="$gray8"
          color="$gray11"
          marginTop="$4"
        >
          Administrar Suscripción
        </Button>
      </YStack>
    </YStack>
  );
};
