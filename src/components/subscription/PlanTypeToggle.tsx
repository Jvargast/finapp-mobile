import React from "react";
import { XStack, Text, Button, AnimatePresence } from "tamagui";

interface Props {
  selected: "INDIVIDUAL" | "FAMILY";
  onSelect: (plan: "INDIVIDUAL" | "FAMILY") => void;
}

export const PlanTypeToggle = ({ selected, onSelect }: Props) => {
  return (
    <XStack
      backgroundColor="$gray3"
      padding="$1"
      borderRadius="$10"
      height={45}
      width="90%"
      alignSelf="center"
      position="relative"
      marginBottom="$4"
    >

      <Button
        flex={1}
        size="$3"
        backgroundColor={
          selected === "INDIVIDUAL" ? "$background" : "transparent"
        }
        color={selected === "INDIVIDUAL" ? "$color" : "$gray10"}
        onPress={() => onSelect("INDIVIDUAL")}
        chromeless={selected !== "INDIVIDUAL"}
        borderRadius="$8"
      >
        <Text fontWeight={selected === "INDIVIDUAL" ? "700" : "500"}>
          Individual
        </Text>
      </Button>

      <Button
        flex={1}
        size="$3"
        backgroundColor={selected === "FAMILY" ? "$background" : "transparent"}
        color={selected === "FAMILY" ? "$color" : "$gray10"}
        onPress={() => onSelect("FAMILY")}
        chromeless={selected !== "FAMILY"}
        borderRadius="$8"
      >
        <Text fontWeight={selected === "FAMILY" ? "700" : "500"}>Familiar</Text>
      </Button>
    </XStack>
  );
};
