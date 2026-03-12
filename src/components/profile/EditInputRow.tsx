import { AlertCircle, Info } from "@tamagui/lucide-icons";
import { useState } from "react";
import { YStack, Input, XStack, Text, Stack } from "tamagui";

interface EditInputRowProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  icon?: any;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string | null;
  helperText?: string;
}

export const EditInputRow = ({
  label,
  value,
  onChangeText,
  placeholder,
  icon: Icon,
  autoCapitalize = "words",
  error,
  helperText,
}: EditInputRowProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const brandColor = "#4F46E5";
  const dangerColor = "#DC2626";
  const borderColor = error ? "$red10" : isFocused ? brandColor : "$appBorder";
  const iconColor = error ? dangerColor : brandColor;
  const iconBgColor = error ? "$red2" : isFocused ? "$appAccentSoft" : "$appPage";
  const labelColor = error ? "$red10" : isFocused ? brandColor : "$gray11";
  const helperColor = error ? "$red10" : isFocused ? brandColor : "$gray10";

  return (
    <YStack marginBottom="$2.5" space="$1.5">
      <Text
        fontSize={11}
        color={labelColor}
        fontWeight="800"
        animation="quick"
        letterSpacing={0.9}
        textTransform="uppercase"
        marginLeft="$1"
      >
        {label}
      </Text>

      <XStack
        alignItems="center"
        backgroundColor="$background"
        borderWidth={1}
        borderColor={borderColor}
        borderRadius={18}
        minHeight={56}
        paddingHorizontal="$3"
        animation="quick"
      >
        {Icon && (
          <Stack
            backgroundColor={iconBgColor}
            borderRadius={12}
            marginRight="$3"
            justifyContent="center"
            alignItems="center"
            width={36}
            height={36}
          >
            <Icon size={17} color={iconColor} opacity={1} />
          </Stack>
        )}

        <Input
          flex={1}
          unstyled
          value={value}
          onChange={(event: any) => onChangeText(event?.nativeEvent?.text ?? "")}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="gray"
          autoCapitalize={autoCapitalize}
          size="$5"
          color="$color"
        />

        {error ? (
          <AlertCircle size={18} color="$red10" animation="bouncy" />
        ) : (
          helperText && (
            <Info
              size={16}
              color={brandColor}
              opacity={isFocused ? 0.55 : 0.22}
              animation="quick"
            />
          )
        )}
      </XStack>

      <YStack minHeight={helperText || error ? 18 : 0} justifyContent="center">
        {error ? (
          <Text
            color="$red10"
            fontSize={11}
            fontWeight="700"
            marginLeft="$2"
            animation="quick"
            enterStyle={{ opacity: 0, y: -5 }}
          >
            {error}
          </Text>
        ) : helperText ? (
          <Text
            color={helperColor}
            fontSize={11}
            marginLeft="$2"
            animation="quick"
            enterStyle={{ opacity: 0 }}
          >
            {helperText}
          </Text>
        ) : null}
      </YStack>
    </YStack>
  );
};
