import React from "react";
import { Button, Text, ButtonProps } from "tamagui";

type PillTone = "pastel" | "neutral";

interface PillButtonProps extends ButtonProps {
  label: string;
  tone?: PillTone;
}

const TONES: Record<PillTone, { border: string; text: string; bg: string; press: string }> = {
  pastel: {
    border: "#D9E4FF",
    text: "#2F4EA6",
    bg: "#FFFFFF",
    press: "#EEF3FF",
  },
  neutral: {
    border: "#E5E7EB",
    text: "#374151",
    bg: "#FFFFFF",
    press: "#F3F4F6",
  },
};

export const PillButton = ({
  label,
  tone = "pastel",
  disabled,
  ...props
}: PillButtonProps) => {
  const colors = TONES[tone];
  const isDisabled = Boolean(disabled);

  return (
    <Button
      height={32}
      borderRadius={999}
      paddingHorizontal="$3"
      backgroundColor={colors.bg}
      borderWidth={1}
      borderColor={colors.border}
      disabled={isDisabled}
      opacity={isDisabled ? 0.6 : 1}
      pressStyle={{ opacity: 0.9, backgroundColor: colors.press }}
      animation="quick"
      {...props}
    >
      <Text fontSize={12} fontWeight="700" letterSpacing={0.3} color={colors.text}>
        {label}
      </Text>
    </Button>
  );
};
