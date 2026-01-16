import { YStack, YStackProps, useTheme, useThemeName } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "react-native";

interface MainLayoutProps extends YStackProps {
  children: React.ReactNode;
  noPadding?: boolean;
  backgroundColor?: string;
}

export const MainLayout = ({
  children,
  noPadding = false,
  backgroundColor = "$background",
  ...props
}: MainLayoutProps) => {
  const theme = useTheme();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const insets = useSafeAreaInsets();

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background?.val}
      />

      <YStack
        flex={1}
        paddingHorizontal={noPadding ? 0 : "$5"}
        paddingTop={noPadding ? 0 : insets.top + 10}
        paddingBottom={noPadding ? 0 : insets.bottom}
        {...props}
      >
        {children}
      </YStack>
    </YStack>
  );
};
