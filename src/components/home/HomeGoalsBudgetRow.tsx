import React from "react";
import { Pressable } from "react-native";
import { YStack, XStack, Text, Stack, useThemeName } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { Target, PieChart } from "@tamagui/lucide-icons";
import { LinearGradient } from "@tamagui/linear-gradient";

export const HomeGoalsBudgetRow = () => {
  const navigation = useNavigation<any>();
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");

  const cards = [
    {
      id: "goals",
      title: "Metas",
      subtitle: "Avanza con intención",
      icon: Target,
      colors: isDark ? ["#2C1E3C", "#20172D"] : ["#F3E8FF", "#EDE9FE"],
      accent: isDark ? "#C4B5FD" : "#7C3AED",
      route: () => navigation.navigate("Goals"),
    },
    {
      id: "budgets",
      title: "Presupuestos",
      subtitle: "Controla tu mes",
      icon: PieChart,
      colors: isDark ? ["#1E2A44", "#182134"] : ["#DBEAFE", "#EFF6FF"],
      accent: isDark ? "#93C5FD" : "#2563EB",
      route: () => navigation.navigate("Budgets"),
    },
  ];
  const subtitleColor = isDark ? "#CBD5E1" : "$gray10";

  return (
    <YStack marginBottom="$5" space="$3">
      <Text fontSize="$5" fontWeight="800" color="$color">
        Metas y presupuestos
      </Text>
      <XStack space="$3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Pressable
              key={card.id}
              onPress={card.route}
              style={({ pressed }) => ({
                flex: 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Stack
                height={110}
                borderRadius="$8"
                overflow="hidden"
                shadowColor={card.accent}
                shadowOpacity={0.12}
                shadowRadius={10}
                shadowOffset={{ width: 0, height: 5 }}
                elevation={2}
              >
                <LinearGradient
                  colors={card.colors}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                  }}
                />
                <YStack padding="$4" space="$2" flex={1}>
                  <Icon size={22} color={card.accent} />
                  <Text fontSize="$4" fontWeight="800" color={card.accent}>
                    {card.title}
                  </Text>
                  <Text fontSize={11} color={subtitleColor}>
                    {card.subtitle}
                  </Text>
                </YStack>
              </Stack>
            </Pressable>
          );
        })}
      </XStack>
    </YStack>
  );
};
