import React, { useMemo, useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Card,
  Separator,
  Progress,
  Button,
} from "tamagui";
import {
  Target,
  Wallet,
  CalendarClock,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
} from "@tamagui/lucide-icons";
import { GoalTransaction, SavingsAnalysis } from "../../types/goal.types";
import { formatGoalAmount } from "../../utils/formatMoney";
import { isSameMonth, isSameYear, format } from "date-fns";
import { es } from "date-fns/locale";
import { GoalService } from "../../services/goalService";
import { useToastStore } from "../../stores/useToastStore";
import { ActionModal } from "../ui/ActionModal";

interface SavingsDetailViewProps {
  goalId: string;
  onGoalUpdate: () => void;
  analysis: SavingsAnalysis;
  currency: string;
  isHousing?: boolean;
  transactions?: GoalTransaction[];
  deadline: string | Date;
}

export const SavingsDetailView = ({
  goalId,
  onGoalUpdate,
  analysis,
  currency,
  isHousing,
  transactions = [],
  deadline,
}: SavingsDetailViewProps) => {
  const targetDateFormatted = useMemo(() => {
    if (!deadline) return "Sin fecha definida";
    return format(new Date(deadline), "d 'de' MMMM, yyyy", { locale: es });
  }, [deadline]);

  const gap = analysis.requiredMonthly - (analysis.yourCapacity || 0);

  const [showRecalibrateModal, setShowRecalibrateModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const showToast = useToastStore((state) => state.showToast);

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    return transactions
      .filter((tx) => {
        const txDate = new Date(tx.date);
        return isSameMonth(txDate, now) && isSameYear(txDate, now);
      })
      .reduce((sum, tx) => {
        const amount = Number(tx.amount);
        return tx.type === "DEPOSIT" ? sum + amount : sum - amount;
      }, 0);
  }, [transactions]);

  const targetDenominator =
    analysis.committedMonthly && analysis.committedMonthly > 0
      ? analysis.committedMonthly
      : analysis.requiredMonthly;

  const monthProgress =
    targetDenominator > 0
      ? Math.min((currentMonthStats / targetDenominator) * 100, 100)
      : 0;

  const isMonthCompleted = monthProgress >= 100;
  const currentMonthName = new Date().toLocaleString("es-CL", {
    month: "long",
  });

  const difference = analysis.requiredMonthly - targetDenominator;
  const needsAdjustment = difference > targetDenominator * 0.1;

  const plan = targetDenominator;
  const reality = analysis.requiredMonthly;
  const diff = reality - plan;

  const isWorthUpdating = Math.abs(diff) > plan * 0.01;
  const isOptimization = diff < 0;

  const handleOpenRecalibrate = () => {
    setShowRecalibrateModal(true);
  };

  const confirmRecalibration = async () => {
    setIsUpdating(true);
    try {
      await GoalService.update(goalId, { monthlyQuota: reality });
      onGoalUpdate();
      setShowRecalibrateModal(false);
    } catch (error: any) {
      console.error("❌ ERROR AXIOS:", error.message);
      console.log("URL FALLIDA:", error.config?.url);
      console.log("MÉTODO:", error.config?.method);
      showToast("Error al recalibrar meta", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <YStack space="$4">
      <Card
        bordered
        borderWidth={1}
        borderColor="$gray4"
        padding="$4"
        backgroundColor="$gray2"
      >
        <XStack justifyContent="space-between" marginBottom="$2">
          <XStack alignItems="center" space="$2">
            <CalendarClock size={16} color="$gray10" />
            <Text
              fontSize="$3"
              fontWeight="800"
              color="$gray11"
              textTransform="capitalize"
            >
              Meta de {currentMonthName}
            </Text>
          </XStack>
          {isMonthCompleted && (
            <XStack
              alignItems="center"
              space="$1"
              backgroundColor="$green3"
              paddingHorizontal="$2"
              borderRadius="$4"
            >
              <CheckCircle2 size={12} color="$green10" />
              <Text fontSize={10} color="$green10" fontWeight="bold">
                LOGRADO
              </Text>
            </XStack>
          )}
        </XStack>

        <XStack alignItems="flex-end" space="$2" marginBottom="$2">
          <Text
            fontSize="$8"
            fontWeight="900"
            color={isMonthCompleted ? "$green9" : "$gray12"}
          >
            {formatGoalAmount(currentMonthStats, currency)}
          </Text>
          <Text fontSize="$3" color="$gray9" marginBottom={4}>
            / {formatGoalAmount(targetDenominator, currency)}
          </Text>
        </XStack>

        <Progress value={monthProgress} size="$2" backgroundColor="$gray5">
          <Progress.Indicator
            animation="bouncy"
            backgroundColor={isMonthCompleted ? "$green9" : "$blue9"}
          />
        </Progress>

        <Text fontSize={11} color="$gray9" marginTop="$2">
          {isMonthCompleted
            ? "¡Excelente! Has cubierto la cuota de este mes."
            : `Te faltan ${formatGoalAmount(
                Math.max(0, targetDenominator - currentMonthStats),
                currency
              )} para tu meta mensual.`}
        </Text>
        {needsAdjustment && !isMonthCompleted && (
          <XStack
            marginTop="$2"
            backgroundColor="$orange2"
            padding="$2"
            borderRadius="$4"
            alignItems="center"
            space="$2"
          >
            <Text fontSize={10} color="$orange10">
              ⚠️ Ojo: Tu cuota pactada es baja. Para terminar a tiempo deberías
              abonar {formatGoalAmount(analysis.requiredMonthly, currency)}.
            </Text>
          </XStack>
        )}
      </Card>
      <XStack justifyContent="space-between" space="$2">
        <Card
          flex={1}
          padding="$3"
          backgroundColor="$blue2"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$blue4"
        >
          <Target size={20} color="$blue9" marginBottom="$2" />
          <Text fontSize="$2" color="$blue11" fontWeight="600">
            Tu Plan Mensual
          </Text>
          <Text fontSize="$5" fontWeight="900" color="$blue10">
            {formatGoalAmount(targetDenominator, currency)}
          </Text>
        </Card>

        <Card
          flex={1}
          padding="$3"
          backgroundColor={reality > plan ? "$orange2" : "$green2"}
          borderRadius="$4"
          borderWidth={1}
          borderColor={reality > plan ? "$orange4" : "$green4"}
        >
          {reality > plan ? (
            <TrendingUp size={20} color="$orange9" marginBottom="$2" />
          ) : (
            <TrendingDown size={20} color="$green9" marginBottom="$2" />
          )}

          <Text
            fontSize="$2"
            color={reality > plan ? "$orange11" : "$green11"}
            fontWeight="600"
          >
            {reality > plan ? "Necesitas subir a" : "Podrías bajar a"}
          </Text>

          <Text
            fontSize="$5"
            fontWeight="900"
            color={reality > plan ? "$orange10" : "$green10"}
          >
            {formatGoalAmount(reality, currency)}
          </Text>
        </Card>
      </XStack>

      {isWorthUpdating && (
        <Card
          bordered
          padding="$3"
          backgroundColor={isOptimization ? "$green2" : "$orange2"}
          borderColor={isOptimization ? "$green4" : "$orange4"}
          animation="quick"
        >
          <XStack alignItems="center" justifyContent="space-between">
            <YStack flex={1} paddingRight="$2">
              <Text
                fontWeight="700"
                color={isOptimization ? "$green11" : "$orange11"}
                fontSize="$3"
              >
                {isOptimization ? "Puedes pagar menos" : "Ajuste recomendado"}
              </Text>
              <Text
                fontSize="$2"
                color={isOptimization ? "$green10" : "$orange10"}
                lineHeight={16}
              >
                {isOptimization
                  ? `Vas tan bien que podrías bajar tu cuota a ${formatGoalAmount(
                      reality,
                      currency
                    )}.`
                  : `Actualiza tu plan a ${formatGoalAmount(
                      reality,
                      currency
                    )} para no perder la fecha.`}
              </Text>
            </YStack>
            <Button
              size="$3"
              theme={isOptimization ? "green" : "orange"}
              icon={
                isOptimization ? (
                  <TrendingDown size={16} />
                ) : (
                  <TrendingUp size={16} />
                )
              }
              onPress={handleOpenRecalibrate}
            >
              {isOptimization ? "Optimizar" : "Ajustar"}
            </Button>
          </XStack>
        </Card>
      )}

      <YStack
        backgroundColor="$gray2"
        padding="$4"
        borderRadius="$4"
        space="$3"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" fontWeight="700" color="$gray11">
            Proyección {isHousing ? "Inmobiliaria" : "de Ahorro"}
          </Text>
          <XStack alignItems="center" space="$2">
            <Text fontSize="$3" color="$gray10">
              {analysis.monthsLeft} meses restantes
            </Text>
          </XStack>
        </XStack>

        <Separator borderColor="$gray4" />
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$gray10">
            Fecha Objetivo:
          </Text>
          <Text fontSize="$3" color="$gray12" fontWeight="700">
            {targetDateFormatted}
          </Text>
        </XStack>
        <Text
          fontSize="$3"
          color={analysis.status === "AT_RISK" ? "$orange11" : "$gray11"}
          lineHeight={22}
          fontWeight={analysis.status === "AT_RISK" ? "600" : "400"}
        >
          {analysis.advice}
        </Text>
      </YStack>
      <ActionModal
        visible={showRecalibrateModal}
        onClose={() => setShowRecalibrateModal(false)}
        onConfirm={confirmRecalibration}
        isLoading={isUpdating}
        variant={isOptimization ? "success" : "warning"}
        title={isOptimization ? "¡Buenas noticias!" : "Ajuste de Plan"}
        message={
          isOptimization
            ? `Vas adelantado. ¿Quieres bajar tu cuota mensual oficial de ${formatGoalAmount(
                plan,
                currency
              )} a ${formatGoalAmount(reality, currency)}?`
            : `Para no perder la fecha meta, te recomendamos subir tu compromiso mensual de ${formatGoalAmount(
                plan,
                currency
              )} a ${formatGoalAmount(reality, currency)}.`
        }
        confirmText={isOptimization ? "Sí, bajar cuota" : "Sí, ajustar plan"}
        cancelText="No, dejar como está"
      />
    </YStack>
  );
};
