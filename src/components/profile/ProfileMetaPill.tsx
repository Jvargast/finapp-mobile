import { Text, XStack, useThemeName } from "tamagui";
import { getAppVisualPalette, withAlpha } from "../../theme/appVisuals";

interface ProfileMetaPillProps {
  label: string;
  value: string;
}

export const ProfileMetaPill = ({
  label,
  value,
}: ProfileMetaPillProps) => {
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");
  const palette = getAppVisualPalette(themeName);
  const pillBg = isDark
    ? withAlpha(palette.mixAlt, 0.08, palette.accentSoft)
    : withAlpha(palette.brand, 0.08, palette.accentSoft);

  return (
    <XStack
      alignSelf="flex-start"
      alignItems="center"
      maxWidth="100%"
      paddingHorizontal="$3"
      paddingVertical="$2"
      borderRadius={999}
      backgroundColor={pillBg}
      space="$2"
    >
      <Text
        fontSize={10}
        fontWeight="800"
        color={palette.muted}
        textTransform="uppercase"
        letterSpacing={0.7}
      >
        {label}
      </Text>

      <Text
        flexShrink={1}
        fontSize={13}
        fontWeight="700"
        color={palette.ink}
        numberOfLines={1}
      >
        {value}
      </Text>
    </XStack>
  );
};
