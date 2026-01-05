import { Button, Text, Spinner, ButtonProps } from "tamagui";
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
  return (
    <Button
      backgroundColor="#4F46E5"
      height={56}
      borderRadius="$6"
      shadowColor="#4F46E5"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.3}
      shadowRadius={10}
      animation="quick"
      pressStyle={{
        scale: 0.97,
        opacity: 0.9,
        backgroundColor: "#4338CA",
      }}
      disabled={isLoading || disabled}
      opacity={isLoading || disabled ? 0.7 : 1}
      icon={
        isLoading ? (
          <Spinner color="white" />
        ) : showIcon ? (
          <Check size={20} color="white" />
        ) : undefined
      }
      {...props}
    >
      <Text
        color="white"
        fontWeight="700"
        fontSize={16}
        letterSpacing={0.5}
      >
        {isLoading ? loadingText : label}
      </Text>
    </Button>
  );
};
