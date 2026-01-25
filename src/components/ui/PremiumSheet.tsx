import React from "react";
import {
  Sheet,
  YStack,
  Text,
  Button,
  XStack,
  Circle,
  Separator,
} from "tamagui";
import {
  Crown,
  Check,
  X,
  Users,
  Zap,
  Shield,
  LayoutDashboard,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

interface PremiumSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const PremiumSheet = ({
  open,
  onOpenChange,
  title = "Mejora tu experiencia",
  description = "Esa función y muchas más están disponibles exclusivamente en Wou+.",
}: PremiumSheetProps) => {
  const ACCENT_COLOR = "#F59E0B";
  const navigation = useNavigation<any>();

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[73]}
      dismissOnSnapToBottom
      zIndex={200_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.85)"
      />
      <Sheet.Handle backgroundColor="$gray8" opacity={0.5} />

      <Sheet.Frame
        padding="$5"
        backgroundColor="$background"
        borderTopLeftRadius="$9"
        borderTopRightRadius="$9"
        borderWidth={1}
        borderColor="$borderColor"
        space="$4"
      >
        <Button
          position="absolute"
          top={15}
          right={15}
          size="$2"
          circular
          chromeless
          icon={<X color="$gray10" />}
          onPress={() => onOpenChange(false)}
          zIndex={10}
        />

        <YStack alignItems="center" space="$2" marginTop="$2">
          <Circle
            size={70}
            backgroundColor="rgba(245, 158, 11, 0.1)"
            borderWidth={1}
            borderColor={ACCENT_COLOR}
            shadowColor={ACCENT_COLOR}
            shadowRadius={10}
            shadowOpacity={0.2}
          >
            <Crown size={32} color={ACCENT_COLOR} />
          </Circle>

          <Text
            fontSize="$8"
            fontWeight="900"
            textAlign="center"
            color="$color"
            marginTop="$2"
          >
            Desbloquea <Text color={ACCENT_COLOR}>Wou+</Text>
          </Text>
          <Text
            fontSize="$2"
            color="$gray10"
            textAlign="center"
            paddingHorizontal="$4"
            lineHeight={20}
          >
            {description}
          </Text>
        </YStack>

        <YStack
          backgroundColor="$gray2"
          padding="$3"
          borderRadius="$6"
          borderWidth={1}
          borderColor="$gray4"
          space="$3"
        >
          <FeatureRow
            icon={LayoutDashboard}
            label="Sin Límites"
            sublabel="Cuentas ilimitadas, categorías custom y exportación."
            color={ACCENT_COLOR}
          />
          <FeatureRow
            icon={Users}
            label="Modo Pareja o Familia"
            sublabel="Comparte con tu pareja o crea un grupo familiar."
            color={ACCENT_COLOR}
          />
          <FeatureRow
            icon={Zap}
            label="Inteligencia Artificial"
            sublabel="Proyección de saldo, Wou Score y alertas."
            color={ACCENT_COLOR}
          />
          <FeatureRow
            icon={Shield}
            label="Privacidad Total"
            sublabel="Modo Discreto (Shake-to-hide) y Sin Anuncios."
            color={ACCENT_COLOR}
          />
        </YStack>

        <YStack space="$3" marginTop="$4" marginBottom="$4">
          <Button
            size="$5"
            backgroundColor={ACCENT_COLOR}
            pressStyle={{ opacity: 0.9 }}
            borderRadius="$10"
            onPressIn={() => {
              onOpenChange(false);
              navigation.navigate("Subscription");
            }}
          >
            <Text color="$gray1" fontWeight="900" fontSize="$4">
              Ver Planes y Ofertas
            </Text>
          </Button>

          <Text fontSize={11} color="$gray9" textAlign="center">
            Desde $2.990/mes. Cancela cuando quieras.
          </Text>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

const FeatureRow = ({
  icon: Icon,
  label,
  sublabel,
  color,
}: {
  icon: any;
  label: string;
  sublabel: string;
  color: string;
}) => (
  <XStack space="$3" alignItems="center">
    <YStack
      backgroundColor="rgba(245, 158, 11, 0.1)"
      padding="$2"
      borderRadius="$4"
    >
      <Icon size={18} color={color} />
    </YStack>
    <YStack flex={1}>
      <Text fontSize={13} fontWeight="700" color="$color">
        {label}
      </Text>
      <Text fontSize={11} color="$gray10" numberOfLines={1}>
        {sublabel}
      </Text>
    </YStack>
    <Check size={16} color={color} />
  </XStack>
);
