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
  const isTrial = subscription?.periodType === "TRIAL";
  const statusLabel = isActive
    ? isTrial
      ? "Período de prueba activo"
      : isCanceled
      ? "Cancelada, activa hasta el fin del ciclo"
      : "Suscripción activa"
    : "Sin suscripción activa";

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
      title: "Plan gratuito",
      icon: Clock3,
      color: "#64748B",
      description: "Acceso básico sin beneficios premium.",
    },
  }[planType];

  const Icon = config.icon;
  const toneColor = isActive ? config.color : "#94A3B8";
  const secondaryLabel = dateLabel
    ? isActive
      ? isTrial
        ? `Prueba hasta ${dateLabel}`
        : isCanceled
        ? `Activa hasta ${dateLabel}`
        : subscription?.willRenew
        ? `Renueva ${dateLabel}`
        : `Acceso hasta ${dateLabel}`
      : `Venció ${dateLabel}`
    : isActive
    ? "Estamos confirmando la vigencia de tu plan"
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
      padding="$4"
      shadowColor={toneColor}
      shadowOpacity={0.1}
    >
      <XStack
        justifyContent="space-between"
        alignItems="flex-start"
        marginBottom="$4"
      >
        <XStack space="$3" alignItems="center" flex={1}>
          <Circle size={48} backgroundColor={`${toneColor}20`}>
            <Icon size={24} color={toneColor} />
          </Circle>
          <YStack flex={1} flexShrink={1}>
            <DisplayHeading
              fontSize="$6"
              fontWeight="400"
              color="$color"
              lineHeight={26}
            >
              {config.title}
            </DisplayHeading>
            <XStack alignItems="flex-start" space="$1.5" flexShrink={1}>
              {isActive ? (
                <CheckCircle2 size={12} color={toneColor} />
              ) : (
                <AlertCircle size={12} color="$red10" />
              )}
              <Text
                fontSize={12}
                fontWeight="700"
                color={isActive ? toneColor : "$red10"}
                flex={1}
                flexShrink={1}
                lineHeight={16}
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
        <YStack space="$1">
          <Text fontSize={12} color="$gray10">
            Vigencia actual
          </Text>
          <Text
            fontSize={12}
            color="$color"
            fontWeight="700"
            lineHeight={18}
            flexShrink={1}
          >
            {secondaryLabel}
          </Text>
        </YStack>

        {familyRoleLabel ? (
          <XStack justifyContent="space-between" alignItems="center">
            <Text fontSize={12} color="$gray10">
              Rol familiar
            </Text>
            <Text
              fontSize={12}
              color="$color"
              fontWeight="700"
              flexShrink={1}
              textAlign="right"
              marginLeft="$3"
            >
              {familyRoleLabel}
            </Text>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  );
};
