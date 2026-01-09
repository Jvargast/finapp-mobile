import React from "react";
import { Stack, StackProps } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

interface GoBackButtonProps extends StackProps {
  onPress?: () => void;
  iconColor?: string;
  transparent?: boolean;
}

export const GoBackButton = ({
  onPress,
  iconColor = "$gray11",
  transparent = false,
  ...props
}: GoBackButtonProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <Stack
      width={42}
      height={42}
      justifyContent="center"
      alignItems="center"
      onPress={handlePress}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      backgroundColor={transparent ? "rgba(255,255,255,0.8)" : "$background"}
      borderRadius="$10"
      borderWidth={1}
      borderColor="$gray4"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={8}
      pressStyle={{
        scale: 0.92,
        backgroundColor: "$gray3",
        borderColor: "$gray5",
      }}
      animation="quick"
      accessibilityRole="button"
      accessibilityLabel="Volver atrás"
      {...props}
    >
      <Stack x={-1.5}>
        <ChevronLeft size={24} color={iconColor} strokeWidth={2.5} />
      </Stack>
    </Stack>
  );
};
