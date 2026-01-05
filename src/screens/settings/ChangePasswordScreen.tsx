import { useState } from "react";
import {
  YStack,
  Text,
  Button,
  Input,
  XStack,
  ScrollView,
  Spinner,
} from "tamagui";
import { Lock, Check, Eye, EyeOff, AlertCircle } from "@tamagui/lucide-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TouchableWithoutFeedback,
} from "react-native";

import { useToastStore } from "../../stores/useToastStore";
import { TextInput } from "react-native-gesture-handler";
import { UserActions } from "../../actions/userActions";
import {
  PASSWORD_REGEX_VALIDATOR,
  PasswordRequirements,
} from "../../components/shared/PasswordRequirements";
import { PasswordInput } from "../../components/shared/PasswordInput";

export default function ChangePasswordScreen() {
  const navigation = useNavigation();
  const showToast = useToastStore((state) => state.showToast);

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordsMatch = newPass.length > 0 && newPass === confirmPass;
  const isStrong = PASSWORD_REGEX_VALIDATOR.test(newPass);

  const handleSubmit = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      showToast("Completa todos los campos", "warning");
      return;
    }

    if (!isStrong) {
      showToast("La nueva contraseña no es segura", "error");
      return;
    }

    if (!passwordsMatch) {
      showToast("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    try {
      await UserActions.changePassword(currentPass, newPass);
      showToast("Contraseña actualizada correctamente", "success");
      navigation.goBack();
    } catch (error:any) {
      console.error("ERROR PASSWORD:", error.response?.data);

      let msg = "Error al actualizar la contraseña";

      if (error.response?.data?.message) {
        const backendMsg = error.response.data.message;
        msg = Array.isArray(backendMsg) ? backendMsg[0] : backendMsg;
      } else if (error.message) {
        msg = error.message;
      }

      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              padding: 20,
              paddingBottom: 120,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <YStack marginBottom="$6">
              <Text fontSize={24} fontWeight="800" color="#1E293B">
                Seguridad
              </Text>
              <Text fontSize={14} color="#64748B">
                Protege tu cuenta con una clave fuerte.
              </Text>
            </YStack>

            <YStack
              backgroundColor="white"
              padding="$4"
              borderRadius="$6"
              shadowColor="#000"
              shadowOpacity={0.05}
              shadowRadius={10}
            >
              <PasswordInput
                label="Contraseña Actual"
                value={currentPass}
                onChange={setCurrentPass}
                placeholder="Ingresa tu clave actual"
              />

              <YStack
                height={1}
                backgroundColor="#F1F5F9"
                marginVertical="$2"
              />

              <PasswordInput
                label="Nueva Contraseña"
                value={newPass}
                onChange={setNewPass}
                placeholder="Mínimo 6 caracteres"
              />

              <PasswordRequirements password={newPass} />

              <YStack height={10} />

              <PasswordInput
                label="Confirmar Nueva Contraseña"
                value={confirmPass}
                onChange={setConfirmPass}
                placeholder="Repite la nueva clave"
              />

              <YStack marginTop="$2">
                <XStack
                  alignItems="center"
                  space="$2"
                  opacity={confirmPass.length > 0 ? 1 : 0.5}
                >
                  {passwordsMatch ? (
                    <Check size={14} color="#10B981" />
                  ) : (
                    <AlertCircle size={14} color="#64748B" />
                  )}
                  <Text
                    fontSize={12}
                    color={passwordsMatch ? "#10B981" : "#64748B"}
                  >
                    Las contraseñas coinciden
                  </Text>
                </XStack>
              </YStack>
            </YStack>

            <Button
              marginTop="$6"
              onPress={handleSubmit}
              backgroundColor="#1E293B"
              height={50}
              borderRadius="$4"
              disabled={loading}
              opacity={loading ? 0.7 : 1}
              icon={loading ? <Spinner color="white" /> : undefined}
            >
              <Text color="white" fontWeight="bold" fontSize={16}>
                {loading ? "Actualizando..." : "Actualizar Contraseña"}
              </Text>
            </Button>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
