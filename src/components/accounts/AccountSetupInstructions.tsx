import React, { useCallback, useMemo } from "react";
import { YStack, Text, XStack, Circle, Button } from "tamagui";
import { Check, Copy } from "@tamagui/lucide-icons";
import * as Clipboard from "expo-clipboard";
import { useToastStore } from "../../stores/useToastStore";

interface AccountSetupInstructionsProps {
  alias: string;
  institution?: string | null;
  rules?: any[];
  isRulesLoading?: boolean;
  verificationSender?: string | null;
  hideSubjectSuggestions?: boolean;
  preferSpecificSenders?: boolean;
}

export const AccountSetupInstructions = ({
  alias,
  institution = null,
  rules = [],
  isRulesLoading = false,
  verificationSender = null,
  hideSubjectSuggestions = false,
  preferSpecificSenders = false,
}: AccountSetupInstructionsProps) => {
  const showToast = useToastStore((state) => state.showToast);

  const steps = [
    "Abre Gmail y ve a Configuración > Ver todos los ajustes.",
    `En la pestaña Reenvío y correo POP/IMAP, pulsa “Añadir una dirección de reenvío” y agrega ${alias}.`,
    "Confirma la dirección desde el correo de verificación que envía Gmail.",
    "En la pestaña Filtros y direcciones bloqueadas, crea un nuevo filtro.",
    hideSubjectSuggestions
      ? "Usa el remitente exacto del banco (el Asunto puede quedar vacío)."
      : "Usa el remitente de tu banco o asunto típico del correo de movimientos.",
    `Activa “Reenviar a” y elige ${alias}.`,
    "Guarda el filtro y verifica que lleguen los primeros correos.",
  ];

  const { senderQuery, subjectQuery, onlyVerification } =
    useMemo(() => {
    if (!Array.isArray(rules) || rules.length === 0) {
      const fallbackSender = verificationSender ? String(verificationSender) : "";
      return {
        senderQuery: fallbackSender,
        subjectQuery: "",
        onlyVerification: Boolean(fallbackSender),
      };
    }

    const senderMap = new Map<string, string>();
    const subjectMap = new Map<string, string>();

    const toList = (value: any) => {
      if (!value) return [];
      return Array.isArray(value) ? value : [value];
    };

    const sanitize = (value: any) => {
      if (value === null || value === undefined) return null;
      const text = String(value).trim();
      return text.length > 0 ? text : null;
    };

    const stripPrefix = (value: string) =>
      value.replace(/^(from|subject):/i, "").trim();

    const extractEmail = (value: string) => {
      const match = value.match(
        /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
      );
      return match ? match[0] : value;
    };

    const addUnique = (map: Map<string, string>, value: string) => {
      const key = value.toLowerCase();
      if (!map.has(key)) map.set(key, value);
    };

    const addSenderEmail = (raw: any) => {
      const cleaned = sanitize(raw);
      if (!cleaned) return;
      const stripped = stripPrefix(cleaned);
      if (!stripped) return;
      const email = extractEmail(stripped);
      if (!email) return;
      addUnique(senderMap, email);
    };

    const addSenderDomain = (raw: any) => {
      const cleaned = sanitize(raw);
      if (!cleaned) return;
      const stripped = stripPrefix(cleaned);
      if (!stripped) return;
      if (stripped.includes("@")) {
        addUnique(senderMap, extractEmail(stripped));
        return;
      }
      const normalized = stripped.startsWith("@")
        ? stripped
        : `@${stripped}`;
      addUnique(senderMap, normalized);
    };

    const formatSubject = (raw: any) => {
      const cleaned = sanitize(raw);
      if (!cleaned) return null;
      const stripped = stripPrefix(cleaned);
      if (!stripped) return null;
      if (/\s/.test(stripped) && !/^".*"$/.test(stripped)) {
        return `"${stripped}"`;
      }
      return stripped;
    };

    rules.forEach((rule) => {
      toList(rule?.senderEmails).forEach(addSenderEmail);
      toList(rule?.senderEmail).forEach(addSenderEmail);
      toList(rule?.senders).forEach(addSenderEmail);
      toList(rule?.sender).forEach(addSenderEmail);
      toList(rule?.from).forEach(addSenderEmail);

      toList(rule?.senderDomains).forEach(addSenderDomain);
      toList(rule?.domains).forEach(addSenderDomain);

      toList(rule?.subjectIncludes).forEach((value) => {
        const formatted = formatSubject(value);
        if (formatted) addUnique(subjectMap, formatted);
      });
      toList(rule?.subjects).forEach((value) => {
        const formatted = formatSubject(value);
        if (formatted) addUnique(subjectMap, formatted);
      });
      toList(rule?.subject).forEach((value) => {
        const formatted = formatSubject(value);
        if (formatted) addUnique(subjectMap, formatted);
      });
    });

    if (verificationSender) {
      addSenderEmail(verificationSender);
    }

    const allSenders = Array.from(senderMap.values());
    const specificSenders = allSenders.filter(
      (value) => value.includes("@") && !value.startsWith("@"),
    );
    const domainSenders = allSenders.filter((value) => value.startsWith("@"));
    const finalSenders =
      preferSpecificSenders && specificSenders.length > 0
        ? specificSenders
        : preferSpecificSenders
          ? []
          : [...specificSenders, ...domainSenders];

    const onlyVerificationSender =
      Boolean(verificationSender) &&
      finalSenders.length === 1 &&
      finalSenders[0].toLowerCase() ===
        String(verificationSender).toLowerCase();

    return {
      senderQuery: finalSenders.join(" OR "),
      subjectQuery: hideSubjectSuggestions
        ? ""
        : Array.from(subjectMap.values()).join(" OR "),
      onlyVerification: onlyVerificationSender,
    };
  }, [rules, verificationSender, hideSubjectSuggestions, preferSpecificSenders]);

  const handleCopyText = useCallback(
    async (value: string, label: string) => {
      if (!value) return;
      await Clipboard.setStringAsync(value);
      showToast(`${label} copiado`, "success");
    },
    [showToast],
  );

  const hasSuggestions = Boolean(senderQuery || subjectQuery);

  return (
    <YStack space="$3">
      {steps.map((step, index) => (
        <XStack key={`${index}-${step}`} space="$3" alignItems="flex-start">
          <Circle size={20} backgroundColor="$blue3">
            <Check size={12} color="$blue10" />
          </Circle>
          <Text fontSize="$3" color="$gray11" flex={1}>
            {step}
          </Text>
        </XStack>
      ))}

      {isRulesLoading ? (
        <Text fontSize="$2" color="$gray9">
          Cargando remitentes sugeridos...
        </Text>
      ) : hasSuggestions ? (
        <YStack space="$3">
          <Text fontSize="$3" fontWeight="700" color="$color">
            {institution
              ? `Sugerencias para el filtro · ${institution}`
              : "Sugerencias para el filtro"}
          </Text>

          {senderQuery ? (
            <YStack space="$2">
              <Text fontSize="$2" color="$gray9">
                Pega esto en el campo “De” del filtro.
              </Text>
              <XStack
                alignItems="flex-start"
                space="$2"
                backgroundColor="$color2"
                padding="$3"
                borderRadius="$6"
              >
                <Text fontSize="$2" color="$color" flex={1}>
                  {senderQuery}
                </Text>
                <Button
                  size="$2"
                  chromeless
                  icon={<Copy size={16} color="$color" />}
                  onPress={() => handleCopyText(senderQuery, "Remitentes")}
                />
              </XStack>
            </YStack>
          ) : null}

          {subjectQuery ? (
            <YStack space="$2">
              <Text fontSize="$2" color="$gray9">
                O usa estos asuntos en el campo “Asunto”.
              </Text>
              <XStack
                alignItems="flex-start"
                space="$2"
                backgroundColor="$color2"
                padding="$3"
                borderRadius="$6"
              >
                <Text fontSize="$2" color="$color" flex={1}>
                  {subjectQuery}
                </Text>
                <Button
                  size="$2"
                  chromeless
                  icon={<Copy size={16} color="$color" />}
                  onPress={() => handleCopyText(subjectQuery, "Asuntos")}
                />
              </XStack>
            </YStack>
          ) : null}

          {hideSubjectSuggestions && (
            <Text fontSize="$2" color="$gray9">
              En el campo “Asunto” no pongas nada.
            </Text>
          )}

          {preferSpecificSenders && onlyVerification && (
            <Text fontSize="$2" color="$gray9">
              Aún no tenemos remitentes específicos del banco. Abre un correo
              real y copia el remitente exacto; puedes combinar varios usando
              {" "}
              <Text fontSize="$2" fontWeight="700" color="$gray9">
                OR
              </Text>
              .
            </Text>
          )}
        </YStack>
      ) : institution ? (
        <Text fontSize="$2" color="$gray9">
          {`Aún no tenemos remitentes sugeridos para ${institution}. Puedes usar el remitente o asunto típico del banco.`}
        </Text>
      ) : (
        <Text fontSize="$2" color="$gray9">
          Define la institución de la cuenta para ver remitentes sugeridos.
        </Text>
      )}
    </YStack>
  );
};
