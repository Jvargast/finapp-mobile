import {
  YStack,
  XStack,
  Text,
  Button,
  Stack,
  Separator,
  useThemeName,
} from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";

interface InfoRowProps {
  icon: any;
  label: string;
  value?: string | null;
  onEdit?: () => void;
  isLast?: boolean;
}

export const InfoRow = ({
  icon: Icon,
  label,
  value,
  onEdit,
  isLast = false,
}: InfoRowProps) => {
  const isEditable = !!onEdit;
  const hasValue = !!value;
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const accentColor = "#4F46E5";
  const iconColor = hasValue ? accentColor : "#94A3B8";
  const pressOverlay = isDark
    ? "rgba(255,255,255,0.05)"
    : "rgba(15,23,42,0.04)";

  return (
    <YStack>
      <Button
        unstyled
        onPress={onEdit}
        disabled={!isEditable}
        backgroundColor="transparent"
        paddingVertical="$3.5"
        paddingHorizontal="$4"
        animation="quick"
        pressStyle={{
          scale: 0.985,
          opacity: 1,
          backgroundColor: pressOverlay,
        }}
      >
        <XStack alignItems="center" space="$3.5">
          <Stack
            backgroundColor={isEditable ? "$appAccentSoft" : "$appPage"}
            width={42}
            height={42}
            borderRadius={14}
            alignItems="center"
            justifyContent="center"
          >
            <Icon size={18} color={iconColor} strokeWidth={2} />
          </Stack>

          <YStack flex={1} space="$0.5">
            <Text
              fontSize={11}
              color="$gray11"
              fontWeight="800"
              letterSpacing={0.9}
              textTransform="uppercase"
            >
              {label}
            </Text>

            <Text
              fontSize={15}
              color={hasValue ? "$color" : "$gray9"}
              fontWeight="700"
              numberOfLines={1}
            >
              {value || "No registrado"}
            </Text>
          </YStack>

          {isEditable ? (
            <XStack alignItems="center" space="$1">
              <Text fontSize={11} fontWeight="800" color={accentColor}>
                Editar
              </Text>
              <ChevronRight size={14} color={accentColor} />
            </XStack>
          ) : null}
        </XStack>
      </Button>
      {!isLast ? <Separator borderColor="$appBorder" marginLeft={58} /> : null}
    </YStack>
  );
};
