import React, { useState } from "react";
import { XStack, YStack, Avatar, Text, Button, ScrollView } from "tamagui";
import { Plus, Crown, UserPlus } from "@tamagui/lucide-icons";
import { FinancialGoal, GoalRole } from "../../types/goal.types";
import { GoalInviteSheet } from "./GoalInviteSheet";
import { useUserStore } from "../../stores/useUserStore";
import { GoalService } from "../../services/goalService";
import { useToastStore } from "../../stores/useToastStore";
import { DangerModal } from "../../components/ui/DangerModal";

interface GoalParticipantsSectionProps {
  goal: FinancialGoal;
  onGoalUpdate?: () => void;
}

export const GoalParticipantsSection = ({
  goal,
  onGoalUpdate,
}: GoalParticipantsSectionProps) => {
  const [isInviteSheetOpen, setInviteSheetOpen] = useState(false);

  const [participantToRemove, setParticipantToRemove] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const showToast = useToastStore((s) => s.showToast);
  const participants = goal.participants || [];
  const myUserId = useUserStore((state) => state.user?.id);
  const myParticipantData = participants.find((p) => p.userId === myUserId);
  const amIOwner = myParticipantData?.role === GoalRole.OWNER;

  const handleOpenRemoveModal = (name: string, userId: string) => {
    setParticipantToRemove({ name, id: userId });
  };

  const handleCloseRemoveModal = () => {
    if (isRemoving) return;
    setParticipantToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (!participantToRemove) return;

    setIsRemoving(true);
    try {
      await GoalService.removeParticipant(goal.id, participantToRemove.id);
      showToast(`${participantToRemove.name} ha sido eliminado`, "success");
      onGoalUpdate?.();
      handleCloseRemoveModal();
    } catch (error) {
      showToast("No se pudo eliminar al participante", "error");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <YStack space="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space="$2">
            <UserPlus size={16} color="$gray9" />
            <Text fontSize="$5" fontWeight="800" color="$gray10">
              Equipo
            </Text>
          </XStack>
          <Text fontSize="$3" color="$gray10" fontWeight="600">
            {participants.length}{" "}
            {participants.length === 1 ? "miembro" : "miembros"}
          </Text>
        </XStack>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <XStack space="$3" paddingVertical="$2" alignItems="flex-start">
            <YStack
              key="invite-button"
              alignItems="center"
              space="$2"
              marginRight="$2"
            >
              <Button
                size="$4"
                circular
                bordered
                borderWidth={1}
                borderStyle="dashed"
                borderColor="$brand"
                icon={<Plus size={24} color="$brand" />}
                onPress={() => setInviteSheetOpen(true)}
                backgroundColor="$blue2"
                pressStyle={{ scale: 0.95, opacity: 0.8 }}
              />
              <Text fontSize="$2" fontWeight="600" color="$brand">
                Invitar
              </Text>
            </YStack>

            {participants.map((p) => {
              const isOwner = p.role === GoalRole.OWNER;
              const userId = p.user.id;
              const isMe = userId === myUserId; 

              const name = p.user.profile?.firstName || "Usuario";

              return (
                <YStack
                  key={userId}
                  alignItems="center"
                  space="$2"
                  onLongPress={() => {
                    if (amIOwner && !isMe) {
                      handleOpenRemoveModal(name, p.userId);
                    }
                  }}
                  pressStyle={{ opacity: 0.7, scale: 0.95 }}
                >
                  <YStack position="relative">
                    <Avatar
                      circular
                      size="$4"
                      borderWidth={2}
                      borderColor="$gray4"
                    >
                      <Avatar.Image src={p.user.profile?.avatarUrl} />
                      <Avatar.Fallback
                        backgroundColor={isMe ? "$brand" : "$gray5"}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text
                          fontSize="$3"
                          fontWeight="bold"
                          color={isMe ? "white" : "$gray11"}
                        >
                          {p.user.profile?.firstName?.[0] ||
                            p.user.email[0].toUpperCase()}
                        </Text>
                      </Avatar.Fallback>
                    </Avatar>
                    {isOwner && (
                      <YStack
                        position="absolute"
                        top={-6}
                        right={-6}
                        backgroundColor="$yellow9"
                        borderRadius={100}
                        padding={3}
                        borderWidth={2}
                        borderColor="white"
                      >
                        <Crown size={10} color="white" />
                      </YStack>
                    )}
                  </YStack>

                  <Text
                    fontSize="$2"
                    color="$gray11"
                    fontWeight="600"
                    maxWidth={70}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {isMe ? "Tú" : name}
                  </Text>
                </YStack>
              );
            })}
          </XStack>
        </ScrollView>
      </YStack>

      <GoalInviteSheet
        open={isInviteSheetOpen}
        onOpenChange={setInviteSheetOpen}
        goal={goal}
      />

      <DangerModal
        visible={!!participantToRemove}
        onClose={handleCloseRemoveModal}
        onConfirm={handleConfirmRemove}
        isLoading={isRemoving}
        title="Eliminar miembro"
        message={
          <Text fontSize={14} color="$gray11" textAlign="center">
            ¿Estás seguro de que quieres sacar a{" "}
            <Text fontWeight="bold" color="$gray12">
              {participantToRemove?.name}
            </Text>{" "}
            de esta meta? Dejará de ver el progreso y no podrá aportar más.
          </Text>
        }
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
      />
    </>
  );
};
