import React from "react";
import { YStack, XStack, Label, Stack } from "tamagui";
import { Check } from "@tamagui/lucide-icons";
import { useSubscription } from "../../hooks/useSubscription";

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export const ColorSelector = ({
  colors,
  selectedColor,
  onSelect,
}: ColorSelectorProps) => {
  const { isPro } = useSubscription();
  return (
    <YStack space="$3">
      <Label fontWeight="700" fontSize="$3" color="$gray11">
        Color de la tarjeta
      </Label>
      <XStack space="$3" flexWrap="wrap">
        {colors.map((color) => {
          const isSelected = selectedColor === color;
          return (
            <Stack
              key={color}
              width={45}
              height={45}
              borderRadius={25}
              backgroundColor={color}
              onPress={() => onSelect(color)}
              alignItems="center"
              justifyContent="center"
              pressStyle={{ scale: 0.9 }}
              borderWidth={isSelected ? 3 : 0}
              borderColor="$color"
              animation="quick"
            >
              {isSelected && <Check color="white" size={20} strokeWidth={4} />}
            </Stack>
          );
        })}
      </XStack>
    </YStack>
  );
};
