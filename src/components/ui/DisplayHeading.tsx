import type { ComponentProps } from "react";
import { Text } from "tamagui";

type DisplayHeadingProps = ComponentProps<typeof Text> & {
  italic?: boolean;
};

export const DisplayHeading = ({
  italic = false,
  fontFamily,
  fontStyle,
  fontWeight,
  ...props
}: DisplayHeadingProps) => (
  <Text
    {...props}
    fontFamily={fontFamily ?? "$display"}
    fontStyle={italic ? "italic" : fontStyle}
    fontWeight={fontWeight ?? "400"}
  />
);
