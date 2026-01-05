import { YStack, Text, XStack, Button } from "tamagui";
import { Send, Plus, CreditCard, MoreHorizontal } from "@tamagui/lucide-icons";

const ACTIONS = [
  {
    id: 1,
    label: "Enviar",
    icon: Send,
    color: "#E0E7FF",
    iconColor: "#4F46E5",
  },
  {
    id: 2,
    label: "Ingresar",
    icon: Plus,
    color: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    id: 3,
    label: "Tarjetas",
    icon: CreditCard,
    color: "#FEF9C3",
    iconColor: "#CA8A04",
  },
  {
    id: 4,
    label: "Más",
    icon: MoreHorizontal,
    color: "#F1F5F9",
    iconColor: "#64748B",
  },
];

export const QuickActions = () => {
  return (
    <XStack
      justifyContent="space-between"
      paddingHorizontal="$2"
      marginBottom="$6"
    >
      {ACTIONS.map((action) => (
        <YStack key={action.id} alignItems="center" space="$2">
          <Button
            size="$5"
            width={60}
            height={60}
            borderRadius={30} 
            backgroundColor={action.color}
            pressStyle={{ scale: 0.95, opacity: 0.8 }}
            elevation={2}
          >
            <action.icon size={24} color={action.iconColor} />
          </Button>
          <Text fontSize="$2" color="#475569" fontWeight="600">
            {action.label}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
};
