import React from "react";
import { YStack, XStack, Text, Progress, Circle, Image } from "tamagui";
import { AlertTriangle, TrendingUp, CheckCircle2 } from "@tamagui/lucide-icons";
import { Budget } from "../../types/budget.types";

interface BudgetCardProps {
  budget: Budget;
  onPress: () => void;
}

export const BudgetCard = ({ budget, onPress }: BudgetCardProps) => {
  const { progress, category, participants } = budget;
  const percent = progress.percentage;

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
      elevation={2}
      pressStyle={{ scale: 0.98, opacity: 0.9 }}
      animation="quick"
      onPress={onPress}
      shadowColor="$shadowColor"
      shadowRadius={10}
      shadowOpacity={0.05}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <XStack space="$3" alignItems="center">
          <Circle size="$4" backgroundColor={category.color || "$gray5"}>
            <Text fontSize={20}>{category.icon || "💰"}</Text>
          </Circle>
          <YStack>
            <Text fontSize="$4" fontWeight="800" color="$color">
              {budget.name || category.name}
            </Text>
            {budget.type === "SHARED" && (
              <Text fontSize={10} color="$purple10" fontWeight="700">
                FAMILIAR
              </Text>
            )}
          </YStack>
        </XStack>

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

      {budget.type === "SHARED" && budget.participants?.length > 0 && (
        <XStack
          marginTop="$1"
          paddingTop="$2"
          borderTopWidth={1}
          borderColor="$gray3"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontSize={11} color="$gray9">
            Compartido con:
          </Text>
          <XStack>
            {budget.participants.slice(0, 3).map((p, index) => (
              <Circle
                key={p.user.id}
                size={24}
                backgroundColor="$gray5"
                borderWidth={2}
                borderColor="$background"
                marginLeft={index > 0 ? -10 : 0}
                overflow="hidden"
              >
                {p.user.profile?.avatarUrl ? (
                  <Image
                    source={{ uri: p.user.profile.avatarUrl }}
                    width="100%"
                    height="100%"
                  />
                ) : (
                  <Text fontSize={10} fontWeight="bold" color="$gray11">
                    {p.user.profile?.firstName?.[0] || "?"}
                  </Text>
                )}
              </Circle>
            ))}
            {budget.participants.length > 3 && (
              <Circle
                size={24}
                backgroundColor="$gray4"
                marginLeft={-10}
                borderWidth={2}
                borderColor="$background"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize={9} fontWeight="bold" color="$gray11">
                  +{budget.participants.length - 3}
                </Text>
              </Circle>
            )}
          </XStack>
        </XStack>
      )}
    </YStack>
  );
};
