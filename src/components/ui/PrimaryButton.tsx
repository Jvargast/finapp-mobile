import { Button, Text, Spinner, ButtonProps, useThemeName } from "tamagui";
import { Check } from "@tamagui/lucide-icons";

interface PrimaryButtonProps extends ButtonProps {
  label: string;
  isLoading?: boolean;
  loadingText?: string;
  showIcon?: boolean;
}

export const PrimaryButton = ({
  label,
  isLoading = false,
  loadingText = "Procesando...",
  showIcon = false,
  disabled,
  ...props
}: PrimaryButtonProps) => {
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const backgroundColor = isDark ? "#F8FAFC" : "#111827";
  const textColor = isDark ? "#0F172A" : "#FFFFFF";
  const pressedColor = isDark ? "#E2E8F0" : "#1F2937";

  return (
    <Button
      backgroundColor={backgroundColor}
      height={56}
      borderRadius={20}
      shadowColor={isDark ? "#FFFFFF" : "#0F172A"}
      shadowOffset={{ width: 0, height: 8 }}
      shadowOpacity={isDark ? 0.1 : 0.1}
      shadowRadius={12}
      animation="quick"
      pressStyle={{
        scale: 0.97,
        opacity: 0.9,
        backgroundColor: pressedColor,
      }}
      hoverStyle={{
        backgroundColor: pressedColor,
      }}
      disabled={isLoading || disabled}
      opacity={isLoading || disabled ? 0.6 : 1}
      icon={
        isLoading ? (
          <Spinner color={textColor} />
        ) : showIcon ? (
          <Check size={20} color={textColor} />
        ) : undefined
      }
      {...props}
    >
      <Text
        color={textColor}
        fontWeight="800"
        fontSize={16}
        letterSpacing={0.2}
      >
        {isLoading ? loadingText : label}
      </Text>
    </Button>
  );
};
