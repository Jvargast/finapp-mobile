import { useMemo } from "react";
import { Pressable } from "react-native";
import { YStack, XStack, Text, Stack, Spinner, useThemeName } from "tamagui";
import { LinearGradient } from "@tamagui/linear-gradient";
import { ChevronRight } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useRecurringStore } from "../../stores/useRecurringStore";
import { formatMoney } from "../../utils/formatMoney";
import { RecurringGlyph } from "../recurring/RecurringGlyph";
import {
  getNextRunLabel,
  getRecurrenceLabel,
  isRecurringActive,
  sortRecurringByNextRun,
} from "../../utils/recurring";

export const HomeRecurringWidget = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const { recurring, isLoading } = useRecurringStore();

  const nextItem = useMemo(() => {
    if (recurring.length === 0) return null;
    const activeItems = recurring.filter(isRecurringActive);
    const sorted = sortRecurringByNextRun(activeItems);
    return sorted[0] || recurring[0] || null;
  }, [recurring]);

  const hasData = Boolean(nextItem);
  const isPaused = hasData && nextItem ? !isRecurringActive(nextItem) : false;
  const title = hasData ? "Próxima recurrente" : "Recurrentes";
  const name =
    nextItem?.name || nextItem?.description || nextItem?.merchant || "";
  const recurrenceLabel =
    hasData && nextItem
      ? isPaused
        ? "Pausada"
        : getRecurrenceLabel(nextItem)
      : "Primer paso";
  const nextLabel =
    hasData && nextItem ? getNextRunLabel(nextItem) : "Empieza en 1 minuto";

  const amountText =
    hasData && nextItem
      ? formatMoney(Number(nextItem.amount || 0), nextItem.currency || "CLP")
      : "";

  const accent = isDark ? "#2DD4BF" : "#0F766E";
  const muted = isDark ? "#B8DAD3" : "#335F57";
  const titleColor = isDark ? "#CCFBF1" : "#134E4A";
  const gradient = isDark ? ["#123532", "#0D2926"] : ["#CCFBF1", "#F0FDFA"];
  const chipBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.85)";
  const chipBorder = isDark ? "rgba(45,212,191,0.32)" : "rgba(15,118,110,0.18)";

  const amountColor =
    hasData && nextItem
      ? nextItem.type === "INCOME"
        ? isDark
          ? "#86EFAC"
          : "#16A34A"
        : isDark
          ? "#FCA5A5"
          : "#DC2626"
      : accent;

  const handlePress = () => {
    navigation.navigate("Recurring");
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Stack
        height={110}
        borderRadius="$8"
        overflow="hidden"
        shadowColor={accent}
        shadowOpacity={0.12}
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 5 }}
        marginBottom="$5"
      >
        <LinearGradient
          colors={gradient}
          start={[0, 0]}
          end={[1, 1]}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <Stack
          position="absolute"
          top={-26}
          right={-24}
          width={100}
          height={100}
          borderRadius={50}
          backgroundColor="rgba(255,255,255,0.4)"
          opacity={0.45}
        />

        <XStack padding="$4" alignItems="center" space="$3" flex={1}>
          <Stack
            width={44}
            height={44}
            borderRadius={14}
            alignItems="center"
            justifyContent="center"
            backgroundColor={chipBg}
            borderWidth={1}
            borderColor={chipBorder}
          >
            <RecurringGlyph stroke={accent} fill={accent} />
          </Stack>

          <YStack flex={1} space="$1">
            <Text fontSize={10} fontWeight="700" color={muted} letterSpacing={0.5}>
              {title.toUpperCase()}
            </Text>
            <Text fontSize="$4" fontWeight="800" color={titleColor} numberOfLines={1}>
              {hasData ? name || "Recurrencia" : "Programa tus pagos y cobros"}
            </Text>

            <XStack alignItems="center" space="$2" flexWrap="wrap">
              <XStack
                paddingHorizontal="$2"
                paddingVertical={2}
                borderRadius="$3"
                backgroundColor={chipBg}
                borderWidth={1}
                borderColor={chipBorder}
              >
                <Text fontSize={10} fontWeight="700" color={accent}>
                  {recurrenceLabel}
                </Text>
              </XStack>

              <Text fontSize={10} fontWeight="600" color={muted} numberOfLines={1}>
                {hasData ? `Próxima: ${nextLabel}` : nextLabel}
              </Text>
            </XStack>
          </YStack>

          <YStack alignItems="flex-end" justifyContent="center" space="$1">
            {isLoading && !hasData ? (
              <Spinner size="small" color={accent} />
            ) : (
              <Text fontSize="$4" fontWeight="800" color={amountColor}>
                {hasData ? amountText : ""}
              </Text>
            )}
            <ChevronRight size={16} color={muted} />
          </YStack>
        </XStack>
      </Stack>
    </Pressable>
  );
};
