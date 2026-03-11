import React, { useMemo, useRef, useState } from "react";
import { Alert, ScrollView as RNScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Crown, RefreshCcw, Settings2 } from "@tamagui/lucide-icons";
import { Button, ScrollView, Text, XStack, YStack } from "tamagui";

import { ComparisonTable } from "../../components/subscription/ComparisonTable";
import { PlanStatusCard } from "../../components/subscription/PlanStatusCard";
import { PricingCard } from "../../components/subscription/PricingCard";
import { SubscriptionCard } from "../../components/subscription/SubscriptionCard";
import { DisplayHeading } from "../../components/ui/DisplayHeading";
import { useSubscription } from "../../hooks/useSubscription";
import type {
  SubscriptionBillingCycle,
  SubscriptionProductKind,
} from "../../types/subscription.types";

const PLAN_COPY: Record<
  SubscriptionProductKind,
  { title: string; description: string; highlights: string[]; badgeText?: string }
> = {
  PRO: {
    title: "WouFinance Pro",
    description:
      "Automatizacion personal, analitica avanzada y control premium de tus finanzas.",
    highlights: [
      "Sincronizacion y cuentas ilimitadas",
      "Analitica avanzada y automatizaciones",
      "Acceso inmediato segun estado confirmado por backend",
    ],
  },
  FAMILY: {
    title: "WouFinance Family",
    description:
      "Administra un plan familiar y comparte beneficios premium cuando aplique.",
    highlights: [
      "Administrador con soporte para plan familiar",
      "Miembros cubiertos desde la configuracion del backend",
      "Gestion de renovaciones desde Customer Center o la tienda",
    ],
    badgeText: "Plan familiar",
  },
};

