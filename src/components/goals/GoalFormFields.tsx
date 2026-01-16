import React, { useState } from "react";
import { Platform } from "react-native";
import { YStack, Input, Label, Button, Text, XStack, Stack } from "tamagui";
import { Control, Controller, FieldErrors, useWatch } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  AlertTriangle,
  Calendar,
  PiggyBank,
  TrendingUp,
} from "@tamagui/lucide-icons";
import { CreateGoalFormInputs } from "../../screens/goals/createGoal.schema";
import { GoalType } from "../../types/goal.types";
import { GoalCurrencySelector } from "./GoalCurrencySelector";

interface GoalFormFieldsProps {
  control: Control<CreateGoalFormInputs>;
  errors: FieldErrors<CreateGoalFormInputs>;
  showInterestField: boolean;
  goalType: GoalType;
  isEditing?: boolean;
}

const formatInputByCurrency = (value: string, currency: string) => {
  if (!value) return "";
  if (currency === "CLP") {
    const cleanNumber = value.replace(/\D/g, "");
    return cleanNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  return value.replace(/[^0-9.,]/g, "");
};

export const GoalFormFields = ({
  control,
  errors,
  showInterestField,
  goalType,
  isEditing = false,
}: GoalFormFieldsProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedCurrency = useWatch({
    control,
    name: "currency",
    defaultValue: "CLP",
  });

  const isHousing = goalType === GoalType.HOUSING;
  const isDebt = goalType === GoalType.DEBT;
  const isInvestment = goalType === GoalType.INVESTMENT;

  const showMonthlyQuota = isDebt || isHousing;
  const showYield = isInvestment;

  const ErrorMsg = ({ name }: { name: keyof CreateGoalFormInputs }) =>
    errors[name] ? (
      <Text color="$red10" fontSize="$2" marginTop="$1" fontWeight="500">
        {errors[name]?.message}
      </Text>
    ) : null;

  const getInterestData = () => {
    switch (goalType) {
      case GoalType.DEBT:
        return {
          label: "Tasa Anual (CAE) %",
          text: "Busca el CAE en tu estado de cuenta. Créditos de consumo: ~15-25%. Tarjetas de crédito: ~25-45%.",
          bg: "$red2",
          border: "$red4",
          textCol: "$red11",
          icon: AlertTriangle,
        };
      case GoalType.INVESTMENT:
        return {
          label: "Retorno Anual Estimado %",
          text: "DAP: ~5%. Fondos Mutuos: ~7%. S&P 500 (Acciones): ~10% histórico.",
          bg: "$blue2",
          border: "$blue4",
          textCol: "$blue11",
          icon: TrendingUp,
        };
      case GoalType.RETIREMENT:
        return {
          label: "Rentabilidad Proyectada %",
          text: "Fondos AFP (A/B) promedian ~5-8% real anual histórico.",
          bg: "$purple2",
          border: "$purple4",
          textCol: "$purple11",
          icon: PiggyBank,
        };
      default:
        return null;
    }
  };

  const interestInfo = getInterestData();

  return (
    <YStack space="$4">
      <YStack>
        <Label fontSize="$3" color="$gray11" fontWeight="600" marginBottom="$2">
          Nombre de la meta
        </Label>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Ej: Vacaciones, Pagar Crédito..."
              placeholderTextColor="$gray8"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              borderColor={errors.name ? "$red8" : "$borderColor"}
              backgroundColor="$gray2"
              borderWidth={1}
              borderRadius="$4"
            />
          )}
        />
        <ErrorMsg name="name" />
      </YStack>

      {!isEditing && (
        <Controller
          control={control}
          name="currency"
          render={({ field: { onChange, value } }) => (
            <GoalCurrencySelector value={value} onChange={onChange} />
          )}
        />
      )}
      <YStack>
        <Label fontSize="$3" color="$gray11" fontWeight="600" marginBottom="$2">
          Monto objetivo
        </Label>
        <Controller
          control={control}
          name="targetAmount"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="0"
              placeholderTextColor="$gray8"
              keyboardType={
                selectedCurrency === "CLP" ? "number-pad" : "decimal-pad"
              }
              onBlur={onBlur}
              onChangeText={(text: string) =>
                onChange(formatInputByCurrency(text, selectedCurrency))
              }
              value={value}
              borderColor={errors.targetAmount ? "$red8" : "$borderColor"}
              fontSize="$5"
              fontWeight="800"
              color="$color"
              backgroundColor="$gray2"
              borderWidth={1}
              borderRadius="$4"
            />
          )}
        />
        <ErrorMsg name="targetAmount" />
      </YStack>

      {showMonthlyQuota && (
        <YStack space="$2">
          <Label fontSize="$3" color="$gray11" fontWeight="600">
            {isHousing
              ? "Dividendo Mensual (Opcional)"
              : "Cuota Mensual Mínima"}
          </Label>
          <Controller
            control={control}
            name="monthlyQuota"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder={
                  isHousing ? "0 (Si estás ahorrando para el pie)" : "0"
                }
                placeholderTextColor="$gray8"
                keyboardType={
                  selectedCurrency === "CLP" ? "number-pad" : "decimal-pad"
                }
                onBlur={onBlur}
                onChangeText={(text: string) =>
                  onChange(formatInputByCurrency(text, selectedCurrency))
                }
                value={value?.toString()}
                backgroundColor="$gray2"
                borderColor={errors.monthlyQuota ? "$red8" : "$borderColor"}
                borderWidth={1}
                borderRadius="$4"
              />
            )}
          />
          {isHousing && (
            <Text fontSize={10} color="$gray10" marginLeft="$1">
              * Déjalo vacío si aún no compras la casa. Llénalo si ya pagas
              crédito.
            </Text>
          )}
          <ErrorMsg name="monthlyQuota" />
        </YStack>
      )}

      {(isDebt || isHousing) && (
        <YStack space="$2">
          <Label fontSize="$3" color="$gray11" fontWeight="600">
            Día de Vencimiento de Cuota (1-31)
          </Label>
          <Controller
            control={control}
            name="monthlyDueDay"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ej: 5 (Día 5 de cada mes)"
                placeholderTextColor="$gray8"
                keyboardType="number-pad"
                onBlur={onBlur}
                maxLength={2}
                onChangeText={(text) => {
                  const num = text.replace(/[^0-9]/g, "");
                  if (Number(num) > 31) return; 
                  onChange(num);
                }}
                value={value?.toString()}
                backgroundColor="$gray2"
                borderColor={errors.monthlyDueDay ? "$red8" : "$borderColor"}
                borderWidth={1}
                borderRadius="$4"
              />
            )}
          />
          <Text fontSize={11} color="$gray9" marginLeft="$1">
            Te avisaremos si te atrasas en tu pago mensual.
          </Text>
          <ErrorMsg name="monthlyDueDay" />
        </YStack>
      )}

      {showYield && (
        <YStack space="$2">
          <Label fontSize="$3" color="$gray11" fontWeight="600">
            Ingreso Mensual Estimado (Arriendo)
          </Label>
          <Controller
            control={control}
            name="estimatedYield"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ej: Si compras para arrendar"
                placeholderTextColor="$gray8"
                keyboardType={
                  selectedCurrency === "CLP" ? "number-pad" : "decimal-pad"
                }
                onBlur={onBlur}
                onChangeText={(text: string) =>
                  onChange(formatInputByCurrency(text, selectedCurrency))
                }
                value={value?.toString()}
                backgroundColor="$gray2"
                borderColor={errors.estimatedYield ? "$red8" : "$borderColor"}
                borderWidth={1}
                borderRadius="$4"
              />
            )}
          />
          <ErrorMsg name="estimatedYield" />
        </YStack>
      )}
      {!isEditing && (
        <YStack>
          <XStack justifyContent="space-between">
            <Label
              fontSize="$3"
              color="$gray11"
              fontWeight="600"
              marginBottom="$2"
            >
              ¿Ya tienes algo ahorrado?
            </Label>
            <Stack
              backgroundColor="$green2"
              paddingHorizontal="$2"
              borderRadius="$4"
              height={20}
              justifyContent="center"
            >
              <Text fontSize={10} color="$green11" fontWeight="700">
                OPCIONAL
              </Text>
            </Stack>
          </XStack>

          <Controller
            control={control}
            name="currentAmount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="0"
                placeholderTextColor="$gray8"
                keyboardType={
                  selectedCurrency === "CLP" ? "number-pad" : "decimal-pad"
                }
                onBlur={onBlur}
                onChangeText={(text: string) =>
                  onChange(formatInputByCurrency(text, selectedCurrency))
                }
                value={value}
                backgroundColor="$gray2"
                borderColor="$borderColor"
                borderWidth={1}
                borderRadius="$4"
              />
            )}
          />
        </YStack>
      )}

      <YStack>
        <Label fontSize="$3" color="$gray11" fontWeight="600" marginBottom="$2">
          Fecha objetivo
        </Label>
        <Controller
          control={control}
          name="deadline"
          render={({ field: { value, onChange } }) => (
            <>
              <Button
                variant="outlined"
                icon={<Calendar size={18} color="$gray10" />}
                justifyContent="flex-start"
                borderColor={errors.deadline ? "$red8" : "$borderColor"}
                onPress={() => setShowDatePicker(true)}
                backgroundColor="$gray2"
                color={value ? "$color" : "$gray8"}
              >
                {value ? value.toLocaleDateString() : "Seleccionar fecha"}
              </Button>

              {showDatePicker && (
                <DateTimePicker
                  value={value instanceof Date ? value : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date()}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS === "android") setShowDatePicker(false);
                    if (event.type === "set" && selectedDate)
                      onChange(selectedDate);
                  }}
                />
              )}
              {Platform.OS === "ios" && showDatePicker && (
                <Button
                  size="$3"
                  marginTop="$2"
                  onPress={() => setShowDatePicker(false)}
                  theme="active"
                >
                  Confirmar Fecha
                </Button>
              )}
            </>
          )}
        />
        <ErrorMsg name="deadline" />
      </YStack>
      {showInterestField && interestInfo && (
        <YStack
          animation="medium"
          enterStyle={{ opacity: 0, scale: 0.95, y: -5 }}
          space="$2"
          marginTop="$2"
        >
          <Label fontSize="$3" color="$gray11" fontWeight="600">
            {interestInfo.label}
          </Label>

          <Controller
            control={control}
            name="interestRate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Ej: 12.5"
                placeholderTextColor="$gray8"
                keyboardType="decimal-pad"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                backgroundColor="$gray2"
                borderColor="$borderColor"
              />
            )}
          />

          <XStack
            backgroundColor={interestInfo.bg}
            padding="$3"
            borderRadius="$6"
            space="$3"
            alignItems="flex-start"
            borderColor={interestInfo.border}
            borderWidth={1}
          >
            <interestInfo.icon
              size={20}
              color={interestInfo.textCol}
              marginTop={2}
            />
            <Text
              fontSize="$3"
              color={interestInfo.textCol}
              flex={1}
              lineHeight={18}
            >
              {interestInfo.text}
            </Text>
          </XStack>
          <ErrorMsg name="interestRate" />
        </YStack>
      )}
    </YStack>
  );
};
