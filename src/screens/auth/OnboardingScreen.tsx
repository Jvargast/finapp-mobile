import { useState, useRef } from "react";
import { YStack, Text, Button, XStack, Stack, Circle } from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from "react-native";
import {
  Wallet,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  ChevronRight,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthActions } from "../../actions/authActions";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Tu dinero,\nbajo control",
    description:
      "Visualiza todos tus movimientos en un solo lugar. Simple, claro y sin complicaciones.",
    icon: Wallet,
    color: "#4F46E5",
    accent: "#EEF2FF",
  },
  {
    id: "2",
    title: "Blindaje\nFinanciero",
    description:
      "Tecnología de encriptación de grado bancario. Tus datos son solo tuyos.",
    icon: ShieldCheck,
    color: "#0EA5E9",
    accent: "#E0F2FE",
  },
  {
    id: "3",
    title: "Cumple tus\nMetas",
    description:
      "Define objetivos de ahorro inteligentes. Nova te ayuda a llegar a la meta más rápido.",
    icon: TrendingUp,
    color: "#8B5CF6",
    accent: "#F3E8FF",
  },
  {
    id: "4",
    title: "Velocidad\nRelámpago",
    description:
      "Sincronización instantánea. Toma decisiones informadas en tiempo real.",
    icon: Zap,
    color: "#F59E0B",
    accent: "#FEF3C7",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    setCurrentIndex(roundIndex);
  };

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await AuthActions.finishOnboarding();
    }
  };

  const handleSkip = async () => {
    await AuthActions.finishOnboarding();
  };

  return (
    <YStack flex={1} backgroundColor="white">
      <StatusBar barStyle="dark-content" />

      <YStack flex={0.65} position="relative" overflow="hidden">
        <Stack
          position="absolute"
          top={-100}
          left={-50}
          width={400}
          height={400}
          backgroundColor={SLIDES[currentIndex].accent}
          borderRadius={200}
          opacity={0.6}
          animation="lazy"
        />
        <Stack
          position="absolute"
          top={100}
          right={-100}
          width={300}
          height={300}
          backgroundColor={SLIDES[currentIndex].accent}
          borderRadius={150}
          opacity={0.5}
          animation="lazy"
        />

        <SafeAreaView style={{ flex: 1 }}>
          <XStack
            justifyContent="flex-end"
            paddingHorizontal="$5"
            paddingTop="$2"
          >
            <Button
              unstyled
              onPress={handleSkip}
              opacity={0.6}
              pressStyle={{ opacity: 1 }}
            >
              <Text fontSize="$3" fontWeight="600" color="#1E293B">
                Omitir
              </Text>
            </Button>
          </XStack>

          <FlatList
            ref={flatListRef}
            data={SLIDES}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <YStack
                width={width}
                alignItems="center"
                justifyContent="center"
                padding="$4"
              >
                <Stack
                  width={width * 0.7}
                  height={width * 0.7}
                  backgroundColor="white"
                  borderRadius="$10"
                  alignItems="center"
                  justifyContent="center"
                  shadowColor={item.color}
                  shadowRadius={40}
                  shadowOffset={{ width: 0, height: 20 }}
                  shadowOpacity={0.2}
                  elevation={10}
                  transform={[{ rotate: "-6deg" }]}
                  marginBottom="$6"
                >
                  <item.icon size={100} color={item.color} />

                  <Circle
                    size={20}
                    backgroundColor={item.color}
                    position="absolute"
                    top={20}
                    right={20}
                    opacity={0.2}
                  />
                  <Circle
                    size={10}
                    backgroundColor={item.color}
                    position="absolute"
                    bottom={40}
                    left={30}
                    opacity={0.2}
                  />
                </Stack>
              </YStack>
            )}
          />
        </SafeAreaView>
      </YStack>

      <YStack
        flex={0.35}
        backgroundColor="white"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        paddingHorizontal="$6"
        paddingTop="$4"
        paddingBottom={insets.bottom + 20}
        justifyContent="space-between"
      >
        <YStack space="$3">
          <Text
            fontSize={38}
            lineHeight={42}
            fontWeight="900"
            color="#0F172A"
            animation="quick"
          >
            {SLIDES[currentIndex].title}
          </Text>
          <Text fontSize="$5" color="#64748B" lineHeight={26} animation="quick">
            {SLIDES[currentIndex].description}
          </Text>
        </YStack>

        <XStack justifyContent="space-between" alignItems="center">
          <XStack space="$2">
            {SLIDES.map((item, index) => (
              <Stack
                key={index}
                width={currentIndex === index ? 32 : 8}
                height={8}
                borderRadius={4}
                backgroundColor={
                  currentIndex === index ? item.color : "#E2E8F0"
                }
                animation="bouncy"
              />
            ))}
          </XStack>

          <Button
            onPress={handleNext}
            size="$5"
            backgroundColor={
              currentIndex === SLIDES.length - 1
                ? SLIDES[currentIndex].color
                : "#1E293B"
            }
            width={currentIndex === SLIDES.length - 1 ? 150 : 70}
            height={70}
            borderRadius={35}
            pressStyle={{ scale: 0.95, opacity: 0.8 }}
            animation="bouncy"
            elevation={5}
            icon={
              currentIndex !== SLIDES.length - 1 ? (
                <ChevronRight size={32} color="white" />
              ) : undefined
            }
          >
            {currentIndex === SLIDES.length - 1 && (
              <Text
                color="white"
                fontWeight="bold"
                fontSize="$5"
                animation="quick"
                enterStyle={{ opacity: 0, y: 10 }}
              >
                Empezar
              </Text>
            )}
          </Button>
        </XStack>
      </YStack>
    </YStack>
  );
}
