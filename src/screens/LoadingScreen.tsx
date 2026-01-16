import { useEffect, useState } from "react";
import { YStack, Text, Spinner, Stack, Circle, XStack } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, StatusBar } from "react-native";

const COLORS = {
  primary: "#4F46E5",
  background: "#F8FAFC",
  textMain: "#1E293B",
  textMuted: "#64748B",
  lightAccent: "#EEF2FF",
};

export default function LoadingScreen() {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((prev) => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <YStack flex={1} backgroundColor="white" position="relative">
      <StatusBar barStyle="dark-content" />

      <Stack position="absolute" width="100%" height="100%" overflow="hidden">
        <Circle
          size={500}
          backgroundColor={COLORS.lightAccent}
          position="absolute"
          top={-200}
          right={-150}
          opacity={0.6}
        />
        <Circle
          size={400}
          backgroundColor="#E0E7FF"
          position="absolute"
          bottom={-100}
          left={-100}
          opacity={0.5}
        />
      </Stack>

      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Stack
            justifyContent="center"
            alignItems="center"
            width={140}
            height={140}
          >
            <Circle
              size={pulse ? 160 : 120}
              backgroundColor={COLORS.primary}
              opacity={pulse ? 0 : 0.15}
              position="absolute"
              animation="lazy"
            />

            <Stack
              width={120}
              height={120}
              borderRadius={60}
              backgroundColor="white"
              shadowColor={COLORS.primary}
              shadowRadius={pulse ? 30 : 15}
              shadowOffset={{ width: 0, height: 10 }}
              shadowOpacity={0.3}
              scale={pulse ? 1.02 : 1}
              animation="bouncy"
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
            >
              <Image
                source={require("../../assets/wou-finance.jpg")}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
            </Stack>
          </Stack>

          <YStack alignItems="center" marginTop="$6" space="$2">
            <Text
              fontSize={42}
              fontWeight="900"
              color={COLORS.textMain}
              letterSpacing={-1.5}
              opacity={pulse ? 1 : 0.8}
              animation="lazy"
            >
              Wou Finance
            </Text>
          </YStack>
          <Stack position="absolute" bottom={60}>
            <XStack
              backgroundColor="white"
              paddingHorizontal="$5"
              paddingVertical="$3"
              borderRadius="$10"
              space="$3"
              alignItems="center"
              shadowColor="#000"
              shadowRadius={10}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.05}
              elevation={2}
              borderWidth={1}
              borderColor="#F1F5F9"
            >
              <Spinner size="small" color={COLORS.primary} />
              <Text fontSize="$3" color={COLORS.textMuted} fontWeight="600">
                Iniciando ecosistema...
              </Text>
            </XStack>
          </Stack>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}
