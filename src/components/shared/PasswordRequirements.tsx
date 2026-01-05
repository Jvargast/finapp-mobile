import { YStack, XStack, Text } from "tamagui";
import { CheckCircle2, AlertCircle } from "@tamagui/lucide-icons";

export const PasswordRequirements = ({ password }: { password: string }) => {
  const requirements = [
    { label: "Mín. 8 caracteres", met: password.length >= 8 },
    { label: "Una mayúscula", met: /[A-Z]/.test(password) },
    { label: "Una minúscula", met: /[a-z]/.test(password) },
    { label: "Un número", met: /\d/.test(password) },
    { label: "Un símbolo (@$!%*?&)", met: /[\W_]/.test(password) },
  ];

  return (
    <YStack space="$1" marginTop="$2" paddingLeft="$1">
      <XStack flexWrap="wrap" gap="$3">
        {requirements.map((req, index) => (
          <XStack key={index} alignItems="center" space="$1.5">
            {req.met ? (
              <CheckCircle2 size={14} color="#22C55E" />
            ) : (
              <AlertCircle size={14} color="#CBD5E1" />
            )}
            <Text
              fontSize={11}
              color={req.met ? "#22C55E" : "#64748B"}
              fontWeight={req.met ? "600" : "400"}
            >
              {req.label}
            </Text>
          </XStack>
        ))}
      </XStack>
    </YStack>
  );
};

export const PASSWORD_REGEX_VALIDATOR =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
