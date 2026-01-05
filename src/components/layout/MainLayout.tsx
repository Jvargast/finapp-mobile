import { YStack, YStackProps } from "tamagui";
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
  backgroundColor = "#F8FAFC",
  ...props
}: MainLayoutProps) => {
  return (
    <YStack flex={1} backgroundColor={backgroundColor}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
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
