import React from "react";
import { AlertTriangle, CheckCircle2, HeartHandshake, TrendingUp, Users } from "@tamagui/lucide-icons";
import { Card, Circle, Image, Progress, Text, Theme, XStack, YStack } from "tamagui";
import { Budget } from "../../types/budget.types";
import { getIcon } from "../../utils/iconMap";
import { creationDate } from "../../utils/formatDate";

interface BudgetCardProps {
  budget: Budget;
  onPress: () => void;
}

const getAvatarColors = (isFamily: boolean) => ({
  bg: isFamily ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.22)",
  text: "white",
});

export const BudgetCard = ({ budget, onPress }: BudgetCardProps) => {
  const { progress, category } = budget;
  const percent = progress.percentage;
  const CategoryIcon = getIcon(category.icon || "HelpCircle");

  const guests = budget.participants || [];
  const ownerAsParticipant = budget.owner ? { user: budget.owner } : null;
  const allParticipants = ownerAsParticipant
    ? [
        ownerAsParticipant,
        ...guests.filter((participant) => participant.user.id !== ownerAsParticipant.user.id),
      ]
    : guests;
  const isFamily = allParticipants.length > 2;
  const ShareIcon = isFamily ? Users : HeartHandshake;
  const shareLabel = isFamily ? "FAMILIA" : "PAREJA";

  const maxVisible = 4;
  const hasOverflow = allParticipants.length > maxVisible;
  const visibleParticipants = hasOverflow
    ? allParticipants.slice(0, maxVisible - 1)
    : allParticipants.slice(0, maxVisible);
  const overflowCount = allParticipants.length - visibleParticipants.length;

  let statusBg = "$green9";
  let StatusIcon = CheckCircle2;
  let statusText = "En orden";

  if (percent >= 100) {
    statusBg = "$red10";
    StatusIcon = AlertTriangle;
    statusText = "Excedido";
  } else if (percent >= budget.warningThreshold) {
    statusBg = "$orange10";
    StatusIcon = TrendingUp;
    statusText = "Cuidado";
  }

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: budget.currency,
      maximumFractionDigits: 0,
    }).format(amount);

  const avatarColors = getAvatarColors(isFamily);

  return (
    <Theme name="dark">
      <Card
        backgroundColor={category.color || "$gray9"}
        borderRadius="$8"
        padding="$4.5"
        elevation={10}
        shadowColor={category.color || "$gray9"}
        shadowOpacity={0.4}
        shadowRadius={15}
        animation="bouncy"
        pressStyle={{ scale: 0.98, opacity: 0.98 }}
        overflow="hidden"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.15)"
        onPress={onPress}
      >
        <YStack
          position="absolute"
          right={-18}
          bottom={-28}
          opacity={0.15}
          rotate="-15deg"
          pointerEvents="none"
        >
          <CategoryIcon size={170} color="white" />
        </YStack>

        <YStack space="$4" zIndex={1}>
          <XStack justifyContent="space-between" alignItems="flex-start" space="$3">
            <XStack space="$3" alignItems="center" flex={1}>
              <Circle
                size="$4"
                backgroundColor="rgba(255,255,255,0.2)"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.3)"
              >
                <CategoryIcon size={20} color="white" />
              </Circle>

              <YStack flex={1} space="$1">
                <Text
                  color="white"
                  fontSize="$5"
                  fontWeight="900"
                  numberOfLines={1}
                  textShadowColor="rgba(0,0,0,0.2)"
                  textShadowRadius={3}
                >
                  {budget.name || category.name}
                </Text>

                <XStack alignItems="center" flexWrap="wrap" space="$2">
                  <Text
                    color="rgba(255,255,255,0.86)"
                    fontSize={11}
                    fontWeight="700"
                    textTransform="uppercase"
                    letterSpacing={0.8}
                  >
                    {category.name}
                  </Text>

                  {budget.type === "SHARED" && (
                    <XStack
                      alignItems="center"
                      space="$1.5"
                      backgroundColor="rgba(255,255,255,0.18)"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$10"
                    >
                      <ShareIcon size={11} color="white" />
                      <Text
                        fontSize={10}
                        color="white"
                        fontWeight="800"
                        letterSpacing={0.5}
                      >
                        {shareLabel}
                      </Text>
                    </XStack>
                  )}
                </XStack>
              </YStack>
            </XStack>

            <YStack alignItems="flex-end" space="$1.5">
              <XStack
                backgroundColor={statusBg}
                paddingHorizontal="$2.5"
                paddingVertical="$1.5"
                borderRadius="$10"
                space="$1.5"
                alignItems="center"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.2)"
              >
                <StatusIcon size={12} color="white" />
                <Text fontSize={10} color="white" fontWeight="800">
                  {statusText}
                </Text>
              </XStack>

              <Text
                fontSize={10}
                fontWeight="700"
                color="rgba(255,255,255,0.72)"
                textAlign="right"
              >
                {creationDate(budget)}
              </Text>
            </YStack>
          </XStack>

          <YStack>
            <Text
              color="white"
              fontSize={36}
              fontWeight="900"
              letterSpacing={-1.2}
              lineHeight={42}
              adjustsFontSizeToFit
              numberOfLines={1}
              textShadowColor="rgba(0,0,0,0.2)"
              textShadowRadius={4}
            >
              {formatMoney(progress.remaining)}
            </Text>
            <Text color="rgba(255,255,255,0.82)" fontSize={12} fontWeight="600">
              disponibles de {formatMoney(budget.amount)}
            </Text>
          </YStack>

          <YStack space="$2">
            <XStack justifyContent="space-between" alignItems="flex-end">
              <Text
                color="rgba(255,255,255,0.92)"
                fontSize="$3"
                fontWeight="600"
              >
                Gastado: {formatMoney(progress.spent)}
              </Text>
              <Text color="white" fontSize="$5" fontWeight="800">
                {Math.round(percent)}%
              </Text>
            </XStack>

            <Progress
              value={Math.min(percent, 100)}
              size="$3"
              backgroundColor="rgba(0,0,0,0.25)"
              borderRadius="$10"
            >
              <Progress.Indicator
                animation="lazy"
                backgroundColor="white"
                opacity={0.95}
              />
            </Progress>

            <XStack justifyContent="space-between" alignItems="center" marginTop="$1">
              <Text color="rgba(255,255,255,0.74)" fontSize={11}>
                Meta: {formatMoney(budget.amount)}
              </Text>
              {percent >= 100 && (
                <Text color="white" fontSize={11} fontWeight="800">
                  +{formatMoney(progress.spent - budget.amount)}
                </Text>
              )}
            </XStack>
          </YStack>

          {allParticipants.length > 0 && (
            <XStack
              paddingTop="$3"
              borderTopWidth={1}
              borderColor="rgba(255,255,255,0.16)"
              alignItems="center"
              justifyContent="space-between"
            >
              <XStack alignItems="center" space="$2">
                <ShareIcon size={14} color="rgba(255,255,255,0.9)" />
                <Text color="rgba(255,255,255,0.82)" fontSize={11} fontWeight="700">
                  {budget.type === "SHARED" ? "Compartido" : "Participantes"}
                </Text>
              </XStack>

              <XStack flexDirection="row-reverse" paddingRight="$2">
                {hasOverflow && (
                  <Circle
                    size={28}
                    backgroundColor="rgba(255,255,255,0.18)"
                    borderWidth={2}
                    borderColor="rgba(255,255,255,0.28)"
                    marginLeft={-10}
                    zIndex={10}
                  >
                    <Text fontSize={10} fontWeight="800" color="white">
                      +{overflowCount}
                    </Text>
                  </Circle>
                )}

                {visibleParticipants.map((participant, index) => {
                  const initial =
                    participant.user.profile?.firstName?.[0]?.toUpperCase() || "U";

                  return (
                    <Circle
                      key={participant.user.id}
                      size={28}
                      backgroundColor="rgba(255,255,255,0.15)"
                      borderWidth={2}
                      borderColor="rgba(255,255,255,0.28)"
                      marginLeft={index === 0 ? 0 : -10}
                      zIndex={visibleParticipants.length - index}
                      overflow="hidden"
                    >
                      {participant.user.profile?.avatarUrl ? (
                        <Image
                          source={{ uri: participant.user.profile.avatarUrl }}
                          width="100%"
                          height="100%"
                        />
                      ) : (
                        <YStack
                          width="100%"
                          height="100%"
                          backgroundColor={avatarColors.bg}
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Text fontSize={10} fontWeight="900" color={avatarColors.text}>
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
      </Card>
    </Theme>
  );
};
