import React, { memo } from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { Lock, RefreshCcw, Edit3, Trash2 } from "@tamagui/lucide-icons";
import { Category } from "../../types/category.types";
import { getIcon } from "../../utils/iconMap";

interface CategoryGridItemProps {
  cat: Category;
  activeTab: "ACTIVE" | "ARCHIVED";
  onPress: (cat: Category) => void;
  onRestore: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CategoryGridItem = memo(
  ({ cat, activeTab, onPress, onRestore, onDelete }: CategoryGridItemProps) => {
    const IconComponent = getIcon(cat.icon);
    const isSystem = !cat.userId;
    const isActiveTab = activeTab === "ACTIVE";

    return (
      <YStack
        width="48%"
        backgroundColor="$gray2"
        borderRadius="$6"
        padding="$4"
        space="$3"
        alignItems="center"
        borderWidth={1}
        borderColor="$gray3"
        pressStyle={{ opacity: 0.7 }}
        onPress={() => (isActiveTab ? onPress(cat) : null)}
      >
        {isSystem && (
          <YStack position="absolute" top={8} right={8} opacity={0.5}>
            <Lock size={12} color="$gray10" />
          </YStack>
        )}

        {isActiveTab && !isSystem && (
          <Button
            position="absolute"
            top={6}
            left={6}
            size="$2"
            circular
            backgroundColor="$red2"
            onPress={(e) => {
              e.stopPropagation();
              onDelete(cat.id);
            }}
            pressStyle={{ scale: 0.9 }}
            zIndex={10}
          >
            <Trash2 size={12} color="$red10" />
          </Button>
        )}

        <YStack
          width={50}
          height={50}
          borderRadius={25}
          backgroundColor={cat.color}
          justifyContent="center"
          alignItems="center"
          elevation={2}
        >
          <IconComponent size={24} color="white" />
        </YStack>

        <Text
          fontSize={13}
          fontWeight="700"
          color="$color"
          textAlign="center"
          numberOfLines={1}
        >
          {cat.name}
        </Text>

        {activeTab === "ARCHIVED" && (
          <Button
            size="$3"
            width="100%"
            backgroundColor="$blue3"
            color="$blue10"
            icon={<RefreshCcw size={14} />}
            onPress={() => onRestore(cat.id)}
            marginTop="$1"
            fontWeight="700"
            fontSize={12}
            pressStyle={{ opacity: 0.8 }}
          >
            Restaurar
          </Button>
        )}

        {isActiveTab && !isSystem && (
          <XStack alignItems="center" space="$1" opacity={0.5} marginTop="$1">
            <Edit3 size={10} color="$gray10" />
            <Text fontSize={10} color="$gray10">
              Editar
            </Text>
          </XStack>
        )}
      </YStack>
    );
  },
  (prev, next) => {
    return (
      prev.cat.id === next.cat.id &&
      prev.cat.name === next.cat.name &&
      prev.cat.color === next.cat.color &&
      prev.cat.icon === next.cat.icon &&
      prev.activeTab === next.activeTab
    );
  }
);
