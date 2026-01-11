import React, { useState } from "react";
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
  LogOut,
  Edit3,
} from "@tamagui/lucide-icons";
import { FinancialGoal, GoalType, GoalRole } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { useNavigation } from "@react-navigation/native";
import { useToastStore } from "../../stores/useToastStore";
import { useUserStore } from "../../stores/useUserStore";
import { GoalService } from "../../services/goalService";
import { DangerModal } from "../ui/DangerModal";

interface GoalOptionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGoalUpdate: () => void;
  goal?: FinancialGoal | null;
}

export const GoalOptionsSheet = ({
  open,
  onOpenChange,
  onGoalUpdate,
  goal,
}: GoalOptionsSheetProps) => {
  const navigation = useNavigation<any>();
  const showToast = useToastStore((s) => s.showToast);
  const myUserId = useUserStore((s) => s.user?.id);
  const [showDangerModal, setShowDangerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  if (!goal) return null;
  const amIOwner =
    (goal.userId && goal.userId === myUserId) ||
    goal.participants?.some(
      (p) => p.userId === myUserId && p.role === GoalRole.OWNER
    );
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

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (amIOwner) {
        await GoalService.delete(goal.id);
        showToast("Meta eliminada correctamente", "success");
      } else {
        await GoalService.leave(goal.id);
        showToast("Has abandonado la meta", "success");
      }

      setShowDangerModal(false);
      onOpenChange(false);
      onGoalUpdate();
    } catch (error) {
      showToast("Ocurrió un error al procesar la solicitud", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Sheet
        forceRemoveScrollEnabled={open}
        modal
        open={open}
        onOpenChange={onOpenChange}
        snapPoints={[50]}
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
            {amIOwner && (
              <Button
                size="$5"
                backgroundColor="$blue2"
                color="$blue10"
                icon={<Edit3 size={20} />}
                onPressIn={() => {
                  onOpenChange(false);
                  navigation.navigate("EditGoal", {
                    goal: goal,
                  });
                }}
                borderColor="$blue4"
                borderWidth={1}
                fontWeight="bold"
                borderRadius="$10"
                pressStyle={{ opacity: 0.8, scale: 0.98 }}
              >
                Editar Meta
              </Button>
            )}
            <Button
              size="$5"
              backgroundColor="$red2"
              color="$red10"
              icon={amIOwner ? <Trash2 size={20} /> : <LogOut size={20} />}
              onPressIn={() => {
                setShowDangerModal(true);
              }}
              fontWeight="bold"
              borderRadius="$10"
              pressStyle={{ opacity: 0.8, scale: 0.98 }}
              borderColor="$red4"
              borderWidth={1}
            >
              {amIOwner ? "Eliminar Meta" : "Abandonar Meta"}
            </Button>

            <Button
              size="$5"
              chromeless
              backgroundColor="$gray3"
              color="$gray11"
              onPressIn={() => onOpenChange(false)}
              fontWeight="700"
              borderRadius="$10"
              hoverStyle={{ backgroundColor: "$gray4" }}
            >
              Cancelar
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>

      <DangerModal
        visible={showDangerModal}
        onClose={() => setShowDangerModal(false)}
        onConfirm={handleAction}
        isLoading={isLoading}
        title={amIOwner ? "Eliminar Meta" : "Abandonar Meta"}
        message={
          amIOwner
            ? `Estás a punto de borrar "${goal.name}". Esta acción es irreversible y afectará a todos los miembros.`
            : `¿Seguro que quieres dejar de participar en "${goal.name}"? Dejarás de ver el progreso.`
        }
        confirmText={amIOwner ? "Sí, Eliminar" : "Sí, Salir"}
        cancelText="Cancelar"
      />
    </>
  );
};
