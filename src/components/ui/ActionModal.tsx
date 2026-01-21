import React from "react";
import {
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { YStack, Text, Button, Circle } from "tamagui";
import {
  Sparkles,
  TrendingUp,
  Info,
  AlertTriangle,
} from "@tamagui/lucide-icons";

type ActionVariant = "success" | "warning" | "info" | "error";

interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ActionVariant;
  singleButton?: boolean;
}

export const ActionModal = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "info",
  singleButton = false,
}: ActionModalProps) => {
  const THEME = {
    success: {
      bg: "$green2",
      iconColor: "$green10",
      buttonBg: "$green9",
      borderColor: "$green5",
      Icon: Sparkles,
    },
    warning: {
      bg: "$orange2",
      iconColor: "$orange10",
      buttonBg: "$orange9",
      borderColor: "$orange5",
      Icon: TrendingUp,
    },
    info: {
      bg: "$blue2",
      iconColor: "$blue10",
      buttonBg: "$blue9",
      borderColor: "$blue5",
      Icon: Info,
    },
    error: {
      bg: "$red2",
      iconColor: "$red10",
      buttonBg: "$red9",
      borderColor: "$red5",
      Icon: AlertTriangle,
    },
  };

  const currentTheme = THEME[variant];
  const IconComponent = currentTheme.Icon;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <YStack
          flex={1}
          backgroundColor="rgba(0,0,0,0.6)"
          justifyContent="center"
          alignItems="center"
          padding="$4"
        >
          <TouchableWithoutFeedback>
            <YStack
              backgroundColor="$background"
              width="100%"
              maxWidth={350}
              borderRadius="$8"
              padding="$5"
              alignItems="center"
              space="$4"
              elevation={10}
              borderWidth={1}
              borderColor="$gray4"
            >
              <Circle size="$6" backgroundColor={currentTheme.bg}>
                <IconComponent size={32} color={currentTheme.iconColor} />
              </Circle>

              <YStack alignItems="center" space="$2">
                <Text
                  fontSize={20}
                  fontWeight="800"
                  color="$color"
                  textAlign="center"
                >
                  {title}
                </Text>
                <Text
                  fontSize={15}
                  color="$gray11"
                  textAlign="center"
                  lineHeight={22}
                  paddingHorizontal="$2"
                >
                  {message}
                </Text>
              </YStack>

              <YStack width="100%" space="$3" marginTop="$4">
                <Button
                  backgroundColor={currentTheme.buttonBg}
                  color="white"
                  fontWeight="bold"
                  size="$4"
                  onPress={onConfirm}
                  disabled={isLoading}
                  opacity={isLoading ? 0.8 : 1}
                  icon={
                    isLoading ? <ActivityIndicator color="white" /> : undefined
                  }
                >
                  {isLoading ? "Actualizando..." : confirmText}
                </Button>

                {!singleButton && (
                  <Button
                    chromeless
                    color="$gray10"
                    fontWeight="600"
                    size="$3"
                    onPress={onClose}
                    disabled={isLoading}
                  >
                    {cancelText}
                  </Button>
                )}
              </YStack>
            </YStack>
          </TouchableWithoutFeedback>
        </YStack>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
