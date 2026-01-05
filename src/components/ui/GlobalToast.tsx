import { useEffect } from "react";
import { YStack, XStack, Text } from "tamagui";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "@tamagui/lucide-icons";
import { useToastStore } from "../../stores/useToastStore";

const TOAST_CONFIG = {
  success: {
    bg: "#DCFCE7",
    border: "#22C55E",
    text: "#15803D",
    icon: CheckCircle2,
  },
  error: {
    bg: "#FEE2E2",
    border: "#EF4444",
    text: "#B91C1C",
    icon: AlertCircle,
  },
  warning: {
    bg: "#FEF3C7",
    border: "#F59E0B",
    text: "#B45309",
    icon: AlertTriangle,
  },
  info: {
    bg: "#EFF6FF",
    border: "#3B82F6", 
    text: "#1E40AF",
    icon: Info,
    
    
  },
};

export const GlobalToast = () => {
  const { visible, message, type, hideToast } = useToastStore();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, hideToast]);

  if (!visible) return null;

  const config = TOAST_CONFIG[type];
  const Icon = config.icon;

  return (
    <YStack
      position="absolute"
      top={60} 
      left={20}
      right={20}
      zIndex={99999} 
      animation="quick"
      enterStyle={{ opacity: 0, y: -20, scale: 0.95 }}
      exitStyle={{ opacity: 0, y: -20, scale: 0.95 }}
    >
      <XStack
        backgroundColor={config.bg}
        borderColor={config.border}
        borderWidth={1}
        borderRadius="$4"
        padding="$3"
        alignItems="center"
        space="$3"
        shadowColor="$shadowColor"
        shadowRadius={5}
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
      >
        <Icon size={22} color={config.border} />
        <Text color={config.text} fontSize="$3" fontWeight="600" flex={1}>
          {message}
        </Text>
      </XStack>
    </YStack>
  );
};
