import React, { useCallback, useMemo, useState } from "react";
import { FlatList, InteractionManager, Pressable, RefreshControl } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Stack,
  Button,
  Input,
  Spinner,
  ScrollView,
  Sheet,
  Separator,
  useThemeName,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "@tamagui/linear-gradient";
import {
  Clock3,
  Landmark,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { RecurringGlyph } from "../../components/recurring/RecurringGlyph";
import { getIcon } from "../../utils/iconMap";
import { RecurringActions } from "../../actions/recurringActions";
import { useRecurringStore } from "../../stores/useRecurringStore";
import { useAccountStore } from "../../stores/useAccountStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { AccountActions } from "../../actions/accountActions";
import { CategoryActions } from "../../actions/categoryActions";
import { formatMoney } from "../../utils/formatMoney";
import {
  filterRecurringList,
  getNextRunLabel,
  getRecurrenceLabel,
  isRecurringActive,
  sortRecurringByNextRun,
} from "../../utils/recurring";
import {
  RecurringListFilters,
  RecurringTransaction,
} from "../../types/recurring.types";

const STATUS_FILTERS = [
  { id: "ALL", label: "Todas" },
  { id: "ACTIVE", label: "Activas" },
  { id: "PAUSED", label: "Pausadas" },
] as const;

const TYPE_FILTERS = [
  { id: "ALL", label: "Todo" },
  { id: "INCOME", label: "Ingresos" },
  { id: "EXPENSE", label: "Gastos" },
] as const;

const UNIT_FILTERS = [
  { id: "ALL", label: "Todas" },
  { id: "MONTHLY", label: "Mensual" },
  { id: "WEEKLY", label: "Semanal" },
] as const;

type TextInputValue =
  | string
  | {
      nativeEvent?: { text?: string };
    };

const readInputValue = (value: TextInputValue): string => {
  if (typeof value === "string") return value;
  return value?.nativeEvent?.text ?? "";
};

const toRgba = (hex?: string, alpha: number = 1) => {
  if (!hex || !hex.startsWith("#")) return `rgba(148,163,184,${alpha})`;
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const value = normalized.slice(1);
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(148,163,184,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function RecurringScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");

  const { recurring, isLoading } = useRecurringStore();
  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoryStore((state) => state.categories);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RecurringListFilters["status"]>(
    "ALL",
  );
  const [typeFilter, setTypeFilter] = useState<RecurringListFilters["type"]>("ALL");
  const [unitFilter, setUnitFilter] =
    useState<RecurringListFilters["recurrenceUnit"]>("ALL");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const accent = isDark ? "#2DD4BF" : "#0F766E";
  const accentSoft = isDark ? "rgba(45,212,191,0.14)" : "#CCFBF1";
  const accentBorder = isDark ? "rgba(45,212,191,0.34)" : "#5EEAD4";
  const accentText = isDark ? "#99F6E4" : "#115E59";

  const styles = {
    page: "$background" as const,
    surface: "$gray2" as const,
    border: "$gray4" as const,
    subtleBorder: "$gray5" as const,
    muted: "$gray10" as const,
    ink: "$color" as const,
    inputBg: "$background" as const,
    accent,
    accentSoft,
    accentBorder,
    accentText,
    successBg: "$green2" as const,
    successBorder: "$green8" as const,
    successText: "$green11" as const,
    pausedBg: "$orange2" as const,
    pausedBorder: "$orange8" as const,
    pausedText: "$orange11" as const,
    incomeText: "$green11" as const,
    expenseText: "$red11" as const,
  };

  const filters = useMemo<RecurringListFilters>(
    () => ({
      search,
      status: statusFilter,
      type: typeFilter,
      recurrenceUnit: unitFilter,
    }),
    [search, statusFilter, typeFilter, unitFilter],
  );

  const filtered = useMemo(() => {
    const list = filterRecurringList(recurring, filters);
    return sortRecurringByNextRun(list);
  }, [recurring, filters]);

  const accountsById = useMemo(
    () => new Map(accounts.map((acc) => [acc.id, acc])),
    [accounts],
  );
  const categoriesById = useMemo(
    () => new Map(categories.map((cat) => [cat.id, cat])),
    [categories],
  );

  const activeFilterLabels = useMemo(() => {
    const labels: { id: string; label: string }[] = [];
    if (statusFilter && statusFilter !== "ALL") {
      labels.push({
        id: "status",
        label: statusFilter === "ACTIVE" ? "Activas" : "Pausadas",
      });
    }
    if (typeFilter && typeFilter !== "ALL") {
      labels.push({
        id: "type",
        label: typeFilter === "INCOME" ? "Ingresos" : "Gastos",
      });
    }
    if (unitFilter && unitFilter !== "ALL") {
      labels.push({
        id: "unit",
        label: unitFilter === "MONTHLY" ? "Mensual" : "Semanal",
      });
    }
    return labels;
  }, [statusFilter, typeFilter, unitFilter]);

  const filterCount = activeFilterLabels.length;

  const clearFilters = () => {
    setStatusFilter("ALL");
    setTypeFilter("ALL");
    setUnitFilter("ALL");
    setSearch("");
  };

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        RecurringActions.loadRecurring();

        const accountState = useAccountStore.getState();
        if (accountState.accounts.length === 0) {
          AccountActions.loadAccounts();
        }

        const categoryState = useCategoryStore.getState();
        if (categoryState.categories.length === 0) {
          CategoryActions.loadCategories();
        }
      });

      return () => {
        task.cancel();
        setFiltersOpen(false);
      };
    }, []),
  );

  const handleRefresh = useCallback(async () => {
    await RecurringActions.loadRecurring();
  }, []);

  const handleCreate = () => {
    setFiltersOpen(false);
    navigation.navigate("RecurringCreate");
  };

  const SegmentGroup = ({
    label,
    value,
    options,
    onChange,
  }: {
    label: string;
    value: string;
    options: readonly { id: string; label: string }[];
    onChange: (id: string) => void;
  }) => (
    <YStack space="$2.5">
      <Text fontSize={11} fontWeight="800" color={styles.muted} letterSpacing={0.5}>
        {label.toUpperCase()}
      </Text>
      <XStack
        backgroundColor="$gray2"
        borderRadius="$4"
        borderWidth={1}
        borderColor={styles.border}
        padding="$1"
        space="$1"
      >
        {options.map((option) => {
          const active = value === option.id;
          return (
            <Pressable
              key={option.id}
              onPress={() => onChange(option.id)}
              style={({ pressed }) => ({
                flex: 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                paddingVertical="$2"
                borderRadius="$3"
                backgroundColor={active ? styles.accent : "transparent"}
                borderWidth={active ? 1 : 0}
                borderColor={active ? styles.accent : "transparent"}
              >
                <Text
                  fontSize={12}
                  fontWeight={active ? "800" : "600"}
                  color={active ? "white" : styles.muted}
                >
                  {option.label}
                </Text>
              </Stack>
            </Pressable>
          );
        })}
      </XStack>
    </YStack>
  );

  const renderHeader = () => (
    <YStack space="$4" marginBottom="$1">
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" space="$3">
          <GoBackButton fallbackRouteName="HomeDrawer" />
          <YStack>
            <Text fontSize="$6" fontWeight="900" color={styles.ink}>
              Recurrentes
            </Text>
            <Text fontSize="$3" color={styles.muted}>
              Controla tus PAC/PAT en un solo lugar.
            </Text>
          </YStack>
        </XStack>
      </XStack>

      <YStack space="$2.5">
        <XStack alignItems="center" space="$2.5">
          <XStack
            alignItems="center"
            space="$2"
            backgroundColor={styles.surface}
            borderRadius="$4"
            borderWidth={1}
            borderColor={styles.border}
            paddingHorizontal="$3"
            paddingVertical="$2"
            flex={1}
          >
            <Search size={16} color={isDark ? "#A3AED0" : "#64748B"} />
            <Input
              placeholder="Buscar recurrentes"
              placeholderTextColor="$gray8"
              value={search}
              onChangeText={(value) => setSearch(readInputValue(value))}
              borderWidth={0}
              backgroundColor="transparent"
              color={styles.ink}
              selectionColor={styles.accent as any}
              flex={1}
            />
          </XStack>

          <Pressable
            onPress={() => setFiltersOpen(true)}
            style={({ pressed }) => ({
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Stack
              width={44}
              height={44}
              borderRadius="$4"
              alignItems="center"
              justifyContent="center"
              backgroundColor={styles.accentSoft}
              borderWidth={1}
              borderColor={styles.accentBorder}
              overflow="visible"
            >
              <SlidersHorizontal size={18} color={styles.accent} />
              {filterCount > 0 ? (
                <Stack
                  position="absolute"
                  top={-5}
                  right={-5}
                  minWidth={20}
                  height={20}
                  borderRadius={10}
                  backgroundColor={styles.accent}
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={2}
                  borderColor={styles.surface}
                  paddingHorizontal={4}
                >
                  <Text fontSize={10} fontWeight="800" color="white">
                    {filterCount}
                  </Text>
                </Stack>
              ) : null}
            </Stack>
          </Pressable>
        </XStack>

        {activeFilterLabels.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2" alignItems="center">
              {activeFilterLabels.map((item) => (
                <Stack
                  key={item.id}
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$3"
                  backgroundColor={styles.accentSoft}
                  borderWidth={1}
                  borderColor={styles.accentBorder}
                >
                  <Text fontSize={11} fontWeight="700" color={styles.accentText}>
                    {item.label}
                  </Text>
                </Stack>
              ))}
              <Pressable
                onPress={clearFilters}
                style={({ pressed }) => ({
                  transform: [{ scale: pressed ? 0.96 : 1 }],
                })}
              >
                <Stack
                  paddingHorizontal="$3"
                  paddingVertical="$1.5"
                  borderRadius="$3"
                  backgroundColor="$orange2"
                  borderWidth={1}
                  borderColor="$orange6"
                >
                  <Text fontSize={11} fontWeight="800" color="$orange11">
                    Limpiar
                  </Text>
                </Stack>
              </Pressable>
            </XStack>
          </ScrollView>
        ) : null}
      </YStack>

      <Text fontSize="$3" color={styles.muted}>
        {isLoading ? "Cargando..." : `${filtered.length} recurrentes`}
      </Text>
    </YStack>
  );

  const renderItem = ({ item }: { item: RecurringTransaction }) => {
    const account = accountsById.get(item.accountId);
    const category = categoriesById.get(item.categoryId);
    const CategoryIcon = getIcon(category?.icon || "HelpCircle");
    const accountLabel = account?.name || "Cuenta";
    const categoryLabel = category?.name || "Sin categoría";
    const categoryColor =
      category?.color || (item.type === "INCOME" ? "#16A34A" : "#DC2626");
    const recurrenceLabel = getRecurrenceLabel(item);
    const nextLabel = getNextRunLabel(item);
    const active = isRecurringActive(item);
    const merchantOrDesc = (item.merchant || item.description || "").trim();
    const repeatsCategoryName =
      item.name.trim().toLowerCase() === categoryLabel.trim().toLowerCase();

    const amountColor = item.type === "INCOME" ? styles.incomeText : styles.expenseText;
    const statusText = active ? styles.successText : styles.pausedText;
    const cardGradient =
      item.type === "INCOME"
        ? isDark
          ? ["#0D1F1A", "#141821"]
          : ["#EEFFF8", "#F8FAFC"]
        : isDark
          ? ["#2A1717", "#141821"]
          : ["#FFF3EE", "#F8FAFC"];
    const chipBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.88)";
    const chipBorder = isDark ? "rgba(148,163,184,0.28)" : "rgba(148,163,184,0.24)";
    const statusDot = active ? "#22C55E" : "#F59E0B";
    const typePillBg =
      item.type === "INCOME"
        ? isDark
          ? "rgba(34,197,94,0.18)"
          : "rgba(22,163,74,0.12)"
        : isDark
          ? "rgba(248,113,113,0.2)"
          : "rgba(220,38,38,0.12)";
    const typePillColor = item.type === "INCOME" ? "#16A34A" : "#DC2626";

    return (
      <Pressable
        onPress={() => navigation.navigate("RecurringEdit", { id: item.id })}
        style={({ pressed }) => ({
          transform: [{ scale: pressed ? 0.986 : 1 }],
        })}
      >
        <Stack
          backgroundColor={styles.surface}
          borderRadius="$6"
          borderWidth={1}
          borderColor={styles.border}
          padding="$3"
          space="$2"
          overflow="hidden"
        >
          <LinearGradient
            colors={cardGradient}
            start={[0, 0]}
            end={[1, 1]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />

          <Stack
            position="absolute"
            top={0}
            left={0}
            bottom={0}
            width={5}
            backgroundColor={categoryColor}
            opacity={0.9}
          />

          <Stack
            position="absolute"
            top={-24}
            right={-28}
            width={100}
            height={100}
            borderRadius={50}
            backgroundColor={toRgba(categoryColor, isDark ? 0.16 : 0.08)}
          />

          <Stack
            position="absolute"
            top={8}
            right={10}
            paddingHorizontal="$2"
            paddingVertical={3}
            borderRadius="$4"
            backgroundColor={chipBg}
            borderWidth={1}
            borderColor={chipBorder}
          >
            <Text fontSize={10} fontWeight="800" color={styles.muted}>
              {recurrenceLabel}
            </Text>
          </Stack>

          <XStack justifyContent="space-between" alignItems="flex-start" space="$2.5">
            <XStack flex={1} alignItems="center" space="$2.5" paddingRight="$2">
              <Stack
                width={40}
                height={40}
                borderRadius={12}
                alignItems="center"
                justifyContent="center"
                backgroundColor={toRgba(categoryColor, isDark ? 0.25 : 0.16)}
                borderWidth={1}
                borderColor={toRgba(categoryColor, isDark ? 0.42 : 0.28)}
              >
                <CategoryIcon size={18} color={categoryColor} />
              </Stack>

              <YStack flex={1} space={1}>
                <Text
                  fontSize="$3"
                  fontWeight="900"
                  color={styles.ink}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <XStack alignItems="center" space="$1.5">
                  {!repeatsCategoryName ? (
                    <Text fontSize={10} color={categoryColor} fontWeight="700" numberOfLines={1}>
                      {categoryLabel}
                    </Text>
                  ) : null}
                  {merchantOrDesc ? (
                    <Text fontSize={10} color={styles.muted} numberOfLines={1} flex={1}>
                      {merchantOrDesc}
                    </Text>
                  ) : null}
                </XStack>
              </YStack>
            </XStack>

            <YStack alignItems="flex-end" space={2} paddingTop={20}>
              <Text fontSize="$3" fontWeight="900" color={amountColor}>
                {formatMoney(Number(item.amount || 0), item.currency || "CLP")}
              </Text>
              <XStack alignItems="center" space={5}>
                <Stack width={7} height={7} borderRadius={4} backgroundColor={statusDot} />
                <Text fontSize={10} fontWeight="800" color={statusText}>
                  {active ? "Activa" : "Pausada"}
                </Text>
              </XStack>
            </YStack>
          </XStack>

          <XStack alignItems="center" justifyContent="space-between" space="$2">
            <XStack alignItems="center" space="$2" flex={1}>
              {!nextLabel ? (
                <Stack
                  paddingHorizontal="$2"
                  paddingVertical={2}
                  borderRadius="$3"
                  backgroundColor={chipBg}
                  borderWidth={1}
                  borderColor={chipBorder}
                >
                  <Text fontSize={10} color={styles.muted} fontWeight="700">
                    {accountLabel}
                  </Text>
                </Stack>
              ) : null}

              <Stack
                paddingHorizontal="$2"
                paddingVertical={2}
                borderRadius="$3"
                backgroundColor={typePillBg}
                borderWidth={1}
                borderColor={toRgba(typePillColor, isDark ? 0.4 : 0.24)}
              >
                <Text
                  fontSize={9}
                  color={typePillColor}
                  letterSpacing={0.4}
                  textTransform="uppercase"
                  fontWeight="800"
                >
                  {item.type === "INCOME" ? "Ingreso" : "Gasto"}
                </Text>
              </Stack>
            </XStack>
          </XStack>

          {nextLabel ? (
            <XStack
              alignItems="center"
              justifyContent="space-between"
              borderTopWidth={1}
              borderTopColor={styles.subtleBorder}
              paddingTop="$1.5"
            >
              <XStack alignItems="center" space={4}>
                <Landmark size={12} color={styles.muted as any} />
                <Text fontSize={10} color={styles.muted} fontWeight="700" numberOfLines={1}>
                  {accountLabel}
                </Text>
              </XStack>
              <XStack alignItems="center" space={4}>
                <Clock3 size={12} color={styles.muted as any} />
                <Text fontSize={10} color={styles.ink} fontWeight="800">
                  {nextLabel}
                </Text>
              </XStack>
            </XStack>
          ) : null}
        </Stack>
      </Pressable>
    );
  };

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <YStack padding="$8" alignItems="center">
          <Spinner size="large" color={styles.accent} />
        </YStack>
      );
    }

    return (
      <YStack padding="$8" alignItems="center" space="$4" opacity={0.8}>
        <Stack
          width={84}
          height={84}
          borderRadius={42}
          overflow="hidden"
          borderWidth={1}
          borderColor={styles.accentBorder}
          alignItems="center"
          justifyContent="center"
        >
          <LinearGradient
            colors={isDark ? ["#123532", "#0D2926"] : ["#CCFBF1", "#F0FDFA"]}
            start={[0, 0]}
            end={[1, 1]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
          <Stack
            position="absolute"
            top={-18}
            right={-16}
            width={52}
            height={52}
            borderRadius={26}
            backgroundColor="rgba(255,255,255,0.42)"
            opacity={0.6}
          />
          <RecurringGlyph
            size={36}
            stroke={styles.accent}
            fill={styles.accent}
            ringOpacity={0.38}
          />
        </Stack>

        <Text fontSize="$4" fontWeight="800" color={styles.ink}>
          Sin recurrentes todavía
        </Text>
        <Text fontSize="$3" color={styles.muted} textAlign="center">
          Crea tus PAC o suscripciones para que aparezcan aquí.
        </Text>

        <Button
          size="$4"
          backgroundColor={styles.accent}
          color="white"
          onPress={handleCreate}
          borderRadius="$4"
          icon={<Plus size={16} color="white" />}
          pressStyle={{ opacity: 0.9, scale: 0.99 }}
        >
          <Text fontSize="$3" fontWeight="800" color="white">
            Crear recurrente
          </Text>
        </Button>
      </YStack>
    );
  };

  const fabSize = 56;
  const fabBottom = insets.bottom + 18;

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        backgroundColor={styles.page}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom={insets.bottom + 20}
      >
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: fabBottom + fabSize + 24,
            gap: 12,
            flexGrow: filtered.length === 0 ? 1 : undefined,
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={styles.accent}
            />
          }
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmpty}
        />

        {filtersOpen ? (
          <Sheet
            key="recurring-filters-sheet"
            modal
            open={filtersOpen}
            onOpenChange={setFiltersOpen}
            snapPoints={[55]}
            dismissOnSnapToBottom
            zIndex={100000}
            animation="medium"
          >
            <Sheet.Overlay
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame padding="$4" space="$4" backgroundColor="$background">
              <XStack alignItems="center" justifyContent="space-between">
                <Text fontSize="$6" fontWeight="800" color="$color">
                  Filtros
                </Text>
                <Button
                  size="$3"
                  circular
                  chromeless
                  icon={<X size={18} color="$gray10" />}
                  onPress={() => setFiltersOpen(false)}
                />
              </XStack>

              <SegmentGroup
                label="Estado"
                value={statusFilter || "ALL"}
                options={STATUS_FILTERS}
                onChange={(id) => setStatusFilter(id as RecurringListFilters["status"])}
              />
              <SegmentGroup
                label="Tipo"
                value={typeFilter || "ALL"}
                options={TYPE_FILTERS}
                onChange={(id) => setTypeFilter(id as RecurringListFilters["type"])}
              />
              <SegmentGroup
                label="Frecuencia"
                value={unitFilter || "ALL"}
                options={UNIT_FILTERS}
                onChange={(id) =>
                  setUnitFilter(id as RecurringListFilters["recurrenceUnit"])
                }
              />

              <YStack space="$3" paddingTop="$2">
                <Separator borderColor="$gray4" />
                <XStack space="$2">
                  <Button
                    flex={1}
                    backgroundColor="$gray2"
                    color="$color"
                    borderRadius="$4"
                    onPress={clearFilters}
                  >
                    <Text fontSize="$3" fontWeight="700" color="$color">
                      Limpiar
                    </Text>
                  </Button>
                  <Button
                    flex={1}
                    backgroundColor={styles.accent}
                    color="white"
                    borderRadius="$4"
                    onPress={() => setFiltersOpen(false)}
                  >
                    <Text fontSize="$3" fontWeight="700" color="white">
                      Listo
                    </Text>
                  </Button>
                </XStack>
              </YStack>
            </Sheet.Frame>
          </Sheet>
        ) : null}

        <Pressable
          onPress={handleCreate}
          style={({ pressed }) => ({
            position: "absolute",
            right: 20,
            bottom: fabBottom,
            transform: [{ scale: pressed ? 0.96 : 1 }],
          })}
        >
          <Stack
            width={fabSize}
            height={fabSize}
            borderRadius={fabSize / 2}
            backgroundColor={styles.accent}
            alignItems="center"
            justifyContent="center"
            shadowColor={styles.accent}
            shadowOpacity={0.25}
            shadowRadius={10}
            shadowOffset={{ width: 0, height: 5 }}
            borderWidth={1}
            borderColor={styles.accentBorder}
          >
            <Plus size={22} color="white" />
          </Stack>
        </Pressable>
      </YStack>
    </MainLayout>
  );
}
