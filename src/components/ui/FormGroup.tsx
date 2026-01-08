import { YStack, Text } from "tamagui";

interface FormGroupProps {
  children: React.ReactNode;
  title?: string;
}

export const FormGroup = ({ children, title }: FormGroupProps) => (
  <YStack marginBottom="$5">
    {title && (
      <Text
        fontSize={13}
        fontWeight="700"
        color="$gray11"
        marginBottom="$2.5"
        marginLeft="$2"
        textTransform="uppercase"
        letterSpacing={0.5}
      >
        {title}
      </Text>
    )}

    <YStack
      backgroundColor="$gray2"
      borderRadius="$6"
      borderWidth={1}
      borderColor="$borderColor"
      padding="$4"
      space="$3"
      shadowColor="$shadowColor"
      shadowRadius={3}
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.05}
    >
      {children}
    </YStack>
  </YStack>
);
