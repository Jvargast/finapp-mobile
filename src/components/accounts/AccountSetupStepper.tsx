import React from "react";
import { XStack, YStack, Text, Circle } from "tamagui";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export const AccountSetupStepper = ({ steps, currentStep }: StepperProps) => {
  return (
    <XStack alignItems="center" justifyContent="space-between">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <YStack key={label} alignItems="center" flex={1}>
            <Circle
              size={26}
              backgroundColor={isDone ? "$green9" : isActive ? "$brand" : "$gray3"}
              borderWidth={1}
              borderColor={isActive ? "$brand" : "$gray5"}
            >
              <Text
                fontSize={11}
                fontWeight="800"
                color={isDone || isActive ? "white" : "$gray9"}
              >
                {stepNumber}
              </Text>
            </Circle>
            <Text
              fontSize={9}
              fontWeight={isActive ? "800" : "600"}
              color={isActive ? "$color" : "$gray9"}
              textAlign="center"
              marginTop="$2"
            >
              {label}
            </Text>
          </YStack>
        );
      })}
    </XStack>
  );
};
