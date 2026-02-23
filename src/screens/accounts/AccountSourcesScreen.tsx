import { useMemo } from "react";
import { YStack, XStack, Text, ScrollView, Circle, Button } from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import {
  Link,
  Wallet,
  FileText,
  ChevronRight,
} from "@tamagui/lucide-icons";
import { MainLayout } from "../../components/layout/MainLayout";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { useToastStore } from "../../stores/useToastStore";
import { useNavigation } from "@react-navigation/native";

type SourceOption = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bg: string;
};

export default function AccountSourcesScreen() {
  const insets = useSafeAreaInsets();
  const showToast = useToastStore((s) => s.showToast);
  const navigation = useNavigation<any>();

  const options = useMemo<SourceOption[]>(
    () => [
      {
        id: "email",
        title: "Email API",
        description:
          "Conecta tu correo y define reglas para extraer movimientos.",
        icon: Link,
        color: "#2563EB",
        bg: "#EFF6FF",
      },
      {
        id: "inbound",
        title: "Inbound / Integraciones",
        description:
          "Recibe movimientos desde otra plataforma o flujo de datos.",
        icon: Wallet,
        color: "#7C3AED",
        bg: "#F5F3FF",
      },
      {
        id: "statements",
        title: "Lectura de Cartolas",
        description:
          "Sube tu cartola bancaria para importar movimientos de forma rápida.",
        icon: FileText,
        color: "#059669",
        bg: "#ECFDF5",
      },
    ],
    [],
  );

  const handleSelect = (option: SourceOption) => {
    if (option.id === "email") {
      navigation.navigate("EmailSourceCreate");
      return;
    }
    showToast(`Próximamente: ${option.title}`, "info");
  };

  return (
    <MainLayout noPadding>
      <YStack
        flex={1}
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        paddingBottom={insets.bottom + 20}
        space="$4"
      >
        <XStack alignItems="center" space="$3">
          <GoBackButton fallbackRouteName="Accounts" />
          <YStack>
            <Text fontSize="$6" fontWeight="900">
              Agregar cuentas
            </Text>
            <Text fontSize="$3" color="$gray10">
              Elige cómo quieres alimentar tu información financiera.
            </Text>
          </YStack>
        </XStack>

        <ScrollView showsVerticalScrollIndicator={false}>
          <YStack space="$3" paddingBottom="$4">
            {options.map((option) => {
              const Icon = option.icon;
              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleSelect(option)}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <XStack
                    alignItems="center"
                    backgroundColor="$background"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$8"
                    padding="$4"
                    space="$3"
                    elevation={2}
                    shadowColor="$shadowColor"
                    shadowRadius={6}
                    shadowOpacity={0.08}
                  >
                    <Circle size="$4.5" backgroundColor={option.bg}>
                      <Icon size={20} color={option.color} />
                    </Circle>

                    <YStack flex={1} space="$1">
                      <Text fontSize="$4" fontWeight="800" color="$color">
                        {option.title}
                      </Text>
                      <Text fontSize="$3" color="$gray10">
                        {option.description}
                      </Text>
                    </YStack>

                    <ChevronRight size={18} color="$gray9" />
                  </XStack>
                </Pressable>
              );
            })}
          </YStack>
        </ScrollView>

        <Button
          size="$4"
          backgroundColor="$color2"
          borderRadius="$8"
          onPress={() =>
            showToast("Puedes elegir un método para continuar", "info")
          }
        >
          <Text fontWeight="700" color="$color">
            ¿Necesitas ayuda para elegir?
          </Text>
        </Button>
      </YStack>
    </MainLayout>
  );
}
