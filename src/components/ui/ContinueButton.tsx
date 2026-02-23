import React from "react";
import { ButtonProps } from "tamagui";
import { WouButton } from "./WouButton";

interface ContinueButtonProps extends ButtonProps {
  label?: string;
  isLoading?: boolean;
  loadingLabel?: string;
}

export const ContinueButton = ({
  label = "Continuar",
  isLoading = false,
  loadingLabel = "Cargando...",
  disabled,
  ...props
}: ContinueButtonProps) => {
  return (
    <WouButton
      label={label}
      variant="solid"
      tone="pastel"
      size="lg"
      isLoading={isLoading}
      loadingLabel={loadingLabel}
      disabled={disabled}
      shadowColor="rgba(167, 191, 255, 0.4)"
      shadowOffset={{ width: 0, height: 10 }}
      shadowOpacity={0.3}
      shadowRadius={18}
      elevation={6}
      {...props}
    />
  );
};
