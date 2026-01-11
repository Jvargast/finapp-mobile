import React, { useState } from "react";
import { Sheet, YStack, XStack, Text, Button } from "tamagui";
import {
  Copy,
  Check,
  MoreHorizontal,
  Mail,
  MessageCircle,
  Instagram,
} from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { Linking, Alert, Share } from "react-native";
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
  const message = `¡Únete a mi meta "${goal.name}" en Nova y alcancémosla juntos! 🚀 ${inviteLink}`;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openUrl = async (url: string, appName: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        onOpenChange(false);
      } else {
        Alert.alert("No disponible", `${appName} no está instalado.`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleWhatsApp = () => {
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    openUrl(url, "WhatsApp");
  };

  const handleGmail = () => {
    const subject = encodeURIComponent(`Invitación a Meta: ${goal.name}`);
    const body = encodeURIComponent(message);
    const url = `mailto:?subject=${subject}&body=${body}`;
    openUrl(url, "Correo");
  };

  const handleInstagram = async () => {
    await Clipboard.setStringAsync(inviteLink);
    const url = "instagram://";
    openUrl(url, "Instagram");
    Alert.alert("Enlace copiado", "Pégalo en tu historia o DM de Instagram.");
  };

  const handleSystemShare = async () => {
    try {
      await Share.share({
        message: message,
        title: "Invitar a Nova",
        url: inviteLink,
      });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const ShareOption = ({
    icon,
    label,
    color,
    onPress,
  }: {
    icon: any;
    label: string;
    color: string;
    onPress: () => void;
  }) => (
    <YStack alignItems="center" space="$2" width={75}>
      <Button
        size="$5"
        circular
        backgroundColor={color}
        color="white"
        icon={icon}
        onPressIn={onPress}
        elevation={2}
        pressStyle={{ scale: 0.95, opacity: 0.8 }}
        borderWidth={0}
      />
      <Text fontSize={11} color="$gray11" fontWeight="600" textAlign="center">
        {label}
      </Text>
    </YStack>
  );

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[45]}
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

      <Sheet.Frame padding="$4" space="$5" backgroundColor="$background">
        <YStack space="$1" alignItems="center" marginBottom="$2">
          <Text fontSize="$6" fontWeight="800" color="$gray12">
            Invitar Colaboradores
          </Text>
          <Text
            fontSize="$3"
            color="$gray10"
            textAlign="center"
            marginBottom="$2"
          >
            Suma amigos a "{goal.name}"
          </Text>
        </YStack>

        <XStack justifyContent="space-between" paddingHorizontal="$2" mt={2}>
          <ShareOption
            label="WhatsApp"
            color="#25D366"
            icon={<MessageCircle size={24} />}
            onPress={handleWhatsApp}
          />
          <ShareOption
            label="Gmail"
            color="#EA4335"
            icon={<Mail size={24} />}
            onPress={handleGmail}
          />
          <ShareOption
            label="Instagram"
            color="#E1306C"
            icon={<Instagram size={24} />}
            onPress={handleInstagram}
          />
          <ShareOption
            label="Más"
            color="$gray8"
            icon={<MoreHorizontal size={24} />}
            onPress={handleSystemShare}
          />
        </XStack>

        <XStack height={1} backgroundColor="$gray4" marginVertical="$2" />

        <YStack space="$2">
          <Text fontSize="$3" fontWeight="600" color="$gray11" marginLeft="$1">
            Enlace de invitación
          </Text>
          <XStack
            backgroundColor="$gray3"
            borderRadius="$6"
            padding="$1.5"
            alignItems="center"
            paddingLeft="$3"
          >
            <Text
              flex={1}
              numberOfLines={1}
              color="$gray11"
              fontSize="$3"
              ellipsizeMode="middle"
            >
              {inviteLink}
            </Text>
            <Button
              size="$3"
              backgroundColor={copied ? "$green9" : "$gray12"}
              color="white"
              icon={copied ? <Check size={16} /> : <Copy size={16} />}
              onPressIn={handleCopy}
              borderRadius="$4"
            >
              {copied ? "Copiado" : "Copiar"}
            </Button>
          </XStack>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
