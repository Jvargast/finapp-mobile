import { YStack, XStack, Text, Button, Separator, View } from "tamagui";
import { ChevronRight, Lock } from "@tamagui/lucide-icons";

interface InfoRowProps {
  icon: any;
  label: string;
  value?: string | null;
  onEdit?: () => void;
  isLast?: boolean;
}

export const InfoRow = ({
  icon: Icon,
  label,
  value,
  onEdit,
  isLast = false,
}: InfoRowProps) => {
  const isEditable = !!onEdit;

  return (
    <YStack>
      <Button
        unstyled
        onPress={onEdit}
        disabled={!isEditable}
        paddingVertical="$4"
        paddingHorizontal="$4"
        animation="quick" 
        pressStyle={{ 
          scale: 0.98, 
          opacity: 0.8,
          backgroundColor: "#F8FAFC" 
        }}
      >
        <XStack alignItems="center" space="$4">
          
          <YStack
            backgroundColor="#EEF2FF" 
            width={42}
            height={42}
            borderRadius="$4" 
            alignItems="center"
            justifyContent="center"
            borderWidth={1}
            borderColor="#E0E7FF" 
            shadowColor="#4F46E5"
            shadowRadius={4}
            shadowOffset={{ width: 0, height: 2 }}
            shadowOpacity={0.05} 
          >
            <Icon size={20} color="#4F46E5" strokeWidth={2} />
          </YStack>

          <YStack flex={1} space="$1">
            <Text
              fontSize={11}
              color="#64748B"
              fontWeight="700"
              letterSpacing={0.5} 
              textTransform="uppercase"
              opacity={0.8}
            >
              {label}
            </Text>
            
            <Text 
              fontSize={16} 
              color={value ? "#1E293B" : "#94A3B8"} 
              fontWeight="600"
              numberOfLines={1}
            >
              {value || "No registrado"}
            </Text>
          </YStack>

          {isEditable ? (
            <View 
              backgroundColor="#F1F5F9" 
              borderRadius="$10" 
              padding="$1.5"
            >
              <ChevronRight size={16} color="#94A3B8" />
            </View>
          ) : (
            <Lock size={14} color="#CBD5E1" />
          )}

        </XStack>
      </Button>
      
      {!isLast && <Separator borderColor="#F1F5F9" marginLeft={74} />}
    </YStack>
  );
};