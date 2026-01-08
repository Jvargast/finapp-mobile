import React from "react";
import {
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { YStack, Text, Button, Circle } from "tamagui";
import { AlertTriangle } from "@tamagui/lucide-icons";

interface DangerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
}

export const DangerModal = ({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
  title,
  message,
  confirmText = "Sí, eliminar",
  cancelText = "Cancelar",
}: DangerModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
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
              borderRadius="$6"
              padding="$5"
              alignItems="center"
              space="$4"
              elevation={5}
              borderWidth={1}
              borderColor="$red3"
            >
              <Circle size="$6" backgroundColor="#FEE2E2">
                <AlertTriangle size={32} color="#EF4444" />
              </Circle>

              <YStack alignItems="center" space="$2">
                <Text fontSize={18} fontWeight="700" color="$color">
                  {title}
                </Text>

                {typeof message === "string" ? (
                  <Text
                    fontSize={14}
                    color="$colorQwerty"
                    textAlign="center"
                    lineHeight={20}
                  >
                    {message}
                  </Text>
                ) : (
                  message
                )}
              </YStack>

              <YStack width="100%" space="$3" marginTop="$2">
                <Button
                  backgroundColor="#EF4444"
                  color="white"
                  fontWeight="600"
                  height="$4.5"
                  onPress={onConfirm}
                  disabled={isLoading}
                  opacity={isLoading ? 0.7 : 1}
                  pressStyle={{ opacity: 0.8 }}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    confirmText
                  )}
                </Button>

                <Button
                  backgroundColor="$backgroundPress"
                  color="$color"
                  fontWeight="600"
                  height="$4.5"
                  onPress={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
              </YStack>
            </YStack>
          </TouchableWithoutFeedback>
        </YStack>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
