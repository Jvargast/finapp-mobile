import React from "react";
import { YStack, XStack, Text, Circle } from "tamagui";
import {
  Crown,
  Users,
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  Clock3,
} from "@tamagui/lucide-icons";
import { DisplayHeading } from "../ui/DisplayHeading";
import {
  type BackendSubscriptionState,
  type SubscriptionFamilyRole,
} from "../../types/subscription.types";
import { SubscriptionPlan } from "../../types/user.types";

interface PlanStatusCardProps {
  subscription: BackendSubscriptionState | null;
  familyRole?: SubscriptionFamilyRole;
  dateLabel?: string;
}

export const PlanStatusCard = ({
  subscription,
  familyRole = "NONE",
  dateLabel,
}: PlanStatusCardProps) => {
  const planType = subscription?.plan ?? SubscriptionPlan.FREE;
  const isActive = subscription?.isActive ?? false;
  const isCanceled = subscription?.isCanceled ?? false;
  const statusLabel = isActive
    ? isCanceled
      ? "Cancelada, activa hasta el fin del ciclo"
      : "Suscripcion activa"
    : "Sin suscripcion activa";

  const config = {
    PRO: {
      title: "WouFinance Pro",
      icon: Crown,
      color: "#F59E0B",
      description: "Acceso total a herramientas personales.",
    },
    FAMILY_ADMIN: {
      title: "WouFinance Family",
      icon: Users,
      color: "#0EA5E9",
      description: "Tú y 5 miembros disfrutan de beneficios Premium.",
    },
    FAMILY_MEMBER: {
      title: "WouFinance Family",
      icon: HeartHandshake,
      color: "#10B981",
      description: "Plan gestionado por el administrador del grupo.",
    },
    FREE: {
      title: "Plan Free",
      icon: Clock3,
      color: "#64748B",
      description: "Acceso basico sin beneficios premium.",
    },
  }[planType];

  const Icon = config.icon;
  const toneColor = isActive ? config.color : "#94A3B8";
  const secondaryLabel = dateLabel
    ? isActive
      ? subscription?.willRenew
        ? `Renueva ${dateLabel}`
        : `Acceso hasta ${dateLabel}`
      : `Vencio ${dateLabel}`
    : isActive
    ? "Sin fecha de expiracion informada"
    : "Activa un plan para desbloquear WouFinance Pro";
  const familyRoleLabel =
    planType === SubscriptionPlan.FAMILY_ADMIN
      ? "Administrador"
      : familyRole === "MEMBER"
      ? "Miembro"
      : null;

  return (
    <YStack
      backgroundColor="$gray2"
      borderRadius="$8"
      borderWidth={1}
      borderColor={toneColor}
      padding="$5"
      shadowColor={toneColor}
      shadowOpacity={0.1}
    >
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$4"
      >
        <XStack space="$3" alignItems="center">
          <Circle size={48} backgroundColor={`${toneColor}20`}>
            <Icon size={24} color={toneColor} />
          </Circle>
          <YStack>
            <DisplayHeading
              fontSize="$6"
              fontWeight="400"
              color="$color"
              lineHeight={26}
            >
              {config.title}
            </DisplayHeading>
            <XStack alignItems="center" space="$1.5">
              {isActive ? (
                <CheckCircle2 size={12} color={toneColor} />
              ) : (
                <AlertCircle size={12} color="$red10" />
              )}
              <Text
                fontSize={12}
                fontWeight="700"
                color={isActive ? toneColor : "$red10"}
              >
                {statusLabel}
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </XStack>

      <Text fontSize={13} color="$gray11" marginBottom="$4">
        {config.description}
      </Text>

      <YStack space="$2">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize={12} color="$gray10">
            Estado backend
          </Text>
          <Text fontSize={12} color="$color" fontWeight="700">
            {secondaryLabel}
          </Text>
        </XStack>

        {familyRoleLabel ? (
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={12} color="$gray10">
              Rol familiar
            </Text>
            <Text fontSize={12} color="$color" fontWeight="700">
              {familyRoleLabel}
            </Text>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  );
};
