import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, RefreshControl } from "react-native";
import { YStack, XStack, Text, Button } from "tamagui";
import { ChevronLeft, Archive, Plus } from "@tamagui/lucide-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { CategoryActions } from "../../actions/categoryActions";
import { Category } from "../../types/category.types";
import { CreateCategorySheet } from "../../components/category/CreateCategorySheet";
import { CategoryGridItem } from "../../components/category/CategoryGridItem";
import { DangerModal } from "../../components/ui/DangerModal";

type TabOption = "ACTIVE" | "ARCHIVED";

const SectionHeader = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) => (
  <XStack alignItems="center" space="$3" marginBottom="$4" marginTop="$2">
    <Text fontSize="$4" fontWeight="800" color="$color" letterSpacing={0.5}>
      {title}
    </Text>
    <YStack
      backgroundColor={color}
      paddingHorizontal="$2"
      paddingVertical={2}
      borderRadius="$4"
    >
      <Text fontSize={9} fontWeight="800" color="white">
        {count}
      </Text>
    </YStack>
    <YStack flex={1} height={1} backgroundColor="$gray5" opacity={0.3} />
  </XStack>
);
export default function ManageCategoriesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.isLoading);

  const [activeTab, setActiveTab] = useState<TabOption>("ACTIVE");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    CategoryActions.loadCategories(true);
  }, []);

  const groupedCategories = useMemo(() => {
    const sorter = (a: Category, b: Category) => a.name.localeCompare(b.name);

    const activeRaw = categories.filter((c) => c.isActive !== false);
    const archivedRaw = categories.filter((c) => c.isActive === false);
    const process = (list: Category[]) => ({
      userCategories: list.filter((c) => c.userId).sort(sorter),
      systemCategories: list.filter((c) => !c.userId).sort(sorter),
    });

    return {
      ACTIVE: process(activeRaw),
      ARCHIVED: process(archivedRaw),
    };
  }, [categories]); 

  const { userCategories, systemCategories } = groupedCategories[activeTab];

  const handleRestore = async (id: string) => {
    await CategoryActions.restoreCategory(id);
  };

  const handleDeletePress = (id: string) => {
    setCategoryToDelete(id);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      await CategoryActions.deleteCategory(categoryToDelete);
      setCategoryToDelete(null);
    }
  };

  const handleEditPress = (cat: Category) => {
    if (!cat.userId) return;
    setEditingCategory(cat);
    setSheetOpen(true);
  };

  const handleCreatePress = () => {
    setEditingCategory(null);
    setSheetOpen(true);
  };

  return (
    <YStack flex={1} backgroundColor="$background" paddingTop={insets.top}>
      <XStack
        alignItems="center"
        paddingHorizontal="$4"
        paddingVertical="$3"
        space="$3"
      >
        <Button
          size="$3"
          circular
          chromeless
          icon={ChevronLeft}
          onPress={navigation.goBack}
        />
        <Text fontSize="$6" fontWeight="800" flex={1}>
          Categorías
        </Text>
        {activeTab === "ACTIVE" && (
          <Button
            size="$3"
            circular
            backgroundColor="$color"
            icon={<Plus size={20} color="$background" />}
            onPress={handleCreatePress}
          />
        )}
      </XStack>

      <XStack paddingHorizontal="$4" marginBottom="$4" space="$3">
        <Button
          flex={1}
          size="$3"
          backgroundColor={activeTab === "ACTIVE" ? "$color" : "$gray3"}
          onPress={() => setActiveTab("ACTIVE")}
          pressStyle={{ opacity: 0.9 }}
        >
          <Text
            fontWeight="700"
            color={activeTab === "ACTIVE" ? "$background" : "$gray10"}
          >
            Activas
          </Text>
        </Button>
        <Button
          flex={1}
          size="$3"
          backgroundColor={activeTab === "ARCHIVED" ? "$orange3" : "$gray3"}
          onPress={() => setActiveTab("ARCHIVED")}
          pressStyle={{ opacity: 0.9 }}
          icon={
            activeTab === "ARCHIVED" ? (
              <Archive size={14} color="$orange10" />
            ) : undefined
          }
        >
          <Text
            fontWeight="700"
            color={activeTab === "ARCHIVED" ? "$orange10" : "$gray10"}
          >
            Papelera
          </Text>
        </Button>
      </XStack>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => CategoryActions.loadCategories(true)}
          />
        }
      >
        {userCategories.length === 0 &&
          systemCategories.length === 0 &&
          !isLoading && (
            <YStack flex={1} alignItems="center" marginTop="$10" space="$4">
              <Archive size={40} color="$gray5" />
              <Text color="$gray9" textAlign="center">
                {activeTab === "ACTIVE"
                  ? "No hay categorías activas."
                  : "La papelera está vacía."}
              </Text>
            </YStack>
          )}

        {userCategories.length > 0 && (
          <YStack marginBottom="$6">
            <SectionHeader
              title={
                activeTab === "ACTIVE" ? "Mis Creaciones" : "Mis Archivadas"
              }
              count={userCategories.length}
              color="$purple9"
            />

            <XStack flexWrap="wrap" gap="$3" justifyContent="space-between">
              {userCategories.map((cat) => (
                <CategoryGridItem
                  key={cat.id}
                  cat={cat}
                  activeTab={activeTab}
                  onPress={handleEditPress}
                  onRestore={handleRestore}
                  onDelete={handleDeletePress}
                />
              ))}
              {userCategories.length % 2 !== 0 && <YStack width="48%" />}
            </XStack>
          </YStack>
        )}

        {systemCategories.length > 0 && (
          <YStack>
            <SectionHeader
              title="Esenciales del Sistema"
              count={systemCategories.length}
              color="$gray8"
            />

            <XStack flexWrap="wrap" gap="$3" justifyContent="space-between">
              {systemCategories.map((cat) => (
                <CategoryGridItem
                  key={cat.id}
                  cat={cat}
                  activeTab={activeTab}
                  onPress={handleEditPress}
                  onRestore={handleRestore}
                  onDelete={() => {}}
                />
              ))}
              {systemCategories.length % 2 !== 0 && <YStack width="48%" />}
            </XStack>
          </YStack>
        )}
      </ScrollView>

      {isSheetOpen && (
        <CreateCategorySheet
          open={isSheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setEditingCategory(null);
          }}
          initialData={editingCategory}
        />
      )}
      <DangerModal
        visible={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={confirmDelete}
        title="¿Archivar Categoría?"
        message="Dejará de aparecer en nuevas opciones, pero se mantendrá en tu historial."
        confirmText="Sí, archivar"
        cancelText="Cancelar"
      />
    </YStack>
  );
}
