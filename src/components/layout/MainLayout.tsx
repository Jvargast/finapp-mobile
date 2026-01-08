import { YStack, YStackProps, useTheme, useThemeName } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
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

  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.background?.val}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <YStack
          flex={1}
          paddingHorizontal={noPadding ? 0 : "$5"}
          paddingTop={noPadding ? 0 : "$2"}
          {...props}
        >
          {children}
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};
