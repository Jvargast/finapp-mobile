import React, { useState } from "react";
import { Vibration } from "react-native";
import { Sheet, YStack, Text, Button, XStack } from "tamagui";
import { Delete, ArrowDownLeft, ArrowUpRight } from "@tamagui/lucide-icons";
import { FinancialGoal } from "../../types/goal.types";
import { GoalService } from "../../services/goalService";
import { useToastStore } from "../../stores/useToastStore";

interface GoalTransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal: FinancialGoal;
  onSuccess: () => void;
}

export const GoalTransactionSheet = ({
  open,
  onOpenChange,
  goal,
  onSuccess,
}: GoalTransactionSheetProps) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const isDeposit = type === "DEPOSIT";
  const activeColor = isDeposit ? "$green9" : "$red9";

  const handlePress = (num: string) => {
    Vibration.vibrate(10);
    if (amount.length > 10) return;
    if (num === "." && amount.includes(".")) return;
    setAmount((prev) => prev + num);
  };

  const handleDelete = () => {
    Vibration.vibrate(10);
    setAmount((prev) => prev.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) === 0) return;

    setIsLoading(true);
    try {
      await GoalService.addTransaction(goal.id, {
        amount: Number(amount),
        type: type,
      });

      showToast(
        isDeposit ? "¡Abono registrado!" : "Retiro registrado",
        "success"
      );
      setAmount("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      showToast("Error al registrar transacción", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const KeyButton = ({ val, icon }: { val?: string; icon?: any }) => (
    <Button
      size="$6"
      chromeless
      flex={1}
      height={70}
      onPressIn={() => (val ? handlePress(val) : handleDelete())}
      pressStyle={{ backgroundColor: "$gray4", opacity: 0.5 }}
    >
      {icon ? (
        icon
      ) : (
        <Text fontSize="$8" fontWeight="600" color="$color">
          {val}
        </Text>
      )}
    </Button>
  );

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[80]}
      dismissOnSnapToBottom
      zIndex={100000}
    >
      <Sheet.Overlay backgroundColor="rgba(0,0,0,0.5)" />
      <Sheet.Handle />
      <Sheet.Frame backgroundColor="$background" padding="$4">
        <XStack justifyContent="center" marginBottom="$6" marginTop="$2">
          <XStack
            backgroundColor="$gray3"
            padding="$1"
            borderRadius="$10"
            alignItems="center"
          >
            <Button
              size="$3"
              backgroundColor={isDeposit ? "white" : "transparent"}
              color={isDeposit ? "$green10" : "$gray10"}
              onPressIn={() => setType("DEPOSIT")}
              borderRadius="$8"
              fontWeight="bold"
              icon={<ArrowDownLeft size={16} />}
            >
              Abonar
            </Button>
            <Button
              size="$3"
              backgroundColor={!isDeposit ? "white" : "transparent"}
              color={!isDeposit ? "$red10" : "$gray10"}
              onPressIn={() => setType("WITHDRAW")}
              borderRadius="$8"
              fontWeight="bold"
              icon={<ArrowUpRight size={16} />}
            >
              Retirar
            </Button>
          </XStack>
        </XStack>

        <YStack
          alignItems="center"
          marginBottom="$4"
          height={80}
          justifyContent="center"
        >
          <Text fontSize="$3" color="$gray9" fontWeight="600" marginBottom="$2">
            {isDeposit ? "Ingresarás a la meta" : "Retirarás de la meta"}
          </Text>
          <Text
            fontSize={amount ? "$9" : "$9"}
            fontWeight="900"
            color={amount ? activeColor : "$gray6"}
            adjustsFontSizeToFit
            numberOfLines={1}
          >
            {goal.currency} {amount ? amount.replace(".", ",") : "0"}
          </Text>
        </YStack>
        <YStack
          flex={1}
          space="$3"
          justifyContent="center"
          paddingHorizontal="$2"
        >
          <XStack space="$2">
            <KeyButton val="1" />
            <KeyButton val="2" />
            <KeyButton val="3" />
          </XStack>
          <XStack space="$2">
            <KeyButton val="4" />
            <KeyButton val="5" />
            <KeyButton val="6" />
          </XStack>
          <XStack space="$2">
            <KeyButton val="7" />
            <KeyButton val="8" />
            <KeyButton val="9" />
          </XStack>
          <XStack space="$2">
            <KeyButton val="." />
            <KeyButton val="0" />
            <KeyButton icon={<Delete size={28} color="$gray10" />} />
          </XStack>
        </YStack>

        <Button
          size="$6"
          backgroundColor={activeColor}
          color="white"
          marginTop="$2"
          marginBottom="$6"
          borderRadius="$10"
          fontWeight="bold"
          onPressIn={handleSubmit}
          disabled={!amount || isLoading}
          opacity={!amount ? 0.5 : 1}
        >
          {isLoading
            ? "Procesando..."
            : isDeposit
            ? "Confirmar Abono"
            : "Confirmar Retiro"}
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
