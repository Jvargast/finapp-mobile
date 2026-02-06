import React from "react";
import { Stack, StackProps } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { CommonActions, useNavigation } from "@react-navigation/native";

interface GoBackButtonProps extends StackProps {
  onPress?: () => void;
  iconColor?: string;
  transparent?: boolean;
  fallbackRouteName?: string;
}

export const GoBackButton = ({
  onPress,
  iconColor = "$gray11",
  transparent = false,
  fallbackRouteName = "Dashboard",
  ...props
}: GoBackButtonProps) => {
  const navigation: any = useNavigation();

  const navigateToInParents = (routeName: string) => {
    let nav: any = navigation;

    while (nav) {
      const state = nav.getState?.();
      const routeNames: string[] = state?.routeNames ?? [];

      if (routeNames.includes(routeName)) {
        nav.dispatch(CommonActions.navigate({ name: routeName }));
        return true;
      }

      nav = nav.getParent?.();
    }

    return false;
  };

  const handlePress = () => {
    if (onPress) return onPress();

    if (navigation.canGoBack()) return navigation.goBack();

    navigateToInParents(fallbackRouteName);
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
