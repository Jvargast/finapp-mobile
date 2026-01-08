import { useState, useCallback } from "react";
import { GoalService } from "../services/goalService";
import { FinancialGoal, GoalType } from "../types/goal.types";
import { useFocusEffect } from "@react-navigation/native";
import { useUserStore } from "../stores/useUserStore"; 

export const useMyGoals = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const userPreferences = useUserStore((state) => state.user?.preferences);
  const mainGoal = userPreferences?.mainGoal || "save"; 

  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const data = await GoalService.getAll();

      const sortedData = data.sort((a, b) => {
        const priority = getPriority(mainGoal); 

        const isAPriority = priority.includes(a.type);
        const isBPriority = priority.includes(b.type);

        if (isAPriority && !isBPriority) return -1; 
        if (!isAPriority && isBPriority) return 1; 
        return 0; 
      });

      setGoals(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGoals();
    }, [mainGoal]) 
  );

  return { goals, isLoading, refetch: fetchGoals };
};

const getPriority = (preference: string): GoalType[] => {
  switch (preference) {
    case "debt":
      return [GoalType.DEBT];
    case "invest":
    case "retire":
      return [GoalType.INVESTMENT];
    case "house":
      return [GoalType.PURCHASE];
    case "control": 
    case "save":
    default:
      return [GoalType.SAVING];
  }
};
