import React, { useCallback, useMemo, useState } from "react";
import { Pressable, ScrollView } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Stack,
  Circle,
  Spinner,
  useThemeName,
} from "tamagui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";
import {
  Mail,
  Receipt,
  Banknote,
  ArrowRightLeft,
  ChevronRight,
} from "@tamagui/lucide-icons";
import { BankingActions } from "../../actions/bankingActions";

const LIMIT = 20;

const getCountLabel = (count: number) =>
  count >= LIMIT ? `${LIMIT}+` : String(count);

export const HomePriorityRail = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const loadPending = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await BankingActions.listCandidates({
        status: "PENDING",
        source: "FORWARDED_EMAIL",
        limit: LIMIT,
      });
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      setPendingCount(list.length);
    } catch (error) {
      console.error("Error cargando pendientes", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPending();
    }, [loadPending]),
  );

  const cards = useMemo(
    () => [
      {
        id: "pending",
        title: "Pendientes",
        subtitle: pendingCount > 0 ? "por revisar" : "Todo al día",
        accent: isDark ? "#FDBA74" : "#EA580C",
        gradient: isDark ? ["#3B251A", "#23160F"] : ["#FFE7D6", "#FFF7ED"],
        icon: Mail,
        badge: isLoading ? "…" : getCountLabel(pendingCount),
        route: () => navigation.navigate("Movements", { tab: "PENDING" }),
        primary: true,
      },
      {
        id: "expense",
        title: "Nuevo gasto",
        subtitle: "Registrar salida",
        accent: isDark ? "#FCA5A5" : "#EF4444",
        gradient: isDark ? ["#3B1C22", "#24151A"] : ["#FEE2E2", "#FFF1F2"],
        icon: Receipt,
        route: () => navigation.navigate("AddExpense"),
      },
      {
        id: "income",
        title: "Nuevo ingreso",
        subtitle: "Sumar entrada",
        accent: isDark ? "#86EFAC" : "#16A34A",
        gradient: isDark ? ["#1C2F25", "#15221C"] : ["#DCFCE7", "#F0FDF4"],
        icon: Banknote,
        route: () => navigation.navigate("AddIncome"),
      },
      {
        id: "transfer",
        title: "Transferir",
        subtitle: "Entre cuentas",
        accent: isDark ? "#93C5FD" : "#2563EB",
        gradient: isDark ? ["#1E2A44", "#182134"] : ["#DBEAFE", "#EFF6FF"],
        icon: ArrowRightLeft,
        route: () => navigation.navigate("AddTransfer"),
      },
    ],
    [navigation, pendingCount, isLoading, isDark],
  );
  const subtitleColor = isDark ? "#E2E8F0" : "#1F2937";
  const chipBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.8)";
  const chipBorder = isDark
    ? "rgba(255,255,255,0.2)"
    : "rgba(255,255,255,0.6)";
  const badgeBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.8)";

  return (
    <YStack space="$3" marginBottom="$5">
      <XStack justifyContent="space-between" alignItems="center">
        <YStack>
          <Text fontSize="$5" fontWeight="800" color="$color">
            Centro de acción
          </Text>
          <Text fontSize={12} color="$gray10">
            Lo importante primero.
          </Text>
        </YStack>
        <XStack alignItems="center" space="$1">
          <Text fontSize={11} color="$gray9" fontWeight="600">
            Desliza
          </Text>
          <ChevronRight size={14} color="$gray8" />
        </XStack>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 0,
          paddingRight: 16,
          gap: 14,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const width = card.primary ? 250 : 210;
          return (
            <Pressable
              key={card.id}
              onPress={card.route}
              style={({ pressed }) => ({
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Stack
                width={width}
                height={132}
                borderRadius="$8"
                overflow="hidden"
                shadowColor={card.accent}
                shadowOpacity={card.primary ? 0.2 : 0.12}
                shadowRadius={12}
                shadowOffset={{ width: 0, height: 6 }}
                elevation={2}
              >
                <LinearGradient
                  colors={card.gradient}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
                <Stack
                  position="absolute"
                  top={-30}
                  right={-30}
                  width={90}
                  height={90}
                  borderRadius={45}
                  backgroundColor="rgba(255,255,255,0.6)"
                  opacity={0.6}
                />
                <YStack padding="$4" space="$2" flex={1}>
                  <XStack justifyContent="space-between" alignItems="center">
                    <Circle
                      size="$3.5"
                      backgroundColor={chipBg}
                      borderWidth={1}
                      borderColor={chipBorder}
                    >
                      <Icon size={18} color={card.accent} />
                    </Circle>
                    {card.badge && (
                      <XStack
                        paddingHorizontal="$2"
                        paddingVertical={2}
                        borderRadius="$8"
                        backgroundColor={badgeBg}
                      >
                        {isLoading && card.primary ? (
                          <Spinner size="small" color={card.accent} />
                        ) : (
                          <Text
                            fontSize={11}
                            fontWeight="800"
                            color={card.accent}
                          >
                            {card.badge}
                          </Text>
                        )}
                      </XStack>
                    )}
                  </XStack>

                  <YStack space="$1" marginTop="$2">
                    <Text fontSize="$5" fontWeight="800" color={card.accent}>
                      {card.title}
                    </Text>
                    <Text fontSize={12} color={subtitleColor}>
                      {card.subtitle}
                    </Text>
                  </YStack>
                </YStack>
              </Stack>
            </Pressable>
          );
        })}
      </ScrollView>
    </YStack>
  );
};
