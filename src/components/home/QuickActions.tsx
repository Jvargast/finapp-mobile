import { YStack, Text, XStack, Button } from "tamagui";
import { Send, Plus, Target, MoreHorizontal } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";

export const QuickActions = () => {
  const navigation = useNavigation<any>();

  const ACTIONS = [
    {
      id: 1,
      label: "Enviar",
      icon: Send,
      color: "#E0E7FF", // Azul muy suave
      iconColor: "#4F46E5", // Indigo fuerte
      route: "Transfer", // (A futuro)
    },
    {
      id: 2,
      label: "Ingresar",
      icon: Plus,
      color: "#DCFCE7", // Verde muy suave
      iconColor: "#16A34A", // Verde fuerte
      route: "AddMoney", // (A futuro)
    },
    {
      id: 3,
      label: "Metas", // <--- CAMBIO AQUÍ: Reemplazamos Tarjetas por Metas
      icon: Target,
      color: "#F0FDFA", // Teal/Cyan muy suave (inspira crecimiento)
      iconColor: "#0D9488", // Teal fuerte
      route: "Goals", // <--- Esta es la ruta que ya registramos
    },
    {
      id: 4,
      label: "Más",
      icon: MoreHorizontal,
      color: "#F1F5F9", // Gris muy suave
      iconColor: "#64748B", // Slate
      route: null, 
    },
  ];

  return (
    <XStack
      justifyContent="space-between"
      paddingHorizontal="$4" 
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
            onPress={() => {
              if (action.route) {
                navigation.navigate(action.route);
              } else {
                console.log("Acción sin ruta definida aún:", action.label);
              }
            }}
            pressStyle={{
              scale: 0.92,
              opacity: 0.8,
              backgroundColor: action.color, 
            }}
            animation="bouncy"
            elevation={2} 
            shadowColor={action.iconColor}
            shadowOpacity={0.1}
            shadowRadius={5}
            shadowOffset={{ width: 0, height: 4 }}
            borderWidth={0} 
          >
            <action.icon size={26} color={action.iconColor} strokeWidth={2.5} />
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
