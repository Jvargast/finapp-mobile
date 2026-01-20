import React from "react";
import { YStack, XStack, Text, Separator } from "tamagui";
import { Lock, Bell, Star, Check } from "@tamagui/lucide-icons";

interface SubscriptionCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  isSelected: boolean;
  onSelect: () => void;
  isBestValue?: boolean;
}

export const SubscriptionCard = ({
  title,
  description,
  price,
  period,
  isSelected,
  onSelect,
  isBestValue,
  badgeText,
}: SubscriptionCardProps) => {
  return (
    <YStack
      borderWidth={2}
      borderColor={isSelected ? "#F59E0B" : "$gray8"}
      backgroundColor={isSelected ? "rgba(245, 158, 11, 0.05)" : "$gray2"}
      borderRadius="$6"
      padding="$4"
      onPress={onSelect}
      marginBottom="$4"
      position="relative"
    >
      {isBestValue && (
        <YStack
          position="absolute"
          top={-12}
          right={16}
          backgroundColor="#6D28D9"
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$4"
        >
          <Text color="white" fontSize={10} fontWeight="800">
            {badgeText || "Incluye ventajas Plus"}
          </Text>
        </YStack>
      )}

      <XStack
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$2"
      >
        <Text fontSize="$6" fontWeight="800" color="white">
          {title}
        </Text>
        {isSelected && (
          <YStack backgroundColor="#F59E0B" borderRadius={20} padding={4}>
            <Check size={12} color="black" />
          </YStack>
        )}
      </XStack>

      <Text color="$gray10" fontSize="$3" marginBottom="$3" lineHeight={20}>
        {description}
      </Text>

      <Text color="$gray11" fontSize={12} marginBottom="$4">
        7 días gratis. Después {price}
        {period}
      </Text>

      {isSelected && (
        <YStack marginTop="$2" paddingLeft="$2">
          <TimelineItem
            icon={Lock}
            text="Hoy: Inicio del periodo de prueba gratis"
            isFirst
          />
          <TimelineItem icon={Bell} text="Día 5: Obtendrá un recordatorio" />
          <TimelineItem
            icon={Star}
            text={`Día 7: Se le cobrará ${price}${period}`}
            isLast
          />
        </YStack>
      )}
    </YStack>
  );
};

const TimelineItem = ({
  icon: Icon,
  text,
  isFirst,
  isLast,
}: {
  icon: any;
  text: string;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  return (
    <XStack space="$3" position="relative" paddingBottom={isLast ? 0 : "$4"}>
      {!isLast && (
        <YStack
          position="absolute"
          left={9}
          top={20}
          bottom={0}
          width={2}
          backgroundColor="rgba(255,255,255,0.1)"
        />
      )}
      <YStack width={20} alignItems="center" justifyContent="center" zIndex={1}>
        <Icon size={16} color="#8B5CF6" />
      </YStack>
      <Text color="white" fontSize={13} flex={1}>
        {text}
      </Text>
    </XStack>
  );
};
