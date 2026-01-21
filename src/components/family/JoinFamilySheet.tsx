import React, { useState } from "react";
import { Keyboard } from "react-native";
import { Sheet, YStack, Text, Button, Input, Spinner, XStack } from "tamagui";
import { Users, Gift, ChevronRight } from "@tamagui/lucide-icons";
import { FamilyActions } from "../../actions/familyActions";
import { ActionModal } from "../ui/ActionModal";

interface JoinFamilySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinFamilySheet = ({
  open,
  onOpenChange,
}: JoinFamilySheetProps) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "info" | "success" | "warning" | "error",
    onConfirm: () => {},
    confirmText: "Entendido",
  });

  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));

  const handleJoin = async () => {
    Keyboard.dismiss();

    if (code.length < 5) {
      setModalConfig({
        visible: true,
        title: "Código incompleto",
        message: "El código debe tener al menos 5 caracteres.",
        variant: "warning",
        confirmText: "Corregir",
        onConfirm: closeModal,
      });
      return;
    }

    setLoading(true);

    try {
      await FamilyActions.joinFamily(code.trim());

      setCode("");
      setModalConfig({
        visible: true,
        title: "¡Bienvenido a la Familia!",
        message: "Has desbloqueado Wou+ Premium exitosamente.",
        variant: "success",
        confirmText: "¡Genial!",
        onConfirm: () => {
          closeModal();
          onOpenChange(false);
        },
      });
    } catch (error) {
      setModalConfig({
        visible: true,
        title: "Algo salió mal",
        message: "El código es inválido o el grupo ya está lleno.",
        variant: "error",
        confirmText: "Intentar de nuevo",
        onConfirm: closeModal,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[60]}
      moveOnKeyboardChange={true}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.4)"
      />

      <Sheet.Frame
        padding="$5"
        space="$5"
        backgroundColor="$background"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      >
        <Sheet.Handle backgroundColor="$gray5" height={4} opacity={0.5} />

        <YStack flex={1} alignItems="center" space="$5">
          <YStack
            backgroundColor="#FFFBEB"
            padding="$4"
            borderRadius={100}
            borderWidth={1}
            borderColor="rgba(245, 158, 11, 0.2)"
            shadowColor="#F59E0B"
            shadowRadius={10}
            shadowOpacity={0.1}
            elevation={5}
          >
            <Users size={40} color="#F59E0B" />
          </YStack>

          <YStack space="$2" alignItems="center" paddingHorizontal="$2">
            <Text
              fontSize={22}
              fontWeight="900"
              color="$color"
              textAlign="center"
            >
              Únete a una Familia
            </Text>
            <Text
              fontSize={14}
              color="$gray11"
              textAlign="center"
              lineHeight={22}
            >
              Ingresa el código de invitación para activar tu membresía{" "}
              <Text color="#F59E0B" fontWeight="800">
                Wou+ Premium
              </Text>{" "}
              sin costo adicional.
            </Text>
          </YStack>

          <YStack width="100%" space="$2">
            <Text
              fontSize={12}
              fontWeight="700"
              color="$gray10"
              marginLeft="$2"
            >
              CÓDIGO DE INVITACIÓN
            </Text>
            <Input
              placeholder="WOU-XXXX"
              placeholderTextColor="$gray8"
              value={code}
              onChangeText={(text) => {
                const nextText = text.toUpperCase();
                const match = nextText.match(/(WOU-[A-Z0-9]+)/);
                if (
                  match &&
                  nextText.length > match[0].length &&
                  Math.abs(nextText.length - code.length) > 1
                ) {
                  setCode(match[0]);
                } else {
                  setCode(nextText);
                }
              }}
              width="100%"
              height={60}
              size="$5"
              borderWidth={2}
              borderColor={code ? "#F59E0B" : "$gray6"}
              backgroundColor={code ? "rgba(245, 158, 11, 0.05)" : "$gray2"}
              focusStyle={{ borderColor: "#F59E0B", borderWidth: 2 }}
              textAlign="center"
              fontWeight="800"
              fontSize={24}
              color="$color"
              autoCapitalize="characters"
              autoCorrect={false}
            />
          </YStack>

          <Button
            themeInverse
            backgroundColor="#F59E0B"
            onPress={handleJoin}
            width="100%"
            height="$5"
            borderRadius="$6"
            shadowColor="#F59E0B"
            shadowOffset={{ width: 0, height: 4 }}
            shadowOpacity={0.3}
            shadowRadius={8}
            disabled={loading || code.length < 5}
            opacity={loading || code.length < 5 ? 0.6 : 1}
            iconAfter={
              loading ? <Spinner color="white" /> : <ChevronRight size={20} />
            }
          >
            <Text color="white" fontWeight="bold" fontSize={16}>
              {loading ? "Validando..." : "Canjear Código"}
            </Text>
          </Button>
        </YStack>
      </Sheet.Frame>
      <ActionModal
        visible={modalConfig.visible}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        variant={modalConfig.variant}
        confirmText={modalConfig.confirmText}
        singleButton={true} 
      />
    </Sheet>
  );
};
