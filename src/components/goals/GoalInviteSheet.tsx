import React, { useState } from "react";
import { Sheet, YStack, XStack, Text, Button, Separator } from "tamagui";
import { Copy, MessageCircle, Share2, Check } from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { Linking, Alert, Platform } from "react-native";
import { FinancialGoal } from "../../types/goal.types";

interface GoalInviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: FinancialGoal;
}

export const GoalInviteSheet = ({
  open,
  onOpenChange,
  goal,
}: GoalInviteSheetProps) => {
  const [copied, setCopied] = useState(false);
  const inviteLink = `https://nova.app/invite/${goal.shareToken}`;
  const message = `Únete a mi meta "${goal.name}" en Nova y alcancémosla juntos! 🚀 ${inviteLink}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteLink);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onOpenChange(false);
    }, 1500);
  };

  const handleWhatsApp = async () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
      onOpenChange(false);
    } else {
      Alert.alert("Error", "WhatsApp no está instalado en este dispositivo.");
    }
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[35]}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      <Sheet.Handle />

      <Sheet.Frame padding="$4" space="$4" backgroundColor="$background">
        <YStack space="$2" alignItems="center" paddingBottom="$4">
          <Text fontSize="$6" fontWeight="800" color="$gray12">
            Invitar Colaboradores
          </Text>
          <Text fontSize="$3" color="$gray10" textAlign="center">
            Comparte el enlace único para sumar gente a "{goal.name}"
          </Text>
        </YStack>

        <YStack space="$3">
          <Button
            size="$5"
            backgroundColor="#25D366"
            color="white"
            icon={<MessageCircle size={20} />}
            onPress={handleWhatsApp}
            fontWeight="bold"
          >
            Enviar por WhatsApp
          </Button>

          <Button
            size="$5"
            backgroundColor="$gray3"
            color="$gray12"
            icon={copied ? <Check color="$green10" /> : <Copy size={20} />}
            onPress={handleCopy}
            fontWeight="600"
          >
            {copied ? "¡Enlace Copiado!" : "Copiar Enlace"}
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
