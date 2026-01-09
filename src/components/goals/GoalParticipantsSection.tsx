import React, { useState } from "react";
import { XStack, YStack, Avatar, Text, Button, ScrollView } from "tamagui";
import { Plus, Crown, UserPlus } from "@tamagui/lucide-icons";
import { FinancialGoal, GoalRole } from "../../types/goal.types";
import { GoalInviteSheet } from "./GoalInviteSheet";

interface GoalParticipantsSectionProps {
  goal: FinancialGoal;
}

export const GoalParticipantsSection = ({
  goal,
}: GoalParticipantsSectionProps) => {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const participants = goal.participants || [];

  return (
    <>
      <YStack space="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <XStack alignItems="center" space="$2">
            <UserPlus size={16} color="$gray10" />
            <Text fontSize="$5" fontWeight="800" color="$gray12">
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
            <YStack alignItems="center" space="$2" marginRight="$2">
              <Button
                size="$4"
                circular
                bordered
                borderWidth={1}
                borderStyle="dashed"
                borderColor="$brand"
                icon={<Plus size={24} color="$brand" />}
                onPress={() => setSheetOpen(true)}
                backgroundColor="$blue2"
                pressStyle={{ scale: 0.95, opacity: 0.8 }}
              />
              <Text fontSize="$2" fontWeight="600" color="$brand">
                Invitar
              </Text>
            </YStack>

            {participants.map((p) => {
              const isOwner = p.role === GoalRole.OWNER;
              return (
                <YStack key={p.id} alignItems="center" space="$2">
                  <YStack position="relative">
                    <Avatar
                      circular
                      size="$4"
                      borderWidth={2}
                      borderColor="$gray4"
                    >
                      <Avatar.Image src={p.user.profile?.avatarUrl} />
                      <Avatar.Fallback
                        backgroundColor="$gray5"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text fontSize="$3" fontWeight="bold" color="$gray11">
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
                    {p.user.profile?.firstName || "Usuario"}
                  </Text>
                </YStack>
              );
            })}
          </XStack>
        </ScrollView>
      </YStack>
      <GoalInviteSheet
        open={isSheetOpen}
        onOpenChange={setSheetOpen}
        goal={goal}
      />
    </>
  );
};
