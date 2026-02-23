import React from "react";
import { Button, Text, Spinner, ButtonProps } from "tamagui";

type ButtonVariant = "solid" | "soft" | "outline" | "ghost";
type ButtonTone = "brand" | "success" | "neutral" | "pastel" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface WouButtonProps extends ButtonProps {
  label: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingLabel?: string;
  disableAnimation?: boolean;
}

const TONES = {
  brand: {
    solid: "#1D4ED8",
    solidPress: "#1E40AF",
    soft: "#E8F0FF",
    softBorder: "#C7DBFF",
    text: "#1D4ED8",
    solidText: "white",
  },
  success: {
    solid: "#15803D",
    solidPress: "#166534",
    soft: "#DCFCE7",
    softBorder: "#A7F3D0",
    text: "#15803D",
    solidText: "white",
  },
  neutral: {
    solid: "#111827",
    solidPress: "#0F172A",
    soft: "#F3F4F6",
    softBorder: "#E5E7EB",
    text: "#111827",
    solidText: "white",
  },
  pastel: {
    solid: "#A7BFFF",
    solidPress: "#8BA7F2",
    soft: "#EEF3FF",
    softBorder: "#D9E4FF",
    text: "#2F4EA6",
    solidText: "#1E2A4A",
  },
  danger: {
    solid: "#FCA5A5",
    solidPress: "#F87171",
    soft: "#FEE2E2",
    softBorder: "#FECACA",
    text: "#B91C1C",
    solidText: "#7F1D1D",
  },
} as const;

const SIZE_MAP = {
  sm: { height: 40, fontSize: 13, paddingX: "$3" },
  md: { height: 46, fontSize: 14, paddingX: "$4" },
  lg: { height: 54, fontSize: 16, paddingX: "$5" },
} as const;

const getVariantColors = (variant: ButtonVariant, tone: ButtonTone) => {
  const palette = TONES[tone];
  if (variant === "solid") {
    return {
      background: palette.solid,
      border: palette.solid,
      text: palette.solidText ?? "white",
      press: palette.solidPress,
    };
  }
  if (variant === "soft") {
    return {
      background: palette.soft,
      border: palette.softBorder,
      text: palette.text,
      press: palette.soft,
    };
  }
  if (variant === "outline") {
    return {
      background: "transparent",
      border: palette.softBorder,
      text: palette.text,
      press: "transparent",
    };
  }
  return {
    background: "transparent",
    border: "transparent",
    text: palette.text,
    press: "transparent",
  };
};

export const WouButton = ({
  label,
  variant = "solid",
  tone = "brand",
  size = "md",
  isLoading = false,
  loadingLabel = "Cargando...",
  disableAnimation = false,
  disabled,
  icon,
  ...props
}: WouButtonProps) => {
  const colors = getVariantColors(variant, tone);
  const sizes = SIZE_MAP[size];
  const isDisabled = Boolean(disabled || isLoading);
  const resolvedAnimation = disableAnimation ? undefined : "quick";
  const resolvedPressStyle = disableAnimation
    ? { opacity: 0.95 }
    : { opacity: 0.9, backgroundColor: colors.press };

  return (
    <Button
      height={sizes.height}
      borderRadius="$12"
      backgroundColor={colors.background}
      borderWidth={variant === "ghost" ? 0 : 1}
      borderColor={colors.border}
      paddingHorizontal={sizes.paddingX}
      disabled={isDisabled}
      opacity={isDisabled ? 0.6 : 1}
      pressStyle={resolvedPressStyle}
      animation={resolvedAnimation}
      {...props}
      icon={isLoading ? <Spinner size="small" color={colors.text} /> : icon}
    >
      <Text
        fontSize={sizes.fontSize}
        fontWeight="700"
        letterSpacing={0.3}
        color={colors.text}
      >
        {isLoading ? loadingLabel : label}
      </Text>
    </Button>
  );
};
