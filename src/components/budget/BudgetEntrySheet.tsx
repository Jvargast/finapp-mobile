import React, { useState, useEffect, useRef } from "react";
import { Sheet, YStack, XStack, Text, Button, Input, Spinner } from "tamagui";
import {
  Plus,
  Link,
  ArrowRight,
  Clipboard as ClipboardIcon,
  Users,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { Keyboard, TextInput } from "react-native";
import { useToastStore } from "../../stores/useToastStore";
import { BudgetActions } from "../../actions/budgetActions";
import { PremiumSheet } from "../ui/PremiumSheet";

interface BudgetEntrySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const extractTokenFromText = (text: string) => {
  if (!text) return "";
  const cleanText = text.trim();
  if (cleanText.includes("/invite/")) {
    return cleanText.split("/invite/")[1].split("/")[0];
  }
  return cleanText;
};

export const BudgetEntrySheet = ({
  open,
  onOpenChange,
}: BudgetEntrySheetProps) => {
  const navigation = useNavigation<any>();
  const [mode, setMode] = useState<"MENU" | "JOIN">("MENU");
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [showPremiumSheet, setShowPremiumSheet] = useState(false);

  const showToast = useToastStore((state) => state.showToast);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!open) {
      const timer = setTimeout(() => {
        setMode("MENU");
        setInviteCode("");
        setIsJoining(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open && mode === "JOIN") {
      const timer = setTimeout(() => inputRef.current?.focus(), 500);
      return () => clearTimeout(timer);
    }
  }, [open, mode]);

  const handleGoToCreate = () => {
    onOpenChange(false);
    setTimeout(() => {
      navigation.navigate("CreateBudget");
    }, 100);
  };

  const handlePaste = async () => {
    const text = await Clipboard.getStringAsync();
    setInviteCode(extractTokenFromText(text || ""));
  };

  const handleJoin = async () => {
    const cleanToken = extractTokenFromText(inviteCode);
    if (!cleanToken) return;
    if (!inviteCode.trim()) return;
    setIsJoining(true);
    Keyboard.dismiss();

    try {
      await BudgetActions.joinBudget(inviteCode);
      showToast("¡Te has unido al presupuesto exitosamente!", "success");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Join Error:", error);

      const serverMessage = error.response?.data?.message;

      if (
        serverMessage &&
        (serverMessage.includes("límite") ||
          serverMessage.includes("Premium") ||
          serverMessage.includes("Wou+"))
      ) {
        Keyboard.dismiss();
        setShowPremiumSheet(true);
        return;
      }

      const msg = serverMessage || "El código es inválido o expiró.";
      showToast(msg, "error");
    } finally {
      setIsJoining(false);
    }
  };
  return (
    <>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[40]}
        dismissOnSnapToBottom
        zIndex={100000}
        animation="medium"
        moveOnKeyboardChange={true}
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
              <YStack space="$5" paddingTop="$2">
                <Text
                  fontSize="$6"
                  fontWeight="800"
                  textAlign="center"
                  color="$color"
                >
                  Nuevo Presupuesto
                </Text>

                <YStack space="$3">
                  <Button
                    size="$5"
                    backgroundColor="$color"
                    color="$background"
                    icon={<Plus size={22} />}
                    onPressIn={handleGoToCreate}
                    fontWeight="bold"
                    justifyContent="flex-start"
                    paddingLeft="$6"
                    pressStyle={{ opacity: 0.9 }}
                  >
                    Crear desde cero
                  </Button>

                  <Button
                    size="$5"
                    backgroundColor="$purple2"
                    color="$purple10"
                    icon={<Users size={22} />}
                    onPressIn={() => setMode("JOIN")}
                    fontWeight="bold"
                    justifyContent="flex-start"
                    paddingLeft="$6"
                    borderWidth={1}
                    borderColor="$purple4"
                    pressStyle={{ opacity: 0.9, backgroundColor: "$purple3" }}
                  >
                    Unirse a uno existente
                  </Button>
                </YStack>
              </YStack>
            ) : (
              <YStack space="$4">
                <XStack alignItems="center" space="$2">
                  <Button
                    size="$3"
                    chromeless
                    icon={ArrowRight}
                    rotate="180deg"
                    onPress={() => setMode("MENU")}
                    color="$color"
                  />
                  <Text fontSize="$5" fontWeight="800" color="$color">
                    Ingresa el código
                  </Text>
                </XStack>

                <Text fontSize="$3" color="$gray10" textAlign="center">
                  Pega el enlace o código que te enviaron.
                </Text>

                <XStack space="$2">
                  <Input
                    ref={inputRef}
                    flex={1}
                    size="$5"
                    placeholder="Ej: BUDGET-XY..."
                    placeholderTextColor="$gray9"
                    color="$color"
                    value={inviteCode}
                    onChangeText={(text) =>
                      setInviteCode(extractTokenFromText(text))
                    }
                    autoCapitalize="none"
                    backgroundColor="$gray2"
                    borderColor="$gray4"
                    focusStyle={{ borderColor: "$purple8" }}
                  />
                  <Button
                    size="$5"
                    icon={<ClipboardIcon color="$color" />}
                    onPress={handlePaste}
                    backgroundColor="$gray3"
                    chromeless={false}
                  />
                </XStack>

                <Button
                  size="$5"
                  backgroundColor="$purple9"
                  color="white"
                  icon={isJoining ? <Spinner color="white" /> : <Link />}
                  onPress={handleJoin}
                  disabled={isJoining || !inviteCode}
                  opacity={!inviteCode ? 0.5 : 1}
                  pressStyle={{ opacity: 0.9, scale: 0.98 }}
                >
                  {isJoining ? "Validando..." : "Unirme al Presupuesto"}
                </Button>
              </YStack>
            )}
          </YStack>
        </Sheet.Frame>
      </Sheet>
      <PremiumSheet
        open={showPremiumSheet}
        onOpenChange={setShowPremiumSheet}
        title="Límite Alcanzado"
        description="El plan Gratuito tiene límites para unirse a presupuestos compartidos. Pásate a Wou+ para acceso ilimitado."
      />
    </>
  );
};
