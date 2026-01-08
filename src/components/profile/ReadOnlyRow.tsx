import { Lock } from "@tamagui/lucide-icons";
import { Label, Text, XStack, YStack } from "tamagui";

interface ReadOnlyRowProps {
  label: string;
  value: string;
}

export const ReadOnlyRow = ({ label, value }: ReadOnlyRowProps) => {
  return (
    <YStack>
      <Label
        fontSize={12}
        color="$gray11"
        marginBottom="$1"
        fontWeight="600"
      >
        {label}
      </Label>

      <XStack
        alignItems="center"
        backgroundColor="$gray3"
        borderRadius="$4"
        paddingHorizontal="$3"
        height={50}
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Lock size={16} color="$gray9" /> 
        <Text
          color="$gray10"
          marginLeft="$2"
          fontSize={15}
          fontWeight="500"
        >
          {value}
        </Text>
      </XStack>
    </YStack>
  );
};
