import React from "react";
import {
  YStack,
  ScrollView,
  Button,
  Separator,
  Spinner,
  Text,
  XStack,
} from "tamagui";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Lock } from "@tamagui/lucide-icons";
import { GoalFormFields } from "../../components/goals/GoalFormFields";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { FinancialGoal, GoalType } from "../../types/goal.types";
import { useGoalForm } from "../../hooks/goals/useCreateGoalForm";

export const EditGoalScreen = () => {
  const route = useRoute<any>();
  const goalToEdit: FinancialGoal = route.params?.goal;
  const { form, submit, isSubmitting } = useGoalForm(goalToEdit);
  const selectedType = goalToEdit.type;
  const showInterestField =
    selectedType === GoalType.DEBT || selectedType === GoalType.INVESTMENT;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingHorizontal="$4" paddingTop="$2">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$4"
          paddingVertical="$2"
        >
          <GoBackButton />
          <YStack alignItems="center">
            <Text
              fontSize="$4"
              fontWeight="800"
              color="$color"
              numberOfLines={1}
            >
              Editar Meta
            </Text>
            <Text
              fontSize={10}
              color="$gray9"
              textTransform="uppercase"
              letterSpacing={1}
              fontWeight="600"
            >
              {selectedType}
            </Text>
          </YStack>
          <YStack width={40} />
        </XStack>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <YStack space="$5" paddingBottom="$10">
            <YStack
              backgroundColor="$gray2"
              padding="$3"
              borderRadius="$4"
              borderWidth={1}
              borderColor="$gray4"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <YStack>
                  <Text
                    fontSize="$2"
                    color="$gray10"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    Tipo de Meta
                  </Text>
                  <Text
                    fontSize="$5"
                    fontWeight="800"
                    color="$gray12"
                    marginTop="$1"
                  >
                    {selectedType === "DEBT"
                      ? "Pagar Deuda"
                      : selectedType === "SAVING"
                      ? "Ahorro Libre"
                      : selectedType}
                  </Text>
                </YStack>
                <Lock size={20} color="$gray9" />
              </XStack>

              <Text
                fontSize="$2"
                color="$gray9"
                marginTop="$2"
                fontStyle="italic"
              >
                El tipo de meta no se puede modificar una vez creada.
              </Text>
            </YStack>

            <Separator borderColor="$gray4" />

            <GoalFormFields
              control={form.control}
              errors={form.formState.errors}
              showInterestField={showInterestField}
              goalType={selectedType}
              isEditing={true}
            />

            <Button
              size="$5"
              backgroundColor="$brand"
              color="white"
              fontWeight="bold"
              marginTop="$4"
              onPress={submit}
              disabled={isSubmitting}
              icon={isSubmitting ? <Spinner color="white" /> : undefined}
              borderRadius="$10"
            >
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </YStack>
        </ScrollView>
      </YStack>
    </SafeAreaView>
  );
};
