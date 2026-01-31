import { YStack, Text, XStack, Button } from "tamagui";
import {
  Target,
  PieChart,
  Receipt,
  Banknote,
  ArrowRightLeft,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

export const QuickActions = () => {
  const navigation = useNavigation<any>();

  const ACTIONS = [
    {
      id: 1,
      label: "Gasto",
      icon: Receipt,
      color: "#EF4444",
      bg: "rgba(239, 68, 68, 0.1)",
      route: "AddExpense",
    },
    {
      id: 2,
      label: "Ingreso",
      icon: Banknote,
      color: "#10B981",
      bg: "rgba(16, 185, 129, 0.1)",
      route: "AddIncome",
    },
    {
      id: 3,
      label: "Transferir",
      icon: ArrowRightLeft,
      color: "#3B82F6",
      bg: "rgba(59, 130, 246, 0.1)",
      route: "AddTransfer",
    },
    {
      id: 4,
      label: "Metas",
      icon: Target,
      color: "#A78BFA",
      bg: "rgba(167, 139, 250, 0.1)",
      route: "Goals",
    },
  ];

  return (
    <XStack
      justifyContent="space-between"
      paddingHorizontal="$4"
      marginBottom="$4"
    >
      {ACTIONS.map((action) => (
        <YStack key={action.id} alignItems="center" space="$2">
          <Button
            size="$5"
            width={60}
            height={60}
            borderRadius={30}
            backgroundColor={action.bg}
            onPress={() => {
              if (action.route) {
                requestAnimationFrame(() => {
                  navigation.navigate(action.route);
                });
              }
            }}
            pressStyle={{
              scale: 0.92,
              opacity: 0.8,
              backgroundColor: action.color,
            }}
            animation="bouncy"
            elevation={2}
            shadowOpacity={0.1}
            shadowRadius={5}
            shadowOffset={{ width: 0, height: 4 }}
            borderWidth={0}
          >
            <action.icon size={26} color={action.color} strokeWidth={2.5} />
          </Button>
          <Text
            fontSize="$2"
            color="$gray11"
            fontWeight="600"
            letterSpacing={0.2}
          >
            {action.label}
          </Text>
        </YStack>
      ))}
    </XStack>
  );
};
