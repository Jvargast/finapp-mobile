import React, { useState, memo, useCallback, useEffect } from "react";
import { Keyboard, ScrollView } from "react-native";
import { Sheet, YStack, XStack, Text, Input, Button, Circle } from "tamagui";
import { Check, X } from "@tamagui/lucide-icons";
import { CategoryActions } from "../../actions/categoryActions";
import {
  COLOR_PALETTE,
  ICON_GROUPS,
  ICON_CATEGORIES,
} from "../../constants/categoryOptions";
import { getIcon } from "../../utils/iconMap";
import { TransactionType } from "../../types/category.types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ColorItem = memo(({ color, isSelected, onPress }: any) => (
  <Circle
    size={36}
    backgroundColor={color}
    onPress={() => onPress(color)}
    borderWidth={isSelected ? 3 : 0}
    borderColor="$background"
    outlineColor={isSelected ? color : "transparent"}
    outlineWidth={2}
    marginRight="$2"
    pressStyle={{ opacity: 0.7 }}
  />
));

const IconItem = memo(
  ({ iconName, isSelected, selectedColor, onPress }: any) => {
    const IconComponent = getIcon(iconName);
    return (
      <Button
        size="$5"
        circular
        backgroundColor={isSelected ? selectedColor : "$gray2"}
        onPress={() => onPress(iconName)}
        borderWidth={0}
        pressStyle={{ opacity: 0.7 }}
      >
        <IconComponent size={24} color={isSelected ? "white" : "$gray10"} />
      </Button>
    );
  }
);

interface CreateCategorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type?: TransactionType;
  initialData?: any;
}

export const CreateCategorySheet = ({
  open,
  onOpenChange,
  type = "EXPENSE",
  initialData,
}: CreateCategorySheetProps) => {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
  const [selectedIcon, setSelectedIcon] = useState(
    ICON_GROUPS["Esenciales"][0]
  );
  const [activeIconTab, setActiveIconTab] = useState("Esenciales");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        setName(initialData.name);
        setSelectedColor(initialData.color);
        setSelectedIcon(initialData.icon);
      } else {
        setName("");
        setSelectedColor(COLOR_PALETTE[0]);
        setSelectedIcon(ICON_GROUPS["Esenciales"][0]);
      }
    }
  }, [open, initialData]);

  const handleSave = async () => {
    if (!name.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      if (initialData) {
        await CategoryActions.updateCategory(initialData.id, {
          name,
          color: selectedColor,
          icon: selectedIcon,
        });
      } else {
        await CategoryActions.createCategory({
          name,
          color: selectedColor,
          icon: selectedIcon,
          type: type,
        });
      }
      await CategoryActions.loadCategories();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving category", error);
    } finally {
      setIsLoading(false);
    }
  };

  const SelectedIconComponent = getIcon(selectedIcon);
  const insets = useSafeAreaInsets();

  return (
    <Sheet
      forceRemoveScrollEnabled={open}
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[75]}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Handle />

      <Sheet.Frame
        paddingHorizontal="$4"
        paddingTop="$5"
        paddingBottom={Math.max(insets.bottom, 20)}
        space="$3"
        backgroundColor="$background"
      >
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="800" color="$color">
            {initialData ? "Editar Categoría" : "Nueva Categoría"}
          </Text>
          <Button
            size="$3"
            circular
            chromeless
            icon={X}
            onPress={() => onOpenChange(false)}
          />
        </XStack>

        <YStack alignItems="center" paddingVertical="$1">
          <Circle
            size={70}
            backgroundColor={selectedColor}
            elevation={5}
            shadowColor={selectedColor}
            shadowRadius={10}
            shadowOpacity={0.5}
          >
            <SelectedIconComponent size={36} color="white" />
          </Circle>
        </YStack>

        <YStack space="$2">
          <Text fontSize="$3" fontWeight="700" color="$gray11" marginLeft="$1">
            NOMBRE
          </Text>
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Ej: Netflix, Gym, Uber..."
            backgroundColor="$gray2"
            size="$4"
            fontWeight="600"
          />
        </YStack>

        <YStack space="$2">
          <Text fontSize="$3" fontWeight="700" color="$gray11" marginLeft="$1">
            COLOR
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <XStack paddingHorizontal="$1" paddingVertical="$2">
              {COLOR_PALETTE.map((color) => (
                <ColorItem
                  key={color}
                  color={color}
                  isSelected={selectedColor === color}
                  onPress={setSelectedColor}
                />
              ))}
            </XStack>
          </ScrollView>
        </YStack>

        <YStack space="$2" flex={1} minHeight={0}>
          <Text fontSize="$3" fontWeight="700" color="$gray11" marginLeft="$1">
            ICONO
          </Text>

          <YStack height={38}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              <XStack space="$2">
                {ICON_CATEGORIES.map((cat) => {
                  const isActive = activeIconTab === cat;
                  return (
                    <Button
                      key={cat}
                      size="$3"
                      backgroundColor={isActive ? "$color" : "$gray3"}
                      onPress={() => setActiveIconTab(cat)}
                      borderRadius="$10"
                      pressStyle={{ opacity: 0.8 }}
                    >
                      <Text
                        fontSize={11}
                        fontWeight="700"
                        color={isActive ? "$background" : "$gray11"}
                      >
                        {cat}
                      </Text>
                    </Button>
                  );
                })}
              </XStack>
            </ScrollView>
          </YStack>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
          >
            <XStack
              flexWrap="wrap"
              gap="$3"
              paddingBottom="$2"
              paddingHorizontal="$1"
            >
              {ICON_GROUPS[activeIconTab as keyof typeof ICON_GROUPS].map(
                (iconName: string) => (
                  <IconItem
                    key={iconName}
                    iconName={iconName}
                    isSelected={selectedIcon === iconName}
                    selectedColor={selectedColor}
                    onPress={setSelectedIcon}
                  />
                )
              )}
            </XStack>
          </ScrollView>
        </YStack>
        <Button
          size="$5"
          backgroundColor={!name ? "$gray5" : selectedColor}
          disabled={!name || isLoading}
          onPress={handleSave}
          color="white"
          fontWeight="bold"
          icon={isLoading ? undefined : Check}
        >
          {isLoading
            ? "Guardando..."
            : initialData
            ? "Guardar Cambios"
            : "Crear Categoría"}
        </Button>
      </Sheet.Frame>
    </Sheet>
  );
};
