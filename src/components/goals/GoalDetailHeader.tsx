import React from "react";
import { XStack, Button, Text, Circle } from "tamagui";
import { ChevronLeft, MoreVertical, Edit3 } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { GoBackButton } from "../ui/GoBackButton";

interface GoalDetailHeaderProps {
  title: string;
  type: string;
}

export const GoalDetailHeader = ({ title, type }: GoalDetailHeaderProps) => {
  const navigation = useNavigation();

  return (
    <XStack
      justifyContent="space-between"
      alignItems="center"
      paddingHorizontal="$4"
      paddingTop="$2"
      paddingBottom="$4"
      backgroundColor="$background"
    >
      <GoBackButton />

      <XStack flexDirection="column" alignItems="center">
        <Text
          fontSize="$4"
          fontWeight="800"
          color="$color"
          numberOfLines={1}
          maxWidth={200}
        >
          {title}
        </Text>
        <Text
          fontSize={10}
          color="$gray9"
          textTransform="uppercase"
          letterSpacing={1}
          fontWeight="600"
        >
          {type}
        </Text>
      </XStack>

      <Button
        size="$3"
        circular
        backgroundColor="$gray2"
        icon={<Edit3 size={18} color="$gray11" />}
        onPress={() => console.log("Editar")}
        chromeless
      />
    </XStack>
  );
};
