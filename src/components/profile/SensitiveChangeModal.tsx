import { useState } from "react";
import { Modal } from "react-native";
import { YStack, Text, Button, Input, XStack, Spinner } from "tamagui";
import {
  X,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
} from "@tamagui/lucide-icons";
import { UserActions } from "../../actions/userActions";
import { useToastStore } from "../../stores/useToastStore";

interface Props {
  isVisible: boolean;
  onClose: () => void;
  type: "EMAIL" | "PHONE";
}

export const SensitiveChangeModal = ({ isVisible, onClose, type }: Props) => {
  const [step, setStep] = useState(1);
  const [newValue, setNewValue] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const label = type === "EMAIL" ? "Correo Electrónico" : "Teléfono";
  const Icon = type === "EMAIL" ? Mail : Phone;

  const handleReset = () => {
    setStep(1);
    setNewValue("");
    setCode("");
    onClose();
  };

  const handleRequestCode = async () => {
    if (!newValue.trim()) return;
    setLoading(true);
    try {
      await UserActions.requestSensitiveChange(type, newValue);
      setStep(2);
      showToast(`Código enviado a ${newValue}`, "info");
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Error al solicitar código",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (code.length < 6) return;
    setLoading(true);
    try {
      await UserActions.verifySensitiveChange(type, newValue, code);
      showToast("¡Cambio realizado con éxito!", "success");
      handleReset();
    } catch (error: any) {
      showToast("Código incorrecto o expirado", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={handleReset}
    >
      <YStack
        flex={1}
        backgroundColor="rgba(0,0,0,0.5)"
        justifyContent="flex-end"
      >
        <YStack
          backgroundColor="white"
          borderTopLeftRadius={24}
          borderTopRightRadius={24}
          padding="$5"
          space="$4"
        >
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={18} fontWeight="700" color="#1E293B">
              Cambiar {label}
            </Text>
            <Button unstyled onPress={handleReset} padding="$2">
              <X size={24} color="#64748B" />
            </Button>
          </XStack>

          {step === 1 && (
            <YStack space="$4">
              <Text fontSize={14} color="#64748B">
                Ingresa tu nuevo {label.toLowerCase()}. Te enviaremos un código
                para verificarlo.
              </Text>

              <XStack
                alignItems="center"
                borderWidth={1}
                borderColor="#E2E8F0"
                borderRadius="$4"
                paddingHorizontal="$3"
                height={50}
              >
                <Icon size={20} color="#64748B" />
                <Input
                  flex={1}
                  unstyled
                  placeholder={`Nuevo ${label}`}
                  value={newValue}
                  onChangeText={setNewValue}
                  autoCapitalize="none"
                  keyboardType={
                    type === "EMAIL" ? "email-address" : "phone-pad"
                  }
                  marginLeft="$2"
                  color="#1E293B"
                />
              </XStack>

              <Button
                onPress={handleRequestCode}
                backgroundColor="#1E293B"
                disabled={loading || !newValue}
                opacity={!newValue ? 0.5 : 1}
                icon={
                  loading ? <Spinner color="white" /> : <ArrowRight size={18} />
                }
              >
                <Text color="white" fontWeight="bold">
                  Enviar Código
                </Text>
              </Button>
            </YStack>
          )}

          {step === 2 && (
            <YStack space="$4">
              <Text fontSize={14} color="#64748B">
                Ingresa el código de 6 dígitos enviado a{" "}
                <Text fontWeight="bold" color="#1E293B">
                  {newValue}
                </Text>
              </Text>

              <Input
                borderWidth={1}
                borderColor="#4F46E5"
                backgroundColor="#EEF2FF"
                borderRadius="$4"
                height={60}
                fontSize={24}
                fontWeight="bold"
                textAlign="center"
                letterSpacing={5}
                keyboardType="number-pad"
                maxLength={6}
                value={code}
                onChangeText={setCode}
                placeholder="000000"
                color="#4F46E5"
              />

              <Button
                onPress={handleVerifyCode}
                backgroundColor="#4F46E5"
                disabled={loading || code.length < 6}
                opacity={code.length < 6 ? 0.5 : 1}
                icon={
                  loading ? (
                    <Spinner color="white" />
                  ) : (
                    <CheckCircle2 size={18} />
                  )
                }
              >
                <Text color="white" fontWeight="bold">
                  Verificar y Cambiar
                </Text>
              </Button>

              <Button unstyled onPress={() => setStep(1)} alignItems="center">
                <Text color="#64748B" fontSize={13}>
                  Corregir {label.toLowerCase()}
                </Text>
              </Button>
            </YStack>
          )}

          <YStack height={20} />
        </YStack>
      </YStack>
    </Modal>
  );
};
