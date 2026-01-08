import { AlertCircle, Info } from "@tamagui/lucide-icons";
import { useState } from "react";
import { YStack, Label, Input, XStack, Text } from "tamagui";

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

  const BRAND_COLOR = "#4F46E5";

  const borderColor = error
    ? "$red10"
    : isFocused
    ? BRAND_COLOR
    : "$borderColor";

  const backgroundColor = "$background";
  const iconColor = error ? "$red10" : BRAND_COLOR;
  const iconBgColor = error ? "$red2" : `${BRAND_COLOR}15`;
  const labelColor = error ? "$red10" : isFocused ? BRAND_COLOR : "$gray11";

  return (
    <YStack marginBottom="$2">
      <Label
        fontSize={12}
        color={labelColor}
        marginBottom="$1.5"
        fontWeight="600"
        animation="quick"
        opacity={isFocused ? 1 : 0.8}
        marginLeft="$1"
      >
        {label}
      </Label>

      <XStack
        alignItems="center"
        backgroundColor={backgroundColor}
        borderWidth={1}
        borderColor={borderColor}
        borderRadius="$4"
        height={50}
        paddingHorizontal="$3"
        shadowColor={isFocused ? BRAND_COLOR : "transparent"}
        shadowRadius={isFocused ? 6 : 0}
        shadowOffset={{ width: 0, height: isFocused ? 3 : 0 }}
        shadowOpacity={isFocused ? 0.15 : 0}
        animation="quick"
      >
        {Icon && (
          <YStack
            backgroundColor={iconBgColor}
            borderRadius="$3"
            padding="$1.5"
            marginRight="$3"
            justifyContent="center"
            alignItems="center"
            width={32}
            height={32}
          >
            <Icon size={18} color={iconColor} opacity={1} />
          </YStack>
        )}

        <Input
          flex={1}
          unstyled
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="$gray8"
          autoCapitalize={autoCapitalize}
          color="$color"
          fontSize={15}
          fontWeight="500"
          height="100%"
        />

        {error ? (
          <AlertCircle size={18} color="$red10" animation="bouncy" />
        ) : (
          isFocused &&
          helperText && (
            <Info
              size={16}
              color={BRAND_COLOR}
              opacity={0.5}
              animation="quick"
            />
          )
        )}
      </XStack>

      <YStack minHeight={20} justifyContent="center" marginTop="$1.5">
        {error ? (
          <Text
            color="$red10"
            fontSize={11}
            fontWeight="600"
            marginLeft="$2"
            animation="quick"
            enterStyle={{ opacity: 0, y: -5 }}
          >
            {error}
          </Text>
        ) : helperText ? (
          <Text
            color={isFocused ? BRAND_COLOR : "$gray10"}
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
