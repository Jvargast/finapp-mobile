import {
  YStack,
  Text,
  Button,
  Stack,
  Separator,
  XStack,
  Circle,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Mail, Wallet } from "@tamagui/lucide-icons";
import { Image, Pressable, StatusBar } from "react-native";

const COLORS = {
  primary: "#4F46E5",
  background: "#F8FAFC",
  textMain: "#1E293B",
  textMuted: "#64748B",
  white: "#FFFFFF",
};

export default function WelcomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <YStack flex={1} backgroundColor="white">
      <StatusBar barStyle="dark-content" />
      <Stack position="absolute" width="100%" height="100%" overflow="hidden">
        <Circle
          size={400}
          backgroundColor="#EEF2FF"
          position="absolute"
          top={-150}
          right={-100}
          opacity={0.7}
        />
        <Circle
          size={300}
          backgroundColor="#E0E7FF"
          position="absolute"
          bottom={-50}
          left={-100}
          opacity={0.5}
        />
      </Stack>

      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} padding="$5" justifyContent="space-between">
          <YStack
            flex={1}
            justifyContent="center"
            alignItems="center"
            space="$4"
          >
            <Stack
              backgroundColor={COLORS.primary}
              padding="$5"
              borderRadius="$12"
              transform={[{ rotate: "-8deg" }]}
              shadowColor={COLORS.primary}
              shadowRadius={20}
              shadowOffset={{ width: 0, height: 10 }}
              shadowOpacity={0.3}
              elevation={10}
              animation="bouncy"
              enterStyle={{ scale: 0.5, opacity: 0, rotate: "0deg" }}
            >
              <Wallet size={64} color="white" />
            </Stack>

            <YStack alignItems="center" space="$1">
              <Text
                fontSize={48}
                fontWeight="900"
                color={COLORS.textMain}
                letterSpacing={-1.5}
                animation="quick"
                enterStyle={{ opacity: 0, y: 10 }}
              >
                Nova
              </Text>
              <Text
                fontSize="$5"
                color={COLORS.textMuted}
                textAlign="center"
                animation="quick"
                enterStyle={{ opacity: 0, y: 10 }}
                delay={100}
              >
                El control de tu dinero,{"\n"}reimaginado.
              </Text>
            </YStack>
          </YStack>

          <YStack
            space="$3"
            marginBottom="$2"
            animation="lazy"
            enterStyle={{ opacity: 0, y: 50 }}
          >
            <Button
              size="$5"
              backgroundColor="white"
              borderColor="#E2E8F0"
              borderWidth={1}
              borderRadius="$8"
              height={56}
              pressStyle={{
                backgroundColor: "#F8FAFC",
                borderColor: "#CBD5E1",
              }}
              onPress={() => alert("Próximamente: Google")}
              elevation={1}
            >
              <XStack alignItems="center" space="$3">
                <Image
                  source={{
                    uri: "https://img.icons8.com/color/48/google-logo.png",
                  }}
                  style={{ width: 24, height: 24, resizeMode: "contain" }}
                />
                <Text color={COLORS.textMain} fontWeight="700" fontSize="$4">
                  Continuar con Google
                </Text>
              </XStack>
            </Button>

            <Button
              size="$5"
              backgroundColor="black"
              borderRadius="$8"
              height={56}
              pressStyle={{ opacity: 0.8 }}
              onPress={() => alert("Próximamente: Apple")}
              elevation={2}
            >
              <XStack alignItems="center" space="$3">
                <Image
                  source={{
                    uri: "https://img.icons8.com/ios-glyphs/60/ffffff/mac-os.png",
                  }}
                  style={{ width: 24, height: 24, resizeMode: "contain" }}
                />
                <Text color="white" fontWeight="700" fontSize="$4">
                  Continuar con Apple
                </Text>
              </XStack>
            </Button>

            <XStack alignItems="center" space="$3" marginVertical="$3">
              <Separator flex={1} borderColor="#E2E8F0" />
              <Text
                color="#94A3B8"
                fontSize="$3"
                fontWeight="600"
                textTransform="uppercase"
                letterSpacing={1}
              >
                o
              </Text>
              <Separator flex={1} borderColor="#E2E8F0" />
            </XStack>

            <Button
              size="$5"
              backgroundColor={COLORS.primary}
              borderRadius="$8"
              height={56}
              icon={<Mail size={22} color="white" />}
              pressStyle={{ opacity: 0.9, scale: 0.98 }}
              onPress={() => navigation.navigate("Login")}
              shadowColor={COLORS.primary}
              shadowRadius={10}
              shadowOffset={{ width: 0, height: 4 }}
              shadowOpacity={0.2}
            >
              <Text color="white" fontWeight="bold" fontSize="$4">
                Usar Correo Electrónico
              </Text>
            </Button>
          </YStack>
          <YStack alignItems="center" marginTop="$4">
            <Text fontSize="$3" color="#94A3B8">
              ¿Eres nuevo en Nova?
            </Text>
            <Pressable
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: 4, padding: 5 }}
            >
              <Text color={COLORS.primary} fontWeight="bold" fontSize="$4">
                Crear una cuenta
              </Text>
            </Pressable>
          </YStack>

          <Text
            textAlign="center"
            fontSize="$2"
            color="#94A3B8"
            marginTop="$4"
            paddingHorizontal="$6"
            lineHeight={18}
          >
            Al registrarte, aceptas nuestros{" "}
            <Text
              color={COLORS.textMain}
              fontWeight="600"
              textDecorationLine="underline"
            >
              Términos de Servicio
            </Text>{" "}
            y{" "}
            <Text
              color={COLORS.textMain}
              fontWeight="600"
              textDecorationLine="underline"
            >
              Política de Privacidad
            </Text>
            .
          </Text>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}
