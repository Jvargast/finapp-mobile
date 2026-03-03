import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView as RNScrollView,
} from "react-native";
import {
  YStack,
  XStack,
  Text,
  Stack,
  Progress,
  Spinner,
  useThemeName,
} from "tamagui";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  PiggyBank,
  CreditCard,
  Home,
  ShieldCheck,
  TrendingUp,
  Briefcase,
} from "@tamagui/lucide-icons";
import { LinearGradient } from "@tamagui/linear-gradient";
import { useMyGoals } from "../../hooks/useMyGoals";
import { GoalType } from "../../types/goal.types";
import { useUserStore } from "../../stores/useUserStore";
import { formatGoalAmount } from "../../utils/formatMoney";
import { useBudgetStore } from "../../stores/useBudgetStore";
import { BudgetActions } from "../../actions/budgetActions";
import { getIcon } from "../../utils/iconMap";

const MAX_GOAL_SLIDES = 6;

const MAIN_GOAL_TO_TYPE: Record<string, GoalType> = {
  save: GoalType.SAVING,
  debt: GoalType.DEBT,
  invest: GoalType.INVESTMENT,
  house: GoalType.HOUSING,
  control: GoalType.CONTROL,
  retire: GoalType.RETIREMENT,
};

const GOAL_VISUALS: Record<
  GoalType,
  {
    label: string;
    icon: any;
    lightColors: [string, string];
    darkColors: [string, string];
    lightAccent: string;
    darkAccent: string;
  }
> = {
  [GoalType.SAVING]: {
    label: "Ahorro",
    icon: PiggyBank,
    lightColors: ["#DCFCE7", "#F0FDF4"],
    darkColors: ["#1B2F22", "#14251B"],
    lightAccent: "#16A34A",
    darkAccent: "#86EFAC",
  },
  [GoalType.DEBT]: {
    label: "Deuda",
    icon: CreditCard,
    lightColors: ["#FEE2E2", "#FFF1F2"],
    darkColors: ["#3B1C22", "#24151A"],
    lightAccent: "#EF4444",
    darkAccent: "#FCA5A5",
  },
  [GoalType.INVESTMENT]: {
    label: "Inversión",
    icon: TrendingUp,
    lightColors: ["#EDE9FE", "#F5F3FF"],
    darkColors: ["#2D2044", "#1F1730"],
    lightAccent: "#7C3AED",
    darkAccent: "#C4B5FD",
  },
  [GoalType.HOUSING]: {
    label: "Vivienda",
    icon: Home,
    lightColors: ["#DBEAFE", "#EFF6FF"],
    darkColors: ["#1E2A44", "#182134"],
    lightAccent: "#2563EB",
    darkAccent: "#93C5FD",
  },
  [GoalType.CONTROL]: {
    label: "Control",
    icon: ShieldCheck,
    lightColors: ["#FFEDD5", "#FFF7ED"],
    darkColors: ["#3A2718", "#261A10"],
    lightAccent: "#EA580C",
    darkAccent: "#FDBA74",
  },
  [GoalType.RETIREMENT]: {
    label: "Retiro",
    icon: Briefcase,
    lightColors: ["#E2E8F0", "#F8FAFC"],
    darkColors: ["#273244", "#1A2230"],
    lightAccent: "#475569",
    darkAccent: "#CBD5E1",
  },
};

