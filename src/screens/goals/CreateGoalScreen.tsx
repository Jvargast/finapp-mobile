import React from "react";
import { YStack, ScrollView, Button, Separator, Spinner } from "tamagui";
import { Controller } from "react-hook-form";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreateGoalHeader } from "../../components/goals/CreateGoalHeader";
import { GoalTypeSelector } from "../../components/goals/GoalTypeSelector";
import { GoalFormFields } from "../../components/goals/GoalFormFields";
import { GoalType } from "../../types/goal.types";
import { useGoalForm } from "../../hooks/goals/useCreateGoalForm";

export const CreateGoalScreen = () => {
  const { form, submit, isSubmitting, watch } = useGoalForm();

  const selectedType = watch("type");
  const showInterestField =
    selectedType === GoalType.DEBT || selectedType === GoalType.INVESTMENT;

  return (
    <YStack flex={1} backgroundColor="$background">
      <SafeAreaView style={{ flex: 1 }}>
        <YStack flex={1} paddingHorizontal="$4" paddingTop="$2">
          <CreateGoalHeader />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <YStack space="$5" paddingBottom="$10">
              <Controller
                control={form.control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <GoalTypeSelector value={value} onChange={onChange} />
                )}
              />

              <Separator />

              <GoalFormFields
                control={form.control}
                errors={form.formState.errors}
                showInterestField={showInterestField}
                goalType={selectedType}
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
              >
                {isSubmitting ? "Creando..." : "Crear Meta"}
              </Button>
            </YStack>
          </ScrollView>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
};
