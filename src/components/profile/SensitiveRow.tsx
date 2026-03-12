import { YStack, XStack, Text, Button, Stack, useThemeName } from "tamagui";
import { Edit3, ShieldCheck, AlertTriangle } from "@tamagui/lucide-icons";

interface SensitiveRowProps {
  icon: any;
  label: string;
  value?: string | null;
  onEdit: () => void;
}

export const SensitiveRow = ({
  icon: Icon,
  label,
  value,
  onEdit,
}: SensitiveRowProps) => {
  const hasValue = !!value;
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const brandColor = "#4F46E5";
  const warningColor = "#C2410C";
  const actionColor = hasValue ? brandColor : warningColor;
  const actionBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.04)";
  const actionPressedBg = isDark
    ? "rgba(255,255,255,0.14)"
    : "rgba(15,23,42,0.08)";

  return (
    <YStack marginBottom="$2.5">
      <XStack
        paddingVertical="$2"
        alignItems="center"
        space="$3"
      >
        <Stack
          backgroundColor={hasValue ? "$appAccentSoft" : "$warningSoft"}
          width={42}
          height={42}
          borderRadius={14}
          alignItems="center"
          justifyContent="center"
        >
          <Icon size={18} color={actionColor} strokeWidth={2} />
        </Stack>

        <YStack flex={1} space="$0.5">
          <XStack alignItems="center" space="$2" flexWrap="wrap">
            <Text
              fontSize={11}
              color="$gray11"
              fontWeight="800"
              textTransform="uppercase"
              letterSpacing={0.9}
            >
              {label}
            </Text>
            <XStack
              alignItems="center"
              space="$1"
              paddingHorizontal="$2"
              paddingVertical={2}
              borderRadius={999}
              backgroundColor={hasValue ? "$successSoft" : "$warningSoft"}
            >
              {hasValue ? (
                <ShieldCheck size={10} color="#15803D" />
              ) : (
                <AlertTriangle size={10} color={warningColor} />
              )}
              <Text
                fontSize={10}
                color={hasValue ? "$appSuccess" : "$appWarning"}
                fontWeight="800"
                textTransform="uppercase"
                letterSpacing={0.5}
              >
                {hasValue ? "Verificado" : "Pendiente"}
              </Text>
            </XStack>
          </XStack>

          <Text
            fontSize={15}
            color={hasValue ? "$color" : "$gray9"}
            fontWeight="700"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {value || "No configurado"}
          </Text>
        </YStack>

        <Button
          unstyled
          onPress={onEdit}
          backgroundColor="transparent"
          borderRadius={999}
          pressStyle={{ opacity: 1, backgroundColor: "transparent" }}
        >
          <Stack
            width={34}
            height={34}
            borderRadius={999}
            alignItems="center"
            justifyContent="center"
            backgroundColor={actionBg}
            animation="quick"
            pressStyle={{ backgroundColor: actionPressedBg }}
          >
            <Edit3 size={15} color={actionColor} />
          </Stack>
        </Button>
      </XStack>
    </YStack>
  );
};
