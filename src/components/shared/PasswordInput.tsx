import { useState } from "react";
import { YStack, Text, XStack } from "tamagui";
import { TextInput, Pressable } from "react-native";
import { Lock, Eye, EyeOff } from "@tamagui/lucide-icons";

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const PasswordInput = ({
  label,
  value,
  onChange,
  placeholder,
}: PasswordInputProps) => {
  const [show, setShow] = useState(false);

  return (
    <YStack marginBottom="$4">
      <Text
        fontSize={13}
        color="#64748B"
        fontWeight="600"
        marginBottom="$2"
        marginLeft="$1"
      >
        {label}
      </Text>
      <XStack
        alignItems="center"
        backgroundColor="white"
        borderWidth={1}
        borderColor="#E2E8F0"
        borderRadius="$4"
        paddingHorizontal="$3"
        height={54}
      >
        <Lock size={20} color="#94A3B8" />
        <TextInput
          style={{
            flex: 1,
            fontSize: 16,
            padding: 10,
            color: "#1E293B",
            height: "100%",
          }}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
          autoCapitalize="none"
        />

        <Pressable
          onPress={() => setShow(!show)}
          style={{ padding: 10 }}
          hitSlop={15}
        >
          {show ? (
            <EyeOff size={22} color="#4F46E5" />
          ) : (
            <Eye size={22} color="#94A3B8" />
          )}
        </Pressable>
      </XStack>
    </YStack>
  );
};
