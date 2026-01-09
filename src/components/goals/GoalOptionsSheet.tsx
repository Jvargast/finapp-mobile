import React from "react";
import { Sheet, YStack, Text, Button, XStack, Separator } from "tamagui";
import {
  Trash2,
  Home,
  TrendingUp,
  ShieldCheck,
  CreditCard,
  PiggyBank,
  Target,
  Briefcase,
} from "@tamagui/lucide-icons";
import { FinancialGoal, GoalType } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";

interface GoalOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  goal?: FinancialGoal | null;
}

export const GoalOptionsSheet = ({
  open,
  onOpenChange,
  onDelete,
  goal,
}: GoalOptionsSheetProps) => {
  if (!goal) return null;

  const getGoalVisuals = (type: GoalType) => {
    switch (type) {
      case GoalType.HOUSING:
        return { icon: Home, bg: "$blue5", color: "$blue11" };
      case GoalType.INVESTMENT:
        return { icon: TrendingUp, bg: "$purple5", color: "$purple11" };
      case GoalType.DEBT:
        return { icon: CreditCard, bg: "$red5", color: "$red11" };
      case GoalType.RETIREMENT:
        return { icon: Briefcase, bg: "$slate5", color: "$slate11" };
      case GoalType.CONTROL:
        return { icon: ShieldCheck, bg: "$orange5", color: "$orange11" };
      case GoalType.SAVING:
        return { icon: PiggyBank, bg: "$green5", color: "$green11" };
      default:
        return { icon: Target, bg: "$gray5", color: "$gray11" };
    }
  };

  const { icon: GoalIcon, bg, color } = getGoalVisuals(goal.type);

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[40]}
      dismissOnSnapToBottom
      zIndex={100000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.6)"
      />

      <Sheet.Handle backgroundColor="$gray8" opacity={0.3} />

      <Sheet.Frame
        padding="$5"
        backgroundColor="$background"
        borderTopLeftRadius="$9"
        borderTopRightRadius="$9"
        space="$4"
      >
        <YStack alignItems="center" paddingBottom="$2">
          <Text fontSize="$5" fontWeight="800" color="$gray11">
            Gestionar Meta
          </Text>
        </YStack>

        <XStack
          backgroundColor="$gray2"
          borderRadius="$6"
          padding="$3"
          alignItems="center"
          space="$3"
          borderWidth={1}
          borderColor="$gray4"
        >
          <YStack
            backgroundColor={bg}
            width={48}
            height={48}
            borderRadius="$4"
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="rgba(0,0,0,0.05)"
          >
            <GoalIcon size={24} color={color} />
          </YStack>

          <YStack flex={1}>
            <Text
              fontWeight="800"
              fontSize="$4"
              color="$color"
              numberOfLines={1}
            >
              {goal.name}
            </Text>
            <XStack alignItems="center" space="$2">
              <Text fontSize="$3" color="$gray10" fontWeight="500">
                Saldo:
              </Text>
              <Text fontSize="$3" color="$gray11" fontWeight="700">
                {formatGoalAmount(goal.currentAmount, goal.currency)}
              </Text>
            </XStack>
          </YStack>
        </XStack>

        <Separator borderColor="$gray4" />

        <YStack space="$3" marginTop="$2">
          <Button
            size="$5"
            backgroundColor="$red2"
            color="$red10"
            icon={<Trash2 size={20} />}
            onPress={onDelete}
            fontWeight="bold"
            borderRadius="$10"
            pressStyle={{ opacity: 0.8, scale: 0.98 }}
            borderColor="$red4"
            borderWidth={1}
          >
            Eliminar Meta
          </Button>

          <Button
            size="$5"
            chromeless
            backgroundColor="$gray3"
            color="$gray11"
            onPress={() => onOpenChange(false)}
            fontWeight="700"
            borderRadius="$10"
            hoverStyle={{ backgroundColor: "$gray4" }}
          >
            Cancelar
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};
