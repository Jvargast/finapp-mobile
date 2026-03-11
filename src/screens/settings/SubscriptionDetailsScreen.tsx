import React from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Calendar,
  ChevronLeft,
  CreditCard,
  Download,
  RefreshCcw,
  Settings2,
  Store,
  Ticket,
  Users,
} from "@tamagui/lucide-icons";
import { Button, ScrollView, Spacer, Text, XStack, YStack } from "tamagui";

import { BillingRow } from "../../components/subscription/BillingRow";
import { PlanStatusCard } from "../../components/subscription/PlanStatusCard";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { useSubscription } from "../../hooks/useSubscription";
import { SubscriptionPlan } from "../../types/user.types";

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "No informado";
  }

  return new Date(value).toLocaleString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

  const expiresAtLabel = formatDateTime(backendSubscription?.expiresAt ?? null);
  const purchasedAtLabel = formatDateTime(
    backendSubscription?.purchasedAt ?? null
  );
  const canceledAtLabel = formatDateTime(
    backendSubscription?.canceledAt ?? null
  );

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
        Alert.alert("No se pudo abrir la gestion", manageError.message);
      }
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        marginBottom="$4"
      >
        <Button
          unstyled
          icon={ChevronLeft}
          color="$color"
          onPress={() => navigation.goBack()}
          marginBottom="$2"
          alignSelf="flex-start"
        />
        <DisplayHeading
          fontSize="$8"
          fontWeight="400"
          color="$color"
          lineHeight={36}
        >
          Tu suscripcion
        </DisplayHeading>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$9" space="$6">
          <PlanStatusCard
            subscription={backendSubscription}
            familyRole={familyRole}
            dateLabel={backendSubscription?.expiresAt ? expiresAtLabel : undefined}
          />

          {plan === SubscriptionPlan.FREE ? (
            <YStack
              backgroundColor="$gray2"
              borderRadius="$6"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$4"
              space="$3"
            >
              <Text color="$color" fontWeight="700">
                No tienes una suscripcion premium activa.
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

          <YStack space="$2">
            <Text
              fontSize={13}
              fontWeight="700"
              color="$gray10"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Estado backend
            </Text>

            <YStack
              backgroundColor="$gray2"
              borderRadius="$4"
              paddingHorizontal="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <BillingRow label="Plan" value={backendSubscription?.plan ?? plan} />
              <BillingRow
                label="Acceso premium"
                value={backendSubscription?.isActive ? "Activo" : "Inactivo"}
              />
              <BillingRow
                label="Expira"
                value={expiresAtLabel}
                icon={Calendar}
              />
              <BillingRow
                label="Renovacion automatica"
                value={backendSubscription?.willRenew ? "Si" : "No"}
              />
              <BillingRow
                label="Cancelada"
                value={backendSubscription?.isCanceled ? "Si" : "No"}
              />
              <BillingRow
                label="Cancelada el"
                value={canceledAtLabel}
                hideSeparator
              />
            </YStack>
          </YStack>

          <YStack space="$2">
            <Text
              fontSize={13}
              fontWeight="700"
              color="$gray10"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Datos de compra
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
                value={backendSubscription?.productId ?? "No informado"}
                icon={CreditCard}
              />
              <BillingRow
                label="Entitlement"
                value={backendSubscription?.entitlement ?? "No informado"}
                icon={Ticket}
              />
              <BillingRow
                label="Store"
                value={backendSubscription?.store ?? "No informado"}
                icon={Store}
              />
              <BillingRow
                label="Environment"
                value={backendSubscription?.environment ?? "No informado"}
              />
              <BillingRow
                label="Comprada el"
                value={purchasedAtLabel}
                icon={Calendar}
              />
              <BillingRow
                label="Rol familiar"
                value={familyRole === "NONE" ? "No aplica" : familyRole}
                icon={Users}
                hideSeparator
              />
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

            {hasManageSubscription && plan !== SubscriptionPlan.FREE ? (
              <Button
                size="$4"
                backgroundColor="#F59E0B"
                color="#111827"
                icon={Settings2}
                onPress={handleManage}
                disabled={isManaging}
              >
                {isManaging ? "Abriendo..." : "Manage subscription"}
              </Button>
            ) : null}
          </YStack>

          <Spacer size="$2" />

          <YStack
            backgroundColor="$gray2"
            borderRadius="$6"
            borderWidth={1}
            borderColor="$borderColor"
            padding="$4"
            space="$3"
          >
            <Text fontSize={13} color="$gray11" lineHeight={20}>
              Las cancelaciones y cambios de plan se gestionan desde RevenueCat
              Customer Center o directamente desde App Store / Google Play. El
              backend sigue siendo la fuente de verdad para acceso premium.
            </Text>

            {plan === SubscriptionPlan.FAMILY_ADMIN ? (
              <XStack justifyContent="space-between" alignItems="center">
                <Text color="$gray10" fontSize={13}>
                  Miembros del plan familiar
                </Text>
                <Button chromeless onPress={() => navigation.navigate("FamilyGroup")}>
                  Abrir grupo
                </Button>
              </XStack>
            ) : null}
          </YStack>
        </YStack>
      </ScrollView>
    </YStack>
  );
}

