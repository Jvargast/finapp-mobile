import React, { useCallback, useEffect, useState } from "react";
import { Pressable, RefreshControl, ScrollView } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Circle,
  Card,
  Checkbox,
  Spinner,
  Stack,
  Button,
  useThemeName,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { Check, Mail, CheckCircle2, Pencil, X } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { WouButton } from "../../components/ui/WouButton";
import { PendingCandidateSheet } from "../../components/banking/PendingCandidateSheet";
import { BankingActions } from "../../actions/bankingActions";
import { AccountActions } from "../../actions/accountActions";
import { CategoryActions } from "../../actions/categoryActions";
import { BudgetActions } from "../../actions/budgetActions";
import { useToastStore } from "../../stores/useToastStore";
import { useAccountStore } from "../../stores/useAccountStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useBudgetStore } from "../../stores/useBudgetStore";
import {
  BankingCandidate,
  BankingCandidateOverrides,
} from "../../types/banking.types";
import { getIcon } from "../../utils/iconMap";
import { sanitizeEmailSnippet } from "../../utils/sanitizeEmailSnippet";

const getPastel = (isDark: boolean) => ({
  page: isDark ? "#0B0F1A" : "#FBF8F4",
  surface: isDark ? "#111827" : "#FFFFFF",
  border: isDark ? "rgba(148, 163, 184, 0.2)" : "#E6DFD6",
  muted: isDark ? "#94A3B8" : "#6B7280",
  ink: isDark ? "#F8FAFC" : "#1F2937",
  accent: isDark ? "#A5B4FC" : "#A7BFFF",
  accentSoft: isDark ? "rgba(165, 180, 252, 0.16)" : "#EEF3FF",
  success: isDark ? "rgba(34, 197, 94, 0.18)" : "#DCFCE7",
  successText: isDark ? "#4ADE80" : "#15803D",
  pending: isDark ? "#FDBA74" : "#EA580C",
  pendingSoft: isDark ? "rgba(251, 146, 60, 0.18)" : "#FFE7D6",
  pendingBorder: isDark ? "rgba(251, 146, 60, 0.35)" : "#F4C6A6",
  confirmBg: isDark ? "rgba(34, 197, 94, 0.2)" : "#E7F8EF",
  confirmBorder: isDark ? "rgba(34, 197, 94, 0.35)" : "#B7E9CE",
  confirmText: isDark ? "#4ADE80" : "#15803D",
  editBg: isDark ? "rgba(167, 139, 250, 0.2)" : "#F1EEFF",
  editBorder: isDark ? "rgba(167, 139, 250, 0.35)" : "#DAD3FF",
  editText: isDark ? "#C4B5FD" : "#5B21B6",
  ignoreBg: isDark ? "rgba(248, 113, 113, 0.2)" : "#FFE8E5",
  ignoreBorder: isDark ? "rgba(248, 113, 113, 0.35)" : "#F7C6C0",
  ignoreText: isDark ? "#FCA5A5" : "#B91C1C",
});

