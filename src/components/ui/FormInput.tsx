import React from "react";
import { YStack, Label, Input, Text } from "tamagui";
import { Controller, Control } from "react-hook-form";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: "default" | "numeric" | "email-address";
  isCurrency?: boolean;
}

export const FormInput = ({
  control,
  name,
  label,
  placeholder,
  keyboardType = "default",
  isCurrency = false,
}: FormInputProps) => {
  return (
    <YStack space="$2">
      <Label htmlFor={name} fontWeight="700" fontSize="$3" color="$gray11">
        {label}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <Input
            id={name}
            size="$5"
            placeholder={placeholder}
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChange}
            backgroundColor="$color2"
            borderWidth={0}
            fontSize={isCurrency ? "$8" : "$5"}
            fontWeight={isCurrency ? "800" : "400"}
            color={isCurrency ? "$brand" : "$color"}
            height={isCurrency ? 70 : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name={name}
        render={({ fieldState: { error } }) =>
          error ? (
            <Text color="$red10" fontSize={11} fontWeight="600">
              {error.message}
            </Text>
          ) : (
            <></>
          )
        }
      />
    </YStack>
  );
};
