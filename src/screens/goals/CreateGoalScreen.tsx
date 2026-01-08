import React, { useState } from "react";
import { Platform } from "react-native";
import {
  YStack,
  Text,
  Input,
  Button,
  ScrollView,
  XStack,
  Separator,
  Label,
  Spinner,
} from "tamagui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, ChevronLeft } from "@tamagui/lucide-icons";

// Asegúrate de que estos imports existan en tu proyecto
import { createGoalSchema, CreateGoalFormValues } from "./createGoal.schema";
import { GoalTypeSelector } from "../../components/goals/GoalTypeSelector";
import { GoalType } from "../../types/goal.types";
import { GoalService } from "../../services/goalService";
import { useUserStore } from "../../stores/useUserStore";

export const CreateGoalScreen = () => {
  const navigation = useNavigation();
  const userPreference = useUserStore(
    (state) => state.user?.preferences?.mainGoal
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Controla la visibilidad del picker (Solo afecta a Android y modo Modal iOS)
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Lógica para pre-seleccionar el tipo basado en la preferencia
  const getDefaultType = (): GoalType => {
    if (userPreference === "debt") return GoalType.DEBT;
    if (userPreference === "invest" || userPreference === "retire")
      return GoalType.INVESTMENT;
    if (userPreference === "house") return GoalType.PURCHASE;
    return GoalType.SAVING;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      type: getDefaultType(),
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: undefined,
    },
  });

  const selectedType = watch("type");
  const showInterestField =
    selectedType === GoalType.DEBT || selectedType === GoalType.INVESTMENT;

  const onSubmit = async (data: CreateGoalFormValues) => {
    try {
      setIsSubmitting(true);
      // El schema de Zod ya se encargó de las transformaciones de string a number
      await GoalService.create({
        ...data,
        deadline: data.deadline.toISOString(),
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error creando meta:", error);
      alert("No se pudo crear la meta. Revisa tu conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ErrorMessage = ({ error }: { error?: any }) =>
    error ? (
      <Text color="$red10" fontSize="$2" marginTop="$1" fontWeight="500">
        {error.message}
      </Text>
    ) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingHorizontal="$4" paddingTop="$2">
        {/* Header */}
        <XStack alignItems="center" space="$3" marginBottom="$4">
          <Button
            unstyled
            icon={ChevronLeft}
            onPress={() => navigation.goBack()}
            color="$gray11"
            pressStyle={{ opacity: 0.5 }}
          />
          <Text fontSize="$6" fontWeight="bold">
            Nueva Meta
          </Text>
        </XStack>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled" // Importante para cerrar teclado al tocar fuera
        >
          <YStack space="$5" paddingBottom="$10">
            {/* 1. Selector Visual de Tipo */}
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <GoalTypeSelector value={value} onChange={onChange} />
              )}
            />

            <Separator />

            {/* 2. Formulario */}
            <YStack space="$4">
              {/* Nombre */}
              <YStack>
                <Label htmlFor="name" color="$gray11" fontSize="$3">
                  Nombre de la meta
                </Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      id="name"
                      placeholder="Ej: Vacaciones, Pagar Crédito..."
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      borderColor={errors.name ? "$red8" : "$borderColor"}
                      backgroundColor="$background"
                    />
                  )}
                />
                <ErrorMessage error={errors.name} />
              </YStack>

              {/* Monto Objetivo */}
              <YStack>
                <Label htmlFor="target" color="$gray11" fontSize="$3">
                  Monto objetivo ($)
                </Label>
                <Controller
                  control={control}
                  name="targetAmount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      id="target"
                      placeholder="0"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value?.toString()}
                      borderColor={
                        errors.targetAmount ? "$red8" : "$borderColor"
                      }
                      fontSize="$5"
                      fontWeight="bold"
                      backgroundColor="$background"
                    />
                  )}
                />
                <ErrorMessage error={errors.targetAmount} />
              </YStack>

              {/* Monto Actual */}
              <YStack>
                <Label htmlFor="current" color="$gray11" fontSize="$3">
                  ¿Ya tienes algo ahorrado? (Opcional)
                </Label>
                <Controller
                  control={control}
                  name="currentAmount"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      id="current"
                      placeholder="0"
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value?.toString()}
                      backgroundColor="$background"
                    />
                  )}
                />
                <ErrorMessage error={errors.currentAmount} />
              </YStack>

              {/* Fecha Límite - Lógica Corregida */}
              <YStack>
                <Label color="$gray11" fontSize="$3">
                  Fecha objetivo
                </Label>
                <Controller
                  control={control}
                  name="deadline"
                  render={({ field: { value, onChange } }) => {
                    const dateValue =
                      value instanceof Date ? value : new Date();

                    return (
                      <>
                        <Button
                          variant="outlined"
                          icon={Calendar}
                          justifyContent="flex-start"
                          borderColor={
                            errors.deadline ? "$red8" : "$borderColor"
                          }
                          onPress={() => setShowDatePicker(true)}
                          backgroundColor="$background"
                        >
                          {value
                            ? value.toLocaleDateString()
                            : "Seleccionar fecha"}
                        </Button>

                        {/* El DatePicker se renderiza condicionalmente */}
                        {showDatePicker && (
                          <DateTimePicker
                            testID="dateTimePicker"
                            value={dateValue}
                            mode="date"
                            display={
                              Platform.OS === "ios" ? "spinner" : "default"
                            }
                            minimumDate={new Date()}
                            onChange={(event, selectedDate) => {
                              // En Android, el picker se cierra al seleccionar
                              if (Platform.OS === "android") {
                                setShowDatePicker(false);
                              }
                              // Si el usuario cancela (Android), selectedDate es undefined
                              if (event.type === "set" && selectedDate) {
                                onChange(selectedDate);
                              }
                            }}
                          />
                        )}

                        {/* Botón "Listo" solo para iOS (porque spinner no tiene botón OK) */}
                        {Platform.OS === "ios" && showDatePicker && (
                          <XStack justifyContent="flex-end" marginTop="$2">
                            <Button
                              size="$3"
                              onPress={() => setShowDatePicker(false)}
                              theme="active"
                            >
                              Confirmar Fecha
                            </Button>
                          </XStack>
                        )}
                      </>
                    );
                  }}
                />
                <ErrorMessage error={errors.deadline} />
              </YStack>

              {/* Campos opcionales (Tasa) */}
              {showInterestField && (
                <YStack animation="quick" enterStyle={{ opacity: 0, y: -10 }}>
                  <Label htmlFor="interest" color="$gray11" fontSize="$3">
                    {selectedType === GoalType.DEBT
                      ? "Tasa de Interés Anual (%)"
                      : "Retorno Estimado Anual (%)"}
                  </Label>
                  <Controller
                    control={control}
                    name="interestRate"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        id="interest"
                        placeholder="Ej: 15.5"
                        keyboardType="decimal-pad"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value?.toString()}
                        backgroundColor="$background"
                      />
                    )}
                  />
                  <Text fontSize="$2" color="$gray10" marginTop="$1">
                    Opcional. Ayuda al algoritmo a calcular proyecciones.
                  </Text>
                  <ErrorMessage error={errors.interestRate} />
                </YStack>
              )}
            </YStack>

            {/* Submit Button */}
            <Button
              size="$5"
              backgroundColor="$brand"
              color="white"
              fontWeight="bold"
              marginTop="$4"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              icon={isSubmitting ? <Spinner color="white" /> : undefined}
            >
              {isSubmitting ? "Creando..." : "Crear Meta"}
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
};
