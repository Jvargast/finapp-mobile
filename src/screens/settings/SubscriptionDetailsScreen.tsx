import React, { useState } from "react";
import { YStack, ScrollView, Text, Button, Spacer } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import {
  Calendar,
  CreditCard,
  History,
  Banknote,
  ChevronLeft,
} from "@tamagui/lucide-icons";
import { Alert } from "react-native";

import { useUserStore } from "../../stores/useUserStore";
import { PlanStatusCard } from "../../components/subscription/PlanStatusCard";
import { BillingRow } from "../../components/subscription/BillingRow";
import { DangerModal } from "../../components/ui/DangerModal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SubscriptionDetailsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useUserStore((state) => state.user);

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const planType =
    user?.plan === "PRO" ||
    user?.plan === "FAMILY_ADMIN" ||
    user?.plan === "FAMILY_MEMBER"
      ? user.plan
      : "PRO";

  const calculateIsYearly = () => {
    if (!user?.subscriptionExpiresAt) return false; 
    const today = new Date();
    const expiry = new Date(user.subscriptionExpiresAt);
    const diffTime = Math.abs(expiry.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 35;
  };
  const isYearly = calculateIsYearly();
  const cycleLabel = isYearly ? "Anual" : "Mensual";

  const getPriceLabel = () => {
    if (planType === "FAMILY_ADMIN") {
      return isYearly ? "$49.990 / año" : "$4.990 / mes";
    }
    return isYearly ? "$29.990 / año" : "$2.990 / mes";
  };
  console.log(planType);

  const expiresAt = user?.subscriptionExpiresAt
    ? new Date(user.subscriptionExpiresAt).toLocaleDateString("es-CL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "30 de Enero, 2026";

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCancelModalVisible(false);
      Alert.alert(
        "Suscripción Cancelada",
        "Tu suscripción no se renovará, pero mantendrás los beneficios hasta el final del periodo actual.",
        [{ text: "Entendido", onPress: () => navigation.goBack() }]
      );
    }, 1500);
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
        <Text fontSize="$8" fontWeight="900" color="$color">
          Tu Suscripción
        </Text>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$4" paddingBottom="$8" space="$6">
          <PlanStatusCard
            planType={planType}
            status="ACTIVE"
            renewsAt={expiresAt}
          />

          {planType !== "FAMILY_MEMBER" && (
            <YStack space="$2">
              <Text
                fontSize={13}
                fontWeight="700"
                color="$gray10"
                textTransform="uppercase"
                letterSpacing={1}
              >
                Detalles de Facturación
              </Text>

              <YStack
                backgroundColor="$gray2"
                borderRadius="$4"
                paddingHorizontal="$4"
                borderWidth={1}
                borderColor="$gray4"
              >
                <BillingRow
                  label="Próximo Pago"
                  value={expiresAt}
                  icon={Calendar}
                />

                <BillingRow
                  label="Monto"
                  value={getPriceLabel()}
                  icon={Banknote}
                />

                <BillingRow
                  label="Medio de Pago"
                  value="Apple Pay (**** 1234)"
                  icon={CreditCard}
                  hideSeparator
                />
              </YStack>
            </YStack>
          )}

          <YStack space="$2">
            <Text
              fontSize={13}
              fontWeight="700"
              color="$gray10"
              textTransform="uppercase"
              letterSpacing={1}
            >
              Gestión
            </Text>

            <YStack
              backgroundColor="$gray2"
              borderRadius="$4"
              paddingHorizontal="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <BillingRow
                label="Historial de Pagos"
                value="Ver"
                icon={History}
                onPress={() =>
                  Alert.alert(
                    "Próximamente",
                    "Aquí podrás ver tus boletas pasadas."
                  )
                }
              />

              {planType !== "FAMILY_MEMBER" && (
                <BillingRow
                  label="Plan Actual"
                  value={cycleLabel} // Aquí mostramos explícitamente el ciclo
                  onPress={() => navigation.navigate("Subscription")}
                />
              )}
            </YStack>
          </YStack>

          <Spacer size="$2" />

          {planType !== "FAMILY_MEMBER" && (
            <Button
              variant="outlined"
              borderColor="$red5"
              color="$red10"
              onPress={() => setCancelModalVisible(true)}
              pressStyle={{ backgroundColor: "$red2", opacity: 0.8 }}
            >
              Cancelar Suscripción
            </Button>
          )}

          <Text
            fontSize={11}
            color="$gray8"
            textAlign="center"
            paddingHorizontal="$6"
          >
            Si cancelas ahora, seguirás teniendo acceso Wou+ hasta el{" "}
            {expiresAt}.
          </Text>
        </YStack>
      </ScrollView>

      <DangerModal
        visible={cancelModalVisible}
        onClose={() => !isLoading && setCancelModalVisible(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isLoading}
        title="¿Cancelar Suscripción?"
        confirmText="Sí, cancelar beneficios"
        message={
          <Text fontSize={14} color="$colorQwerty" textAlign="center">
            Perderás acceso a las funciones{" "}
            <Text fontWeight="bold">Premium</Text> al finalizar tu ciclo actual.
            No se te volverá a cobrar.
          </Text>
        }
      />
    </YStack>
  );
}