const formatDate = (value: string | null) => {
  if (!value) {
    return null;
  }

  return new Date(value).toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function SubscriptionScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<RNScrollView>(null);

  const {
    backendSubscription,
    offerings,
    familyRole,
    hasPremiumAccess,
    hasManageSubscription,
    isInitializing,
    isRefreshing,
    isPurchasing,
    isRestoring,
    error,
    purchasePackage,
    restorePurchases,
    openCustomerCenter,
    refresh,
  } = useSubscription();

  const [comparisonLayoutY, setComparisonLayoutY] = useState(0);
  const [selectedPlanType, setSelectedPlanType] =
    useState<SubscriptionProductKind>("PRO");
  const [billingCycle, setBillingCycle] =
    useState<SubscriptionBillingCycle>("YEARLY");

  const selectedOffering = offerings[selectedPlanType];
  const selectedPackage =
    billingCycle === "MONTHLY"
      ? selectedOffering?.monthly ?? null
      : selectedOffering?.yearly ?? null;

  const monthlyPrice = selectedOffering?.monthly?.priceString ?? "--";
  const yearlyPrice = selectedOffering?.yearly?.priceString ?? "--";
  const expiresLabel = formatDate(backendSubscription?.expiresAt ?? null);
  const isCurrentSelectionActive =
    backendSubscription?.isActive === true &&
    backendSubscription.productId === selectedPackage?.productIdentifier;

  const paywallFootnote = useMemo(() => {
    if (!selectedPackage) {
      return "El offering seleccionado no tiene este ciclo configurado en RevenueCat.";
    }

    if (selectedPackage.introPrice) {
      return `Oferta introductoria disponible desde ${selectedPackage.introPrice}, segun elegibilidad de la tienda.`;
    }

    return "La compra, cancelacion y cambios de plan se gestionan desde RevenueCat Customer Center o tu tienda.";
  }, [selectedPackage]);

  const ctaLabel = useMemo(() => {
    if (isPurchasing) {
      return "Procesando...";
    }

    if (!selectedPackage) {
      return "Plan no disponible";
    }

    if (isCurrentSelectionActive) {
      return "Plan actual";
    }

    return hasPremiumAccess ? "Cambiar plan" : "Suscribirme";
  }, [hasPremiumAccess, isCurrentSelectionActive, isPurchasing, selectedPackage]);

  const handleSubscribe = async () => {
    if (!selectedPackage) {
      Alert.alert(
        "Plan no disponible",
        "El ciclo seleccionado no existe en los offerings configurados en RevenueCat."
      );
      return;
    }

    try {
      const nextSubscription = await purchasePackage(
        selectedPlanType,
        billingCycle
      );

      if (nextSubscription?.isActive) {
        navigation.navigate("SubscriptionDetails");
      }
    } catch (purchaseError) {
      if (purchaseError instanceof Error) {
        Alert.alert("Compra no completada", purchaseError.message);
      }
    }
  };

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
      <YStack position="absolute" top={insets.top + 10} left={20} zIndex={100}>
        <Button
          circular
          size="$3"
          chromeless
          backgroundColor="rgba(255,255,255,0.08)"
          icon={ChevronLeft}
          onPress={() => navigation.goBack()}
          color="$color"
        />
      </YStack>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 320 }}
        paddingTop={insets.top + 60}
      >
        <YStack paddingHorizontal="$4" marginBottom="$6" space="$4">
          <DisplayHeading
            fontSize="$9"
            fontWeight="400"
            color="$color"
            lineHeight={40}
          >
            {hasPremiumAccess ? (
              <Text>
                Gestiona tu <Text color="#F59E0B">WouFinance Pro</Text>
              </Text>
            ) : (
              <Text>
                Desbloquea <Text color="#F59E0B">WouFinance Pro</Text>
              </Text>
            )}
          </DisplayHeading>

          <Text color="$gray11" fontSize={15} lineHeight={22}>
            El backend sigue siendo la fuente de verdad. RevenueCat se usa para
            offerings, compras, restauraciones y Customer Center.
          </Text>

          <PlanStatusCard
            subscription={backendSubscription}
            familyRole={familyRole}
            dateLabel={expiresLabel ?? undefined}
          />

          {error ? (
            <YStack
              backgroundColor="$red2"
              borderColor="$red6"
              borderWidth={1}
              borderRadius="$5"
              padding="$3"
            >
              <Text color="$red10" fontSize={13}>
                {error}
              </Text>
            </YStack>
          ) : null}

          <XStack space="$3">
            <Button
              flex={1}
              size="$4"
              variant="outlined"
              icon={RefreshCcw}
              onPress={() =>
                refresh({
                  reason: "manual_refresh_from_paywall",
                  refreshOfferings: true,
                  refreshCustomerInfo: true,
                }).catch(() => undefined)
              }
              disabled={isRefreshing || isInitializing}
            >
              {isRefreshing ? "Actualizando..." : "Actualizar estado"}
            </Button>

            {hasManageSubscription ? (
              <Button
                flex={1}
                size="$4"
                variant="outlined"
                icon={Settings2}
                onPress={handleManage}
              >
                Gestionar
              </Button>
            ) : null}
          </XStack>
        </YStack>

        <XStack
          paddingHorizontal="$4"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text color="$gray11" fontWeight="700">
            Elige tu plan
          </Text>
          <Text
            color="#F59E0B"
            fontWeight="700"
            textDecorationLine="underline"
            onPress={() => {
              if (scrollViewRef.current && comparisonLayoutY) {
                scrollViewRef.current.scrollTo({
                  y: comparisonLayoutY,
                  animated: true,
                });
              }
            }}
          >
            Comparar
          </Text>
        </XStack>

        <YStack paddingHorizontal="$4">
          {(["PRO", "FAMILY"] as SubscriptionProductKind[]).map((planType) => {
            const planOffering = offerings[planType];
            const planPrice =
              billingCycle === "MONTHLY"
                ? planOffering?.monthly?.priceString ?? "--"
                : planOffering?.yearly?.priceString ?? "--";

            return (
              <SubscriptionCard
                key={planType}
                title={PLAN_COPY[planType].title}
                description={PLAN_COPY[planType].description}
                price={planPrice}
                period={billingCycle === "MONTHLY" ? " / mes" : " / ano"}
                isSelected={selectedPlanType === planType}
                onSelect={() => setSelectedPlanType(planType)}
                isBestValue={planType === "FAMILY"}
                badgeText={PLAN_COPY[planType].badgeText}
                highlights={PLAN_COPY[planType].highlights}
                footnote={
                  planOffering
                    ? null
                    : "Offering ausente. Revisa EXPO_PUBLIC_REVENUECAT_*_OFFERING_ID."
                }
              />
            );
          })}
        </YStack>

        <YStack
          paddingHorizontal={0}
          onLayout={(event) => {
            setComparisonLayoutY(event.nativeEvent.layout.y);
          }}
        >
          <Text
            fontSize="$6"
            fontWeight="800"
            color="$color"
            marginBottom="$4"
            textAlign="center"
            marginTop="$6"
          >
            Comparativa de funciones
          </Text>

          <YStack paddingHorizontal="$2">
            <ComparisonTable
              planType={selectedPlanType === "FAMILY" ? "FAMILY" : "INDIVIDUAL"}
            />
          </YStack>
        </YStack>

        <Text
          textAlign="center"
          color="$gray8"
          fontSize={11}
          marginTop="$4"
          paddingHorizontal="$6"
        >
          {paywallFootnote}
        </Text>
      </ScrollView>

      <YStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        paddingBottom={insets.bottom + 10}
        backgroundColor="$background"
        borderTopWidth={1}
        borderColor="$borderColor"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        shadowColor="$shadowColor"
        shadowRadius={20}
        shadowOpacity={0.15}
      >
        <XStack space="$3" marginBottom="$3">
          <PricingCard
            title="Mensual"
            price={monthlyPrice}
            period="mes"
            isSelected={billingCycle === "MONTHLY"}
            onSelect={() => setBillingCycle("MONTHLY")}
          />

          <PricingCard
            title="Anual"
            price={yearlyPrice}
            period="ano"
            isSelected={billingCycle === "YEARLY"}
            onSelect={() => setBillingCycle("YEARLY")}
            badge={selectedOffering?.yearly ? "Disponible" : undefined}
            saveLabel={
              selectedOffering?.yearly && selectedOffering?.monthly
                ? "Mejor precio"
                : undefined
            }
          />
        </XStack>

        <Button
          size="$5"
          backgroundColor="#F59E0B"
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
          onPress={handleSubscribe}
          disabled={
            isInitializing ||
            isPurchasing ||
            isCurrentSelectionActive ||
            selectedPackage === null
          }
          borderRadius="$8"
          icon={isPurchasing ? undefined : <Crown size={18} color="#111827" />}
        >
          <Text color="#111827" fontWeight="800" fontSize="$4">
            {ctaLabel}
          </Text>
        </Button>

        <XStack justifyContent="space-between" marginTop="$3">
          <Button
            size="$3"
            chromeless
            onPress={handleRestore}
            disabled={isRestoring || isPurchasing}
          >
            {isRestoring ? "Restaurando..." : "Restaurar compras"}
          </Button>

          {backendSubscription?.isActive ? (
            <Button
              size="$3"
              chromeless
              onPress={() => navigation.navigate("SubscriptionDetails")}
            >
              Ver detalles
            </Button>
          ) : null}
        </XStack>
      </YStack>
    </YStack>
  );
}
