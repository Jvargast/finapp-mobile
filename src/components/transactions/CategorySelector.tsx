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
  embedded?: boolean;
  showColors?: boolean;
  onAddCategory?: () => void;
}

export const CategorySelector = ({
  selectedId,
  onSelect,
  navigation,
  embedded = false,
  showColors = false,
  onAddCategory,
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

  const headerPadding = embedded ? 0 : "$4";

  const getSoftColor = (color?: string) => {
    if (!color) return "$gray3";
    if (color.startsWith("#")) return `${color}22`;
    return "$gray3";
  };

  return (
    <YStack space="$2">
      <XStack
        justifyContent="space-between"
        alignItems="center"
        paddingHorizontal={headerPadding}
      >
        <Text fontSize="$3" color="$gray10" fontWeight="700">
          Categoría
        </Text>
        <Text fontSize={10} color="$gray8">
          {activeCategories.length} disponibles
        </Text>
      </XStack>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        nestedScrollEnabled
        contentContainerStyle={{
          paddingHorizontal: embedded ? 0 : 20,
          gap: 12,
          paddingBottom: embedded ? 10 : 15,
          paddingTop: embedded ? 6 : 10,
        }}
        overflow="visible"
      >
        {activeCategories.map((cat) => {
          const isSelected = selectedId === cat.id;
          const Icon = getIcon(cat.icon);
          const softColor = getSoftColor(cat.color);
          const showTint = Boolean(showColors);
          const iconColor = isSelected
            ? "white"
            : showTint
            ? cat.color
            : "$gray10";
          const bgColor = isSelected
            ? cat.color
            : showTint
            ? softColor
            : "$gray3";
          const borderColor = isSelected
            ? "transparent"
            : showTint
            ? cat.color
            : "$gray5";
          const itemOpacity = isSelected ? 1 : showTint ? 0.9 : 0.5;

          return (
            <Pressable key={cat.id} onPress={() => onSelect(cat.id)}>
              <YStack
                alignItems="center"
                space="$2"
                opacity={itemOpacity}
                width={70}
              >
                <Circle
                  size="$5"
                  backgroundColor={bgColor}
                  borderWidth={isSelected ? 0 : 1}
                  borderColor={borderColor}
                  shadowColor={isSelected ? cat.color : "transparent"}
                  shadowRadius={5}
                  shadowOpacity={0.3}
                  shadowOffset={{ width: 0, height: 2 }}
                >
                  <Icon size={20} color={iconColor} />
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

        <Pressable
          onPress={() =>
            onAddCategory ? onAddCategory() : navigation.navigate("ManageCategories")
          }
        >
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
