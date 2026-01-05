import { useState } from "react";
import {
  YStack,
  Text,
  Button,
  Input,
  Spinner,
  XStack,
  Label,
  Stack,
  ScrollView,
} from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/useAuthStore";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import { Mail, Lock, LogIn, Eye, EyeOff, Wallet } from "@tamagui/lucide-icons";
import { useToastStore } from "../../stores/useToastStore";
import { AuthActions } from "../../actions/authActions";

const COLORS = {
  primary: "#4F46E5",
  background: "#F8FAFC",
  textMain: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const showToast = useToastStore((state) => state.showToast);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Faltan datos importantes", "warning");
      return;
    }

    Keyboard.dismiss();
    setIsSubmitting(true);

    try {
      await AuthActions.login(email, password);
    } catch (error: any) {
      setIsSubmitting(false);

      console.error("LOGIN ERROR:", error);

      if (error.response?.status === 401) {
        showToast("Correo o contraseña incorrectos", "error");
      } else if (error.message?.includes("Network")) {
        showToast("Sin conexión a internet", "error");
      } else {
        showToast("Ocurrió un error inesperado", "error");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <YStack flex={1} justifyContent="center" padding="$5" space="$5">
              <YStack alignItems="center" space="$2" marginBottom="$4">
                <Stack
                  backgroundColor={COLORS.primary}
                  padding="$3.5"
                  borderRadius="$10"
                  marginBottom="$3"
                  transform={[{ rotate: "-5deg" }]}
                >
                  <Wallet size={36} color="white" />
                </Stack>
                <Text
                  fontSize={40}
                  fontWeight="900"
                  color={COLORS.textMain}
                  letterSpacing={-1}
                >
                  Nova
                </Text>
                <Text fontSize="$4" color={COLORS.textMuted} textAlign="center">
                  Tu futuro financiero, hoy.
                </Text>
              </YStack>

              <YStack
                backgroundColor={COLORS.white}
                borderRadius="$8"
                padding="$5"
                shadowColor="#64748B"
                shadowRadius={20}
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.1}
                elevation={4}
                space="$4"
              >
                <YStack space="$2">
                  <Label
                    color={COLORS.textMuted}
                    fontSize="$3"
                    fontWeight="600"
                  >
                    Correo
                  </Label>
                  <XStack
                    alignItems="center"
                    borderWidth={1.5}
                    borderColor={
                      focusedInput === "email" ? COLORS.primary : COLORS.border
                    }
                    borderRadius="$4"
                    paddingHorizontal="$3"
                    height={54}
                    backgroundColor={
                      focusedInput === "email" ? "#EEF2FF" : "transparent"
                    }
                  >
                    <Mail
                      size={20}
                      color={
                        focusedInput === "email" ? COLORS.primary : "#94A3B8"
                      }
                    />
                    <Input
                      flex={1}
                      unstyled
                      placeholder="hola@nova.app"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={(text: string) => setEmail(text)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={{
                        fontSize: 16,
                        padding: 10,
                        color: COLORS.textMain,
                        height: "100%",
                      }}
                    />
                  </XStack>
                </YStack>

                <YStack space="$2">
                  <XStack justifyContent="space-between">
                    <Label
                      color={COLORS.textMuted}
                      fontSize="$3"
                      fontWeight="600"
                    >
                      Contraseña
                    </Label>
                  </XStack>
                  <XStack
                    alignItems="center"
                    borderWidth={1.5}
                    borderColor={
                      focusedInput === "password"
                        ? COLORS.primary
                        : COLORS.border
                    }
                    borderRadius="$4"
                    paddingHorizontal="$3"
                    height={54}
                    backgroundColor={
                      focusedInput === "password" ? "#EEF2FF" : "transparent"
                    }
                  >
                    <Lock
                      size={20}
                      color={
                        focusedInput === "password" ? COLORS.primary : "#94A3B8"
                      }
                    />

                    <TextInput
                      placeholder="••••••••"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      style={{
                        flex: 1,
                        fontSize: 16,
                        padding: 10,
                        color: COLORS.textMain,
                        height: "100%",
                      }}
                    />

                    <Pressable
                      onPress={() => setShowPassword(!showPassword)}
                      style={{ padding: 10 }}
                      hitSlop={15}
                    >
                      {showPassword ? (
                        <Eye size={22} color={COLORS.primary} />
                      ) : (
                        <EyeOff size={22} color="#94A3B8" />
                      )}
                    </Pressable>
                  </XStack>
                </YStack>

                <Button
                  onPress={handleLogin}
                  backgroundColor={COLORS.primary}
                  pressStyle={{ opacity: 0.8, scale: 0.98 }}
                  size="$5"
                  marginTop="$4"
                  borderRadius="$6"
                  disabled={isSubmitting}
                  icon={isSubmitting ? <Spinner color="white" /> : undefined}
                  height={54}
                >
                  <Text
                    color="white"
                    fontWeight="bold"
                    fontSize="$5"
                    letterSpacing={0.5}
                  >
                    {isSubmitting ? "Entrando..." : "Iniciar Sesión"}
                  </Text>
                </Button>
              </YStack>

              <YStack alignItems="center" marginTop="$4">
                <Text fontSize="$3" color={COLORS.textMuted}>
                  ¿Olvidaste tu contraseña?{" "}
                  <Text color={COLORS.primary} fontWeight="bold">
                    Recuperar
                  </Text>
                </Text>
              </YStack>
            </YStack>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
