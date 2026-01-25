import React from "react";
import { YStack, XStack, Text, Card, Progress, Circle, Theme } from "tamagui";
import { AlertTriangle, TrendingUp, CheckCircle2 } from "@tamagui/lucide-icons";
import { Budget } from "../../types/budget.types";
import { getIcon } from "../../utils/iconMap";

export const BudgetProgressCard = ({ budget }: { budget: Budget }) => {
  const { progress, currency, category } = budget;
  const percent = progress.percentage;
  const CategoryIcon = getIcon(category.icon);

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

  const formatMoney = (val: number) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <Theme name="dark">
      <Card
        backgroundColor={category.color || "$gray9"}
        borderRadius="$8"
        padding="$5"
        elevation={10}
        shadowColor={category.color || "$gray9"}
        shadowOpacity={0.4}
        shadowRadius={15}
        animation="bouncy"
        pressStyle={{ scale: 0.98 }}
        overflow="hidden"
        borderWidth={1}
        borderColor="rgba(255,255,255,0.15)"
      >
        <YStack
          position="absolute"
          right={-20}
          bottom={-30}
          opacity={0.15}
          rotate="-15deg"
          pointerEvents="none"
        >
          <CategoryIcon size={180} color="white" />
        </YStack>

        <YStack space="$5" zIndex={1}>
          <XStack justifyContent="space-between" alignItems="center">
            <XStack space="$3" alignItems="center">
              <Circle
                size="$4"
                backgroundColor="rgba(255,255,255,0.2)"
                borderWidth={1}
                borderColor="rgba(255,255,255,0.3)"
              >
                <CategoryIcon size={20} color="white" />
              </Circle>
              <YStack>
                <Text
                  color="rgba(255,255,255,0.9)"
                  fontSize={12}
                  fontWeight="800"
                  textTransform="uppercase"
                  letterSpacing={1}
                  textShadowColor="rgba(0,0,0,0.3)"
                  textShadowRadius={2}
                >
                  {category.name}
                </Text>
                <Text
                  color="rgba(255,255,255,0.8)"
                  fontSize={11}
                  fontWeight="600"
                >
                  {percent >= 100 ? "Sin fondos" : "Disponible"}
                </Text>
              </YStack>
            </XStack>

            <XStack
              backgroundColor={statusBg}
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              borderRadius="$10"
              space="$1.5"
              alignItems="center"
              shadowColor="rgba(0,0,0,0.5)"
              shadowRadius={5}
              shadowOpacity={0.3}
              borderWidth={1}
              borderColor="rgba(255,255,255,0.2)"
            >
              <StatusIcon size={12} color="white" />
              <Text fontSize={10} color="white" fontWeight="800">
                {statusText}
              </Text>
            </XStack>
          </XStack>

          <YStack>
            <Text
              color="white"
              fontSize={42}
              fontWeight="900"
              letterSpacing={-1.5}
              lineHeight={48}
              adjustsFontSizeToFit
              numberOfLines={1}
              textShadowColor="rgba(0,0,0,0.2)"
              textShadowRadius={4}
            >
              {formatMoney(progress.remaining)}
            </Text>
          </YStack>

          <YStack space="$2">
            <XStack justifyContent="space-between" alignItems="flex-end">
              <Text
                color="rgba(255,255,255,0.9)"
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

            <XStack justifyContent="flex-end" marginTop="$1">
              <Text color="rgba(255,255,255,0.7)" fontSize={11}>
                Meta: {formatMoney(budget.amount)}
              </Text>
            </XStack>
          </YStack>
        </YStack>
      </Card>
    </Theme>
  );
};
