import React, { useState, useRef } from "react";
import { ScrollView as RNScrollView } from "react-native";
import { ScrollView, YStack, XStack, Text, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Crown } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

import { SubscriptionCard } from "../../components/subscription/SubscriptionCard";
import { ComparisonTable } from "../../components/subscription/ComparisonTable";
import { SUBSCRIPTION_PRODUCTS } from "../../constants/subscriptionFeatures";
import { useSubscription } from "../../hooks/useSubscription";
import { UserActions } from "../../actions/userActions";
import { PricingCard } from "../../components/subscription/PricingCard";

export default function SubscriptionScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { isPro } = useSubscription();
  const scrollViewRef = useRef<RNScrollView>(null);
  const [tableLayoutY, setTableLayoutY] = useState(0);

  const [selectedTier, setSelectedTier] = useState<"INDIVIDUAL" | "FAMILY">(
    "INDIVIDUAL"
  );
  const [billingCycle, setBillingCycle] = useState<"MONTHLY" | "YEARLY">(
    "YEARLY"
  );
  const [isLoading, setIsLoading] = useState(false);

  const tierInfo = SUBSCRIPTION_PRODUCTS[selectedTier];
  const productDetails = tierInfo[billingCycle];

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      await UserActions.subscribe(productDetails.id);

      console.log("Transacción exitosa para:", productDetails.id);

      if (isPro) {
        alert(
          `¡Tu plan ha sido actualizado a ${tierInfo.title} correctamente!`
        );
      } else {
        alert(`¡Bienvenido a Wou+ ${tierInfo.title}!`);
      }

      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("No se pudo procesar la solicitud. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToTable = () => {
    if (scrollViewRef.current && tableLayoutY) {
      scrollViewRef.current.scrollTo({ y: tableLayoutY, animated: true });
    }
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack position="absolute" top={insets.top + 10} left={20} zIndex={100}>
        <Button
          circular
          size="$3"
          chromeless
          backgroundColor="rgba(255,255,255,0.1)"
          icon={ChevronLeft}
          onPress={() => navigation.goBack()}
          color="$white"
        />
      </YStack>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 360 }}
        paddingTop={insets.top + 60}
      >
        <YStack paddingHorizontal="$4" marginBottom="$6">
          <Text
            fontSize="$9"
            fontWeight="900"
            color="white"
            lineHeight={34}
            marginBottom="$2"
          >
            {isPro ? (
              <Text>
                Mejora tu plan <Text color="#F59E0B">Wou+</Text>
              </Text>
            ) : (
              <Text>
                Pruebe gratis <Text color="#F59E0B">Wou+</Text> y mucho más
              </Text>
            )}
          </Text>
        </YStack>

        <XStack
          paddingHorizontal="$4"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
        >
          <Text color="$gray11" fontWeight="600">
            Elija su plan
          </Text>
          <Text
            color="white"
            fontWeight="600"
            textDecorationLine="underline"
            onPress={scrollToTable}
          >
            Comparar
          </Text>
        </XStack>

        <YStack paddingHorizontal="$4">
          <SubscriptionCard
            title="Wou+ Individual"
            description="Automatización personal, IA y control total de tus finanzas."
            price={SUBSCRIPTION_PRODUCTS.INDIVIDUAL[billingCycle].price}
            period={SUBSCRIPTION_PRODUCTS.INDIVIDUAL[billingCycle].period}
            isSelected={selectedTier === "INDIVIDUAL"}
            onSelect={() => setSelectedTier("INDIVIDUAL")}
          />

          <SubscriptionCard
            title="Wou+ Familiar"
            description="Cuentas Premium para ti y hasta 5 miembros de tu familia."
            price={SUBSCRIPTION_PRODUCTS.FAMILY[billingCycle].price}
            period={SUBSCRIPTION_PRODUCTS.FAMILY[billingCycle].period}
            isSelected={selectedTier === "FAMILY"}
            onSelect={() => setSelectedTier("FAMILY")}
            isBestValue
          />
        </YStack>

        <YStack
          paddingHorizontal={0}
          onLayout={(event) => {
            setTableLayoutY(event.nativeEvent.layout.y);
          }}
        >
          <Text
            fontSize="$6"
            fontWeight="800"
            color="white"
            marginBottom="$4"
            textAlign="center"
            marginTop="$6"
          >
            Comparativa de funciones
          </Text>

          <YStack paddingHorizontal="$2">
            <ComparisonTable planType={selectedTier} />
          </YStack>
        </YStack>

        <Text
          textAlign="center"
          color="$gray8"
          fontSize={11}
          marginTop="$2"
          paddingHorizontal="$6"
        >
          Suscripción recurrente. Cancela en cualquier momento desde los
          ajustes.
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
        shadowOpacity={0.2}
        zIndex={100}
      >
        <XStack space="$3" marginBottom="$3">
          <PricingCard
            title="Mensual"
            price={SUBSCRIPTION_PRODUCTS[selectedTier].MONTHLY.price}
            period="mes"
            isSelected={billingCycle === "MONTHLY"}
            onSelect={() => setBillingCycle("MONTHLY")}
          />

          <PricingCard
            title="Anual"
            price={SUBSCRIPTION_PRODUCTS[selectedTier].YEARLY.price}
            period="año"
            isSelected={billingCycle === "YEARLY"}
            onSelect={() => setBillingCycle("YEARLY")}
            badge="-17% OFF"
            saveLabel="2 meses de regalo"
          />
        </XStack>

        <Button
          size="$4"
          backgroundColor="#F59E0B"
          pressStyle={{ opacity: 0.9, scale: 0.98 }}
          onPress={handleSubscribe}
          disabled={isLoading}
          animation="bouncy"
          borderRadius="$8"
          icon={isLoading ? undefined : <Crown size={18} color="$gray1" />}
        >
          <Text color="$gray1" fontWeight="800" fontSize="$4">
            {isLoading
              ? "Procesando..."
              : isPro
              ? "Actualizar mi Plan"
              : billingCycle === "YEARLY"
              ? "Iniciar Prueba de 7 Días"
              : "Suscribirme Ahora"}
          </Text>
        </Button>
      </YStack>
    </YStack>
  );
}
