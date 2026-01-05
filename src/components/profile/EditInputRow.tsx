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

  const borderColor = error ? "$red10" : isFocused ? "#4F46E5" : "#E2E8F0";
  const iconColor = error ? "$red10" : isFocused ? "#4F46E5" : "#94A3B8";

  return (
    <YStack marginBottom="$4">
      <Label
        fontSize={12}
        color={error ? "$red10" : "#64748B"}
        marginBottom="$1.5"
        fontWeight="600"
      >
        {label}
      </Label>

      <XStack
        alignItems="center"
        backgroundColor="white"
        borderWidth={1.5}
        borderColor={borderColor}
        borderRadius="$4"
        height={50}
        paddingHorizontal="$3"
        animation="quick"
      >
        {Icon && (
          <Icon
            size={20}
            color={error ? "$red10" : isFocused ? "#4F46E5" : "#94A3B8"}
            marginRight="$3"
          />
        )}

        <Input
          flex={1}
          unstyled
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          autoCapitalize={autoCapitalize}
          color="#1E293B"
          fontSize={15}
          height="100%"
        />
        {error ? (
          <AlertCircle size={18} color="$red10" />
        ) : (
          isFocused &&
          helperText && <Info size={16} color="#4F46E5" opacity={0.5} />
        )}
      </XStack>
      {error ? (
        <Text
          color="$red10"
          fontSize={11}
          marginTop="$1.5"
          fontWeight="600"
          marginLeft="$1"
        >
          {error}
        </Text>
      ) : helperText ? (
        <Text
          color={isFocused ? "#4F46E5" : "#94A3B8"}
          fontSize={11}
          marginTop="$1.5"
          marginLeft="$1"
        >
          {helperText}
        </Text>
      ) : null}
    </YStack>
  );
};
