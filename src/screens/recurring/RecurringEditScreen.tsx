import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, InteractionManager } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  YStack,
  XStack,
  Text,
  Button,
  Input,
  Switch,
  Spinner,
  Separator,
  Stack,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeft, Calendar, Sparkles, Save, Trash2 } from "@tamagui/lucide-icons";
import { LinearGradient } from "@tamagui/linear-gradient";
import { MainLayout } from "../../components/layout/MainLayout";
import { AccountSelector } from "../../components/transactions/AccountSelector";
import { CategorySelector } from "../../components/transactions/CategorySelector";
import { TransactionDatePicker } from "../../components/transactions/TransactionDatePicker";
import { AccountActions } from "../../actions/accountActions";
import { CategoryActions } from "../../actions/categoryActions";
import { RecurringActions } from "../../actions/recurringActions";
import { useAccountStore } from "../../stores/useAccountStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useRecurringStore } from "../../stores/useRecurringStore";
import { useToastStore } from "../../stores/useToastStore";
import {
  BusinessDayAdjustment,
  MonthlyRule,
  RecurrenceUnit,
  RecurringTransaction,
  RecurringTransactionType,
} from "../../types/recurring.types";

const WEEKDAYS = [
  { label: "D", value: 0 },
  { label: "L", value: 1 },
  { label: "Ma", value: 2 },
  { label: "Mi", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
];

const MONTH_DAY_ROWS = [
  [1, 5, 10, 15],
  [20, 25, 30],
];

const WEEKDAY_ROWS = [
  [0, 1, 2, 3],
  [4, 5, 6],
];

const MONTHLY_RULE_OPTIONS: Array<{ label: string; value: MonthlyRule }> = [
  { label: "Día del mes", value: "DAY_OF_MONTH" },
  { label: "Último día", value: "LAST_DAY" },
  { label: "Último hábil", value: "LAST_BUSINESS_DAY" },
];

type TextInputValue =
  | string
  | {
      nativeEvent?: { text?: string };
    };

const readInputValue = (value: TextInputValue): string => {
  if (typeof value === "string") return value;
  return value?.nativeEvent?.text ?? "";
};

const formatYmd = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value?: string | null, fallback?: Date) => {
  if (!value) return fallback ? new Date(fallback) : new Date();

  const ymdMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return fallback ? new Date(fallback) : new Date();
  }

  return parsed;
};

