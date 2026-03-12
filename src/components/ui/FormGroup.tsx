import type { ReactNode } from "react";
import { Text, YStack } from "tamagui";

interface FormGroupProps {
  children: ReactNode;
  title?: string;
}

export const FormGroup = ({ children, title }: FormGroupProps) => (
  <YStack marginBottom="$4" space="$2">
    {title ? (
      <Text
        fontSize={11}
        fontWeight="800"
        color="$gray11"
        textTransform="uppercase"
        letterSpacing={0.9}
        paddingHorizontal="$1"
      >
        {title}
      </Text>
    ) : null}

    <YStack
      backgroundColor="$appSurface"
      borderRadius={24}
      padding="$4"
      space="$3"
      shadowColor="$shadowColor"
      shadowRadius={10}
      shadowOffset={{ width: 0, height: 6 }}
      shadowOpacity={0.04}
    >
      {children}
    </YStack>
  </YStack>
);
