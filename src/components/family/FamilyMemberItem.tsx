import React from "react";
import { XStack, YStack, Text, Avatar, Button, View } from "tamagui";
import { Crown, Trash2, Clock } from "@tamagui/lucide-icons";

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "PENDING";
}

interface FamilyMemberItemProps {
  member: FamilyMember;
  isCurrentUser: boolean;
  canManage: boolean;
  onRemove: (id: string) => void;
}

export const FamilyMemberItem = ({
  member,
  isCurrentUser,
  canManage,
  onRemove,
}: FamilyMemberItemProps) => {
  const isAdmin = member.role === "ADMIN";
  const isPending = member.status === "PENDING";

  const statusColor = isAdmin ? "#F59E0B" : isPending ? "$gray8" : "$blue10";
  const bgColor = isCurrentUser ? "rgba(245, 158, 11, 0.03)" : "$gray2";
  const borderColor = isCurrentUser
    ? "rgba(245, 158, 11, 0.3)"
    : "$borderColor";

  return (
    <XStack
      backgroundColor={bgColor}
      marginBottom="$3"
      paddingVertical="$3.5"
      paddingHorizontal="$4"
      borderRadius="$6"
      alignItems="center"
      space="$3.5"
      borderWidth={1}
      borderColor={borderColor}
      animation="quick"
      pressStyle={{ scale: 0.99, opacity: 0.9 }}
      shadowColor="$shadowColor"
      shadowRadius={2}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.05}
    >
      <View
        padding={2}
        borderRadius={100}
        borderWidth={isAdmin ? 1.5 : 0}
        borderColor={statusColor}
        borderStyle={isPending ? "dashed" : "solid"}
      >
        <Avatar circular size="$4.5">
          <Avatar.Image src={member.avatar} />
          <Avatar.Fallback
            backgroundColor={isAdmin ? "rgba(245, 158, 11, 0.1)" : "$gray4"}
            alignItems="center"
            justifyContent="center"
          >
            {isAdmin ? (
              <Crown size={20} color="#F59E0B" />
            ) : (
              <Text color="$gray11" fontWeight="800" fontSize={16}>
                {(member.name?.[0] || "?").toUpperCase()}
              </Text>
            )}
          </Avatar.Fallback>
        </Avatar>

        {!isPending && !isAdmin && (
          <View
            position="absolute"
            bottom={0}
            right={0}
            backgroundColor="$green10"
            width={10}
            height={10}
            borderRadius={5}
            borderWidth={1.5}
            borderColor="$background"
          />
        )}
      </View>

      <YStack flex={1} space="$1">
        <XStack alignItems="center" space="$2">
          <Text fontSize={15} fontWeight="700" color="$color">
            {member.name}
            {isCurrentUser && (
              <Text color="$gray9" fontWeight="400">
                (Tú)
              </Text>
            )}
          </Text>

          {isAdmin && (
            <View
              backgroundColor="rgba(245, 158, 11, 0.15)"
              paddingHorizontal={6}
              paddingVertical={1}
              borderRadius={6}
            >
              <Text
                fontSize={9}
                fontWeight="800"
                color="#F59E0B"
                letterSpacing={0.5}
              >
                ADMIN
              </Text>
            </View>
          )}

          {isPending && (
            <View
              backgroundColor="$gray5"
              paddingHorizontal={6}
              paddingVertical={1}
              borderRadius={6}
              borderWidth={1}
              borderColor="$gray6"
            >
              <Text fontSize={9} fontWeight="600" color="$gray10">
                PENDIENTE
              </Text>
            </View>
          )}
        </XStack>

        <Text fontSize={12} color="$gray10" numberOfLines={1}>
          {member.email}
        </Text>
      </YStack>
      <YStack justifyContent="center">
        {canManage && !isAdmin && !isCurrentUser ? (
          <Button
            size="$3"
            circular
            backgroundColor="rgba(239, 68, 68, 0.08)"
            icon={<Trash2 size={16} color="#EF4444" />}
            onPress={() => onRemove(member.id)}
            hoverStyle={{ backgroundColor: "#EF4444" }}
            pressStyle={{ backgroundColor: "#EF4444", opacity: 0.8 }}
          />
        ) : isPending ? (
          <View
            backgroundColor="$gray3"
            padding={8}
            borderRadius={100}
            opacity={0.8}
          >
            <Clock size={16} color="$gray10" />
          </View>
        ) : (
          <View width={32} alignItems="center"></View>
        )}
      </YStack>
    </XStack>
  );
};
