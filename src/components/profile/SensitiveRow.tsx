import { YStack, Label, XStack, Text, Button, View } from "tamagui";
import { Edit3, ShieldCheck, AlertTriangle } from "@tamagui/lucide-icons";

interface SensitiveRowProps {
  icon: any;
  label: string;
  value?: string | null;
  onEdit: () => void;
}

export const SensitiveRow = ({
  icon: Icon,
  label,
  value,
  onEdit,
}: SensitiveRowProps) => {
  const hasValue = !!value;

  return (
    <YStack marginBottom="$4">
      <XStack
        backgroundColor="white"
        borderRadius="$6"
        padding="$3.5"
        alignItems="center"
        borderWidth={1}
        borderColor="#F1F5F9"
        shadowColor="#64748B"
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.04}
        animation="quick"
      >
        <YStack
          backgroundColor={hasValue ? "#EEF2FF" : "#F1F5F9"} 
          padding="$2.5"
          borderRadius="$4"
          marginRight="$3.5"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            size={20}
            color={hasValue ? "#4F46E5" : "#94A3B8"}
            strokeWidth={2}
          />
        </YStack>

        <YStack flex={1} space="$0.5">
          <XStack alignItems="center" space="$1.5">
            <Text
              fontSize={11}
              color="#64748B"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing={0.5}
            >
              {label}
            </Text>
            {hasValue && <ShieldCheck size={10} color="#10B981" />}
          </XStack>

          <Text
            fontSize={15}
            color={hasValue ? "#1E293B" : "#94A3B8"}
            fontWeight="600"
            numberOfLines={1}
            ellipsizeMode="middle"
          >
            {value || "No configurado"}
          </Text>
        </YStack>

        <Button
          onPress={onEdit}
          size="$3"
          backgroundColor="#F8FAFC" 
          hoverStyle={{ backgroundColor: "#F1F5F9" }}
          pressStyle={{ backgroundColor: "#E2E8F0", scale: 0.97 }}
          borderWidth={1}
          borderColor="#E2E8F0"
          borderRadius="$10" 
          paddingHorizontal="$3"
          icon={<Edit3 size={14} color="#4F46E5" />}
        >
          <Text fontSize={12} fontWeight="600" color="#4F46E5">
            {hasValue ? "Editar" : "Añadir"}
          </Text>
        </Button>
      </XStack>

      {!hasValue && (
        <XStack
          marginTop="$1.5"
          marginLeft="$2"
          alignItems="center"
          space="$1.5"
        >
          <AlertTriangle size={12} color="#F59E0B" />
          <Text fontSize={11} color="#F59E0B" fontWeight="500">
            Recomendado para recuperar tu cuenta.
          </Text>
        </XStack>
      )}
    </YStack>
  );
};
