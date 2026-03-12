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
      width={38}
      height={38}
      justifyContent="center"
      alignItems="center"
      onPress={handlePress}
      hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      backgroundColor="transparent"
      borderRadius={999}
      pressStyle={{
        scale: 0.96,
        backgroundColor: transparent ? "rgba(148,163,184,0.12)" : "$gray3",
      }}
      animation="quick"
      accessibilityRole="button"
      accessibilityLabel="Volver atrás"
      {...props}
    >
      <ChevronLeft size={22} color={iconColor} strokeWidth={2.5} />
    </Stack>
  );
};
