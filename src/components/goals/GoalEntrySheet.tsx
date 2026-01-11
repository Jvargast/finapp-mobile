import React, { useState, useEffect, useRef } from "react";
import { Sheet, YStack, XStack, Text, Button, Input, Spinner } from "tamagui";
import {
  Plus,
  Link,
  ArrowRight,
  Clipboard as ClipboardIcon,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { Alert, Keyboard, TextInput } from "react-native";
import { GoalService } from "../../services/goalService";
import { useToastStore } from "../../stores/useToastStore";

interface GoalEntrySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalCreated?: () => void;
}

const extractTokenFromText = (text: string) => {
  if (!text) return "";
  const cleanText = text.trim();
  if (cleanText.includes("/invite/")) {
    return cleanText.split("/invite/")[1].split("/")[0];
  }
  if (cleanText.includes("/")) {
    const parts = cleanText.split("/").filter(Boolean);
    return parts[parts.length - 1];
  }
  return cleanText;
};

export const GoalEntrySheet = ({
  open,
  onOpenChange,
  onGoalCreated,
}: GoalEntrySheetProps) => {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<"MENU" | "JOIN">("MENU");
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const inputRef = useRef<TextInput>(null);

  const snapPoints = [45];

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMode("MENU");
        setInviteCode("");
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open && mode === "JOIN") {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [open, mode]);

  const handleGoToCreate = () => {
    onOpenChange(false);
    setTimeout(() => {
      navigation.navigate("CreateGoal");
    }, 100);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setInviteCode(extractTokenFromText(text || ""));
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    Keyboard.dismiss();

    try {
      await GoalService.joinByToken(inviteCode);
      await new Promise((r) => setTimeout(r, 1500));
      showToast("¡Te has unido a la meta correctamente!", "success");
      onOpenChange(false);
      onGoalCreated?.();
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "El código es inválido o expiró.";
      showToast(msg, "error");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <Sheet
      key="goal-sheet"
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={snapPoints}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
      moveOnKeyboardChange={true}
      dismissOnOverlayPress={mode === "MENU"}
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />

      <Sheet.Frame padding="$4" backgroundColor="$background">
        <YStack space="$4" flex={1}>
          {mode === "MENU" ? (
            <YStack space="$4">
              <Text
                fontSize="$6"
                fontWeight="800"
                textAlign="center"
                color="$gray12"
              >
                Nueva Meta
              </Text>

              <YStack space="$3">
                <Button
                  size="$5"
                  backgroundColor="$brand"
                  color="white"
                  icon={<Plus size={22} />}
                  onPressIn={handleGoToCreate}
                  fontWeight="bold"
                  justifyContent="flex-start"
                  paddingLeft="$6"
                >
                  Crear desde cero
                </Button>

                <Button
                  size="$5"
                  backgroundColor="$blue2"
                  color="$blue10"
                  icon={<Link size={22} />}
                  onPressIn={() => setMode("JOIN")}
                  fontWeight="bold"
                  justifyContent="flex-start"
                  paddingLeft="$6"
                  borderWidth={1}
                  borderColor="$blue5"
                >
                  Unirse con código
                </Button>
              </YStack>
            </YStack>
          ) : (
            <YStack space="$4">
              <YStack space="$1">
                <Text
                  fontSize="$6"
                  fontWeight="800"
                  textAlign="center"
                  color="$gray12"
                >
                  Ingresa el código
                </Text>
                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Pídele el enlace al creador de la meta
                </Text>
              </YStack>

              <XStack space="$2">
                <Input
                  ref={inputRef}
                  flex={1}
                  size="$5"
                  placeholder="Ej: abcd-1234"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                  autoCapitalize="none"
                  autoFocus={false}
                />
                <Button
                  size="$5"
                  icon={<ClipboardIcon />}
                  onPress={handlePaste}
                  chromeless
                />
              </XStack>
              <Button
                size="$5"
                backgroundColor="$brand"
                color="white"
                icon={isJoining ? <Spinner color="white" /> : <ArrowRight />}
                onPress={handleJoin}
                disabled={isJoining || !inviteCode}
                opacity={!inviteCode ? 0.5 : 1}
              >
                {isJoining ? "Uniéndome..." : "Confirmar"}
              </Button>

              <Text
                onPress={() => setMode("MENU")}
                fontSize="$3"
                color="$gray10"
                textAlign="center"
                fontWeight="600"
                padding="$2"
              >
                Cancelar
              </Text>
            </YStack>
          )}
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
