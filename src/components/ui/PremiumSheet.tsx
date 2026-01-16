import React from "react";
import {
  Sheet,
  YStack,
  Text,
  Button,
  XStack,
  Circle,
} from "tamagui";
import {
  Crown,
  Check,
  X,
  TrendingUp,
  Download,
  Palette,
  Infinity as InfinityIcon,
} from "@tamagui/lucide-icons";

interface PremiumSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export const PremiumSheet = ({
  open,
  onOpenChange,
  title = "Sube de Nivel con WOU+",
  description = "Elimina los límites y toma el control total de tus finanzas.",
}: PremiumSheetProps) => {
  const BG_COLOR = "#1E293B"; 
  const ACCENT_COLOR = "#F59E0B"; 
  const TEXT_PRIMARY = "white";
  const TEXT_SECONDARY = "#94A3B8"; 

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[70]} 
      dismissOnSnapToBottom
      zIndex={200_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
        backgroundColor="rgba(0,0,0,0.8)" 
      />
      <Sheet.Handle backgroundColor="#334155" opacity={1} />

      <Sheet.Frame
        padding="$5"
        backgroundColor={BG_COLOR} 
        borderTopLeftRadius="$9"
        borderTopRightRadius="$9"
        space="$4"
      >
        <Button
          position="absolute"
          top={10}
          right={10}
          size="$2"
          circular
          chromeless
          icon={<X color={TEXT_SECONDARY} />}
          onPress={() => onOpenChange(false)}
          zIndex={10}
        />

        <YStack alignItems="center" space="$2" marginTop="$2">
          <Circle
            size={70}
            backgroundColor="rgba(245, 158, 11, 0.15)" 
            borderWidth={1}
            borderColor={ACCENT_COLOR}
          >
            <Crown size={36} color={ACCENT_COLOR} />
          </Circle>

          <Text
            fontSize="$7"
            fontWeight="900"
            textAlign="center"
            color={TEXT_PRIMARY}
            marginTop="$2"
          >
            WOU<Text color={ACCENT_COLOR}>+</Text>
          </Text>
          <Text
            fontSize="$3"
            color={TEXT_SECONDARY}
            textAlign="center"
            paddingHorizontal="$4"
            lineHeight={20}
          >
            {description}
          </Text>
        </YStack>

        <YStack
          space="$3"
          backgroundColor="rgba(255,255,255,0.05)" 
          padding="$4"
          borderRadius="$6"
          borderWidth={1}
          borderColor="rgba(255,255,255,0.05)"
          marginBottom="$2"
        >
          <FeatureRow
            icon={InfinityIcon}
            label="Cuentas Ilimitadas"
            sublabel="Agrega todos tus bancos y tarjetas."
            color={ACCENT_COLOR}
            textColor={TEXT_PRIMARY}
            subTextColor={TEXT_SECONDARY}
          />
          <FeatureRow
            icon={TrendingUp}
            label="Proyecciones con IA"
            sublabel="Anticípate a tus gastos futuros."
            color={ACCENT_COLOR}
            textColor={TEXT_PRIMARY}
            subTextColor={TEXT_SECONDARY}
          />
          <FeatureRow
            icon={Palette}
            label="Skins Premium"
            sublabel="Personaliza con Gold, Neón y Dark."
            color={ACCENT_COLOR}
            textColor={TEXT_PRIMARY}
            subTextColor={TEXT_SECONDARY}
          />
          <FeatureRow
            icon={Download}
            label="Exportar Datos"
            sublabel="Descarga en Excel para tu control."
            color={ACCENT_COLOR}
            textColor={TEXT_PRIMARY}
            subTextColor={TEXT_SECONDARY}
          />
        </YStack>

        <YStack space="$2">
          <Button
            size="$5"
            backgroundColor={ACCENT_COLOR}
            pressStyle={{ opacity: 0.9, scale: 0.98 }}
            animation="quick"
            color="#1E293B" 
            fontWeight="900"
            borderRadius="$10"
            icon={<Crown size={18} color="#1E293B" />}
            onPress={() => {
              onOpenChange(false);
              console.log("Iniciar checkout");
            }}
          >
            Mejorar a PRO
          </Button>
          <Text fontSize={10} color={TEXT_SECONDARY} textAlign="center">
            Cancela cuando quieras. Sin compromisos.
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
  textColor,
  subTextColor,
}: any) => (
  <XStack space="$3" alignItems="center">
    <YStack
      backgroundColor="rgba(245, 158, 11, 0.1)"
      padding="$2"
      borderRadius="$4"
    >
      <Icon size={18} color={color} />
    </YStack>
    <YStack flex={1}>
      <Text fontSize={13} fontWeight="700" color={textColor}>
        {label}
      </Text>
      <Text fontSize={11} color={subTextColor}>
        {sublabel}
      </Text>
    </YStack>
    <Check size={14} color={color} opacity={0.8} />
  </XStack>
);
