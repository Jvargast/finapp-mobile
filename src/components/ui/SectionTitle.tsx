import { Text, GetProps } from "tamagui";

type SectionTitleProps = GetProps<typeof Text> & {
  title: string;
};

export const SectionTitle = ({ title, ...props }: SectionTitleProps) => (
  <Text
    fontSize={12}
    color="$color"
    opacity={0.5}
    fontWeight="700"
    marginTop="$5"
    marginBottom="$3"
    marginLeft="$4" 
    textTransform="uppercase"
    letterSpacing={1}
    {...props} 
  >
    {title}
  </Text>
);