const hexToRgba = (hex: string, alpha: number, fallback: string) => {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return fallback;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const HomeGoalsBudgetRow = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const { goals, isLoading } = useMyGoals();
  const { budgets, isLoading: isBudgetsLoading } = useBudgetStore();
  const mainGoalPreference = useUserStore(
    (state) => state.user?.preferences?.mainGoal || "save"
  );

  const [goalsCardWidth, setGoalsCardWidth] = useState(0);
  const [activeGoalIndex, setActiveGoalIndex] = useState(0);
  const [budgetsCardWidth, setBudgetsCardWidth] = useState(0);
  const [activeBudgetIndex, setActiveBudgetIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      BudgetActions.loadBudgets();
    }, [])
  );

  const mainGoalType =
    MAIN_GOAL_TO_TYPE[mainGoalPreference] || GoalType.SAVING;

  const goalSlides = useMemo(() => {
    const sorted = [...goals].sort((a, b) => {
      const aPriority = a.type === mainGoalType ? 1 : 0;
      const bPriority = b.type === mainGoalType ? 1 : 0;
      return bPriority - aPriority;
    });
    return sorted.slice(0, MAX_GOAL_SLIDES);
  }, [goals, mainGoalType]);

  useEffect(() => {
    if (activeGoalIndex <= goalSlides.length - 1) return;
    setActiveGoalIndex(0);
  }, [activeGoalIndex, goalSlides.length]);

  const handleGoalScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!goalsCardWidth || goalSlides.length === 0) return;
      const x = event.nativeEvent.contentOffset.x;
      const index = Math.round(x / goalsCardWidth);
      const safeIndex = Math.max(0, Math.min(goalSlides.length - 1, index));
      setActiveGoalIndex(safeIndex);
    },
    [goalSlides.length, goalsCardWidth]
  );

  const budgetSlides = useMemo(() => {
    const sorted = [...budgets].sort((a, b) => {
      const aOver = a.progress.percentage >= 100 ? 1 : 0;
      const bOver = b.progress.percentage >= 100 ? 1 : 0;
      if (aOver !== bOver) return bOver - aOver;
      return b.progress.percentage - a.progress.percentage;
    });
    return sorted.slice(0, MAX_GOAL_SLIDES);
  }, [budgets]);

  useEffect(() => {
    if (activeBudgetIndex <= budgetSlides.length - 1) return;
    setActiveBudgetIndex(0);
  }, [activeBudgetIndex, budgetSlides.length]);

  const handleBudgetScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!budgetsCardWidth || budgetSlides.length === 0) return;
      const x = event.nativeEvent.contentOffset.x;
      const index = Math.round(x / budgetsCardWidth);
      const safeIndex = Math.max(0, Math.min(budgetSlides.length - 1, index));
      setActiveBudgetIndex(safeIndex);
    },
    [budgetSlides.length, budgetsCardWidth]
  );

  const getBudgetStatus = (percent: number, warningThreshold: number) => {
    if (percent >= 100) {
      return {
        indicatorColor: "#EF4444",
        progressColor: "#EF4444",
      };
    }
    if (percent >= warningThreshold) {
      return {
        indicatorColor: "#F97316",
        progressColor: "#F97316",
      };
    }
    return {
      indicatorColor: "#22C55E",
      progressColor: "#22C55E",
    };
  };

  const formatBudgetMoney = (amount: number, currency: string) =>
    new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "CLP" ? 0 : 2,
    }).format(amount);

  const subtitleColor = isDark ? "#CBD5E1" : "#6B7280";

  return (
    <YStack marginBottom="$5" space="$3">
      <XStack space="$3" alignItems="flex-start">
        <YStack flex={1} space="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              flex={1}
              minWidth={0}
              numberOfLines={1}
              paddingRight="$2"
              fontSize="$4"
              fontWeight="800"
              color={isDark ? "#DDD6FE" : "#6D28D9"}
            >
              Metas
            </Text>
            <Pressable onPress={() => navigation.navigate("Goals")}>
              <Text
                fontSize={11}
                fontWeight="700"
                color={isDark ? "#C4B5FD" : "#7C3AED"}
              >
                Ver todas
              </Text>
            </Pressable>
          </XStack>

          <Stack
            height={160}
            borderRadius="$8"
            overflow="hidden"
            onLayout={(event) =>
              setGoalsCardWidth(Math.round(event.nativeEvent.layout.width))
            }
          >
            {isLoading ? (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <LinearGradient
                  colors={isDark ? ["#2C1E3C", "#20172D"] : ["#F3E8FF", "#EDE9FE"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
                <Spinner size="small" color={isDark ? "#C4B5FD" : "#7C3AED"} />
              </YStack>
            ) : goalSlides.length === 0 ? (
              <Pressable
                onPress={() => navigation.navigate("Goals")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  flex: 1,
                })}
              >
                <LinearGradient
                  colors={isDark ? ["#2C1E3C", "#20172D"] : ["#F3E8FF", "#EDE9FE"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
                <YStack flex={1} justifyContent="center" padding="$4" space="$1.5">
                  <Text
                    fontSize={13}
                    fontWeight="700"
                    color={isDark ? "#E9D5FF" : "#4C1D95"}
                  >
                    Crea tu primera meta
                  </Text>
                  <Text fontSize={11} color={subtitleColor}>
                    Tu objetivo financiero aparecerá primero aquí.
                  </Text>
                </YStack>
              </Pressable>
            ) : (
              <RNScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleGoalScrollEnd}
                bounces={false}
                decelerationRate="fast"
              >
                {goalSlides.map((goal, index) => {
                  const visual =
                    GOAL_VISUALS[goal.type] || GOAL_VISUALS[GoalType.SAVING];
                  const Icon = visual.icon;
                  const accent = isDark ? visual.darkAccent : visual.lightAccent;
                  const bg = isDark ? visual.darkColors : visual.lightColors;
                  const target = Number(goal.targetAmount || 0);
                  const current = Number(goal.currentAmount || 0);
                  const progress =
                    target > 0 ? Math.min((current / target) * 100, 100) : 0;
                  const isPrioritySlide =
                    index === 0 && goal.type === mainGoalType;

                  return (
                    <Pressable
                      key={goal.id}
                      onPress={() =>
                        navigation.navigate("GoalDetail", {
                          goalId: goal.id,
                          goal,
                        })
                      }
                      style={({ pressed }) => ({
                        width: goalsCardWidth || 220,
                        height: 160,
                        opacity: pressed ? 0.92 : 1,
                      })}
                    >
                      <LinearGradient
                        colors={bg}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={{ position: "absolute", width: "100%", height: "100%" }}
                      />

                      <Stack
                        position="absolute"
                        top={-28}
                        right={-18}
                        width={100}
                        height={100}
                        borderRadius={50}
                        backgroundColor={isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.5)"}
                      />

                      <YStack flex={1} justifyContent="space-between" padding="$3.5">
                        <XStack justifyContent="space-between" alignItems="flex-start">
                          <XStack
                            space="$2"
                            alignItems="center"
                            flex={1}
                            minWidth={0}
                            paddingRight="$2"
                          >
                            <Stack
                              width={24}
                              height={24}
                              borderRadius={12}
                              alignItems="center"
                              justifyContent="center"
                              backgroundColor={isDark ? "rgba(15,23,42,0.55)" : "rgba(255,255,255,0.8)"}
                            >
                              <Icon size={13} color={accent} />
                            </Stack>
                            <Text
                              fontSize={11}
                              fontWeight="700"
                              color={isDark ? "#E2E8F0" : "#374151"}
                            >
                              {visual.label}
                            </Text>
                          </XStack>
                          {isPrioritySlide && (
                            <XStack
                              paddingHorizontal={6}
                              paddingVertical={3}
                              borderRadius={999}
                              backgroundColor={isDark ? "rgba(15,23,42,0.45)" : "rgba(255,255,255,0.65)"}
                            >
                              <Text
                                fontSize={9}
                                fontWeight="800"
                                color={isDark ? "#DDD6FE" : "#6D28D9"}
                              >
                                OBJ.
                              </Text>
                            </XStack>
                          )}
                        </XStack>

                        <YStack space="$2">
                          <Text
                            fontSize="$5"
                            fontWeight="900"
                            color={isDark ? "#FFFFFF" : "#111827"}
                            numberOfLines={2}
                            lineHeight={24}
                          >
                            {goal.name}
                          </Text>
                          <XStack justifyContent="space-between" alignItems="center">
                            <Text
                              fontSize={11}
                              color={isDark ? "rgba(255,255,255,0.88)" : "#334155"}
                              fontWeight="600"
                            >
                              {formatGoalAmount(current, goal.currency)}
                            </Text>
                            <Text
                              fontSize={11}
                              color={isDark ? "rgba(255,255,255,0.88)" : "#334155"}
                              fontWeight="600"
                            >
                              {formatGoalAmount(target, goal.currency)}
                            </Text>
                          </XStack>
                          <Progress
                            value={progress}
                            height={6}
                            backgroundColor={isDark ? "rgba(15,23,42,0.35)" : "rgba(15,23,42,0.12)"}
                          >
                            <Progress.Indicator
                              animation="bouncy"
                              backgroundColor={accent}
                            />
                          </Progress>
                          <Text
                            fontSize={10}
                            fontWeight="800"
                            color={isDark ? "#F8FAFC" : "#1F2937"}
                          >
                            {Math.round(progress)}% completado
                          </Text>
                        </YStack>
                      </YStack>
                    </Pressable>
                  );
                })}
              </RNScrollView>
            )}
          </Stack>

          {goalSlides.length > 1 && !isLoading && (
            <XStack justifyContent="center" space="$1.5" paddingTop="$0.5">
              {goalSlides.map((goal, index) => (
                <Stack
                  key={goal.id}
                  width={activeGoalIndex === index ? 16 : 6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={
                    activeGoalIndex === index
                      ? isDark
                        ? "#C4B5FD"
                        : "#7C3AED"
                      : isDark
                      ? "rgba(196,181,253,0.3)"
                      : "rgba(124,58,237,0.28)"
                  }
                />
              ))}
            </XStack>
          )}
        </YStack>

        <YStack flex={1} space="$2">
          <XStack justifyContent="space-between" alignItems="center">
            <Text
              flex={1}
              minWidth={0}
              numberOfLines={1}
              paddingRight="$2"
              fontSize="$4"
              fontWeight="800"
              color={isDark ? "#BFDBFE" : "#1D4ED8"}
            >
              Presupuestos
            </Text>
            <Pressable onPress={() => navigation.navigate("Budgets")}>
              <Text
                fontSize={11}
                fontWeight="700"
                color={isDark ? "#93C5FD" : "#2563EB"}
              >
                Ver todos
              </Text>
            </Pressable>
          </XStack>

          <Stack
            height={160}
            borderRadius="$8"
            overflow="hidden"
            onLayout={(event) =>
              setBudgetsCardWidth(Math.round(event.nativeEvent.layout.width))
            }
          >
            {isBudgetsLoading ? (
              <YStack flex={1} justifyContent="center" alignItems="center">
                <LinearGradient
                  colors={isDark ? ["#1E2A44", "#182134"] : ["#DBEAFE", "#EFF6FF"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
                <Spinner size="small" color={isDark ? "#93C5FD" : "#2563EB"} />
              </YStack>
            ) : budgetSlides.length === 0 ? (
              <Pressable
                onPress={() => navigation.navigate("Budgets")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.85 : 1,
                  flex: 1,
                })}
              >
                <LinearGradient
                  colors={isDark ? ["#1E2A44", "#182134"] : ["#DBEAFE", "#EFF6FF"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{ position: "absolute", width: "100%", height: "100%" }}
                />
                <YStack flex={1} justifyContent="center" padding="$4" space="$1.5">
                  <Text
                    fontSize={13}
                    fontWeight="700"
                    color={isDark ? "#BFDBFE" : "#1D4ED8"}
                  >
                    Crea tu primer presupuesto
                  </Text>
                  <Text fontSize={11} color={isDark ? "#CBD5E1" : "#475569"}>
                    El carrusel mostrará tus categorías más críticas.
                  </Text>
                </YStack>
              </Pressable>
            ) : (
              <RNScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleBudgetScrollEnd}
                bounces={false}
                decelerationRate="fast"
              >
                {budgetSlides.map((budget) => {
                  const percent = Number(budget.progress?.percentage || 0);
                  const spent = Number(budget.progress?.spent || 0);
                  const remaining = Number(
                    budget.progress?.remaining ?? budget.amount
                  );
                  const warningThreshold = Number(
                    budget.warningThreshold || 75
                  );
                  const status = getBudgetStatus(percent, warningThreshold);
                  const baseAccent = budget.category?.color?.startsWith("#")
                    ? budget.category.color
                    : isDark
                    ? "#93C5FD"
                    : "#2563EB";
                  const gradientStart = isDark
                    ? hexToRgba(baseAccent, 0.4, "rgba(30, 58, 138, 0.45)")
                    : hexToRgba(baseAccent, 0.22, "rgba(59, 130, 246, 0.2)");
                  const gradientEnd = isDark ? "#0F172A" : "#F8FAFC";
                  const CategoryIcon = getIcon(
                    budget.category?.icon || "HelpCircle"
                  );
                  const budgetTitle =
                    budget.name || budget.category?.name || "Sin nombre";
                  const categoryLabel = budget.category?.name || "Sin categoría";
                  const budgetMetaLabel = budgetTitle !== categoryLabel
                    ? categoryLabel
                    : "Mensual";

                  return (
                    <Pressable
                      key={budget.id}
                      onPress={() => navigation.navigate("BudgetDetail", { budget })}
                      style={({ pressed }) => ({
                        width: budgetsCardWidth || 220,
                        height: 160,
                        opacity: pressed ? 0.92 : 1,
                      })}
                    >
                      <LinearGradient
                        colors={[gradientStart, gradientEnd]}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={{ position: "absolute", width: "100%", height: "100%" }}
                      />

                      <YStack flex={1} justifyContent="space-between" padding="$3.5" space="$1.5">
                        <XStack justifyContent="space-between" alignItems="flex-start">
                          <XStack
                            space="$2"
                            alignItems="center"
                            flex={1}
                            minWidth={0}
                            paddingRight="$2"
                          >
                            <Stack
                              width={24}
                              height={24}
                              borderRadius={12}
                              alignItems="center"
                              justifyContent="center"
                              backgroundColor={
                                isDark
                                  ? "rgba(15,23,42,0.55)"
                                  : "rgba(255,255,255,0.8)"
                              }
                            >
                              <CategoryIcon size={13} color={baseAccent} />
                            </Stack>
                            <YStack flex={1} minWidth={0}>
                              <Text
                                fontSize={11}
                                fontWeight="700"
                                color={isDark ? "#E2E8F0" : "#374151"}
                                numberOfLines={1}
                              >
                                {budgetMetaLabel}
                              </Text>
                            </YStack>
                          </XStack>

                          <Stack
                            width={10}
                            height={10}
                            borderRadius={5}
                            marginTop={4}
                            backgroundColor={status.indicatorColor}
                            borderWidth={1}
                            borderColor={isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.12)"}
                          />
                        </XStack>

                        <YStack space="$1.5" marginTop="$0.5">
                          <YStack minHeight={36} justifyContent="flex-start">
                            <Text
                              fontSize={13}
                              fontWeight="800"
                              color={isDark ? "#F8FAFC" : "#0F172A"}
                              numberOfLines={2}
                              lineHeight={17}
                            >
                              {budgetTitle}
                            </Text>
                          </YStack>
                          <Text
                            fontSize="$6"
                            fontWeight="900"
                            color={isDark ? "#FFFFFF" : "#111827"}
                            numberOfLines={1}
                          >
                            {formatBudgetMoney(remaining, budget.currency)}
                          </Text>

                          <XStack justifyContent="space-between" alignItems="center">
                            <Text
                              fontSize={10}
                              color={isDark ? "rgba(255,255,255,0.88)" : "#334155"}
                              fontWeight="600"
                            >
                              Gastado: {formatBudgetMoney(spent, budget.currency)}
                            </Text>
                            <Text
                              fontSize={10}
                              color={isDark ? "rgba(255,255,255,0.88)" : "#334155"}
                              fontWeight="700"
                            >
                              {Math.round(percent)}%
                            </Text>
                          </XStack>

                          <Progress
                            value={Math.min(percent, 100)}
                            height={6}
                            backgroundColor={
                              isDark
                                ? "rgba(15,23,42,0.35)"
                                : "rgba(15,23,42,0.12)"
                            }
                          >
                            <Progress.Indicator
                              animation="bouncy"
                              backgroundColor={status.progressColor}
                            />
                          </Progress>
                        </YStack>
                      </YStack>
                    </Pressable>
                  );
                })}
              </RNScrollView>
            )}
          </Stack>

          {budgetSlides.length > 1 && !isBudgetsLoading && (
            <XStack justifyContent="center" space="$1.5" paddingTop="$0.5">
              {budgetSlides.map((budget, index) => (
                <Stack
                  key={budget.id}
                  width={activeBudgetIndex === index ? 16 : 6}
                  height={6}
                  borderRadius={3}
                  backgroundColor={
                    activeBudgetIndex === index
                      ? isDark
                        ? "#93C5FD"
                        : "#2563EB"
                      : isDark
                      ? "rgba(147,197,253,0.3)"
                      : "rgba(37,99,235,0.28)"
                  }
                />
              ))}
            </XStack>
          )}
        </YStack>
      </XStack>
    </YStack>
  );
};
