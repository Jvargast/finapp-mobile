import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  CreditCard,
  Download,
  RefreshCcw,
  Settings2,
  Store,
  Users,
} from "@tamagui/lucide-icons";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";

import { BillingRow } from "../../components/subscription/BillingRow";
import { PlanStatusCard } from "../../components/subscription/PlanStatusCard";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { useSubscription } from "../../hooks/useSubscription";
import { SubscriptionPlan } from "../../types/user.types";
import {
  formatSubscriptionDateTime,
  formatSubscriptionRemainingTime,
  getSubscriptionFamilyRoleName,
  getSubscriptionPlanName,
  getSubscriptionPeriodTypeName,
  getSubscriptionProductName,
  getSubscriptionStoreName,
} from "../../utils/subscriptionDisplay";

export default function SubscriptionDetailsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const {
    backendSubscription,
    plan,
    familyRole,
    hasManageSubscription,
    isRefreshing,
    isRestoring,
    isManaging,
    restorePurchases,
    openCustomerCenter,
    refresh,
  } = useSubscription();

  const displayPlan = backendSubscription?.plan ?? plan;
  const isTrialPeriod = backendSubscription?.periodType === "TRIAL";
  const isCanceledButActive = Boolean(
    backendSubscription?.isActive && backendSubscription?.isCanceled
  );
  const expiresAtLabel = formatSubscriptionDateTime(
    backendSubscription?.expiresAt ?? null
  );
  const purchasedAtLabel =
    formatSubscriptionDateTime(backendSubscription?.purchasedAt ?? null) ??
    (displayPlan === SubscriptionPlan.FREE
      ? "Sin compra registrada"
      : "Pendiente de confirmación");
  const currentPeriodStartsAtLabel =
    formatSubscriptionDateTime(
      backendSubscription?.currentPeriodStartsAt ?? null
    ) ??
    (displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : "Pendiente de confirmación");
  const canceledAtLabel =
    backendSubscription?.isCanceled || backendSubscription?.canceledAt
      ? formatSubscriptionDateTime(backendSubscription?.canceledAt ?? null) ??
        "Pendiente de confirmación"
      : null;
  const remainingTimeLabel =
    displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : formatSubscriptionRemainingTime(backendSubscription?.expiresAt ?? null) ??
        (backendSubscription?.isActive ? "Por confirmar" : "Expirada");
  const periodTypeLabel =
    displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : getSubscriptionPeriodTypeName(backendSubscription?.periodType);
  const accessLabel =
    displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : !backendSubscription?.isActive
      ? backendSubscription?.isCanceled
        ? "Cancelada"
        : "Inactivo"
      : isTrialPeriod
      ? "En prueba"
      : isCanceledButActive
      ? "Activo hasta vencimiento"
      : "Activo";
  const renewalStatusLabel =
    displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : !backendSubscription?.isActive
      ? backendSubscription?.isCanceled
        ? "Cancelada"
        : "Suscripción inactiva"
      : isTrialPeriod
      ? "Período de prueba en curso"
      : isCanceledButActive
      ? "Cancelada, seguirá activa hasta el vencimiento"
      : backendSubscription?.willRenew
      ? "Renovación automática activa"
      : "No renovará al terminar el período";
  const expiryRowLabel =
    displayPlan === SubscriptionPlan.FREE
      ? "Vigencia"
      : !backendSubscription?.isActive
      ? "Venció"
      : isTrialPeriod
      ? "Fin de prueba"
      : "Expira el";
  const expiryRowValue =
    displayPlan === SubscriptionPlan.FREE
      ? "No aplica"
      : expiresAtLabel ??
        (backendSubscription?.isActive ? "Por confirmar" : "Sin registro");
  const familyRoleLabel = getSubscriptionFamilyRoleName(
    displayPlan === SubscriptionPlan.FAMILY_ADMIN
      ? "ADMIN"
      : displayPlan === SubscriptionPlan.FAMILY_MEMBER
      ? "MEMBER"
      : familyRole
  );
  const productLabel = backendSubscription?.productId
    ? getSubscriptionProductName(backendSubscription.productId)
    : displayPlan === SubscriptionPlan.FREE
    ? "Sin compra registrada"
    : "Producto por confirmar";
  const storeLabel =
    displayPlan === SubscriptionPlan.FREE && !backendSubscription?.store
      ? "No aplica"
      : getSubscriptionStoreName(backendSubscription?.store ?? null);

  const handleRestore = async () => {
    try {
      await restorePurchases();
    } catch (restoreError) {
      if (restoreError instanceof Error) {
        Alert.alert("No se pudo restaurar", restoreError.message);
      }
    }
  };

  const handleManage = async () => {
    try {
      await openCustomerCenter();
    } catch (manageError) {
      if (manageError instanceof Error) {
        Alert.alert("No se pudo abrir la gestión", manageError.message);
      }
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom="$1"
      >
        <GoBackButton
          onPress={() => navigation.goBack()}
          iconColor="$color"
          marginBottom="$2"
        />
        <DisplayHeading
          fontSize="$8"
          fontWeight="400"
          color="$color"
          lineHeight={36}
        >
          Tu suscripción
        </DisplayHeading>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingTop="$2" paddingBottom="$9" space="$5">
          <PlanStatusCard
            subscription={backendSubscription}
            familyRole={familyRole}
            dateLabel={expiresAtLabel ?? undefined}
          />

          {displayPlan === SubscriptionPlan.FREE ? (
            <YStack
              backgroundColor="$gray2"
              borderRadius="$6"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$4"
              space="$3"
            >
              <Text color="$color" fontWeight="700">
                No tienes una suscripción premium activa.
              </Text>
              <Button
                size="$4"
                backgroundColor="#F59E0B"
                onPress={() => navigation.navigate("Subscription")}
              >
                Ver planes
              </Button>
            </YStack>
          ) : null}

          <YStack space="$2.5" marginTop="$4">
            <Text
              fontSize={13}
              fontWeight="700"
              color="$gray10"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Estado actual
            </Text>

            <YStack
              backgroundColor="$gray2"
              borderRadius="$4"
              paddingHorizontal="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <BillingRow
                label="Plan"
                value={getSubscriptionPlanName(displayPlan)}
              />
              <BillingRow
                label="Acceso"
                value={accessLabel}
              />
              <BillingRow
                label="Período actual"
                value={periodTypeLabel}
              />
              <BillingRow
                label={expiryRowLabel}
                value={expiryRowValue}
                icon={Calendar}
                stacked
              />
              <BillingRow
                label="Tiempo restante"
                value={remainingTimeLabel}
              />
              <BillingRow
                label="Estado de renovación"
                value={renewalStatusLabel}
              />
              <BillingRow
                label="Renovación automática"
                value={
                  displayPlan === SubscriptionPlan.FREE
                    ? "No aplica"
                    : backendSubscription?.willRenew
                    ? "Sí"
                    : "No"
                }
              />
              <BillingRow
                label="Cancelación programada"
                value={
                  backendSubscription?.isCanceled
                    ? isCanceledButActive
                      ? "Sí, sigue activa"
                      : "Sí"
                    : "No"
                }
                hideSeparator={!canceledAtLabel}
              />
              {canceledAtLabel ? (
                <BillingRow
                  label="Cancelada el"
                  value={canceledAtLabel}
                  icon={Calendar}
                  stacked
                  hideSeparator
                />
              ) : null}
            </YStack>
          </YStack>

          <YStack space="$2.5">
            <Text
              fontSize={13}
              fontWeight="700"
              color="$gray10"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Compra y renovación
            </Text>

            <YStack
              backgroundColor="$gray2"
              borderRadius="$4"
              paddingHorizontal="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <BillingRow
                label="Producto"
                value={productLabel}
                icon={CreditCard}
              />
              <BillingRow
                label="Tienda"
                value={storeLabel}
                icon={Store}
              />
              <BillingRow
                label="Comprada el"
                value={purchasedAtLabel}
                icon={Calendar}
                stacked
              />
              <BillingRow
                label="Inicio del período actual"
                value={currentPeriodStartsAtLabel}
                icon={Calendar}
                stacked
                hideSeparator={!familyRoleLabel}
              />
              {familyRoleLabel ? (
                <BillingRow
                  label="Rol familiar"
                  value={familyRoleLabel}
                  icon={Users}
                  hideSeparator
                />
              ) : null}
            </YStack>
          </YStack>

          <YStack space="$3">
            <Button
              size="$4"
              icon={RefreshCcw}
              variant="outlined"
              onPress={() =>
                refresh({
                  reason: "subscription_details_refresh",
                  refreshOfferings: true,
                  refreshCustomerInfo: true,
                }).catch(() => undefined)
              }
              disabled={isRefreshing}
            >
              {isRefreshing ? "Actualizando..." : "Actualizar estado"}
            </Button>

            <Button
              size="$4"
              icon={Download}
              variant="outlined"
              onPress={handleRestore}
              disabled={isRestoring}
            >
              {isRestoring ? "Restaurando..." : "Restaurar compras"}
            </Button>

            {hasManageSubscription && displayPlan !== SubscriptionPlan.FREE ? (
              <YStack space="$2.5">
                <Button
                  size="$4"
                  backgroundColor="#F59E0B"
                  color="#111827"
                  icon={Settings2}
                  onPress={handleManage}
                  disabled={isManaging}
                >
                  {isManaging ? "Abriendo..." : "Gestionar suscripción"}
                </Button>
                <Text fontSize={13} color="$gray11" lineHeight={19}>
                  Si necesitas cancelar o cambiar tu plan, usa este acceso para
                  abrir la gestión de la tienda.
                </Text>
              </YStack>
            ) : null}
          </YStack>

          {displayPlan === SubscriptionPlan.FAMILY_ADMIN ? (
            <XStack
              justifyContent="space-between"
              alignItems="center"
              backgroundColor="$gray2"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray4"
              paddingHorizontal="$4"
              paddingVertical="$3.5"
            >
              <Text color="$gray10" fontSize={13}>
                Miembros del plan familiar
              </Text>
              <Button chromeless onPress={() => navigation.navigate("FamilyGroup")}>
                Abrir grupo
              </Button>
            </XStack>
          ) : null}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
