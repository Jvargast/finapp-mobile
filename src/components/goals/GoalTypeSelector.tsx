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
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    id: GoalType.DEBT,
    label: "Salir de Deudas",
    description: "Eliminar cargas",
    icon: TrendingDown,
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  {
    id: GoalType.HOUSING,
    label: "Casa Propia",
    description: "El sueño del hogar",
    icon: Building,
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    id: GoalType.CONTROL,
    label: "Control Gastos",
    description: "Optimizar dinero",
    icon: ShieldCheck,
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    id: GoalType.INVESTMENT,
    label: "Inversiones",
    description: "Crecer patrimonio",
    icon: TrendingUp,
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    id: GoalType.RETIREMENT,
    label: "Jubilación",
    description: "Futuro asegurado",
    icon: Briefcase,
    color: "#475569",
    bg: "#F8FAFC",
  },
];

export const GoalTypeSelector = ({
  value,
  onChange,
}: GoalTypeSelectorProps) => {
  return (
    <YStack space="$4">
      <YStack>
        <Text fontSize="$5" fontWeight="800" color="$gray12">
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
              backgroundColor={isSelected ? option.color : "white"}
              borderColor={isSelected ? option.color : "$gray4"}
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

                {isSelected && (
                  <Stack
                    width={8}
                    height={8}
                    borderRadius={4}
                    backgroundColor="white"
                    opacity={0.9}
                  />
                )}
              </XStack>

              <YStack>
                <Text
                  fontSize="$3"
                  fontWeight="800"
                  color={isSelected ? "white" : "$gray12"}
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
                <Text
                  fontSize={11}
                  fontWeight="500"
                  color={isSelected ? "rgba(255,255,255,0.85)" : "$gray9"}
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