const toRgba = (hex?: string, alpha: number = 1) => {
  if (!hex || !hex.startsWith("#")) return `rgba(59,130,246,${alpha})`;
  const normalized =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  const value = normalized.slice(1);
  const r = Number.parseInt(value.slice(0, 2), 16);
  const g = Number.parseInt(value.slice(2, 4), 16);
  const b = Number.parseInt(value.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(59,130,246,${alpha})`;
  return `rgba(${r},${g},${b},${alpha})`;
};

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const Section = ({ title, subtitle, children }: SectionProps) => (
  <YStack
    backgroundColor="$background"
    borderWidth={1}
    borderColor="$gray5"
    borderRadius="$6"
    padding="$4"
    space="$3.5"
  >
    <YStack space="$1.5">
      <Text fontSize="$4" fontWeight="900" color="$color">
        {title}
      </Text>
      {subtitle ? (
        <Text fontSize="$2" color="$gray10">
          {subtitle}
        </Text>
      ) : null}
    </YStack>
    <Separator borderColor="$gray4" />
    <YStack space="$3">{children}</YStack>
  </YStack>
);

type SegmentButtonProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  tone?: "default" | "expense" | "income";
};

const SegmentButton = ({
  label,
  active,
  onPress,
  tone = "default",
}: SegmentButtonProps) => {
  const inactiveBackgroundColor =
    tone === "expense" ? "$red2" : tone === "income" ? "$green2" : "$blue2";
  const inactiveBorderColor =
    tone === "expense" ? "$red5" : tone === "income" ? "$green5" : "$blue5";
  const inactiveTextColor =
    tone === "expense" ? "$red11" : tone === "income" ? "$green11" : "$blue11";
  const activeBackgroundColor =
    tone === "expense" ? "$red10" : tone === "income" ? "$green10" : "$brand";
  const activeBorderColor =
    tone === "expense" ? "$red9" : tone === "income" ? "$green9" : "$brand";

  return (
    <Button
      flex={1}
      height={44}
      borderRadius="$4"
      backgroundColor={active ? activeBackgroundColor : inactiveBackgroundColor}
      borderWidth={1}
      borderColor={active ? activeBorderColor : inactiveBorderColor}
      onPress={onPress}
      pressStyle={{ opacity: 0.92, scale: 0.99 }}
    >
      <Text fontSize="$3" fontWeight="800" color={active ? "white" : inactiveTextColor}>
        {label}
      </Text>
    </Button>
  );
};

export default function RecurringEditScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const showToast = useToastStore((state) => state.showToast);

  const recurringId = route.params?.id as string | undefined;

  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoryStore((state) => state.categories);
  const recurringFromStore = useRecurringStore((state) =>
    state.recurring.find((item) => item.id === recurringId),
  );

  const [isLoadingItem, setIsLoadingItem] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<RecurringTransactionType>("EXPENSE");
  const [description, setDescription] = useState("");
  const [merchant, setMerchant] = useState("");
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [recurrenceUnit, setRecurrenceUnit] = useState<RecurrenceUnit>("MONTHLY");
  const [monthlyRule, setMonthlyRule] = useState<MonthlyRule>("DAY_OF_MONTH");
  const [businessDayAdjustment, setBusinessDayAdjustment] =
    useState<BusinessDayAdjustment>("NONE");
  const [interval, setInterval] = useState("1");
  const [dayOfMonth, setDayOfMonth] = useState("1");
  const [weekday, setWeekday] = useState<number>(new Date().getDay());
  const [startsAt, setStartsAt] = useState<Date>(new Date());
  const [endsAt, setEndsAt] = useState<Date>(new Date());
  const [hasEndDate, setHasEndDate] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStartPickerOpen, setStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setEndPickerOpen] = useState(false);
  const [showHeavySelectors, setShowHeavySelectors] = useState(
    () => accounts.length > 0 || categories.length > 0,
  );

  const hydrateForm = useCallback((item: RecurringTransaction) => {
    setName(item.name || "");
    setAmount(String(Math.round(Number(item.amount || 0))));
    setType(item.type || "EXPENSE");
    setDescription(item.description || "");
    setMerchant(item.merchant || "");
    setSelectedAccountId(item.accountId || "");
    setSelectedCategoryId(item.categoryId || "");
    setRecurrenceUnit(item.recurrenceUnit || "MONTHLY");
    setMonthlyRule(item.monthlyRule || "DAY_OF_MONTH");
    setBusinessDayAdjustment(item.businessDayAdjustment || "NONE");
    setInterval(String(item.interval ? Math.max(1, Number(item.interval)) : 1));
    setDayOfMonth(String(item.dayOfMonth ? Math.max(1, Number(item.dayOfMonth)) : 1));
    setWeekday(
      item.weekday === null || item.weekday === undefined
        ? new Date().getDay()
        : Math.min(6, Math.max(0, Number(item.weekday))),
    );

    const parsedStart = parseDateInput(item.startsAt, new Date());
    const parsedEnd = parseDateInput(item.endsAt, parsedStart);

    setStartsAt(parsedStart);
    setHasEndDate(Boolean(item.endsAt));
    setEndsAt(parsedEnd);
    setIsActive(item.isActive !== false);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (accounts.length > 0) return;
    const task = InteractionManager.runAfterInteractions(() => {
      AccountActions.loadAccounts();
    });
    return () => task.cancel();
  }, [accounts.length]);

  useEffect(() => {
    if (categories.length > 0) return;
    const task = InteractionManager.runAfterInteractions(() => {
      CategoryActions.loadCategories();
    });
    return () => task.cancel();
  }, [categories.length]);

  useEffect(() => {
    if (showHeavySelectors) return;
    const task = InteractionManager.runAfterInteractions(() => {
      setShowHeavySelectors(true);
    });
    return () => task.cancel();
  }, [showHeavySelectors]);

  useEffect(() => {
    if (!recurringId) {
      showToast("No encontramos la recurrencia", "error");
      navigation.goBack();
      return;
    }

    if (recurringFromStore && !isHydrated) {
      hydrateForm(recurringFromStore);
      setIsLoadingItem(false);
      return;
    }

    if (recurringFromStore) {
      setIsLoadingItem(false);
      return;
    }

    let isMounted = true;
    const task = InteractionManager.runAfterInteractions(async () => {
      try {
        const fetched = await RecurringActions.getRecurringById(recurringId);
        if (!isMounted) return;
        hydrateForm(fetched);
      } catch (_error) {
        if (!isMounted) return;
        showToast("No se pudo cargar la recurrencia", "error");
        navigation.goBack();
      } finally {
        if (isMounted) setIsLoadingItem(false);
      }
    });

    return () => {
      isMounted = false;
      task.cancel();
    };
  }, [
    hydrateForm,
    isHydrated,
    navigation,
    recurringFromStore,
    recurringId,
    showToast,
  ]);

  const accountCurrency = useMemo(() => {
    const match = accounts.find((acc) => acc.id === selectedAccountId);
    return match?.currency || recurringFromStore?.currency || "CLP";
  }, [accounts, recurringFromStore?.currency, selectedAccountId]);
  const selectedCategory = useMemo(
    () => categories.find((cat) => cat.id === selectedCategoryId),
    [categories, selectedCategoryId],
  );
  const heroAccent = selectedCategory?.color || (type === "INCOME" ? "#22C55E" : "#38BDF8");
  const heroGradient = useMemo(
    () =>
      type === "INCOME"
        ? ["#0A1120", "#13263E", "#1E3A8A"]
        : ["#0D1022", "#182547", "#1E3A8A"],
    [type],
  );

  const formatDateLabel = (value: Date) =>
    value.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleSave = useCallback(async () => {
    if (!recurringId) return;

    const amountValue = Number(amount);
    if (!name.trim()) {
      showToast("Ingresa un nombre para la recurrencia", "error");
      return;
    }
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      showToast("Ingresa un monto válido", "error");
      return;
    }
    if (!selectedAccountId) {
      showToast("Selecciona una cuenta", "error");
      return;
    }
    if (!selectedCategoryId) {
      showToast("Selecciona una categoría", "error");
      return;
    }

    const intervalValue = Math.max(1, Number(interval) || 1);
    const dayValue = Math.min(31, Math.max(1, Number(dayOfMonth) || 1));
    const weekdayValue = Math.min(6, Math.max(0, Number(weekday)));
    const isMonthly = recurrenceUnit === "MONTHLY";
    const usesDayOfMonth = isMonthly && monthlyRule === "DAY_OF_MONTH";

    if (usesDayOfMonth && (dayValue < 1 || dayValue > 31)) {
      showToast("El día del mes debe estar entre 1 y 31", "error");
      return;
    }

    setIsSaving(true);
    try {
      const payload: Parameters<typeof RecurringActions.updateRecurring>[1] = {
        name: name.trim(),
        amount: amountValue,
        currency: accountCurrency,
        type,
        accountId: selectedAccountId,
        categoryId: selectedCategoryId,
        description: description.trim() || null,
        merchant: merchant.trim() || null,
        recurrenceUnit,
        interval: intervalValue,
        dayOfMonth: isMonthly ? (usesDayOfMonth ? dayValue : null) : null,
        weekday: recurrenceUnit === "WEEKLY" ? weekdayValue : null,
        startsAt: formatYmd(startsAt),
        endsAt: hasEndDate ? formatYmd(endsAt) : null,
        isActive,
      };

      if (isMonthly) {
        payload.monthlyRule = monthlyRule;
        if (usesDayOfMonth) {
          payload.businessDayAdjustment = businessDayAdjustment;
        }
      }

      await RecurringActions.updateRecurring(recurringId, payload);

      showToast("Recurrente actualizada", "success");
      navigation.goBack();
    } catch (_error) {
      showToast("No se pudo actualizar la recurrente", "error");
    } finally {
      setIsSaving(false);
    }
  }, [
    accountCurrency,
    amount,
    dayOfMonth,
    description,
    endsAt,
    hasEndDate,
    interval,
    businessDayAdjustment,
    isActive,
    merchant,
    monthlyRule,
    name,
    navigation,
    recurrenceUnit,
    recurringId,
    selectedAccountId,
    selectedCategoryId,
    showToast,
    startsAt,
    type,
    weekday,
  ]);

  const handleDelete = useCallback(() => {
    if (!recurringId || isDeleting) return;

    Alert.alert(
      "Eliminar recurrente",
      "Esta acción no se puede deshacer. ¿Quieres continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await RecurringActions.deleteRecurring(recurringId);
              showToast("Recurrente eliminada", "success");
              navigation.goBack();
            } catch (_error) {
              showToast("No se pudo eliminar la recurrente", "error");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  }, [isDeleting, navigation, recurringId, showToast]);

  if (isLoadingItem) {
    return (
      <MainLayout noPadding>
        <YStack flex={1} alignItems="center" justifyContent="center" space="$3">
          <Spinner size="large" color="$brand" />
          <Text color="$gray10">Cargando recurrencia...</Text>
        </YStack>
      </MainLayout>
    );
  }

  return (
    <MainLayout noPadding>
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top + 8}>
        <YStack paddingHorizontal="$4" paddingBottom="$3" space="$2.5">
          <XStack alignItems="center" justifyContent="space-between">
            <Button
              size="$3"
              circular
              chromeless
              icon={<ChevronLeft size={24} color="$color" />}
              onPress={() => navigation.goBack()}
            />
            <Text fontSize="$4" fontWeight="900" color="$gray11">
              Editar recurrente
            </Text>
            <Stack width={36} />
          </XStack>

          <Stack
            borderRadius="$7"
            overflow="hidden"
            borderWidth={1}
            borderColor={toRgba(heroAccent, 0.35)}
          >
            <LinearGradient
              colors={heroGradient}
              start={[0, 0]}
              end={[1, 1]}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            />
            <Stack
              position="absolute"
              top={0}
              left={0}
              right={0}
              height={3}
              backgroundColor={heroAccent}
            />
            <Stack
              position="absolute"
              top={-28}
              right={-24}
              width={120}
              height={120}
              borderRadius={60}
              backgroundColor={toRgba(heroAccent, 0.2)}
            />
            <Stack
              position="absolute"
              bottom={-38}
              left={-30}
              width={130}
              height={130}
              borderRadius={65}
              backgroundColor={toRgba(heroAccent, 0.12)}
            />
            <YStack padding="$4" space="$2.5">
              <XStack alignItems="center" space="$2">
                <Sparkles size={16} color="white" />
                <Text color="white" fontWeight="800" fontSize={11} letterSpacing={0.5}>
                  MODO EDICIÓN
                </Text>
              </XStack>
              <Text fontSize="$6" fontWeight="900" color="white" numberOfLines={1}>
                {name || "Tu regla recurrente"}
              </Text>
              <Text fontSize="$2" color="rgba(255,255,255,0.9)">
                Ajusta frecuencia, cuenta, categoría y estado sin salir de esta vista.
              </Text>
              <XStack>
                <Stack
                  paddingHorizontal="$2.5"
                  paddingVertical={4}
                  borderRadius="$4"
                  backgroundColor={toRgba(heroAccent, 0.2)}
                  borderWidth={1}
                  borderColor={toRgba(heroAccent, 0.4)}
                >
                  <Text fontSize={10} fontWeight="800" color="white">
                    {selectedCategory?.name || "Categoría"}
                  </Text>
                </Stack>
              </XStack>
            </YStack>
          </Stack>
        </YStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: insets.bottom + 200,
          }}
        >
          <YStack space="$5">
            <Section title="Monto y tipo" subtitle="Define el impacto de este movimiento">
              <XStack space="$2.5">
                <SegmentButton
                  label="Gasto"
                  active={type === "EXPENSE"}
                  onPress={() => setType("EXPENSE")}
                  tone="expense"
                />
                <SegmentButton
                  label="Ingreso"
                  active={type === "INCOME"}
                  onPress={() => setType("INCOME")}
                  tone="income"
                />
              </XStack>

              <YStack space="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="700">
                  Monto
                </Text>
                <Input
                  placeholder="Ej: 15000"
                  placeholderTextColor="$gray8"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={(value) =>
                    setAmount(readInputValue(value).replace(/[^0-9]/g, ""))
                  }
                  backgroundColor="$background"
                  height={48}
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$gray5"
                  color="$color"
                  paddingHorizontal="$3"
                />
              </YStack>
            </Section>

            <Section title="Detalles" subtitle="Nombre y contexto de la regla">
              <YStack space="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="700">
                  Nombre
                </Text>
                <Input
                  placeholder="Ej: Suscripción streaming"
                  placeholderTextColor="$gray8"
                  value={name}
                  onChangeText={(value) => setName(readInputValue(value))}
                  backgroundColor="$background"
                  height={48}
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$gray5"
                  color="$color"
                  paddingHorizontal="$3"
                />
              </YStack>

              <YStack space="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="700">
                  Descripción (opcional)
                </Text>
                <Input
                  placeholder="Detalle adicional"
                  placeholderTextColor="$gray8"
                  value={description}
                  onChangeText={(value) => setDescription(readInputValue(value))}
                  backgroundColor="$background"
                  height={48}
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$gray5"
                  color="$color"
                  paddingHorizontal="$3"
                />
              </YStack>

              <YStack space="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="700">
                  Comercio (opcional)
                </Text>
                <Input
                  placeholder="Ej: Netflix"
                  placeholderTextColor="$gray8"
                  value={merchant}
                  onChangeText={(value) => setMerchant(readInputValue(value))}
                  backgroundColor="$background"
                  height={48}
                  borderRadius="$4"
                  borderWidth={1}
                  borderColor="$gray5"
                  color="$color"
                  paddingHorizontal="$3"
                />
              </YStack>
            </Section>

            <Section title="Cuenta y categoría" subtitle="Dónde se registrará el movimiento">
              {showHeavySelectors ? (
                <>
                  <AccountSelector
                    accounts={accounts}
                    selectedId={selectedAccountId}
                    onSelect={setSelectedAccountId}
                    embedded
                  />
                  <CategorySelector
                    selectedId={selectedCategoryId}
                    onSelect={setSelectedCategoryId}
                    navigation={navigation}
                    embedded
                    showColors
                  />
                </>
              ) : (
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  space="$2"
                  paddingVertical="$5"
                  opacity={0.8}
                >
                  <Spinner size="small" color="$brand" />
                  <Text fontSize="$2" color="$gray10">
                    Cargando selectores...
                  </Text>
                </XStack>
              )}
            </Section>

            <Section title="Frecuencia" subtitle="Cada cuánto se repetirá esta regla">
              <XStack space="$2.5">
                <SegmentButton
                  label="Mensual"
                  active={recurrenceUnit === "MONTHLY"}
                  onPress={() => setRecurrenceUnit("MONTHLY")}
                />
                <SegmentButton
                  label="Semanal"
                  active={recurrenceUnit === "WEEKLY"}
                  onPress={() => setRecurrenceUnit("WEEKLY")}
                />
              </XStack>

              <YStack space="$2">
                <Text fontSize="$2" color="$gray10" fontWeight="700">
                  Intervalo
                </Text>
                <XStack
                  alignItems="center"
                  justifyContent="center"
                  backgroundColor="$blue2"
                  borderWidth={1}
                  borderColor="$blue5"
                  borderRadius="$4"
                  paddingHorizontal="$3"
                  paddingVertical="$2.5"
                >
                  <XStack flex={1} alignItems="center" justifyContent="flex-end" paddingRight="$2">
                    <Text fontSize="$2" color="$blue11" fontWeight="700">
                      Cada
                    </Text>
                  </XStack>
                  <Input
                    width={84}
                    keyboardType="numeric"
                    value={interval}
                    onChangeText={(value) =>
                      setInterval(readInputValue(value).replace(/[^0-9]/g, ""))
                    }
                    backgroundColor="$background"
                    height={40}
                    borderRadius="$3"
                    borderWidth={1}
                    borderColor="$blue6"
                    color="$color"
                    textAlign="center"
                  />
                  <XStack flex={1} alignItems="center" justifyContent="flex-start" paddingLeft="$2">
                    <Text fontSize="$2" color="$blue11" fontWeight="700">
                      {recurrenceUnit === "MONTHLY" ? "mes(es)" : "semana(s)"}
                    </Text>
                  </XStack>
                </XStack>
              </YStack>

              {recurrenceUnit === "MONTHLY" ? (
                <YStack space="$3">
                  <YStack space="$2.5">
                    <Text fontSize="$2" color="$gray10" fontWeight="700">
                      Regla mensual
                    </Text>
                    <XStack space="$2">
                      {MONTHLY_RULE_OPTIONS.map((option) => {
                        const active = monthlyRule === option.value;
                        return (
                          <Button
                            key={option.value}
                            flex={1}
                            height={42}
                            borderRadius="$3"
                            backgroundColor={active ? "$brand" : "$background"}
                            borderWidth={1}
                            borderColor={active ? "$brand" : "$blue6"}
                            onPress={() => {
                              setMonthlyRule(option.value);
                              if (option.value !== "DAY_OF_MONTH") {
                                setBusinessDayAdjustment("NONE");
                              }
                            }}
                            pressStyle={{ opacity: 0.92, scale: 0.99 }}
                          >
                            <Text
                              fontSize={11}
                              fontWeight="800"
                              color={active ? "white" : "$blue11"}
                              numberOfLines={1}
                            >
                              {option.label}
                            </Text>
                          </Button>
                        );
                      })}
                    </XStack>
                  </YStack>

                  {monthlyRule === "DAY_OF_MONTH" ? (
                    <YStack space="$2.5">
                      <Text fontSize="$2" color="$gray10" fontWeight="700">
                        Día del mes
                      </Text>
                      <YStack
                        alignSelf="center"
                        width="92%"
                        maxWidth={320}
                        backgroundColor="$blue2"
                        borderWidth={1}
                        borderColor="$blue5"
                        borderRadius="$4"
                        padding="$2.5"
                        space="$2.5"
                      >
                        {MONTH_DAY_ROWS.map((row, rowIndex) => (
                          <XStack key={`row-${rowIndex}`} space="$2" justifyContent="center">
                            {row.map((day) => {
                              const isDayActive = Number(dayOfMonth) === day;
                              return (
                                <Button
                                  key={day}
                                  size="$2"
                                  height={38}
                                  minWidth={48}
                                  borderRadius="$3"
                                  backgroundColor={isDayActive ? "$brand" : "$background"}
                                  borderWidth={1}
                                  borderColor={isDayActive ? "$brand" : "$blue6"}
                                  onPress={() => setDayOfMonth(String(day))}
                                  pressStyle={{ opacity: 0.92, scale: 0.99 }}
                                >
                                  <Text
                                    fontSize="$2"
                                    fontWeight="800"
                                    color={isDayActive ? "white" : "$blue11"}
                                  >
                                    {day}
                                  </Text>
                                </Button>
                              );
                            })}
                          </XStack>
                        ))}
                      </YStack>
                      <Input
                        placeholder="Otro día (1-31)"
                        placeholderTextColor="$gray8"
                        keyboardType="numeric"
                        maxLength={2}
                        value={dayOfMonth}
                        onChangeText={(value) =>
                          setDayOfMonth(readInputValue(value).replace(/[^0-9]/g, ""))
                        }
                        backgroundColor="$background"
                        height={46}
                        width="55%"
                        minWidth={150}
                        maxWidth={210}
                        alignSelf="center"
                        borderRadius="$4"
                        borderWidth={1}
                        borderColor="$gray5"
                        color="$color"
                        textAlign="center"
                        paddingHorizontal="$3"
                      />

                      <XStack
                        alignItems="center"
                        justifyContent="space-between"
                        backgroundColor="$background"
                        borderWidth={1}
                        borderColor="$gray5"
                        borderRadius="$4"
                        paddingHorizontal="$3"
                        paddingVertical="$2.5"
                      >
                        <YStack flex={1} paddingRight="$2">
                          <Text fontSize="$2" color="$gray11" fontWeight="700">
                            Ajustar a día hábil anterior
                          </Text>
                          <Text fontSize="$2" color="$gray10">
                            Si cae sábado o domingo, mueve al hábil anterior.
                          </Text>
                        </YStack>
                        <Switch
                          size="$3"
                          checked={businessDayAdjustment === "PREVIOUS"}
                          onCheckedChange={(checked) =>
                            setBusinessDayAdjustment(checked ? "PREVIOUS" : "NONE")
                          }
                          backgroundColor={
                            businessDayAdjustment === "PREVIOUS" ? "$blue9" : "$gray6"
                          }
                          borderWidth={1}
                          borderColor={
                            businessDayAdjustment === "PREVIOUS" ? "$blue8" : "$gray7"
                          }
                          flexShrink={0}
                        >
                          <Switch.Thumb animation="bouncy" />
                        </Switch>
                      </XStack>
                    </YStack>
                  ) : (
                    <YStack
                      backgroundColor="$background"
                      borderWidth={1}
                      borderColor="$gray5"
                      borderRadius="$4"
                      padding="$3"
                    >
                      <Text fontSize="$2" color="$gray10">
                        {monthlyRule === "LAST_DAY"
                          ? "Se ejecutará el último día de cada mes."
                          : "Se ejecutará el último día hábil (lunes a viernes) de cada mes."}
                      </Text>
                    </YStack>
                  )}
                </YStack>
              ) : (
                <YStack space="$2.5">
                  <Text fontSize="$2" color="$gray10" fontWeight="700">
                    Día de la semana
                  </Text>
                  <YStack
                    alignSelf="center"
                    width="92%"
                    maxWidth={320}
                    backgroundColor="$blue2"
                    borderWidth={1}
                    borderColor="$blue5"
                    borderRadius="$4"
                    padding="$2.5"
                    space="$2.5"
                  >
                    {WEEKDAY_ROWS.map((row, rowIndex) => (
                      <XStack key={`weekday-row-${rowIndex}`} space="$2" justifyContent="center">
                        {row.map((weekdayValue) => {
                          const day = WEEKDAYS.find((item) => item.value === weekdayValue);
                          if (!day) return null;
                          const isDayActive = weekday === day.value;
                          return (
                            <Button
                              key={day.value}
                              size="$2"
                              height={38}
                              minWidth={48}
                              borderRadius="$3"
                              backgroundColor={isDayActive ? "$brand" : "$background"}
                              borderWidth={1}
                              borderColor={isDayActive ? "$brand" : "$blue6"}
                              onPress={() => setWeekday(day.value)}
                              pressStyle={{ opacity: 0.92, scale: 0.99 }}
                            >
                              <Text
                                fontSize="$2"
                                fontWeight="800"
                                color={isDayActive ? "white" : "$blue11"}
                              >
                                {day.label}
                              </Text>
                            </Button>
                          );
                        })}
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}
            </Section>

            <Section title="Fechas y estado" subtitle="Control de vigencia de la regla">
              <Button
                icon={<Calendar size={16} color="$gray11" />}
                justifyContent="flex-start"
                backgroundColor="$background"
                borderColor="$gray5"
                borderWidth={1}
                borderRadius="$4"
                height={48}
                paddingHorizontal="$3"
                onPress={() => setStartPickerOpen(true)}
              >
                <Text fontSize="$3" fontWeight="700" color="$gray11">
                  {`Inicio: ${formatDateLabel(startsAt)}`}
                </Text>
              </Button>

              <XStack
                alignItems="center"
                space="$3"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$2.5"
              >
                <Text fontSize="$2" color="$gray10" flex={1} minWidth={0} numberOfLines={2}>
                  Definir fecha de término
                </Text>
                <Switch
                  size="$3"
                  checked={hasEndDate}
                  onCheckedChange={setHasEndDate}
                  backgroundColor={hasEndDate ? "$blue9" : "$gray6"}
                  borderWidth={1}
                  borderColor={hasEndDate ? "$blue8" : "$gray7"}
                  flexShrink={0}
                >
                  <Switch.Thumb animation="bouncy" />
                </Switch>
              </XStack>

              {hasEndDate ? (
                <Button
                  icon={<Calendar size={16} color="$gray11" />}
                  justifyContent="flex-start"
                  backgroundColor="$background"
                  borderColor="$gray5"
                  borderWidth={1}
                  borderRadius="$4"
                  height={48}
                  paddingHorizontal="$3"
                  onPress={() => setEndPickerOpen(true)}
                >
                  <Text fontSize="$3" fontWeight="700" color="$gray11">
                    {`Fin: ${formatDateLabel(endsAt)}`}
                  </Text>
                </Button>
              ) : null}

              <XStack
                alignItems="center"
                space="$3"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$3"
              >
                <YStack flex={1} minWidth={0} paddingRight="$2">
                  <Text fontSize="$3" color="$color" fontWeight="700">
                    Recurrente activa
                  </Text>
                  <Text fontSize="$2" color="$gray10" numberOfLines={2}>
                    Cuando está apagada, no se ejecutará automáticamente.
                  </Text>
                </YStack>
                <Switch
                  size="$3"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  backgroundColor={isActive ? "$green9" : "$gray6"}
                  borderWidth={1}
                  borderColor={isActive ? "$green8" : "$gray7"}
                  flexShrink={0}
                >
                  <Switch.Thumb animation="bouncy" />
                </Switch>
              </XStack>
            </Section>
          </YStack>
        </ScrollView>

        <YStack
          position="absolute"
          left={0}
          right={0}
          bottom={0}
          backgroundColor="$background"
          borderTopWidth={1}
          borderTopColor="$gray4"
          paddingHorizontal="$4"
          paddingTop="$3"
          paddingBottom={insets.bottom + 12}
          space="$2"
        >
          <XStack space="$2">
            <Button
              flex={1}
              height={54}
              borderRadius="$5"
              backgroundColor="$red9"
              color="white"
              onPress={handleDelete}
              disabled={isSaving || isDeleting}
              opacity={isSaving || isDeleting ? 0.65 : 1}
              icon={<Trash2 size={16} color="white" />}
              pressStyle={{ opacity: 0.9, scale: 0.99 }}
            >
              <Text fontSize="$3" fontWeight="800" color="white">
                {isDeleting ? "Eliminando..." : "Eliminar"}
              </Text>
            </Button>

            <Button
              flex={1.5}
              height={54}
              borderRadius="$5"
              backgroundColor="$brand"
              color="white"
              onPress={handleSave}
              disabled={isSaving || isDeleting}
              opacity={isSaving || isDeleting ? 0.7 : 1}
              icon={<Save size={16} color="white" />}
              pressStyle={{ opacity: 0.9, scale: 0.99 }}
            >
              <Text fontSize="$4" fontWeight="800" color="white">
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </Text>
            </Button>
          </XStack>
        </YStack>
      </YStack>

      {isStartPickerOpen ? (
        <TransactionDatePicker
          open={isStartPickerOpen}
          onOpenChange={setStartPickerOpen}
          value={startsAt}
          onChange={setStartsAt}
        />
      ) : null}

      {isEndPickerOpen ? (
        <TransactionDatePicker
          open={isEndPickerOpen}
          onOpenChange={setEndPickerOpen}
          value={endsAt}
          onChange={setEndsAt}
        />
      ) : null}
    </MainLayout>
  );
}
