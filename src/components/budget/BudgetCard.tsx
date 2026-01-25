import React from "react";
import { YStack, XStack, Text, Progress, Circle, Image } from "tamagui";
import {
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  Users,
  HeartHandshake,
} from "@tamagui/lucide-icons";
import { Budget } from "../../types/budget.types";
import { getIcon } from "../../utils/iconMap";
import { creationDate } from "../../utils/formatDate";

interface BudgetCardProps {
  budget: Budget;
  onPress: () => void;
}

export const BudgetCard = ({ budget, onPress }: BudgetCardProps) => {
  const { progress, category } = budget;
  const percent = progress.percentage;

  const guests = budget.participants || [];

  const ownerAsParticipant = budget.owner ? { user: budget.owner } : null;

  const allParticipants = ownerAsParticipant
    ? [
        ownerAsParticipant,
        ...guests.filter((p) => p.user.id !== ownerAsParticipant.user.id),
      ]
    : guests;
  const isFamily = allParticipants.length > 2;
  const ShareIcon = isFamily ? Users : HeartHandshake;
  const shareLabel = isFamily ? "FAMILIA" : "PAREJA";
  const shareColor = isFamily ? "$purple10" : "$pink10";

  const maxVisible = 4;
  const hasOverflow = allParticipants.length > maxVisible;
  const visibleParticipants = hasOverflow
    ? allParticipants.slice(0, maxVisible - 1)
    : allParticipants.slice(0, maxVisible);
  const overflowCount = allParticipants.length - visibleParticipants.length;

  const IconComponent = getIcon(category.icon || "HelpCircle");

  let statusColor = "$green9";
  let bgColor = "$green2";
  let StatusIcon = CheckCircle2;
  let statusText = "Excelente";

  if (percent >= 100) {
    statusColor = "$red10";
    bgColor = "$red2";
    StatusIcon = AlertTriangle;
    statusText = "Excedido";
  } else if (percent >= budget.warningThreshold) {
    statusColor = "$orange10";
    bgColor = "$orange2";
    StatusIcon = TrendingUp;
    statusText = "Cuidado";
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: budget.currency,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <YStack
      backgroundColor="$background"
      borderRadius="$6"
      padding="$4"
      space="$3"
      borderWidth={1}
      borderColor="$gray4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.1}
      shadowRadius={4}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      onPress={onPress}
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <XStack space="$3" alignItems="center" flex={1} marginRight="$2">
          <Circle size="$4" backgroundColor={category.color || "$gray5"}>
            <IconComponent size={20} color="white" />
          </Circle>

          <YStack flex={1}>
            <Text
              fontSize="$4"
              fontWeight="800"
              color="$color"
              numberOfLines={1}
            >
              {budget.name || category.name}
            </Text>

            {budget.type === "SHARED" && (
              <XStack alignItems="center" space="$1.5" marginTop={2}>
                <ShareIcon size={12} color={shareColor} />
                <Text
                  fontSize={10}
                  color={shareColor}
                  fontWeight="800"
                  letterSpacing={0.5}
                >
                  {shareLabel}
                </Text>
              </XStack>
            )}
          </YStack>
        </XStack>
        <YStack alignItems="flex-end" space="$1">
          <XStack
            backgroundColor={bgColor}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$4"
            space="$1.5"
            alignItems="center"
          >
            <StatusIcon size={12} color={statusColor} />
            <Text fontSize={11} color={statusColor} fontWeight="700">
              {statusText}
            </Text>
          </XStack>

          <Text fontSize={9} fontWeight="600" color="$gray9" textAlign="right">
            {creationDate(budget)}
          </Text>
        </YStack>
      </XStack>

      <YStack>
        <Text fontSize="$7" fontWeight="900" color="$color">
          {formatMoney(progress.remaining)}
        </Text>
        <Text fontSize={12} color="$gray10">
          disponibles de {formatMoney(budget.amount)}
        </Text>
      </YStack>

      <YStack space="$2">
        <Progress value={Math.min(percent, 100)} size="$2" borderRadius="$10">
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={statusColor}
          />
        </Progress>
        <XStack justifyContent="space-between">
          <Text fontSize={11} color="$gray9" fontWeight="600">
            {Math.round(percent)}% gastado
          </Text>
          {percent >= 100 && (
            <Text fontSize={11} color="$red10" fontWeight="700">
              +{formatMoney(progress.spent - budget.amount)}
            </Text>
          )}
        </XStack>
      </YStack>

      {allParticipants.length > 0 && (
        <XStack
          marginTop="$3"
          paddingTop="$3"
          borderTopWidth={1}
          borderColor="$gray3"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={11} color="$gray9" fontWeight="500">
            Miembros:
          </Text>

          <XStack flexDirection="row-reverse" paddingRight="$2">
            {hasOverflow && (
              <Circle
                size={28}
                backgroundColor="$gray5"
                borderWidth={2}
                borderColor="$background"
                marginLeft={-10}
                zIndex={10}
              >
                <Text fontSize={10} fontWeight="800" color="$gray11">
                  +{overflowCount}
                </Text>
              </Circle>
            )}

            {visibleParticipants.map((p, index) => {
              const fallbackBg = isFamily ? "$purple3" : "$pink3";
              const fallbackTxt = isFamily ? "$purple11" : "$pink11";
              const initial =
                p.user.profile?.firstName?.[0]?.toUpperCase() || "U";

              return (
                <Circle
                  key={p.user.id}
                  size={28}
                  backgroundColor="$gray4"
                  borderWidth={2}
                  borderColor="$background"
                  marginLeft={index === 0 ? 0 : -10}
                  zIndex={visibleParticipants.length - index}
                  overflow="hidden"
                >
                  {p.user.profile?.avatarUrl ? (
                    <Image
                      source={{ uri: p.user.profile.avatarUrl }}
                      width="100%"
                      height="100%"
                    />
                  ) : (
                    <YStack
                      width="100%"
                      height="100%"
                      backgroundColor={fallbackBg}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text fontSize={10} fontWeight="900" color={fallbackTxt}>
                        {initial}
                      </Text>
                    </YStack>
                  )}
                </Circle>
              );
            })}
          </XStack>
        </XStack>
      )}
    </YStack>
  );
};
