import { useState } from "react";
import { Alert } from "react-native";
import { GoalService } from "../../services/goalService";

export const useGoalMutations = () => {
  const [isMutating, setIsMutating] = useState(false);

  const deleteGoal = async (id: string, onSuccess?: () => void) => {
    try {
      setIsMutating(true);
      await GoalService.delete(id);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error eliminando meta:", error);
      Alert.alert("Error", "No se pudo eliminar la meta. Intenta nuevamente.");
    } finally {
      setIsMutating(false);
    }
  };

  return {
    deleteGoal,
    isMutating,
  };
};
