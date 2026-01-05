import { Lock } from "@tamagui/lucide-icons";
import { Label, Text, XStack, YStack } from "tamagui";

interface ReadOnlyRowProps {
  label: string;
  value: string;
}

export const ReadOnlyRow = ({ label, value }: ReadOnlyRowProps) => {
  return (
    <YStack>
      <Label fontSize={12} color="#64748B" marginBottom="$1.5" fontWeight="600">
        {label}
      </Label>
      <XStack
        alignItems="center"
        backgroundColor="#F1F5F9"
        borderRadius="$4"
        paddingHorizontal="$3"
        height={50}
        borderWidth={1}
        borderColor="#E2E8F0"
        opacity={0.8}
      >
        <Lock size={16} color="#94A3B8" />
        <Text color="#64748B" marginLeft="$2" fontSize={15} fontWeight="500">
          {value}
        </Text>
      </XStack>
    </YStack>
  );
};
