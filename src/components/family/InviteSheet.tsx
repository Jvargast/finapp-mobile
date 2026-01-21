import React, { useState } from "react";
import { Sheet, YStack, XStack, Text, Button, Spinner } from "tamagui";
import {
  Copy,
  Check,
  MoreHorizontal,
  Mail,
  MessageCircle,
  Smartphone,
  RefreshCw,
} from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { Linking, Share } from "react-native";
import { FamilyActions } from "../../actions/familyActions";
import { ActionModal } from "../ui/ActionModal";

interface InviteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
}

export const InviteSheet = ({
  open,
  onOpenChange,
  inviteCode,
}: InviteSheetProps) => {
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    variant: "info" as "info" | "success" | "warning" | "error",
    onConfirm: () => {},
    confirmText: "Confirmar",
    singleButton: false,
  });
  const closeModal = () =>
    setModalConfig((prev) => ({ ...prev, visible: false }));

  const inviteLink = `https://wou.cl/invite/${inviteCode}`;
  const message = `¡Únete a mi Plan Familiar Wou+! Tendrás acceso Premium para controlar tus finanzas. Entra aquí: ${inviteLink}`;

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
        await Clipboard.setStringAsync(inviteLink);

        setModalConfig({
          visible: true,
          title: `${appName} no detectado`,
          message:
            "Hemos copiado el enlace para que puedas pegarlo manualmente.",
          variant: "info",
          singleButton: true,
          confirmText: "Entendido",
          onConfirm: closeModal,
        });
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
    const subject = encodeURIComponent("Te invito a mi Plan Familiar Wou+");
    const body = encodeURIComponent(message);
    const url = `mailto:?subject=${subject}&body=${body}`;
    openUrl(url, "Correo");
  };

  const handleSMS = () => {
    const url = `sms:&body=${encodeURIComponent(message)}`;
    openUrl(url, "Mensajes");
  };

  const handleSystemShare = async () => {
    try {
      await Share.share({
        message: message,
        title: "Invitación Familia Wou+",
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
        elevation="$2"
        pressStyle={{ opacity: 0.9 }}
        borderWidth={0}
      />
      <Text fontSize={11} color="$gray11" fontWeight="600" textAlign="center">
        {label}
      </Text>
    </YStack>
  );

  const executeRegenerate = async () => {
    closeModal();
    setIsRegenerating(true);

    try {
      await FamilyActions.rotateCode();

      setModalConfig({
        visible: true,
        title: "Código actualizado",
        message:
          "Ahora tienes un nuevo enlace de invitación listo para compartir.",
        variant: "success",
        singleButton: true,
        confirmText: "Genial",
        onConfirm: closeModal,
      });
    } catch (error) {
      setModalConfig({
        visible: true,
        title: "Error",
        message: "No se pudo regenerar el código. Verifica tu conexión.",
        variant: "error",
        singleButton: true,
        confirmText: "Cerrar",
        onConfirm: closeModal,
      });
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRegenerateClick = () => {
    setModalConfig({
      visible: true,
      title: "¿Revocar código actual?",
      message:
        "El enlace anterior dejará de funcionar inmediatamente. Útil si expulsaste a alguien recientemente.",
      variant: "warning",
      confirmText: "Sí, cambiar código",
      singleButton: false,
      onConfirm: executeRegenerate,
    });
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[55]}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.5)"
      />
      <Sheet.Handle backgroundColor="$gray8" opacity={0.3} />

      <Sheet.Frame padding="$4" space="$5" backgroundColor="$background">
        <YStack space="$1" alignItems="center" marginBottom="$2">
          <Text fontSize="$6" fontWeight="900" color="$color">
            Invitar a tu Familia
          </Text>
          <Text
            fontSize="$3"
            color="$gray10"
            textAlign="center"
            marginBottom="$2"
          >
            Comparte los beneficios Premium
          </Text>
        </YStack>
        <XStack
          justifyContent="space-between"
          paddingHorizontal="$2"
          marginTop="$2"
        >
          <ShareOption
            label="WhatsApp"
            color="#25D366"
            icon={<MessageCircle size={24} />}
            onPress={handleWhatsApp}
          />
          <ShareOption
            label="Correo"
            color="#EA4335"
            icon={<Mail size={24} />}
            onPress={handleGmail}
          />
          <ShareOption
            label="Mensaje"
            color="#3B82F6"
            icon={<Smartphone size={24} />}
            onPress={handleSMS}
          />
          <ShareOption
            label="Más"
            color="$gray8"
            icon={<MoreHorizontal size={24} />}
            onPress={handleSystemShare}
          />
        </XStack>

        <XStack height={1} backgroundColor="$borderColor" marginVertical="$2" />

        <YStack space="$2">
          <Text fontSize="$3" fontWeight="600" color="$gray11" marginLeft="$1">
            Enlace directo
          </Text>
          <XStack
            backgroundColor="$gray3"
            borderRadius="$6"
            padding="$1.5"
            alignItems="center"
            paddingLeft="$3"
            borderWidth={1}
            borderColor="$borderColor"
          >
            <Text
              flex={1}
              numberOfLines={1}
              color="$gray11"
              fontSize="$3"
              ellipsizeMode="middle"
              fontFamily="$mono"
            >
              {inviteLink}
            </Text>
            <Button
              size="$3"
              backgroundColor={copied ? "$green9" : "$color"}
              color="$background"
              icon={copied ? <Check size={16} /> : <Copy size={16} />}
              onPressIn={handleCopy}
              borderRadius="$4"
              fontWeight="700"
              animation="quick"
            >
              {copied ? "Listo" : "Copiar"}
            </Button>
          </XStack>
        </YStack>
        <Button
          size="$3"
          variant="outlined"
          borderColor="$red5"
          color="$red10"
          icon={
            isRegenerating ? (
              <Spinner color="$red10" />
            ) : (
              <RefreshCw size={14} />
            )
          }
          onPressIn={handleRegenerateClick}
          marginTop="$2"
          opacity={isRegenerating ? 0.5 : 1}
          disabled={isRegenerating}
        >
          {isRegenerating ? "Generando..." : "Revocar y generar nuevo enlace"}
        </Button>
        <ActionModal
          visible={modalConfig.visible}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          variant={modalConfig.variant}
          confirmText={modalConfig.confirmText}
          singleButton={modalConfig.singleButton}
        />
      </Sheet.Frame>
    </Sheet>
  );
};
