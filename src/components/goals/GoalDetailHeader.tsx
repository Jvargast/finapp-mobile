import React, { useState } from "react";
import { XStack, Button, Text } from "tamagui";
import { MoreVertical } from "@tamagui/lucide-icons";
import { GoBackButton } from "../ui/GoBackButton";
import { FinancialGoal } from "../../types/goal.types";
import { GoalOptionsSheet } from "./GoalOptionsSheet";

interface GoalDetailHeaderProps {
  title: string;
  type: string;
  goal: FinancialGoal;
  onGoalUpdate: () => void;
}

export const GoalDetailHeader = ({
  title,
  type,
  goal,
  onGoalUpdate,
}: GoalDetailHeaderProps) => {
  const [isOptionsOpen, setOptionsOpen] = useState(false);

  return (
    <>
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal="$4"
        paddingTop="$2"
        paddingBottom="$4"
        backgroundColor="$background"
      >
        <GoBackButton />

        <XStack flexDirection="column" alignItems="center">
          <Text
            fontSize="$4"
            fontWeight="800"
            color="$color"
            numberOfLines={1}
            maxWidth={200}
          >
            {title}
          </Text>
          <Text
            fontSize={10}
            color="$gray9"
            textTransform="uppercase"
            letterSpacing={1}
            fontWeight="600"
          >
            {type}
          </Text>
        </XStack>

        <Button
          size="$3"
          circular
          backgroundColor="$gray2"
          icon={<MoreVertical size={20} color="$gray11" />}
          onPress={() => setOptionsOpen(true)}
          chromeless
        />
      </XStack>

      <GoalOptionsSheet
        open={isOptionsOpen}
        onOpenChange={setOptionsOpen}
        goal={goal}
        onGoalUpdate={onGoalUpdate}
      />
    </>
  );
};
