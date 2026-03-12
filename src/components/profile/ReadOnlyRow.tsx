import { Lock } from "@tamagui/lucide-icons";
import { Text, XStack, YStack, Stack } from "tamagui";

interface ReadOnlyRowProps {
  label: string;
  value: string;
}

export const ReadOnlyRow = ({ label, value }: ReadOnlyRowProps) => {
  return (
    <YStack space="$1.5">
      <Text
        fontSize={11}
        color="$gray11"
        fontWeight="800"
        textTransform="uppercase"
        letterSpacing={0.9}
        marginLeft="$1"
      >
        {label}
      </Text>

      <XStack
        alignItems="center"
        paddingVertical="$2"
        space="$3"
      >
        <Stack
          width={36}
          height={36}
          borderRadius={12}
          backgroundColor="$appPage"
          alignItems="center"
          justifyContent="center"
        >
          <Lock size={16} color="#64748B" />
        </Stack>
        <YStack flex={1} space={2}>
          <Text color="$gray11" fontSize={15} fontWeight="700">
            {value}
          </Text>
        </YStack>
      </XStack>
    </YStack>
  );
};
