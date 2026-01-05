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
  Progress,
  Separator,
} from "tamagui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronLeft,
  CheckCircle2,
  CheckSquare,
  Square,
  AlertCircle,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { AuthActions } from "../../actions/authActions";
import {
  PASSWORD_REGEX_VALIDATOR,
  PasswordRequirements,
} from "../../components/shared/PasswordRequirements";
import { PasswordInput } from "../../components/shared/PasswordInput";

const COLORS = {
  primary: "#4F46E5",
  secondary: "#A855F7",
  background: "#F8FAFC",
  textMain: "#1E293B",
  textMuted: "#64748B",
  border: "#E2E8F0",
  white: "#FFFFFF",
  error: "#EF4444",
  success: "#22C55E",
};

const CustomInput = ({
  icon: Icon,
  label,
  id,
  focusedInput,
  setFocusedInput,
  ...props
}: any) => {
  const isFocused = focusedInput === id;
  return (
    <YStack space="$2">
      <Label color={COLORS.textMuted} fontSize="$3" fontWeight="600">
        {label}
      </Label>
      <XStack
        alignItems="center"
        borderWidth={1.5}
        borderColor={isFocused ? COLORS.primary : COLORS.border}
        borderRadius="$4"
        paddingHorizontal="$3"
        height={54}
        backgroundColor={isFocused ? "#EEF2FF" : COLORS.white}
        animation="quick"
      >
        <Icon size={20} color={isFocused ? COLORS.primary : "#94A3B8"} />
        <Input
          flex={1}
          unstyled
          placeholderTextColor="#94A3B8"
          onFocus={() => setFocusedInput(id)}
          onBlur={() => setFocusedInput(null)}
          style={{
            fontSize: 16,
            padding: 10,
            color: COLORS.textMain,
            height: "100%",
          }}
          {...props}
        />
      </XStack>
    </YStack>
  );
};

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const loading = useAuthStore((state) => state.isLoading);

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  const progressValue = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
    if (errorMsg) setErrorMsg(null);
  };

  const handleNext = async () => {
    Keyboard.dismiss();
    setErrorMsg(null);

    if (currentStep === 1) {
      if (!formData.firstName.trim() || formData.firstName.length < 2) {
        setErrorMsg("Ingresa tu nombre.");
        return;
      }
      if (!formData.lastName.trim() || formData.lastName.length < 2) {
        setErrorMsg("Ingresa tu apellido.");
        return;
      }
      setCurrentStep(2);
    } else {
      if (!formData.email.includes("@")) {
        setErrorMsg("El correo electrónico no es válido.");
        return;
      }
      if (!PASSWORD_REGEX_VALIDATOR.test(formData.password)) {
        setErrorMsg("La contraseña no cumple con los requisitos de seguridad.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrorMsg("Las contraseñas no coinciden.");
        return;
      }
      if (!formData.termsAccepted) {
        setErrorMsg("Debes aceptar los términos y condiciones.");
        return;
      }

      handleFinalRegister();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleFinalRegister = async () => {
    try {
      await AuthActions.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      navigation.replace("Setup");
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);
      setErrorMsg(
        "Error al registrar: " + (error.message || "Intenta nuevamente")
      );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1} padding="$5">
            <YStack marginBottom="$6" space="$4">
              <XStack justifyContent="space-between" alignItems="center">
                <Pressable onPress={handleBack} style={{ padding: 5 }}>
                  <ChevronLeft size={28} color={COLORS.textMain} />
                </Pressable>
                <Text color={COLORS.textMuted} fontSize="$3" fontWeight="600">
                  Paso {currentStep} de {totalSteps}
                </Text>
                <Stack width={28} />
              </XStack>

              <Progress size="$1" value={progressValue} animation="bouncy">
                <Progress.Indicator
                  backgroundColor={COLORS.primary}
                  animation="bouncy"
                />
              </Progress>
            </YStack>

            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <YStack
                flex={1}
                justifyContent="space-between"
                paddingBottom={insets.bottom + 20}
              >
                <YStack space="$5">
                  <YStack
                    animation="quick"
                    enterStyle={{ opacity: 0, x: -20 }}
                    key={`title-${currentStep}`}
                  >
                    <Text
                      fontSize={32}
                      fontWeight="900"
                      color={COLORS.textMain}
                      letterSpacing={-1}
                    >
                      {currentStep === 1
                        ? "¿Cómo te llamas?"
                        : "Protege tu cuenta"}
                    </Text>
                    <Text fontSize="$4" color={COLORS.textMuted} marginTop="$2">
                      {currentStep === 1
                        ? "Tu nombre nos ayuda a personalizar tu experiencia."
                        : "Establece tus credenciales de acceso seguro."}
                    </Text>
                  </YStack>

                  {currentStep === 1 && (
                    <YStack
                      space="$4"
                      animation="lazy"
                      enterStyle={{ opacity: 0, y: 20 }}
                    >
                      <CustomInput
                        id="firstName"
                        label="Nombre"
                        icon={User}
                        placeholder="Ej. John"
                        value={formData.firstName}
                        onChangeText={(t: string) =>
                          handleChange("firstName", t)
                        }
                        autoCapitalize="words"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />

                      <CustomInput
                        id="lastName"
                        label="Apellido"
                        icon={User}
                        placeholder="Ej. Smith"
                        value={formData.lastName}
                        onChangeText={(t: string) =>
                          handleChange("lastName", t)
                        }
                        autoCapitalize="words"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />
                    </YStack>
                  )}

                  {currentStep === 2 && (
                    <YStack
                      space="$4"
                      animation="lazy"
                      enterStyle={{ opacity: 0, y: 20 }}
                    >
                      <CustomInput
                        id="email"
                        label="Correo Electrónico"
                        icon={Mail}
                        placeholder="nombre@ejemplo.com"
                        value={formData.email}
                        onChangeText={(t: string) =>
                          handleChange("email", t.toLowerCase().trim())
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        focusedInput={focusedInput}
                        setFocusedInput={setFocusedInput}
                      />

                      <YStack>
                        <PasswordInput
                          label="Contraseña"
                          value={formData.password}
                          onChange={(text) => handleChange("password", text)}
                          placeholder="Mínimo 8 caracteres"
                        />

                        <PasswordRequirements password={formData.password} />
                      </YStack>

                      <PasswordInput
                        label="Confirmar Contraseña"
                        value={formData.confirmPassword}
                        onChange={(text) =>
                          handleChange("confirmPassword", text)
                        }
                        placeholder="Repite tu contraseña"
                      />

                      <Separator borderColor="#E2E8F0" marginTop="$2" />

                      <Pressable
                        onPress={() =>
                          handleChange("termsAccepted", !formData.termsAccepted)
                        }
                      >
                        <XStack alignItems="center" space="$3">
                          {formData.termsAccepted ? (
                            <CheckSquare size={24} color={COLORS.primary} />
                          ) : (
                            <Square size={24} color={COLORS.textMuted} />
                          )}
                          <Text
                            color={COLORS.textMuted}
                            fontSize="$3"
                            lineHeight={20}
                            flex={1}
                          >
                            Acepto los{" "}
                            <Text color={COLORS.primary} fontWeight="bold">
                              Términos de Servicio
                            </Text>{" "}
                            y la{" "}
                            <Text color={COLORS.primary} fontWeight="bold">
                              Política de Privacidad
                            </Text>
                            .
                          </Text>
                        </XStack>
                      </Pressable>
                    </YStack>
                  )}
                </YStack>

                <YStack space="$3" marginTop="$6">
                  {errorMsg && (
                    <XStack
                      backgroundColor="#FEF2F2"
                      padding="$3"
                      borderRadius="$4"
                      alignItems="center"
                      space="$2"
                      borderWidth={1}
                      borderColor="#FECACA"
                      animation="quick"
                    >
                      <AlertCircle size={20} color={COLORS.error} />
                      <Text color={COLORS.error} fontSize="$3" flex={1}>
                        {errorMsg}
                      </Text>
                    </XStack>
                  )}

                  <Button
                    onPress={handleNext}
                    backgroundColor={COLORS.primary}
                    pressStyle={{ opacity: 0.9, scale: 0.98 }}
                    size="$5"
                    borderRadius="$6"
                    height={56}
                    disabled={loading}
                    icon={
                      loading ? (
                        <Spinner color="white" />
                      ) : currentStep === 2 ? (
                        <CheckCircle2 color="white" />
                      ) : undefined
                    }
                    animation="bouncy"
                  >
                    <Text color="white" fontWeight="bold" fontSize="$5">
                      {loading
                        ? "Procesando..."
                        : currentStep < 2
                        ? "Continuar"
                        : "Crear Cuenta"}
                    </Text>
                  </Button>
                </YStack>
              </YStack>
            </ScrollView>
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
