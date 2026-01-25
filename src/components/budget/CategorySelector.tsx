import React, { useMemo, memo, useCallback, useState } from "react";
import { Alert, FlatList } from "react-native";
import { YStack, XStack, Text, Button, Separator } from "tamagui";
import { Plus } from "@tamagui/lucide-icons";
import { Category } from "../../types/category.types";
import { CategoryItem } from "../category/CategoryItem";
import { DangerModal } from "../ui/DangerModal";

interface CategorySelectorProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddPress?: () => void;
  onDeleteCategory?: (id: string) => void;
  onEditCategory?: (category: Category) => void;
}

type ListItem =
  | { type: "CATEGORY"; data: Category }
  | { type: "SEPARATOR"; id: string };

export const CategorySelector = memo(
  ({
    categories,
    selectedId,
    onSelect,
    onAddPress,
    onDeleteCategory,
    onEditCategory,
  }: CategorySelectorProps) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(
      null
    );
    const { processedData, generalCount, customCount } = useMemo(() => {
      const custom = categories.filter((c) => c.userId);
      const general = categories.filter((c) => !c.userId);

      const sorter = (a: Category, b: Category) => {
        if (a.name === "Otros" || a.name === "Others") return 1;
        if (b.name === "Otros" || b.name === "Others") return -1;
        return a.name.localeCompare(b.name);
      };

      custom.sort(sorter);
      general.sort(sorter);
      const data: ListItem[] = [];
      custom.forEach((cat) => data.push({ type: "CATEGORY", data: cat }));
      if (custom.length > 0 && general.length > 0) {
        data.push({ type: "SEPARATOR", id: "sep-1" });
      }
      general.forEach((cat) => data.push({ type: "CATEGORY", data: cat }));

      return {
        processedData: data,
        generalCount: general.length,
        customCount: custom.length,
      };
    }, [categories]);

    const handleDeletePress = useCallback((id: string) => {
      setCategoryToDelete(id);
    }, []);

    const confirmDelete = useCallback(() => {
      if (categoryToDelete) {
        if (onDeleteCategory) onDeleteCategory(categoryToDelete);
        if (selectedId === categoryToDelete) onSelect("");
        setCategoryToDelete(null);
      }
    }, [categoryToDelete, onDeleteCategory, selectedId, onSelect]);

    const renderItem = useCallback(
      ({ item }: { item: ListItem }) => {
        if (item.type === "SEPARATOR") {
          return (
            <YStack justifyContent="center" paddingHorizontal="$3">
              <Separator vertical height={80} borderColor="$gray6" />
            </YStack>
          );
        }
        return (
          <CategoryItem
            cat={item.data}
            isSelected={selectedId === item.data.id}
            onSelect={(id) => {
              if (isEditMode) {
                setIsEditMode(false);
              } else {
                onSelect(id);
              }
            }}
            isEditing={isEditMode}
            onLongPress={() => setIsEditMode((prev) => !prev)}
            onDelete={handleDeletePress}
            onEdit={(category) => {
              setIsEditMode(false);
              if (onEditCategory) onEditCategory(category);
            }}
          />
        );
      },
      [selectedId, onSelect, isEditMode, handleDeletePress, onEditCategory]
    );

    const ListHeader = useCallback(() => {
      if (!onAddPress) return null;
      return (
        <YStack alignItems="center" space="$2" marginRight="$3" marginLeft="$1">
          <Button
            size="$6"
            circular
            backgroundColor="$background"
            borderWidth={2}
            borderColor="$gray5"
            borderStyle="dashed"
            onPress={() => {
              setIsEditMode(false);
              onAddPress();
            }}
            pressStyle={{ backgroundColor: "$gray3" }}
          >
            <Plus size={24} color="$gray10" />
          </Button>
          <Text fontSize={10} fontWeight="700" color="$gray10">
            Nueva
          </Text>
        </YStack>
      );
    }, [onAddPress]);

    return (
      <YStack space="$3">
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal="$2"
        >
          <Text fontSize="$3" fontWeight="700" color="$gray10" marginLeft="$2">
            CATEGORÍA
          </Text>

          <XStack space="$1" alignItems="center">
            {customCount > 0 && (
              <>
                <Text fontSize={10} color="$purple10" fontWeight="700">
                  {customCount} Creadas
                </Text>
                <Text fontSize={10} color="$gray6" marginHorizontal="$1.5">
                  |
                </Text>
              </>
            )}
            <Text
              fontSize={10}
              color="$gray9"
              fontWeight="600"
              marginRight="$2"
            >
              {generalCount} Generales
            </Text>
          </XStack>
        </XStack>

        <FlatList
          data={processedData}
          renderItem={renderItem}
          keyExtractor={(item) =>
            item.type === "CATEGORY" ? item.data.id : item.id
          }
          horizontal
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 10,
            paddingTop: 10,
            alignItems: "flex-start",
          }}
          keyboardShouldPersistTaps="handled"
        />
        <DangerModal
          visible={!!categoryToDelete}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={confirmDelete}
          title="¿Archivar Categoría?"
          message={
            <YStack space="$2">
              <Text color="$colorQwerty" textAlign="center" fontSize={14}>
                Esta categoría dejará de aparecer para nuevas creaciones.
              </Text>
              <Text color="$gray10" textAlign="center" fontSize={12}>
                (Tus presupuestos y gastos antiguos se mantendrán intactos en tu
                historial).
              </Text>
            </YStack>
          }
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
        />
      </YStack>
    );
  }
);
