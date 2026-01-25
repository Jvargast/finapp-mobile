import React, { memo } from "react";
import { YStack, Text, Button } from "tamagui";
import { Category } from "../../types/category.types";
import { getIcon } from "../../utils/iconMap";
import { Pencil, X } from "@tamagui/lucide-icons";

interface CategoryItemProps {
  cat: Category;
  isSelected: boolean;
  isEditing?: boolean;
  onSelect: (id: string) => void;
  onLongPress?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (cat: Category) => void;
}

const CategoryItemBase = ({
  cat,
  isSelected,
  isEditing,
  onSelect,
  onLongPress,
  onDelete,
  onEdit,
}: CategoryItemProps) => {
  const IconComponent = getIcon(cat.icon);
  const canDelete = !!cat.userId && isEditing;

  return (
    <YStack alignItems="center" space="$2" marginHorizontal="$1.5">
      <YStack>
        <Button
          size="$6"
          circular
          backgroundColor={isSelected ? cat.color : "$gray1"}
          borderWidth={isSelected ? 0 : 1.5}
          borderColor={isSelected ? "transparent" : "$gray5"}
          onPress={() => onSelect(cat.id)}
          onLongPress={cat.userId ? onLongPress : undefined}
          elevation={isSelected ? 5 : 0}
          shadowColor={isSelected ? cat.color : undefined}
          shadowRadius={isSelected ? 8 : 0}
          shadowOpacity={isSelected ? 0.4 : 0}
          pressStyle={{ opacity: 0.8 }}
          rotate={canDelete ? "-3deg" : "0deg"}
        >
          <IconComponent size={26} color={isSelected ? "white" : cat.color} />
        </Button>
        {canDelete && (
          <>
            <Button
              position="absolute"
              top={-6}
              right={-6}
              size="$2"
              circular
              backgroundColor="$red10"
              elevation={5}
              onPress={() => onDelete && onDelete(cat.id)}
              pressStyle={{ scale: 0.9 }}
              zIndex={10}
            >
              <X size={12} color="white" strokeWidth={3} />
            </Button>

            <Button
              position="absolute"
              bottom={-6}
              right={-6}
              size="$2"
              circular
              backgroundColor="$blue10"
              elevation={5}
              onPress={() => onEdit && onEdit(cat)}
              pressStyle={{ scale: 0.9 }}
              zIndex={10}
            >
              <Pencil size={12} color="white" strokeWidth={3} />
            </Button>
          </>
        )}
      </YStack>

      <Text
        fontSize={11}
        fontWeight={isSelected ? "800" : "500"}
        color={isSelected ? "$color" : "$gray10"}
        numberOfLines={1}
        ellipsizeMode="tail"
        maxWidth={74}
        textAlign="center"
      >
        {cat.name}
      </Text>
    </YStack>
  );
};

export const CategoryItem = memo(CategoryItemBase, (prev, next) => {
  return (
    prev.isSelected === next.isSelected &&
    prev.cat.id === next.cat.id &&
    prev.cat.color === next.cat.color &&
    prev.isEditing === next.isEditing
  );
});
