import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
import { YStack, Text, Circle, XStack, useThemeName } from "tamagui";
import { Plus, Search } from "@tamagui/lucide-icons";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { CategoryActions } from "../../actions/categoryActions";
import { getIcon } from "../../utils/iconMap";
import { NavigationProp } from "@react-navigation/native";
import { TransactionType } from "../../types/category.types";

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
  navigation: NavigationProp<any>;
  embedded?: boolean;
  showColors?: boolean;
  onAddCategory?: () => void;
  transactionType?: TransactionType;
}

export const CategorySelector = ({
  selectedId,
  onSelect,
  navigation,
  embedded = false,
  showColors = false,
  onAddCategory,
  transactionType,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);

  useEffect(() => {
    if (categories.length === 0 && !isLoading) {
      CategoryActions.loadCategories();
    }
  }, [categories.length, isLoading]);

  const activeCategories = useMemo(() => {
    return categories
      .filter(
        (c) =>
          c.isActive !== false &&
          (!transactionType || c.type === transactionType)
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [categories, transactionType]);
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return activeCategories;
    return activeCategories.filter((category) =>
      category.name.toLowerCase().includes(normalizedSearch)
    );
  }, [activeCategories, normalizedSearch]);
  const showSearch = activeCategories.length > 7;
  const categoryScopeLabel =
    transactionType === "EXPENSE"
      ? "de gasto"
      : transactionType === "INCOME"
      ? "de ingreso"
      : "activas";
  const counterLabel = normalizedSearch
    ? `${filteredCategories.length} resultados`
    : `${activeCategories.length} ${categoryScopeLabel}`;
  const searchPlaceholder =
    transactionType === "EXPENSE"
      ? "Buscar categoría de gasto"
      : transactionType === "INCOME"
      ? "Buscar categoría de ingreso"
      : "Buscar categoría";

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
          {counterLabel}
        </Text>
      </XStack>

      {showSearch ? (
        <XStack
          alignItems="center"
          space="$2"
          marginHorizontal={embedded ? 0 : 20}
          paddingHorizontal="$2.5"
          height={36}
          borderRadius="$10"
          backgroundColor="$gray2"
          borderWidth={1}
          borderColor="$gray4"
        >
          <Search size={14} color="#94A3B8" />
          <TextInput
            style={{
              flex: 1,
              fontSize: 13,
              color: isDark ? "#F8FAFC" : "#0F172A",
              paddingVertical: 0,
            }}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={searchPlaceholder}
            placeholderTextColor="#94A3B8"
          />
        </XStack>
      ) : null}

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
      >
        {filteredCategories.map((cat) => {
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

      {showSearch && normalizedSearch && filteredCategories.length === 0 ? (
        <Text
          paddingHorizontal={headerPadding}
          fontSize={11}
          color="$gray8"
        >
          No hay {categoryScopeLabel} con ese nombre.
        </Text>
      ) : null}
    </YStack>
  );
};
