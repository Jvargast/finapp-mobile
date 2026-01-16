import { YStack, XStack, Text, Stack, Separator, Button } from "tamagui";
import {
  ShoppingBag,
  Coffee,
  ArrowUpRight,
  ArrowDownLeft,
  Car,
  Utensils,
} from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

// Mock Data: Esto vendrá de tu base de datos unificada (Manual + Banco)
const RECENT_MOVEMENTS = [
  {
    id: 1,
    title: "Uber Eats",
    category: "Comida",
    amount: -12500,
    date: "Hoy, 14:30",
    icon: Utensils,
    color: "$orange10",
    bgColor: "$orange3",
    type: "expense",
  },
  {
    id: 2,
    title: "Transferencia Recibida",
    category: "Diego A.",
    amount: 50000,
    date: "Hoy, 10:15",
    icon: ArrowDownLeft,
    color: "$green10",
    bgColor: "$green3",
    type: "income",
  },
  {
    id: 3,
    title: "Netflix Suscripción",
    category: "Entretenimiento",
    amount: -8990,
    date: "Ayer",
    icon: ArrowUpRight,
    color: "$red10",
    bgColor: "$red3",
    type: "expense",
  },
  {
    id: 4,
    title: "Starbucks",
    category: "Café",
    amount: -4500,
    date: "Ayer",
    icon: Coffee,
    color: "$blue10",
    bgColor: "$blue3",
    type: "expense",
  },
  {
    id: 5,
    title: "Jumbo Supermercado",
    category: "Mercado",
    amount: -85400,
    date: "10 Oct",
    icon: ShoppingBag,
    color: "$purple10",
    bgColor: "$purple3",
    type: "expense",
  },
];

export const RecentTransactions = () => {
  const navigation = useNavigation<any>();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(amount);
  };

  return (
    <YStack space="$4" paddingHorizontal="$4" marginBottom="$8">
      {/* Header de la Sección */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$5" fontWeight="800" color="$color">
          Últimos Movimientos
        </Text>
        <Button
          size="$2"
          chromeless
          color="$brand"
          fontWeight="700"
          onPress={() => console.log("Ver historial completo")}
        >
          Ver todo
        </Button>
      </XStack>

      {/* Lista de Movimientos */}
      <YStack
        backgroundColor="$color2"
        borderRadius="$8"
        paddingVertical="$2"
        shadowColor="$shadowColor"
        shadowRadius={10}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.05}
      >
        {RECENT_MOVEMENTS.map((item, index) => {
          const isLast = index === RECENT_MOVEMENTS.length - 1;
          const isExpense = item.type === "expense";
          const Icon = item.icon;

          return (
            <YStack key={item.id}>
              <XStack
                paddingHorizontal="$4"
                paddingVertical="$3"
                alignItems="center"
                justifyContent="space-between"
                pressStyle={{ backgroundColor: "rgba(0,0,0,0.02)" }} // Efecto visual al tocar
                onPress={() => console.log("Detalle transacción", item.id)}
              >
                {/* Lado Izquierdo: Icono + Texto */}
                <XStack space="$3" alignItems="center" flex={1}>
                  <Stack
                    backgroundColor={item.bgColor}
                    padding="$2.5"
                    borderRadius="$10" // Círculo perfecto (Squircle)
                  >
                    <Icon size={20} color={item.color} strokeWidth={2.5} />
                  </Stack>

                  <YStack flex={1}>
                    <Text
                      fontSize="$3"
                      fontWeight="700"
                      color="$color"
                      numberOfLines={1}
                    >
                      {item.title}
                    </Text>
                    <XStack space="$2" alignItems="center">
                      <Text fontSize={11} color="$gray10" fontWeight="500">
                        {item.date}
                      </Text>
                      <Stack
                        width={3}
                        height={3}
                        borderRadius={2}
                        backgroundColor="$gray8"
                      />
                      <Text fontSize={11} color="$gray10" fontWeight="500">
                        {item.category}
                      </Text>
                    </XStack>
                  </YStack>
                </XStack>

                {/* Lado Derecho: Monto */}
                <Text
                  fontSize="$3"
                  fontWeight="800"
                  color={isExpense ? "$red10" : "$green10"} // Rojo gastos, Verde ingresos
                >
                  {isExpense ? "" : "+"} {formatCurrency(item.amount)}
                </Text>
              </XStack>

              {/* Separador sutil, excepto en el último item */}
              {!isLast && (
                <Separator
                  borderColor="$borderColor"
                  marginHorizontal="$4"
                  opacity={0.5}
                />
              )}
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
};
