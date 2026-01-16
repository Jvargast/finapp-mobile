import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { GoalService } from "../../services/goalService";
import { useUserStore } from "../../stores/useUserStore";
import { GoalType, FinancialGoal } from "../../types/goal.types";
import { useToastStore } from "../../stores/useToastStore";
import {
  createGoalSchema,
  CreateGoalFormOutput,
  CreateGoalFormInputs,
} from "../../screens/goals/createGoal.schema";

export const useGoalForm = (goalToEdit?: FinancialGoal) => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  const userPreference = useUserStore(
    (state) => state.user?.preferences?.mainGoal
  );

  const getDefaultType = (): GoalType => {
    if (userPreference === "debt") return GoalType.DEBT;
    if (userPreference === "invest" || userPreference === "retire")
      return GoalType.INVESTMENT;
    if (userPreference === "house") return GoalType.HOUSING;
    return GoalType.SAVING;
  };

  const defaultValues = useMemo(() => {
    if (goalToEdit) {
      return {
        type: goalToEdit.type,
        currency: goalToEdit.currency,
        name: goalToEdit.name,
        targetAmount: String(goalToEdit.targetAmount),
        currentAmount: String(goalToEdit.currentAmount || 0),
        monthlyQuota: String(goalToEdit.monthlyQuota || 0),
        estimatedYield: String(goalToEdit.estimatedYield || 0),
        interestRate: String(goalToEdit.interestRate || 0),
        monthlyDueDay: goalToEdit.monthlyDueDay
          ? String(goalToEdit.monthlyDueDay)
          : "",
        deadline: goalToEdit.deadline
          ? new Date(goalToEdit.deadline)
          : undefined,
      };
    }

    return {
      type: getDefaultType(),
      currency: "CLP",
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: undefined,
      monthlyQuota: "",
      estimatedYield: "",
      monthlyDueDay: "",
    };
  }, [goalToEdit, userPreference]);

  const form = useForm<CreateGoalFormInputs>({
    resolver: zodResolver(createGoalSchema) as any,
    mode: "onBlur",
    defaultValues: defaultValues as any,
  });

  const onSubmit = async (data: CreateGoalFormOutput) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...data,
        deadline: data.deadline.toISOString(),
      };

      if (goalToEdit) {
        await GoalService.update(goalToEdit.id, payload);
        showToast("Meta actualizada correctamente", "success");
      } else {
        await GoalService.create(payload);
        showToast("Meta creada con éxito", "success");
      }

      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error submit meta:", error);
      showToast(
        goalToEdit ? "Error al actualizar" : "No se pudo crear la meta",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submit: form.handleSubmit(onSubmit as any),
    watch: form.watch,
    isEditing: !!goalToEdit,
  };
};
