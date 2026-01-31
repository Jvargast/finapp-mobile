import React, { useEffect, useMemo } from "react";
import { Pressable, ScrollView } from "react-native";
import { YStack, Text, Circle, XStack } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { CategoryActions } from "../../actions/categoryActions";
import { getIcon } from "../../utils/iconMap";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  navigation: NavigationProp<any>;
}

export const CategorySelector = ({
  selectedId,
  onSelect,
  navigation,
}: Props) => {
  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);

  useEffect(() => {
    if (categories.length === 0) {
      CategoryActions.loadCategories(true);
    }
  }, []);

  const activeCategories = useMemo(() => {
    return categories
      .filter((c) => c.isActive !== false)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <YStack space="$2">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingRight="$4"
      >
        <Text fontSize="$3" color="$gray10" fontWeight="600" marginLeft="$4">
          Categoría
        </Text>
        <Text fontSize={10} color="$gray8">
          {activeCategories.length} disponibles
        </Text>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12,
          paddingBottom: 15,
          paddingTop: 10,
        }}
        overflow="visible"
      >
        {activeCategories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const Icon = getIcon(cat.icon);

          return (
            <Pressable key={cat.id} onPress={() => onSelect(cat.id)}>
              <YStack
                alignItems="center"
                space="$2"
                opacity={isSelected ? 1 : 0.5}
                width={70}
              >
                <Circle
                  size="$5"
                  backgroundColor={isSelected ? cat.color : "$gray3"}
                  borderWidth={isSelected ? 0 : 1}
                  borderColor="$gray5"
                  shadowColor={isSelected ? cat.color : "transparent"}
                  shadowRadius={5}
                  shadowOpacity={0.3}
                  shadowOffset={{ width: 0, height: 2 }}
                >
                  <Icon size={20} color={isSelected ? "white" : "$gray10"} />
                </Circle>

                <Text
                  fontSize={11}
                  fontWeight={isSelected ? "700" : "500"}
                  color={isSelected ? "$color" : "$gray10"}
                  numberOfLines={1}
                  textAlign="center"
                >
                  {cat.name}
                </Text>
              </YStack>
            </Pressable>
          );
        })}

        <Pressable onPress={() => navigation.navigate("ManageCategories")}>
          <YStack alignItems="center" space="$2" width={70} opacity={0.6}>
            <Circle
              size="$5"
              backgroundColor="transparent"
              borderWidth={1}
              borderColor="$gray8"
              borderStyle="dashed"
            >
              <Plus size={20} color="$gray10" />
            </Circle>
            <Text fontSize={11} color="$gray10" numberOfLines={1}>
              Nueva
            </Text>
          </YStack>
        </Pressable>
      </ScrollView>
    </YStack>
  );
};
