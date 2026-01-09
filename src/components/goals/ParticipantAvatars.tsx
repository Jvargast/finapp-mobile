import React from "react";
import { XStack, Avatar, Text, View } from "tamagui";
import { GoalParticipant } from "../../types/goal.types";

interface ParticipantAvatarsProps {
  participants: GoalParticipant[];
  max?: number;
  borderColor?: string;
}

export const ParticipantAvatars = ({
  participants = [],
  max = 3,
  borderColor = "$background",
}: ParticipantAvatarsProps) => {
  const activeParticipants = participants.filter(
    (p) => p.status === "ACCEPTED"
  );

  if (activeParticipants.length <= 0) return null;

  const visibleParticipants = activeParticipants.slice(0, max);
  const remaining = activeParticipants.length - max;

  return (
    <XStack alignItems="center">
      {visibleParticipants.map((p, index) => (
        <Avatar
          circular
          size="$2"
          key={p.id}
          borderWidth={2}
          borderColor={borderColor}
          marginLeft={index === 0 ? 0 : -10}
          zIndex={index}
        >
          <Avatar.Image src={p.user.profile?.avatarUrl} />
          <Avatar.Fallback
            backgroundColor="$gray5"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={10} fontWeight="bold" color="$gray11">
              {p.user.profile?.firstName?.[0] || p.user.email[0].toUpperCase()}
            </Text>
          </Avatar.Fallback>
        </Avatar>
      ))}

      {remaining > 0 && (
        <View
          width={28}
          height={28}
          borderRadius={100}
          backgroundColor="$gray4"
          alignItems="center"
          justifyContent="center"
          borderWidth={2}
          borderColor="$background"
          marginLeft={-10}
          zIndex={10}
        >
          <Text fontSize={10} fontWeight="bold" color="$gray11">
            +{remaining}
          </Text>
        </View>
      )}
    </XStack>
  );
};
