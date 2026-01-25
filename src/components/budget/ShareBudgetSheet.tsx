import React, { useState } from "react";
import { Share } from "react-native";
import {
  Sheet,
  YStack,
  XStack,
  Text,
  Button,
  Separator,
  Spinner,
  Theme,
} from "tamagui";
import {
  Copy,
  Share2,
  RefreshCw,
  Check,
  Link as LinkIcon,
  ShieldAlert,
} from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { Budget } from "../../types/budget.types";
import { BudgetActions } from "../../actions/budgetActions";
import { useToastStore } from "../../stores/useToastStore";

interface ShareBudgetSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: Budget;
  onTokenRegenerated?: () => void;
}

export const ShareBudgetSheet = ({
  open,
  onOpenChange,
  budget,
  onTokenRegenerated,
}: ShareBudgetSheetProps) => {
  const showToast = useToastStore((state) => state.showToast);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const inviteCode = budget.shareToken || "Generando...";
  const inviteLink = `woufinance.app/invite/${inviteCode}`;

  const handleCopy = async () => {
    if (!budget.shareToken) return;
    await Clipboard.setStringAsync(inviteLink);
    setHasCopied(true);
    showToast("Enlace copiado", "success");
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleShareNative = async () => {
    try {
      await Share.share({
        title: "Únete a mi presupuesto en Wou Finance",
        message: `Hola, únete a mi presupuesto "${
          budget.name || budget.category.name
        }" para que llevemos las finanzas juntos. Entra aquí: ${inviteLink}`,
      });
    } catch (error) {
      console.log("Error al compartir", error);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      await BudgetActions.regenerateToken(budget.id);
      showToast("Enlace revocado y regenerado exitosamente", "success");
      onTokenRegenerated?.();
    } catch (error) {
      showToast("Error al regenerar el enlace", "error");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[75]}
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
      <Sheet.Frame padding="$5" backgroundColor="$background" space="$5">
        <YStack space="$2" alignItems="center" marginTop="$2">
          <YStack
            backgroundColor="$purple2"
            padding="$3"
            borderRadius="$10"
            marginBottom="$3"
          >
            <Share2 size={32} color="$purple9" />
          </YStack>
          <Text
            fontSize="$6"
            fontWeight="800"
            textAlign="center"
            color="$color"
          >
            Invitar Miembro
          </Text>
          <Text
            fontSize="$3"
            color="$gray10"
            textAlign="center"
            paddingHorizontal="$6"
            lineHeight={22}
          >
            Comparte este enlace con tu pareja o familiar para gestionar este
            presupuesto juntos.
          </Text>
        </YStack>

        <Separator borderColor="$gray4" />

        <YStack space="$3">
          <Text
            fontSize={11}
            fontWeight="700"
            color="$gray9"
            textTransform="uppercase"
            marginLeft="$1"
          >
            Enlace de invitación
          </Text>
          <XStack
            backgroundColor="$gray2"
            paddingHorizontal="$3"
            paddingVertical="$3.5" // 👈 Caja más alta y cómoda
            borderRadius="$4"
            alignItems="center"
            borderWidth={1}
            borderColor="$gray4"
            space="$3"
          >
            <LinkIcon size={16} color="$gray9" />
            <Text
              flex={1}
              fontSize="$3"
              color="$color"
              numberOfLines={1}
              ellipsizeMode="middle"
              fontFamily="$mono"
              opacity={budget.shareToken ? 1 : 0.5}
            >
              {inviteLink}
            </Text>
            <Button
              size="$2.5" // 👈 Botón de copiar un pelín más grande
              chromeless
              backgroundColor={hasCopied ? "$green2" : "transparent"}
              onPress={handleCopy}
              icon={
                hasCopied ? (
                  <Check size={16} color="$green10" />
                ) : (
                  <Copy size={16} color="$gray10" />
                )
              }
            />
          </XStack>
        </YStack>

        <Button
          size="$5"
          backgroundColor="$purple9"
          color="white"
          icon={<Share2 size={20} />}
          onPressIn={handleShareNative}
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
          fontWeight="bold"
          marginTop="$2" 
        >
          Compartir Enlace
        </Button>

        <YStack
          marginTop="$6"
          backgroundColor="$red2"
          padding="$3"
          borderRadius="$4"
          space="$3"
          borderWidth={1}
          borderColor="$red4"
        >
          <XStack space="$2" alignItems="center">
            <ShieldAlert size={16} color="$red10" />
            <Text fontSize="$3" fontWeight="700" color="$red10">
              Zona de Seguridad
            </Text>
          </XStack>

          <Text fontSize={11} color="$red9" lineHeight={16}>
            Si alguien no deseado tiene el enlace, puedes revocarlo. El enlace
            anterior dejará de funcionar inmediatamente.
          </Text>

          <Button
            size="$3"
            variant="outlined"
            borderColor="$red6"
            color="$red10"
            icon={
              isRegenerating ? (
                <Spinner color="$red10" />
              ) : (
                <RefreshCw size={14} />
              )
            }
            onPress={handleRegenerate}
            disabled={isRegenerating}
            backgroundColor="transparent"
          >
            Revocar y Generar Nuevo
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