const formatCurrency = (amount: number, currency = "CLP") => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount));
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Sin fecha";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  const today = new Date();
  const time = date.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isToday = date.toDateString() === today.toDateString();
  if (isToday) return `Hoy, ${time}`;

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ayer, ${time}`;
  }

  const datePart = date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
  });
  return `${datePart}, ${time}`;
};

const getSoftColor = (color?: string, fallback = "#EEF2FF") => {
  if (!color) return fallback;
  if (color.startsWith("#")) return `${color}22`;
  return fallback;
};

const getDirectionColor = (
  direction?: string | null,
  palette?: { ink: string },
) => {
  const value = (direction || "").toString().toUpperCase();
  if (value.includes("OUT") || value.includes("DEBIT") || value.includes("EXPENSE"))
    return "#DC2626";
  if (value.includes("IN") || value.includes("CREDIT") || value.includes("INCOME"))
    return "#16A34A";
  return palette?.ink || "#1F2937";
};

type PendingMovementsScreenProps = {
  embedded?: boolean;
  initialCandidateId?: string | null;
};

export default function PendingMovementsScreen({
  embedded = false,
  initialCandidateId,
}: PendingMovementsScreenProps) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const pastel = getPastel(isDark);
  const softFallback = isDark ? "rgba(255,255,255,0.08)" : "#EEF2FF";
  const showToast = useToastStore((s) => s.showToast);
  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoryStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);

  const [candidates, setCandidates] = useState<BankingCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeCandidate, setActiveCandidate] =
    useState<BankingCandidate | null>(null);
  const resolvedCandidateId =
    initialCandidateId ?? (embedded ? null : route.params?.candidateId);
  const sheetOpen = Boolean(activeCandidate);

  const hasAutoOpened = React.useRef(false);

  const resolveCategory = useCallback(
    (candidate: BankingCandidate) => {
      if (candidate.suggestedCategory?.name) return candidate.suggestedCategory;
      const lookupId =
        candidate.categoryId || candidate.suggestedCategoryId || "";
      if (!lookupId) return null;
      return categories.find((cat) => cat.id === lookupId) || null;
    },
    [categories],
  );

  const resolveAccountName = useCallback(
    (candidate: BankingCandidate) => {
      const accountId = candidate.accountId || candidate.account?.id || null;
      if (accountId) {
        const account = accounts.find((acc) => acc.id === accountId);
        return account?.name || candidate.account?.name || null;
      }
      const last4 = candidate.account?.last4 || candidate.last4 || null;
      if (last4) {
        const matches = accounts.filter((acc) => acc.last4 === last4);
        if (matches.length === 1) return matches[0]?.name || null;
      }
      const cashAccount =
        accounts.find((acc) => acc.type?.toUpperCase() === "CASH") ||
        accounts.find((acc) => acc.type?.toUpperCase() === "WALLET") ||
        accounts[0];
      return cashAccount?.name || null;
    },
    [accounts],
  );

  const resolveBudgetName = useCallback(
    (candidate: BankingCandidate) => {
      const budgetId = candidate.suggestedBudgetId;
      if (!budgetId) return null;
      const budget = budgets.find((item) => item.id === budgetId);
      if (!budget) return null;
      return budget.name || budget.category?.name || "Presupuesto";
    },
    [budgets],
  );

  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await BankingActions.listCandidates({
        status: "PENDING",
        source: "FORWARDED_EMAIL",
        limit: 20,
      });
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      setCandidates(list);
    } catch (error) {
      console.error("Error cargando candidatos", error);
      showToast("No se pudieron cargar los pendientes", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const refreshCandidates = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await BankingActions.listCandidates({
        status: "PENDING",
        source: "FORWARDED_EMAIL",
        limit: 20,
      });
      const list = Array.isArray(data) ? data : data?.data || data?.items || [];
      setCandidates(list);
    } catch (error) {
      console.error("Error refrescando candidatos", error);
      showToast("No se pudieron actualizar", "error");
    } finally {
      setIsRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    AccountActions.loadAccounts();
    CategoryActions.loadCategories();
    BudgetActions.loadBudgets();
    loadCandidates();
  }, [loadCandidates]);

  useEffect(() => {
    if (!resolvedCandidateId || hasAutoOpened.current) return;
    if (candidates.length === 0) return;
    const match = candidates.find((item) => item.id === resolvedCandidateId);
    if (!match) return;
    setActiveCandidate(match);
    hasAutoOpened.current = true;
  }, [resolvedCandidateId, candidates]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setActiveCandidate(null);
      };
    }, []),
  );

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleOpenCandidate = (candidate: BankingCandidate) => {
    if (isBulkMode) {
      toggleSelection(candidate.id);
      return;
    }
    setActiveCandidate(candidate);
  };

  const handleSheetChange = (open: boolean) => {
    if (!open) setActiveCandidate(null);
  };

  const removeCandidate = (id: string) => {
    setCandidates((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleConfirm = async (
    id: string,
    overrides: BankingCandidateOverrides,
  ) => {
    await BankingActions.confirmCandidate(id, overrides);
    removeCandidate(id);
  };

  const handleQuickConfirm = async (id: string) => {
    await BankingActions.confirmCandidate(id, {});
    removeCandidate(id);
  };

  const handleIgnore = async (id: string) => {
    await BankingActions.ignoreCandidate(id);
    removeCandidate(id);
  };

  const handleConfirmSelected = async () => {
    if (selectedIds.length === 0) {
      showToast("Selecciona al menos un movimiento", "info");
      return;
    }
    const items = selectedIds.map((id) => ({ id }));
    await BankingActions.confirmCandidates(items);
    setCandidates((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    setSelectedIds([]);
    setIsBulkMode(false);
  };

  const pendingCount = candidates.length;
  const scrollBottomPadding =
    insets.bottom + (embedded ? 80 : 96) + (isBulkMode ? 80 : 0);

  const ActionPill = ({
    label,
    onPress,
    icon,
    bg,
    border,
    color,
  }: {
    label: string;
    onPress: () => void;
    icon: React.ReactNode;
    bg: string;
    border: string;
    color: string;
  }) => (
    <Button
      flex={1}
      height={36}
      borderRadius="$10"
      backgroundColor={bg}
      borderWidth={1}
      borderColor={border}
      pressStyle={{ opacity: 0.9 }}
      onPress={onPress}
    >
      <XStack alignItems="center" space="$1.5">
        {icon}
        <Text fontSize={12} fontWeight="700" color={color}>
          {label}
        </Text>
      </XStack>
    </Button>
  );

  const content = (
    <YStack space="$2">
      <XStack
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={pastel.surface}
        borderWidth={1}
        borderColor={pastel.border}
        borderRadius="$10"
        padding="$3"
      >
        <XStack alignItems="center" space="$2">
          <Circle size="$3.5" backgroundColor={pastel.accentSoft}>
            <Mail size={16} color={pastel.ink} />
          </Circle>
          <Text fontWeight="700" color={pastel.ink}>
            {pendingCount} pendientes
          </Text>
        </XStack>
        <WouButton
          label={isBulkMode ? "Cancelar" : "Seleccionar"}
          variant="soft"
          tone="pastel"
          size="sm"
          disableAnimation
          onPress={() => {
            setIsBulkMode((prev) => !prev);
            setSelectedIds([]);
          }}
        />
      </XStack>

      {isBulkMode && (
        <XStack
          alignItems="center"
          justifyContent="space-between"
          backgroundColor={pastel.surface}
          borderWidth={1}
          borderColor={pastel.border}
          borderRadius="$10"
          padding="$3"
        >
          <Text color={pastel.muted}>
            {selectedIds.length} seleccionados
          </Text>
          <WouButton
            label="Confirmar seleccionados"
            tone="success"
            size="sm"
            disableAnimation
            onPress={handleConfirmSelected}
          />
        </XStack>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshCandidates} />
        }
        contentContainerStyle={{
          paddingBottom: scrollBottomPadding,
        }}
      >
        <YStack space="$2" paddingTop={0} paddingBottom="$4">
            {isLoading ? (
              <XStack justifyContent="center" padding="$4">
                <Spinner size="large" color={pastel.accent} />
              </XStack>
            ) : pendingCount === 0 ? (
              <Card
                backgroundColor={pastel.surface}
                borderWidth={1}
                borderColor={pastel.border}
                padding="$4"
                borderRadius="$10"
              >
                <Text color={pastel.muted}>
                  No hay movimientos pendientes por revisar.
                </Text>
              </Card>
            ) : (
              candidates.map((candidate) => {
                const category = resolveCategory(candidate);
                const CategoryIcon = category?.icon ? getIcon(category.icon) : Mail;
                const amountColor = getDirectionColor(candidate.direction, pastel);
                const accountName = resolveAccountName(candidate);
                const budgetName = resolveBudgetName(candidate);
                const categoryLabel = category?.name || "Sin categoría";
                const accountLabel = accountName || "Sin cuenta";
                const hasBudget = Boolean(candidate.suggestedBudgetId);
                const budgetLabel = hasBudget
                  ? budgetName || "Presupuesto sugerido"
                  : "Sin presupuesto";
                const isSelected = selectedIds.includes(candidate.id);
                const emailSnippet = sanitizeEmailSnippet(
                  candidate.email?.snippet,
                  200,
                );
                const card = (
                  <Card
                    backgroundColor={pastel.surface}
                    borderWidth={1}
                    borderColor={pastel.border}
                    padding="$4"
                    borderRadius="$10"
                    space="$3"
                  >
                    <XStack alignItems="flex-start" justifyContent="space-between" space="$3">
                      <XStack alignItems="flex-start" space="$2" flex={1}>
                        {isBulkMode && (
                          <Checkbox
                            size="$4"
                            checked={isSelected}
                            onCheckedChange={() => toggleSelection(candidate.id)}
                          >
                            <Checkbox.Indicator>
                              <Check />
                            </Checkbox.Indicator>
                          </Checkbox>
                        )}
                        <YStack alignItems="center" width={52} space="$1">
                          <Circle
                            size="$4"
                            backgroundColor={getSoftColor(
                              category?.color,
                              softFallback,
                            )}
                            borderWidth={1}
                            borderColor={category?.color || pastel.border}
                          >
                            <CategoryIcon
                              size={18}
                              color={category?.color || pastel.muted}
                            />
                          </Circle>
                          <Text
                            fontSize={10}
                            fontWeight="700"
                            color={pastel.muted}
                            numberOfLines={1}
                            textAlign="center"
                          >
                            {categoryLabel}
                          </Text>
                        </YStack>
                        <YStack flex={1} space="$2">
                          <XStack space="$2" alignItems="center" minHeight={22}>
                            <Text
                              fontWeight="800"
                              color={pastel.ink}
                              numberOfLines={1}
                              flex={1}
                              lineHeight={18}
                            >
                              {candidate.merchant ||
                                candidate.description ||
                                "Movimiento pendiente"}
                            </Text>
                            <XStack
                              paddingHorizontal="$2"
                              paddingVertical={1}
                              borderRadius="$8"
                              backgroundColor={pastel.pendingSoft}
                              borderWidth={1}
                              borderColor={pastel.pendingBorder}
                              marginTop={1}
                            >
                              <Text fontSize={10} fontWeight="700" color={pastel.pending}>
                                Pendiente
                              </Text>
                            </XStack>
                          </XStack>
                          <Text fontSize={12} color={pastel.muted}>
                            {formatDate(candidate.occurredAt)}
                          </Text>
                        </YStack>
                      </XStack>
                      <YStack alignItems="flex-end" space="$1" paddingTop={2}>
                        <Text fontWeight="800" color={amountColor} lineHeight={18}>
                          {formatCurrency(candidate.amount)}
                        </Text>
                        {candidate.direction && (
                          <Text fontSize={10} color={pastel.muted}>
                            {candidate.direction}
                          </Text>
                        )}
                      </YStack>
                    </XStack>

                    <YStack space="$2">
                      <XStack
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$6"
                        backgroundColor={pastel.accentSoft}
                        alignSelf="flex-start"
                      >
                        <Text fontSize={10} fontWeight="700" color={pastel.ink}>
                          Cuenta: {accountLabel}
                        </Text>
                      </XStack>
                      <XStack
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$6"
                        backgroundColor={hasBudget ? pastel.success : pastel.surface}
                        borderWidth={hasBudget ? 0 : 1}
                        borderColor={hasBudget ? "transparent" : pastel.border}
                        alignSelf="flex-start"
                      >
                        <Text
                          fontSize={10}
                          fontWeight="700"
                          color={hasBudget ? pastel.successText : pastel.muted}
                        >
                          Presupuesto: {budgetLabel}
                        </Text>
                      </XStack>
                    </YStack>

                    {candidate.email && (
                      <Stack
                        backgroundColor="$gray1"
                        borderRadius="$8"
                        padding="$3"
                        borderWidth={1}
                        borderColor="$borderColor"
                      >
                        <Text fontSize={11} color="$gray9" fontWeight="700">
                          Correo original
                        </Text>
                        {candidate.email.from && (
                          <Text fontSize={11} color={pastel.muted}>
                            De: {candidate.email.from}
                          </Text>
                        )}
                        {candidate.email.subject && (
                          <Text fontSize={11} color={pastel.muted}>
                            Asunto: {candidate.email.subject}
                          </Text>
                        )}
                        {emailSnippet && (
                          <Text fontSize={10} color="$gray9" numberOfLines={2}>
                            {emailSnippet}
                          </Text>
                        )}
                      </Stack>
                    )}

                    {!isBulkMode && (
                      <XStack space="$2" justifyContent="space-between">
                        <ActionPill
                          label="Confirmar"
                          onPress={() => handleQuickConfirm(candidate.id)}
                          icon={<CheckCircle2 size={14} color={pastel.confirmText} />}
                          bg={pastel.confirmBg}
                          border={pastel.confirmBorder}
                          color={pastel.confirmText}
                        />
                        <ActionPill
                          label="Editar"
                          onPress={() => handleOpenCandidate(candidate)}
                          icon={<Pencil size={14} color={pastel.editText} />}
                          bg={pastel.editBg}
                          border={pastel.editBorder}
                          color={pastel.editText}
                        />
                        <ActionPill
                          label="Ignorar"
                          onPress={() => handleIgnore(candidate.id)}
                          icon={<X size={14} color={pastel.ignoreText} />}
                          bg={pastel.ignoreBg}
                          border={pastel.ignoreBorder}
                          color={pastel.ignoreText}
                        />
                      </XStack>
                    )}
                  </Card>
                );

                if (isBulkMode) {
                  return (
                    <Pressable
                      key={candidate.id}
                      onPress={() => handleOpenCandidate(candidate)}
                      style={({ pressed }) => ({
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                    >
                      {card}
                    </Pressable>
                  );
                }

                return <YStack key={candidate.id}>{card}</YStack>;
              })
            )}
          </YStack>
      </ScrollView>
    </YStack>
  );

  if (embedded) {
    return (
      <YStack
        flex={1}
        backgroundColor={pastel.page}
        paddingHorizontal="$4"
        paddingTop={0}
        paddingBottom="$4"
        space="$4"
      >
        {content}
        {sheetOpen && activeCandidate && (
          <PendingCandidateSheet
            key={activeCandidate.id}
            open={sheetOpen}
            onOpenChange={handleSheetChange}
            candidate={activeCandidate}
            accounts={accounts}
            onConfirm={handleConfirm}
            onIgnore={handleIgnore}
            navigation={navigation}
          />
        )}
      </YStack>
    );
  }

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        backgroundColor={pastel.page}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom={insets.bottom + 20}
        space="$4"
      >
        <XStack alignItems="center" space="$3">
          <GoBackButton fallbackRouteName="HomeDrawer" />
          <YStack>
            <Text fontSize="$6" fontWeight="900" color={pastel.ink}>
              Movimientos pendientes
            </Text>
            <Text fontSize="$3" color={pastel.muted}>
              Revisa los correos reenviados antes de confirmar.
            </Text>
          </YStack>
        </XStack>
        {content}
      </YStack>

      {sheetOpen && activeCandidate && (
        <PendingCandidateSheet
          key={activeCandidate.id}
          open={sheetOpen}
          onOpenChange={handleSheetChange}
          candidate={activeCandidate}
          accounts={accounts}
          onConfirm={handleConfirm}
          onIgnore={handleIgnore}
          navigation={navigation}
        />
      )}
    </MainLayout>
  );
}
