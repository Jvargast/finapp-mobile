import { XStack, YStack, Text, Card, Theme } from "tamagui";
import { Target, Home, TrendingUp, CreditCard } from "@tamagui/lucide-icons";
import { GoalType } from "../../types/goal.types";

interface GoalTypeSelectorProps {
  value: GoalType;
  onChange: (type: GoalType) => void;
}

const GOAL_OPTIONS = [
  {
    id: GoalType.SAVING,
    label: "Ahorro / Emergencia",
    icon: Target,
    color: "$green9",
  },
  {
    id: GoalType.DEBT,
    label: "Salir de Deudas",
    icon: CreditCard,
    color: "$red9",
  },
  { id: GoalType.PURCHASE, label: "Comprar Algo", icon: Home, color: "$blue9" },
  {
    id: GoalType.INVESTMENT,
    label: "Inversión / Retiro",
    icon: TrendingUp,
    color: "$purple9",
  },
];

export const GoalTypeSelector = ({
  value,
  onChange,
}: GoalTypeSelectorProps) => {
  return (
    <YStack space="$3">
      <Text fontSize="$4" fontWeight="600" color="$gray11">
        ¿Qué tipo de meta es?
      </Text>
      <XStack flexWrap="wrap" gap="$3" justifyContent="space-between">
        {GOAL_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          const Icon = option.icon;

          return (
            <Card
              key={option.id}
              width="48%" 
              bordered
              animation="quick"
              pressStyle={{ scale: 0.97 }}
              onPress={() => onChange(option.id)}
              backgroundColor={isSelected ? option.color : "$background"}
              borderColor={isSelected ? option.color : "$borderColor"}
              elevation={isSelected ? 4 : 0}
            >
              <YStack padding="$3" alignItems="center" space="$2">
                <Icon size={28} color={isSelected ? "white" : option.color} />
                <Text
                  fontSize="$3"
                  fontWeight="600"
                  textAlign="center"
                  color={isSelected ? "white" : "$color"}
                >
                  {option.label}
                </Text>
              </YStack>
            </Card>
          );
        })}
      </XStack>
    </YStack>
  );
};
