import React, { useEffect, useState } from "react";
import {
  YStack,
  ScrollView,
  Text,
  Button,
  XStack,
  Progress,
  Spinner,
} from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, UserPlus, Users, LogOut } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Alert } from "react-native";
import { useUserStore } from "../../stores/useUserStore";
import { useFamilyStore } from "../../stores/useFamilyStore";
import { FamilyMemberItem } from "../../components/family/FamilyMemberItem";
import { InviteSheet } from "../../components/family/InviteSheet";
import { DangerModal } from "../../components/ui/DangerModal";
import { FamilyActions } from "../../actions/familyActions";

export default function FamilyGroupScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const currentUser = useUserStore((state) => state.user);
  const {
    members,
    role,
    inviteCode,
    maxMembers,
    usedSlots,
    isLoading,
    adminName,
  } = useFamilyStore();

  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    FamilyActions.loadFamilyGroup();
  }, []);

  const isFamilyAdmin = role === "ADMIN";
  const progress = (usedSlots / maxMembers) * 100;

  const handleOpenInvite = async () => {
    if (!inviteCode) {
      try {
        await FamilyActions.generateCode();
      } catch (error) {
        Alert.alert("Error", "No se pudo generar el código de invitación.");
        return;
      }
    }
    setShowInviteSheet(true);
  };

  const handleRemoveConfirm = async () => {
    if (!memberToRemove) return;

    setIsProcessing(true);
    try {
      await FamilyActions.removeMember(memberToRemove);
      setMemberToRemove(null);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo eliminar al miembro. Intenta nuevamente."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLeaveGroup = async () => {
    Alert.alert(
      "¿Salir del grupo?",
      "Perderás los beneficios Premium inmediatamente.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            try {
              await FamilyActions.leaveGroup();
              navigation.goBack();
            } catch (error) {
              Alert.alert("Error", "No pudimos procesar tu salida.");
            }
          },
        },
      ]
    );
  };

  const adminItem = {
    id: "admin-owner",
    name: isFamilyAdmin
      ? `${currentUser?.firstName || "Tú"} (Admin)`
      : adminName || "Administrador",
    email: isFamilyAdmin ? currentUser?.email : "Organizador del plan",
    role: "ADMIN",
    status: "ACTIVE",
    avatar: isFamilyAdmin ? currentUser?.avatar : undefined,
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

      {isLoading && members.length === 0 ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="#F59E0B" />
        </YStack>
      ) : (
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
                    {isFamilyAdmin ? "Tu Plan Familiar" : "Miembro del Plan"}
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
                  ? "Gestiona tu suscripción familiar. Invita amigos o familiares para que disfruten de Wou+."
                  : "Disfrutas de los beneficios Premium gracias a este plan familiar."}
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
                  Miembros ({members.length})
                </Text>

                {isFamilyAdmin && usedSlots < maxMembers && (
                  <Button
                    size="$2"
                    chromeless
                    color="#F59E0B"
                    icon={UserPlus}
                    fontWeight="bold"
                    onPress={handleOpenInvite}
                  >
                    Invitar
                  </Button>
                )}
              </XStack>

              <FamilyMemberItem
                member={adminItem as any}
                isCurrentUser={isFamilyAdmin}
                canManage={false}
                onRemove={() => {}}
              />

              {members.map((member) => (
                <FamilyMemberItem
                  key={member.id}
                  member={member}
                  isCurrentUser={member.email === currentUser?.email}
                  canManage={isFamilyAdmin}
                  onRemove={(id) => setMemberToRemove(id)}
                />
              ))}

              {members.length === 0 && (
                <Text
                  textAlign="center"
                  color="$gray8"
                  fontSize={12}
                  marginTop="$4"
                >
                  No hay miembros en este grupo aún.
                </Text>
              )}
            </YStack>

            {!isFamilyAdmin && role === "MEMBER" && (
              <Button
                marginTop="$4"
                variant="outlined"
                borderColor="$red5"
                color="$red10"
                icon={LogOut}
                onPress={handleLeaveGroup}
              >
                Salir del Grupo Familiar
              </Button>
            )}
          </YStack>
        </ScrollView>
      )}

      <InviteSheet
        open={showInviteSheet}
        onOpenChange={setShowInviteSheet}
        inviteCode={inviteCode || "..."}
      />

      <DangerModal
        visible={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        onConfirm={handleRemoveConfirm}
        isLoading={isProcessing}
        title="¿Eliminar miembro?"
        confirmText="Sí, eliminar"
        message={
          <Text fontSize={14} color="$colorQwerty" textAlign="center">
            Esta persona perderá inmediatamente el acceso.{"\n"}
            Podrás invitarla nuevamente si lo deseas.
          </Text>
        }
      />
    </YStack>
  );
}
