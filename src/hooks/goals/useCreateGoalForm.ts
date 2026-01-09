import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigation } from "@react-navigation/native";
import { GoalService } from "../../services/goalService";
import { useUserStore } from "../../stores/useUserStore";
import { GoalType } from "../../types/goal.types";
import {
  createGoalSchema,
  CreateGoalFormOutput,
  CreateGoalFormInputs,
} from "../../screens/goals/createGoal.schema";

export const useCreateGoalForm = () => {
  const navigation = useNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const form = useForm<CreateGoalFormInputs>({
    resolver: zodResolver(createGoalSchema) as any,
    mode: "onBlur",
    defaultValues: {
      type: getDefaultType(),
      currency: "CLP",
      name: "",
      targetAmount: "",
      currentAmount: "",
      deadline: undefined,
      monthlyQuota: "",
      estimatedYield: "",
    },
  });

  const onSubmit = async (data: CreateGoalFormOutput) => {
    try {
      setIsSubmitting(true);

      await GoalService.create({
        ...data,
        deadline: data.deadline.toISOString(),
      });

      if (navigation.canGoBack()) {
        navigation.goBack();
        // Opcional: navigation.navigate('GoalDetail', { goalId: newGoal.id });
      }
    } catch (error) {
      console.error("Error creando meta:", error);
      alert("No se pudo crear la meta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    submit: form.handleSubmit(onSubmit as any),
    watch: form.watch,
  };
};
