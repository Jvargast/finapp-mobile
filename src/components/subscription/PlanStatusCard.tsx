import React from "react";
import { YStack, XStack, Text, Progress, Circle } from "tamagui";
import {
  Crown,
  Users,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
} from "@tamagui/lucide-icons";

interface PlanStatusCardProps {
  planType: "PRO" | "FAMILY_ADMIN" | "FAMILY_MEMBER";
  status: "ACTIVE" | "CANCELLED" | "EXPIRED";
  renewsAt: string; 
}

export const PlanStatusCard = ({
  planType,
  status,
  renewsAt,
}: PlanStatusCardProps) => {
  const isActive = status === "ACTIVE";

  const config = {
    PRO: {
      title: "Wou+ Individual",
      icon: Crown,
      color: "#F59E0B",
      description: "Acceso total a herramientas personales.",
    },
    FAMILY_ADMIN: {
      title: "Wou+ Familiar (Admin)",
      icon: Users,
      color: "#8B5CF6",
      description: "Tú y 5 miembros disfrutan de beneficios Premium.",
    },
    FAMILY_MEMBER: {
      title: "Miembro Familiar",
      icon: HeartHandshake,
      color: "#10B981",
      description: "Plan gestionado por el administrador del grupo.",
    },
  }[planType];

  const Icon = config.icon;

  return (
    <YStack
      backgroundColor="$gray2"
      borderRadius="$8"
      borderWidth={1}
      borderColor={isActive ? config.color : "$gray5"}
      padding="$5"
      elevation={isActive ? "$4" : undefined}
      shadowColor={config.color}
      shadowOpacity={0.1}
    >
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$4"
      >
        <XStack space="$3" alignItems="center">
          <Circle size={48} backgroundColor={`${config.color}20`}>
            <Icon size={24} color={config.color} />
          </Circle>
          <YStack>
            <Text fontSize="$5" fontWeight="800" color="$color">
              {config.title}
            </Text>
            <XStack alignItems="center" space="$1.5">
              {isActive ? (
                <CheckCircle2 size={12} color={config.color} />
              ) : (
                <AlertCircle size={12} color="$red10" />
              )}
              <Text
                fontSize={12}
                fontWeight="700"
                color={isActive ? config.color : "$red10"}
              >
                {isActive ? "Suscripción Activa" : "Cancelada / Expirada"}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </XStack>

      <Text fontSize={13} color="$gray11" marginBottom="$4">
        {config.description}
      </Text>

      {isActive && (
        <YStack space="$2">
          <XStack justifyContent="space-between">
            <Text fontSize={11} color="$gray10">
              Ciclo actual
            </Text>
            <Text fontSize={11} color="$gray10">
              Renueva: {renewsAt}
            </Text>
          </XStack>
          <Progress value={65} size="$1">
            <Progress.Indicator
              animation="bouncy"
              backgroundColor={config.color}
            />
          </Progress>
        </YStack>
      )}
    </YStack>
  );
};
