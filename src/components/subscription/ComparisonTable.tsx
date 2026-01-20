import React, { useMemo } from "react";
import { YStack, XStack, Text } from "tamagui";
import { Check, X } from "@tamagui/lucide-icons";
import { COMPARISON_DATA } from "../../constants/subscriptionFeatures";

interface Props {
  planType: "INDIVIDUAL" | "FAMILY";
}

export const ComparisonTable = ({ planType }: Props) => {
  const highlightColor = "rgba(245, 158, 11, 0.08)";
  const highlightBorder = "rgba(245, 158, 11, 0.25)";
  const activeTextColor = "#FBBF24";

  const allFeatures = useMemo(
    () => COMPARISON_DATA.flatMap((section) => section.features),
    []
  );

  const getProValue = (value: string) => {
    if (value === "dynamic_collaboration") {
      return planType === "FAMILY" ? "Grupo (6 pax)" : "Modo Pareja";
    }
    if (value === "dynamic_dashboard") {
      return planType === "FAMILY" ? "✅ Modo Hogar" : "❌";
    }
    return value;
  };

  return (
    <YStack width="100%" paddingBottom="$4">
      <XStack alignItems="stretch" height={50}>
        <YStack flex={1.5} justifyContent="center" paddingLeft="$3">
          <Text fontSize="$3" color="$gray10" fontWeight="600">
            Beneficios
          </Text>
        </YStack>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text fontSize="$3" color="$gray10" fontWeight="600">
            Free
          </Text>
        </YStack>
        <YStack
          flex={1.2}
          justifyContent="center"
          alignItems="center"
          backgroundColor={highlightColor}
          borderTopLeftRadius="$4"
          borderTopRightRadius="$4"
          borderTopWidth={1}
          borderLeftWidth={1}
          borderRightWidth={1}
          borderBottomWidth={0}
          borderColor={highlightBorder}
        >
          <Text fontSize="$3" color="#F59E0B" fontWeight="800">
            Wou+
          </Text>
        </YStack>
      </XStack>

      {allFeatures.map((feature, index) => {
        const isLastRow = index === allFeatures.length - 1;
        const isEven = index % 2 === 0;
        const proText = getProValue(feature.pro);
        const isCheck = proText.includes("✅");

        return (
          <XStack
            key={feature.name}
            alignItems="stretch"
            minHeight={50}
            backgroundColor={isEven ? "rgba(255,255,255,0.02)" : "transparent"}
          >
            <YStack
              flex={1.5}
              justifyContent="center"
              paddingLeft="$3"
              paddingVertical="$2"
            >
              <Text fontSize={13} color="$gray12" fontWeight="500">
                {feature.name}
              </Text>
            </YStack>

            <YStack
              flex={1}
              justifyContent="center"
              alignItems="center"
              paddingVertical="$2"
            >
              {feature.free === "✅" ? (
                <Check size={18} color="$gray8" />
              ) : feature.free === "❌" ? (
                <X size={18} color="$gray6" />
              ) : (
                <Text fontSize={12} color="$gray9" textAlign="center">
                  {feature.free}
                </Text>
              )}
            </YStack>

            <YStack
              flex={1.2}
              justifyContent="center"
              alignItems="center"
              backgroundColor={highlightColor}
              paddingVertical="$2"
              borderLeftWidth={1}
              borderRightWidth={1}
              borderColor={highlightBorder}
              borderBottomLeftRadius={isLastRow ? "$4" : 0}
              borderBottomRightRadius={isLastRow ? "$4" : 0}
              borderBottomWidth={isLastRow ? 1 : 0}
            >
              {isCheck ? (
                <YStack alignItems="center">
                  <Check size={22} color={activeTextColor} strokeWidth={3} />
                  {proText.replace("✅", "").trim().length > 0 && (
                    <Text
                      fontSize={10}
                      color={activeTextColor}
                      fontWeight="700"
                      marginTop="$1"
                    >
                      {proText.replace("✅", "")}
                    </Text>
                  )}
                </YStack>
              ) : proText === "❌" ? (
                <X size={22} color={activeTextColor} strokeWidth={3} />
              ) : (
                <Text
                  fontSize={12}
                  color={activeTextColor}
                  fontWeight="700"
                  textAlign="center"
                >
                  {proText}
                </Text>
              )}
            </YStack>
          </XStack>
        );
      })}
    </YStack>
  );
};
