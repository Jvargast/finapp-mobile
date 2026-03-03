import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionManager } from "react-native";
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
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft, Calendar } from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { AccountSelector } from "../../components/transactions/AccountSelector";
import { CategorySelector } from "../../components/transactions/CategorySelector";
import { TransactionDatePicker } from "../../components/transactions/TransactionDatePicker";
import { AccountActions } from "../../actions/accountActions";
import { CategoryActions } from "../../actions/categoryActions";
import { RecurringActions } from "../../actions/recurringActions";
import { useAccountStore } from "../../stores/useAccountStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useToastStore } from "../../stores/useToastStore";
import {
  BusinessDayAdjustment,
  MonthlyRule,
  RecurrenceUnit,
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

type SectionProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const Section = ({ title, subtitle, children }: SectionProps) => (
  <YStack
    backgroundColor="$gray2"
    borderWidth={1}
    borderColor="$gray4"
    borderRadius="$6"
    padding="$4"
    space="$3.5"
  >
    <YStack space="$1.5">
      <Text fontSize="$4" fontWeight="800" color="$color">
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

export default function RecurringCreateScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const showToast = useToastStore((state) => state.showToast);

  const accounts = useAccountStore((state) => state.accounts);
  const categories = useCategoryStore((state) => state.categories);

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
  const [isStartPickerOpen, setStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setEndPickerOpen] = useState(false);
  const [showHeavySelectors, setShowHeavySelectors] = useState(
    () => accounts.length > 0 || categories.length > 0,
  );

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
    if (!selectedAccountId && accounts.length > 0) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts, selectedAccountId]);

  useEffect(() => {
    if (!selectedCategoryId && categories.length > 0) {
      const firstActive = categories.find((cat) => cat.isActive !== false);
      if (firstActive) setSelectedCategoryId(firstActive.id);
    }
  }, [categories, selectedCategoryId]);

  const accountCurrency = useMemo(() => {
    const match = accounts.find((acc) => acc.id === selectedAccountId);
    return match?.currency || "CLP";
  }, [accounts, selectedAccountId]);

  const formatDateLabel = (value: Date) =>
    value.toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleSave = useCallback(async () => {
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
      const payload: Parameters<typeof RecurringActions.createRecurring>[0] = {
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
        startsAt: startsAt.toISOString().slice(0, 10),
        endsAt: hasEndDate ? endsAt.toISOString().slice(0, 10) : null,
        isActive,
      };

      if (isMonthly) {
        payload.monthlyRule = monthlyRule;
        if (usesDayOfMonth) {
          payload.businessDayAdjustment = businessDayAdjustment;
        }
      }

      await RecurringActions.createRecurring(payload);

      showToast("Recurrente creada", "success");
      navigation.goBack();
    } catch (_error) {
      showToast("No se pudo crear la recurrente", "error");
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
    selectedAccountId,
    selectedCategoryId,
    showToast,
    startsAt,
    type,
    weekday,
  ]);

  return (
    <MainLayout noPadding>
      <YStack flex={1} backgroundColor="$background" paddingTop={insets.top + 8}>
        <YStack paddingHorizontal="$4" paddingBottom="$3" space="$2.5">
          <XStack alignItems="center" space="$3">
            <Button
              size="$3"
              circular
              chromeless
              icon={<ChevronLeft size={24} color="$color" />}
              onPress={() => navigation.goBack()}
            />
            <YStack flex={1}>
              <Text fontSize="$6" fontWeight="900" color="$color">
                Nueva recurrente
              </Text>
              <Text fontSize="$3" color="$gray10">
                Configura una regla automática con el estilo del resto de la app.
              </Text>
            </YStack>
          </XStack>
        </YStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 6,
            paddingBottom: insets.bottom + 170,
          }}
        >
          <YStack space="$5">
            <Section title="Monto y tipo" subtitle="Define el impacto del movimiento">
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

            <Section
              title="Cuenta y categoría"
              subtitle="Selecciona dónde se registrará el movimiento"
            >
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

            <Section title="Frecuencia" subtitle="Cada cuánto se repetirá la regla">
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
                              const active = Number(dayOfMonth) === day;
                              return (
                                <Button
                                  key={day}
                                  size="$2"
                                  height={38}
                                  minWidth={48}
                                  borderRadius="$3"
                                  backgroundColor={active ? "$brand" : "$background"}
                                  borderWidth={1}
                                  borderColor={active ? "$brand" : "$blue6"}
                                  onPress={() => setDayOfMonth(String(day))}
                                  pressStyle={{ opacity: 0.92, scale: 0.99 }}
                                >
                                  <Text
                                    fontSize="$2"
                                    fontWeight="800"
                                    color={active ? "white" : "$blue11"}
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
                          const active = weekday === day.value;
                          return (
                            <Button
                              key={day.value}
                              size="$2"
                              height={38}
                              minWidth={48}
                              borderRadius="$3"
                              backgroundColor={active ? "$brand" : "$background"}
                              borderWidth={1}
                              borderColor={active ? "$brand" : "$blue6"}
                              onPress={() => setWeekday(day.value)}
                              pressStyle={{ opacity: 0.92, scale: 0.99 }}
                            >
                              <Text
                                fontSize="$2"
                                fontWeight="800"
                                color={active ? "white" : "$blue11"}
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

            <Section title="Fechas" subtitle="Inicio inmediato y término opcional">
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
                justifyContent="space-between"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$2.5"
              >
                <Text fontSize="$2" color="$gray10">
                  Definir fecha de término
                </Text>
                <Switch
                  size="$3"
                  checked={hasEndDate}
                  onCheckedChange={setHasEndDate}
                  backgroundColor={hasEndDate ? "$blue9" : "$gray6"}
                  borderWidth={1}
                  borderColor={hasEndDate ? "$blue8" : "$gray7"}
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
            </Section>

            <Section
              title="Estado"
              subtitle="Puedes pausar esta regla cuando quieras"
            >
              <XStack
                alignItems="center"
                justifyContent="space-between"
                backgroundColor="$background"
                borderWidth={1}
                borderColor="$gray5"
                borderRadius="$4"
                paddingHorizontal="$3"
                paddingVertical="$3"
              >
                <YStack>
                  <Text fontSize="$3" color="$color" fontWeight="700">
                    Recurrente activa
                  </Text>
                  <Text fontSize="$2" color="$gray10">
                    Se aplicará automáticamente.
                  </Text>
                </YStack>
                <Switch
                  size="$3"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                  backgroundColor={isActive ? "$green9" : "$gray6"}
                  borderWidth={1}
                  borderColor={isActive ? "$green8" : "$gray7"}
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
        >
          <Button
            height={54}
            borderRadius="$5"
            backgroundColor="$brand"
            color="white"
            onPress={handleSave}
            disabled={isSaving}
            opacity={isSaving ? 0.7 : 1}
            pressStyle={{ opacity: 0.9, scale: 0.99 }}
          >
            <Text fontSize="$4" fontWeight="800" color="white">
              {isSaving ? "Guardando..." : "Crear recurrente"}
            </Text>
          </Button>
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
