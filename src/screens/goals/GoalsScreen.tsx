import {
  YStack,
  Text,
  Button,
  Spinner,
  XStack,
  ScrollView,
  Circle,
} from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useMyGoals } from "../../hooks/useMyGoals";
import { GoalCard } from "../../components/goals/GoalCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, RefreshControl, Vibration } from "react-native";
import { useState, useCallback } from "react";
import { useGoalMutations } from "../../hooks/goals/useGoalMutations";
import { GoalOptionsSheet } from "../../components/goals/GoalOptionsSheet";
import { FinancialGoal } from "../../types/goal.types";
import { GoBackButton } from "../../components/ui/GoBackButton";

export const GoalsScreen = () => {
  const navigation = useNavigation<any>();
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const { goals, isLoading, refetch } = useMyGoals();

  const { deleteGoal, isMutating } = useGoalMutations();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openSheet, setOpenSheet] = useState(false);

  const handleCreateGoal = () => {
    navigation.navigate("CreateGoal");
  };

  const handleLongPress = useCallback((goal: FinancialGoal) => {
    Vibration.vibrate(50);
    setSelectedGoal(goal);
    setTimeout(() => {
      setOpenSheet(true);
    }, 100);
  }, []);

  const handleDelete = () => {
    if (!selectedGoal) return;

    Alert.alert(
      "¿Eliminar meta?",
      `Estás a punto de borrar "${selectedGoal.name}".`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            const idToDelete = selectedGoal.id;
            setDeletingId(idToDelete);
            setOpenSheet(false);
            deleteGoal(idToDelete, async () => {
              await refetch();
              setDeletingId(null);
              setSelectedGoal(null);
            });
          },
        },
      ]
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
        >
          <YStack paddingHorizontal="$4" paddingTop="$2" marginBottom="$6">
            <XStack justifyContent="space-between" alignItems="center">
              <GoBackButton />
              <Button
                size="$3"
                circular
                backgroundColor="$color"
                color="$background"
                icon={<Plus size={20} />}
                onPress={handleCreateGoal}
                elevation={4}
              />
            </XStack>

            <YStack marginTop="$4">
              <Text
                fontSize="$9"
                fontWeight="900"
                letterSpacing={-0.5}
                lineHeight={40}
              >
                Mi Billetera
              </Text>
              <Text
                fontSize="$9"
                fontWeight="900"
                color="$brand"
                letterSpacing={-0.5}
                lineHeight={40}
              >
                de Metas
              </Text>
              <Text fontSize="$4" color="$gray10" marginTop="$2">
                {isLoading
                  ? "Cargando..."
                  : `Tienes ${goals.length} objetivos activos`}
              </Text>
            </YStack>
          </YStack>

          {isLoading && goals.length === 0 ? (
            <YStack height={300} justifyContent="center" alignItems="center">
              <Spinner size="large" color="$brand" />
            </YStack>
          ) : (
            <YStack paddingHorizontal="$4" marginTop="$2">
              {goals.length === 0 ? (
                <YStack
                  height={300}
                  justifyContent="center"
                  alignItems="center"
                  space="$4"
                  opacity={0.8}
                >
                  <Circle size={80} backgroundColor="$color2">
                    <Plus size={40} color="$brand" />
                  </Circle>
                  <YStack alignItems="center">
                    <Text fontSize="$5" fontWeight="700">
                      Comienza tu viaje
                    </Text>
                    <Text
                      textAlign="center"
                      color="$gray10"
                      maxWidth={250}
                      marginTop="$2"
                    >
                      Crea tu primera meta financiera y deja que el algoritmo
                      haga su magia.
                    </Text>
                  </YStack>
                  <Button
                    backgroundColor="$brand"
                    color="white"
                    fontWeight="bold"
                    paddingHorizontal="$6"
                    onPress={handleCreateGoal}
                    marginTop="$4"
                  >
                    Crear Meta
                  </Button>
                </YStack>
              ) : (
                <YStack paddingTop="$2">
                  {goals.map((goal, index) => {
                    const isFocused = selectedGoal?.id === goal.id;
                    const shouldStayLifted =
                      (isFocused && openSheet) || deletingId === goal.id;

                    return (
                      <GoalCard
                        key={goal.id}
                        goal={goal}
                        index={index}
                        total={goals.length}
                        isSelected={shouldStayLifted}
                        onPress={() => {
                          navigation.navigate("GoalDetail", {
                            goalId: goal.id,
                            goal,
                          });
                        }}
                        onLongPress={() => handleLongPress(goal)}
                      />
                    );
                  })}

                  <YStack height={50 * (goals.length - 1)} />
                </YStack>
              )}
            </YStack>
          )}
        </ScrollView>
      </SafeAreaView>
      <GoalOptionsSheet
        open={openSheet}
        onOpenChange={(isOpen) => {
          setOpenSheet(isOpen);
          if (!isOpen && !isMutating && !deletingId) {
            setTimeout(() => setSelectedGoal(null), 300);
          }
        }}
        onDelete={handleDelete}
        goal={selectedGoal}
      />
    </YStack>
  );
};
