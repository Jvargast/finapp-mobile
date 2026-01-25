import React, { useState } from "react";
import { YStack, XStack, Text, Button, Circle, Image } from "tamagui";
import { Users, Crown, X, Lock } from "@tamagui/lucide-icons";
import { Budget } from "../../types/budget.types";
import { ShareBudgetSheet } from "./ShareBudgetSheet";
import { DangerModal } from "../ui/DangerModal";
import { BudgetActions } from "../../actions/budgetActions";
import { useToastStore } from "../../stores/useToastStore";

const getAvatarColor = (name: string) => {
  const colors = [
    "$red5",
    "$orange5",
    "$yellow5",
    "$green5",
    "$blue5",
    "$purple5",
    "$pink5",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

interface Props {
  budget: Budget;
  onUpdate: () => void;
  currentUserId?: string;
}

export const BudgetParticipantsSection = ({
  budget,
  onUpdate,
  currentUserId,
}: Props) => {
  const showToast = useToastStore((state) => state.showToast);

  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);

  const [participantToDelete, setParticipantToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const participants = budget.participants || [];
  const totalCount = participants.length + (budget.owner ? 1 : 0);
  const ownerPlan = budget.owner?.profile?.plan || "FREE";
  const maxLimit = ownerPlan.includes("FAMILY")
    ? 6
    : ownerPlan === "PRO"
    ? 2
    : 1;

  const isFull = totalCount >= maxLimit;
  const isCurrentUserOwner =
    currentUserId && budget.owner?.id === currentUserId;

  const handleLongPress = () => {
    if (isCurrentUserOwner && participants.length > 0) {
      setDeleteMode(true);
    }
  };

  const confirmDelete = async () => {
    if (!participantToDelete) return;

    setIsDeleting(true);
    try {
      await BudgetActions.removeParticipant(budget.id, participantToDelete.id);
      showToast(`Has eliminado a ${participantToDelete.name}`, "success");
      onUpdate();
    } catch (error) {
      showToast("No se pudo eliminar al participante", "error");
    } finally {
      setIsDeleting(false);
      setParticipantToDelete(null);
      if (participants.length <= 1) setDeleteMode(false);
    }
  };

  return (
    <YStack space="$4" marginTop="$4">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack space="$2" alignItems="center">
          <Users size={18} color="$brand" />
          <Text fontSize="$5" fontWeight="800" color="$gray11">
            Participantes
          </Text>

          <XStack
            alignItems="center"
            space="$1.5"
            backgroundColor={isFull ? "$red3" : "transparent"}
            paddingHorizontal={isFull ? "$2" : 0}
            paddingVertical={isFull ? "$1" : 0}
            borderRadius="$12"
          >
            <Text
              fontSize={isFull ? "$3" : "$5"}
              color={isFull ? "$red10" : "$gray9"}
              fontWeight={isFull ? "800" : "600"}
              marginLeft={isFull ? 0 : "$1"}
            >
              {totalCount}/{maxLimit}
            </Text>

            {isFull && <Lock size={12} color="$red10" strokeWidth={3} />}
          </XStack>
        </XStack>

        {budget.type === "SHARED" && isCurrentUserOwner && (
          <Button
            size="$2"
            chromeless
            color={deleteMode ? "$red10" : "$brand"}
            onPress={() =>
              deleteMode ? setDeleteMode(false) : setShareSheetOpen(true)
            }
            fontWeight="700"
            pressStyle={{ opacity: 0.7 }}
          >
            {deleteMode ? "Listo" : "Invitar +"}
          </Button>
        )}
      </XStack>

      <XStack space="$4" flexWrap="wrap" paddingHorizontal="$1">
        {budget.owner && (
          <ParticipantCircle user={budget.owner} isOwner isDeleteMode={false} />
        )}

        {participants.map((p) => (
          <ParticipantCircle
            key={p.user.id}
            user={p.user}
            isDeleteMode={deleteMode}
            onRemove={() =>
              setParticipantToDelete({
                id: p.user.id,
                name: p.user.profile?.firstName || "Usuario",
              })
            }
            onLongPress={handleLongPress}
          />
        ))}

        {participants.length === 0 && !budget.owner && (
          <Text color="$gray9" fontSize="$3" fontStyle="italic">
            Presupuesto Personal
          </Text>
        )}
      </XStack>

      <ShareBudgetSheet
        open={shareSheetOpen}
        onOpenChange={setShareSheetOpen}
        budget={budget}
        onTokenRegenerated={onUpdate}
      />

      <DangerModal
        visible={!!participantToDelete}
        onClose={() => setParticipantToDelete(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="¿Eliminar participante?"
        message={`Estás a punto de eliminar a ${participantToDelete?.name} de este presupuesto. Perderá el acceso inmediatamente.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </YStack>
  );
};

const ParticipantCircle = ({
  user,
  isOwner = false,
  isDeleteMode = false,
  onRemove,
  onLongPress,
}: {
  user: any;
  isOwner?: boolean;
  isDeleteMode?: boolean;
  onRemove?: () => void;
  onLongPress?: () => void;
}) => {
  const firstName = user.profile?.firstName || "U";
  const avatarUrl = user.profile?.avatarUrl;
  const bgColor = getAvatarColor(firstName);

  return (
    <YStack
      alignItems="center"
      space="$2"
      onLongPress={onLongPress}
      pressStyle={{ scale: 0.95 }}
      animation="quick"
      position="relative"
    >
      <YStack>
        <Circle
          size="$4.5"
          overflow="hidden"
          borderWidth={isOwner ? 3 : 2}
          borderColor={isOwner ? "$yellow9" : "$background"}
          shadowColor="$shadowColor"
          shadowRadius={3}
          shadowOffset={{ width: 0, height: 2 }}
          shadowOpacity={0.1}
          backgroundColor={bgColor}
        >
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              width="100%"
              height="100%"
              resizeMode="cover"
            />
          ) : (
            <YStack
              flex={1}
              alignItems="center"
              justifyContent="center"
              backgroundColor={bgColor}
            >
              <Text
                fontWeight="900"
                color="rgba(255,255,255,0.9)"
                fontSize={16}
                textShadowColor="rgba(0,0,0,0.2)"
                textShadowRadius={2}
              >
                {firstName[0].toUpperCase()}
              </Text>
            </YStack>
          )}
        </Circle>

        {isOwner && (
          <YStack
            position="absolute"
            top={-12}
            right={-6}
            rotate="15deg"
            zIndex={10}
            shadowColor="$yellow9"
            shadowRadius={5}
            shadowOpacity={0.5}
          >
            <Crown size={22} color="#F59E0B" fill="#FCD34D" />
          </YStack>
        )}

        {isDeleteMode && !isOwner && (
          <Button
            position="absolute"
            top={-6}
            right={-6}
            size="$2"
            circular
            backgroundColor="$red10"
            borderWidth={2}
            borderColor="$background"
            onPress={onRemove}
            scale={0.9}
            animation="bouncy"
            enterStyle={{ scale: 0, opacity: 0 }}
            exitStyle={{ scale: 0, opacity: 0 }}
            elevation={5}
          >
            <X size={12} color="white" strokeWidth={4} />
          </Button>
        )}
      </YStack>

      <Text
        fontSize={11}
        fontWeight="600"
        color="$gray11"
        numberOfLines={1}
        maxWidth={70}
        textAlign="center"
      >
        {isOwner ? "Admin" : firstName}
      </Text>
    </YStack>
  );
};
