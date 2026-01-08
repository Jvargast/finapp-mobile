import { YStack, Label, XStack, Text, Button } from "tamagui";
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

  const brandColor = "#4F46E5";
  const placeholderColor = "$gray9"; 

  return (
    <YStack marginBottom="$4">
      <XStack
        backgroundColor="$background"
        borderRadius="$6"
        padding="$3.5"
        alignItems="center"
        borderWidth={1}
        borderColor="$borderColor"
        shadowColor="$shadowColor"
        shadowRadius={8}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.05}
        animation="quick"
      >
        <YStack
          backgroundColor="$gray2"
          padding="$2.5"
          borderRadius="$4"
          marginRight="$3.5"
          alignItems="center"
          justifyContent="center"
        >
          <Icon
            size={20}
            color={hasValue ? brandColor : placeholderColor}
            strokeWidth={2}
          />
        </YStack>

        <YStack flex={1} space="$0.5">
          <XStack alignItems="center" space="$1.5">
            <Text
              fontSize={11}
              color="$gray10" 
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
            color={hasValue ? "$color" : placeholderColor}
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
          backgroundColor="$gray3"
          hoverStyle={{ backgroundColor: "$gray4" }}
          pressStyle={{ backgroundColor: "$gray5", scale: 0.97 }}
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$10"
          paddingHorizontal="$3"
          icon={<Edit3 size={14} color={brandColor} />}
        >
          <Text fontSize={12} fontWeight="600" color={brandColor}>
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
