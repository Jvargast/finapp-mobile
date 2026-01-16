import React from "react";
import { XStack, YStack, Text, Stack } from "tamagui";
import {
  Target,
  TrendingDown,
  Building,
  TrendingUp,
  Briefcase,
  ShieldCheck,
} from "@tamagui/lucide-icons";
import { GoalType } from "../../types/goal.types";

interface GoalTypeSelectorProps {
  value: GoalType;
  onChange: (type: GoalType) => void;
}

const GOAL_OPTIONS = [
  {
    id: GoalType.SAVING,
    label: "Ahorro",
    description: "Fondo de emergencia",
    icon: Target,
    color: "$green10",
    bg: "$green3",
  },
  {
    id: GoalType.DEBT,
    label: "Salir de Deudas",
    description: "Eliminar cargas",
    icon: TrendingDown,
    color: "$red10",
    bg: "$red3",
  },
  {
    id: GoalType.HOUSING,
    label: "Casa Propia",
    description: "El sueño del hogar",
    icon: Building,
    color: "$blue10",
    bg: "$blue3",
  },
  {
    id: GoalType.CONTROL,
    label: "Control Gastos",
    description: "Optimizar dinero",
    icon: ShieldCheck,
    color: "$orange10",
    bg: "$orange3",
  },
  {
    id: GoalType.INVESTMENT,
    label: "Inversiones",
    description: "Crecer patrimonio",
    icon: TrendingUp,
    color: "$purple10",
    bg: "$purple3",
  },
  {
    id: GoalType.RETIREMENT,
    label: "Jubilación",
    description: "Futuro asegurado",
    icon: Briefcase,
    color: "$gray10",
    bg: "$gray3",
  },
];

export const GoalTypeSelector = ({
  value,
  onChange,
}: GoalTypeSelectorProps) => {
  return (
    <YStack space="$4">
      <YStack>
        <Text fontSize="$5" fontWeight="800" color="$color">
          ¿Qué quieres lograr?
        </Text>
        <Text fontSize="$3" color="$gray10" marginTop="$1">
          Elige el algoritmo que guiará tu plan.
        </Text>
      </YStack>

      <XStack flexWrap="wrap" justifyContent="space-between" gap="$3">
        {GOAL_OPTIONS.map((option) => {
          const isSelected = value === option.id;
          const Icon = option.icon;

          return (
            <Stack
              key={option.id}
              width="48%"
              onPress={() => onChange(option.id)}
              backgroundColor={isSelected ? option.color : "$color2"}
              borderColor={isSelected ? option.color : "$borderColor"}
              borderWidth={1.5}
              borderRadius="$6"
              padding="$3"
              height={110}
              justifyContent="space-between"
              shadowColor="$shadowColor"
              shadowOpacity={0.05}
              shadowRadius={4}
              shadowOffset={{ width: 0, height: 2 }}
              pressStyle={{ opacity: 0.7 }}
            >
              <XStack justifyContent="space-between" alignItems="flex-start">
                <Stack
                  backgroundColor={
                    isSelected ? "rgba(255,255,255,0.2)" : option.bg
                  }
                  padding="$2"
                  borderRadius="$4"
                >
                  <Icon
                    size={22}
                    color={isSelected ? "white" : option.color}
                    strokeWidth={2.5}
                  />
                </Stack>

                <Stack
                  width={8}
                  height={8}
                  borderRadius={4}
                  backgroundColor="white"
                  opacity={isSelected ? 0.9 : 0}
                />
              </XStack>

              <YStack>
                <Text
                  fontSize="$3"
                  fontWeight="800"
                  color={isSelected ? "white" : "$color"}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
                <Text
                  fontSize={11}
                  fontWeight="500"
                  color={isSelected ? "rgba(255,255,255,0.85)" : "$gray10"}
                  numberOfLines={1}
                  marginTop={2}
                >
                  {option.description}
                </Text>
              </YStack>
            </Stack>
          );
        })}
      </XStack>
    </YStack>
  );
};
