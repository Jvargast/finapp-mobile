import React, { useState } from "react";
import {
  YStack,
  ScrollView,
  Text,
  Button,
  XStack,
  Progress,
} from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, UserPlus, Users } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";

import { useUserStore } from "../../stores/useUserStore";
import { FamilyMemberItem } from "../../components/family/FamilyMemberItem";
import { InviteSheet } from "../../components/family/InviteSheet";
import { DangerModal } from "../../components/ui/DangerModal";

const MOCK_MEMBERS = [
  {
    id: "1",
    name: "Tú",
    email: "usuario@wou.cl",
    role: "ADMIN",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Fernando",
    email: "fernando@gmail.com",
    role: "MEMBER",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Invitado",
    email: "esperando...",
    role: "MEMBER",
    status: "PENDING",
  },
];

export default function FamilyGroupScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);

  const [members, setMembers] = useState<any[]>(MOCK_MEMBERS);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  const isFamilyAdmin = user?.plan === "FAMILY_ADMIN";
  const maxMembers = 6;
  const usedSlots = members.length;
  const progress = (usedSlots / maxMembers) * 100;

  const handleRemoveMember = () => {
    if (memberToRemove) {
      setMembers((prev) => prev.filter((m) => m.id !== memberToRemove));
      setMemberToRemove(null);
      Alert.alert(
        "Miembro eliminado",
        "El usuario ha sido removido del plan familiar."
      );
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        marginBottom="$4"
      >
        <XStack alignItems="center" space="$2">
          <Button
            unstyled
            icon={ChevronLeft}
            color="$color"
            onPress={() => navigation.goBack()}
          />
          <Text fontSize="$6" fontWeight="900" color="$color">
            Familia Wou+
          </Text>
        </XStack>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" space="$6" paddingBottom="$8">
          <YStack
            backgroundColor="rgba(245, 158, 11, 0.1)"
            borderRadius="$6"
            padding="$4"
            borderWidth={1}
            borderColor="#F59E0B"
            space="$3"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack space="$2" alignItems="center">
                <Users size={20} color="#F59E0B" />
                <Text fontSize={16} fontWeight="800" color="#F59E0B">
                  {isFamilyAdmin ? "Tu Plan Familiar" : "Miembro Familiar"}
                </Text>
              </XStack>
              <Text fontSize={12} fontWeight="700" color="$color">
                {usedSlots} de {maxMembers} cupos
              </Text>
            </XStack>

            <Progress value={progress} size="$2" backgroundColor="$gray4">
              <Progress.Indicator
                animation="bouncy"
                backgroundColor="#F59E0B"
              />
            </Progress>

            <Text fontSize={12} color="$gray11" lineHeight={18}>
              {isFamilyAdmin
                ? "Como administrador, puedes invitar hasta 5 personas más para disfrutar de Wou+ Premium."
                : "Eres parte de un plan familiar. El administrador gestiona los pagos y miembros."}
            </Text>
          </YStack>

          <YStack space="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text
                fontSize={14}
                fontWeight="700"
                color="$gray10"
                textTransform="uppercase"
              >
                Miembros
              </Text>
              {isFamilyAdmin && usedSlots < maxMembers && (
                <Button
                  size="$2"
                  chromeless
                  color="#F59E0B"
                  icon={UserPlus}
                  fontWeight="bold"
                  onPress={() => setShowInviteSheet(true)}
                >
                  Invitar
                </Button>
              )}
            </XStack>

            {members.map((member) => (
              <FamilyMemberItem
                key={member.id}
                member={member as any}
                isCurrentUser={member.email === "usuario@wou.cl"}
                canManage={isFamilyAdmin}
                onRemove={(id) => setMemberToRemove(id)}
              />
            ))}
          </YStack>
        </YStack>
      </ScrollView>

      <InviteSheet
        open={showInviteSheet}
        onOpenChange={setShowInviteSheet}
        inviteCode="WOU-FAM-XYZ"
      />

      <DangerModal
        visible={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveMember}
        isLoading={false}
        title="¿Eliminar miembro?"
        confirmText="Sí, eliminar"
        message={
          <Text fontSize={14} color="$colorQwerty" textAlign="center">
            Esta persona perderá inmediatamente el acceso a los beneficios
            Premium.
          </Text>
        }
      />
    </YStack>
  );
}
