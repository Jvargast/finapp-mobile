import React from "react";
import { Pressable } from "react-native";
import { Circle, Stack, Text, XStack } from "tamagui";

type AnalyticsSectionId = "CATEGORIES" | "PLANNED_ACTUAL" | "FIXED_VARIABLE";

interface SectionOption {
  id: AnalyticsSectionId;
  label: string;
}

interface AnalyticsSectionTabsProps {
  options: readonly SectionOption[];
  value: AnalyticsSectionId;
  onChange: (id: AnalyticsSectionId) => void;
  incomeOnly?: boolean;
  colors: {
    page: string;
    surface: string;
    border: string;
    ink: string;
    muted: string;
    accent: string;
    accentSoft: string;
    peach: string;
    peachText: string;
    mint: string;
    mintText: string;
  };
}

const SECTION_TONE: Record<
  AnalyticsSectionId,
  {
    color: "accent" | "peachText" | "mintText";
    soft: "accentSoft" | "peach" | "mint";
  }
> = {
  CATEGORIES: { color: "accent", soft: "accentSoft" },
  PLANNED_ACTUAL: { color: "peachText", soft: "peach" },
  FIXED_VARIABLE: { color: "mintText", soft: "mint" },
};

export const AnalyticsSectionTabs = ({
  options,
  value,
  onChange,
  incomeOnly = false,
  colors,
}: AnalyticsSectionTabsProps) => {
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
      {options.map((option) => {
        const tone = SECTION_TONE[option.id];
        const active = option.id === value;
        const hidden = incomeOnly && option.id !== "CATEGORIES";
        const toneColor = colors[tone.color];
        const softColor = colors[tone.soft];

        return (
          <Pressable
            key={option.id}
            onPress={() => {
              if (!hidden) onChange(option.id);
            }}
            disabled={hidden}
            style={({ pressed }) => ({
              flex: 1,
              opacity: pressed ? 0.96 : 1,
              transform: [{ scale: pressed ? 0.985 : 1 }],
            })}
          >
            <Stack
              minHeight={48}
              borderRadius="$6"
              borderWidth={1}
              borderColor={
                hidden ? "transparent" : active ? toneColor : "transparent"
              }
              backgroundColor={hidden ? "transparent" : active ? softColor : "transparent"}
              justifyContent="center"
              paddingHorizontal="$2.5"
              opacity={hidden ? 0 : 1}
            >
              <XStack alignItems="center" justifyContent="center" space="$2">
                <Circle
                  size={8}
                  backgroundColor={active ? toneColor : colors.border}
                />
                <Text
                  fontSize={13}
                  fontWeight={active ? "800" : "700"}
                  color={active ? toneColor : colors.ink}
                  textAlign="center"
                  numberOfLines={1}
                >
                  {option.label}
                </Text>
              </XStack>
            </Stack>
          </Pressable>
        );
      })}
    </XStack>
  );
};
