import React from "react";
import { YStack, XStack, Text } from "tamagui";

interface MonthlySummaryProps {
  totalSpent: number;
  totalBudgeted: number;
}

export const MonthlySummary = ({
  totalSpent,
  totalBudgeted,
}: MonthlySummaryProps) => {
  const percentage = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;

  const barColor = percentage > 100 ? "$red9" : "$blue9";

  return (
    <YStack
      borderRadius="$8"
      overflow="hidden"
      backgroundColor="$gray2"
      padding="$5"
      space="$2"
      borderWidth={1}
      borderColor="$gray4"
    >
      <Text fontSize="$3" fontWeight="700" color="$gray10" letterSpacing={1}>
        RESUMEN MENSUAL
      </Text>

      <XStack alignItems="baseline" space="$1">
        <Text fontSize={36} fontWeight="900" color="$color">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(totalSpent)}
        </Text>
        <Text fontSize="$4" color="$gray11" fontWeight="500">
          gastados
        </Text>
      </XStack>

      <Text fontSize="$3" color="$gray10">
        <Text>de un total presupuestado de </Text>
        <Text color="$color" fontWeight="700">
          {new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: "CLP",
          }).format(totalBudgeted)}
        </Text>
      </Text>

      <YStack
        height={6}
        backgroundColor="$gray5"
        borderRadius="$10"
        marginTop="$2"
        overflow="hidden"
      >
        <YStack
          height="100%"
          width={`${Math.min(percentage, 100)}%`}
          backgroundColor={barColor}
          animation="lazy"
        />
      </YStack>
    </YStack>
  );
};
