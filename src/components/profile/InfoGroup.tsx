import { YStack, Text } from "tamagui";

export const InfoGroup = ({ children, title }: any) => (
  <YStack marginBottom="$5">
    {title && (
      <Text
        fontSize={13}
        fontWeight="700"
        color="#64748B"
        marginBottom="$2.5"
        marginLeft="$2"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {title}
      </Text>
    )}
    <YStack
      backgroundColor="white"
      borderRadius="$6"
      overflow="hidden"
      borderWidth={1}
      borderColor="#E2E8F0"
      shadowColor="#64748B"
      shadowRadius={3}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.05}
    >
      {children}
    </YStack>
  </YStack>
);
