import React from "react";
import { Pressable } from "react-native";
import { Circle, Stack, Text, XStack } from "tamagui";

type ViewMode = "EXPENSE" | "INCOME";

interface AnalyticsModeTabsProps {
  value: ViewMode;
  onChange: (next: ViewMode) => void;
  showIncomeHint: boolean;
  colors: {
    page: string;
    surface: string;
    border: string;
    ink: string;
    muted: string;
    peach: string;
    peachText: string;
    mint: string;
    mintText: string;
  };
}

const MODE_META: Record<
  ViewMode,
  {
    label: string;
    description: string;
    dot: "peachText" | "mintText";
    soft: "peach" | "mint";
  }
> = {
  EXPENSE: {
    label: "Gastos",
    description: "Detalle de salidas del mes",
    dot: "peachText",
    soft: "peach",
  },
  INCOME: {
    label: "Ingreso",
    description: "Vista disponible en categorias",
    dot: "mintText",
    soft: "mint",
  },
};

export const AnalyticsModeTabs = ({
  value,
  onChange,
  showIncomeHint: _showIncomeHint,
  colors,
}: AnalyticsModeTabsProps) => {
  return (
    <XStack
      width="100%"
      backgroundColor={colors.page}
      borderRadius="$7"
      borderWidth={1}
      borderColor={colors.border}
      padding="$1"
      space="$1"
    >
      {(Object.keys(MODE_META) as ViewMode[]).map((mode) => {
        const meta = MODE_META[mode];
        const active = value === mode;
        const toneColor = colors[meta.dot];
        const softColor = colors[meta.soft];

        return (
          <Pressable
            key={mode}
            onPress={() => onChange(mode)}
            style={({ pressed }) => ({
              flex: 1,
              opacity: pressed ? 0.96 : 1,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            })}
          >
            <Stack
              minHeight={40}
              borderRadius="$6"
              borderWidth={1}
              borderColor={active ? toneColor : colors.border}
              backgroundColor={active ? softColor : "transparent"}
              justifyContent="center"
              paddingHorizontal="$3"
            >
              <XStack alignItems="center" justifyContent="center" space="$2">
                <Circle size={8} backgroundColor={active ? toneColor : colors.border} />
                <Text
                  fontSize={13}
                  fontWeight={active ? "800" : "700"}
                  color={active ? toneColor : colors.ink}
                  letterSpacing={0.4}
                >
                  {meta.label.toUpperCase()}
                </Text>
              </XStack>
            </Stack>
          </Pressable>
        );
      })}
    </XStack>
  );
};
