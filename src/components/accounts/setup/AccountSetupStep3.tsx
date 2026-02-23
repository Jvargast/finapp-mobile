import React from "react";
import { YStack, XStack, Text, Button, Input, Circle, Spinner } from "tamagui";
import {
  Copy,
  CheckCircle,
  Mail,
  CheckCircle2,
  Circle as CircleIcon,
} from "@tamagui/lucide-icons";
import { AccountSetupMethod } from "../../../types/account.types";
import { AccountSetupInstructions } from "../AccountSetupInstructions";
import { WouButton } from "../../ui/WouButton";
import { ContinueButton } from "../../ui/ContinueButton";
import { WouLoader } from "../../ui/WouLoader";

type PreviewItem = {
  id: string;
  description: string;
  detail?: string;
  ruleName?: string;
  amount?: number | string;
  currency?: string;
  date?: string;
  matched?: boolean;
};

interface AccountSetupStep3Props {
  selectedMethod: AccountSetupMethod | null;
  emailProvider: "GMAIL" | "GOOGLE" | null;
  emailConnected: boolean;
  isProviderConnected?: boolean;
  isIntegrationsLoading?: boolean;
  isSaving: boolean;
  onSelectEmailProvider: (provider: "GMAIL" | "GOOGLE") => void;
  onImportEmailHistory: () => void;
  onPreviewEmailHistory: () => void;
  isPreviewLoading: boolean;
  previewItems: PreviewItem[];
  accountCurrency?: string;
  accountInstitution?: string | null;
  firstSyncedAt?: string | Date | null;
  lastSyncedAt?: string | Date | null;
  setupStatus?: string | null;
  isAccountSyncPolling?: boolean;
  emailSourceId?: string;
  rules: any[];
  attachedRuleIds: string[];
  isRulesLoading: boolean;
  isRuleUpdating?: string | null;
  onToggleRule: (ruleId: string, isAttached: boolean) => void;
  hasPreviewed: boolean;
  isRulesFallback?: boolean;
  rulesNoMatch?: boolean;
  hasInstitution?: boolean;
  syncStatus?: any;
  syncStartedAt?: number | null;
  isSyncPolling?: boolean;
  onOpenIntegrations: () => void;
  forwardAlias: string;
  isAliasLoading: boolean;
  forwardReady: boolean;
  forwardConfigured: boolean;
  forwardSenderEmail: string;
  isForwardVerifying?: boolean;
  isForwardPolling?: boolean;
  forwardConfirmationCode: string;
  forwardConfirmationLink: string;
  isForwardConfirmPolling?: boolean;
  onCopyAlias: () => void;
  onCopyForwardSender: () => void;
  onCopyForwardConfirmationCode: () => void;
  onCopyForwardConfirmationLink: () => void;
  onMarkForwardReady: () => void;
  onVerifyForward: () => void;
  statementFile: string;
  onChangeStatementFile: (value: string) => void;
  statementFormat: string;
  onChangeStatementFormat: (value: string) => void;
  onImportStatement: () => void;
  methodConfigured: boolean;
  onContinue: () => void;
  onBackToMethods: () => void;
}

export const AccountSetupStep3 = ({
    selectedMethod,
    emailProvider,
    emailConnected,
    isProviderConnected = false,
    isIntegrationsLoading = false,
    isSaving,
    onSelectEmailProvider,
    onImportEmailHistory,
    onPreviewEmailHistory,
    isPreviewLoading,
  previewItems,
  accountCurrency,
  accountInstitution = null,
  firstSyncedAt = null,
  lastSyncedAt = null,
  setupStatus = null,
  isAccountSyncPolling = false,
  emailSourceId,
    rules,
    attachedRuleIds,
    isRulesLoading,
    isRuleUpdating = null,
    onToggleRule,
    hasPreviewed,
    isRulesFallback = false,
    rulesNoMatch = false,
    hasInstitution = true,
    syncStatus,
    syncStartedAt,
    isSyncPolling = false,
    onOpenIntegrations,
    forwardAlias,
    isAliasLoading,
    forwardReady,
    forwardConfigured,
    forwardSenderEmail,
    isForwardVerifying = false,
    isForwardPolling = false,
    forwardConfirmationCode,
    forwardConfirmationLink,
    isForwardConfirmPolling = false,
    onCopyAlias,
    onCopyForwardSender,
    onCopyForwardConfirmationCode,
    onCopyForwardConfirmationLink,
    onMarkForwardReady,
    onVerifyForward,
    statementFile,
    onChangeStatementFile,
    statementFormat,
    onChangeStatementFormat,
    onImportStatement,
    methodConfigured,
    onContinue,
    onBackToMethods,
  }: AccountSetupStep3Props) => {
    const formatAmount = (value?: number | string, currency?: string) => {
      if (value === undefined || value === null || value === "") return "-";
      if (typeof value === "number") {
        try {
          return new Intl.NumberFormat("es-CL", {
            style: "currency",
            currency: currency || accountCurrency || "CLP",
          }).format(value);
        } catch (error) {
          return value.toString();
        }
      }
      return value;
    };
  const hasPreviewMatches = previewItems.some((item) => item.matched);
  const forwardPalette = {
    shellBg: "#F7F4EF",
    shellBorder: "#E9E1D6",
    ink: "#1F2937",
    muted: "#6B7280",
    statusIdle: "#64748B",
    statusActive: "#2563EB",
    statusDone: "#16A34A",
    chipBg: "#FFFFFF",
    chipBorder: "#E5E7EB",
    stepAlias: {
      bg: "#EFF6FF",
      border: "#D7E5FF",
      accent: "#1D4ED8",
      soft: "#E3ECFF",
    },
    stepConfirm: {
      bg: "#F5F3FF",
      border: "#E4DBFF",
      accent: "#6D28D9",
      soft: "#EEE6FF",
    },
    stepFilter: {
      bg: "#FFF4E6",
      border: "#FADCC0",
      accent: "#C2410C",
      soft: "#FFE7CF",
    },
    stepVerify: {
      bg: "#ECFDF3",
      border: "#D1F5DF",
      accent: "#15803D",
      soft: "#DCFCE7",
    },
  };
  const forwardStatusLabel = forwardConfigured
    ? "Listo"
    : isForwardPolling || isForwardVerifying
      ? "Verificando..."
      : "Pendiente";
  const forwardStatusColor = forwardConfigured
    ? forwardPalette.statusDone
    : isForwardPolling || isForwardVerifying
      ? forwardPalette.statusActive
      : forwardPalette.statusIdle;
  const hasForwardConfirmation = Boolean(
    forwardConfirmationCode || forwardConfirmationLink,
  );
  const canConfigureFilter = forwardConfigured || hasForwardConfirmation;
  const verifyButtonLabel = forwardConfigured
    ? "Configurado"
    : isForwardVerifying
      ? "Enviando..."
      : forwardSenderEmail
        ? "Reenviar correo de prueba"
        : "Enviar correo de prueba";
  const shortSourceId = emailSourceId
    ? `${emailSourceId.slice(0, 6)}...${emailSourceId.slice(-4)}`
    : null;
  const syncStateLabel = firstSyncedAt
    ? "Sincronización completada"
    : isAccountSyncPolling
      ? "Sincronización en proceso"
      : "Sincronización pendiente";

  const formatDate = (value?: string | Date | null) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().slice(0, 10);
  };

    const parseSyncInfo = (data: any) => {
      const status =
        data?.status ||
        data?.state ||
        data?.syncStatus ||
        data?.sync_state ||
        "processing";
      const processed =
        data?.processed ||
        data?.processedItems ||
        data?.completed ||
        data?.done ||
        data?.current ||
        data?.count;
      const total =
        data?.total ||
        data?.totalItems ||
        data?.expected ||
        data?.items ||
        data?.totalCount;
      return { status, processed, total };
    };

    const formatDuration = (ms?: number | null) => {
      if (!ms || ms <= 0) return null;
      const totalSeconds = Math.round(ms / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      if (minutes <= 0) return `${seconds}s`;
      return `${minutes}m ${seconds}s`;
    };

    const syncInfo = syncStatus ? parseSyncInfo(syncStatus) : null;
    const elapsedMs = syncStartedAt ? Date.now() - syncStartedAt : null;
    const elapsedText = formatDuration(elapsedMs);
    const canEstimate =
      syncInfo?.total &&
      syncInfo?.processed &&
      Number(syncInfo.total) > 0 &&
      Number(syncInfo.processed) > 0;
    const remainingText = (() => {
      if (!canEstimate || !elapsedMs) return null;
      const total = Number(syncInfo?.total);
      const processed = Number(syncInfo?.processed);
      if (!Number.isFinite(total) || !Number.isFinite(processed)) return null;
      if (processed <= 0 || processed >= total) return null;
      const rate = processed / (elapsedMs / 1000);
      if (!rate || !Number.isFinite(rate)) return null;
      const remainingSeconds = Math.round((total - processed) / rate);
      return formatDuration(remainingSeconds * 1000);
    })();

    const getRuleId = (rule: any) =>
      rule?.id || rule?.ruleId || rule?.uuid || rule?.rule_id;
    const getRuleName = (rule: any) =>
      rule?.name || rule?.title || rule?.ruleName || "Regla bancaria";
    const getRuleInstitution = (rule: any) =>
      rule?.institution || rule?.bank || rule?.entity;
    const getRuleMeta = (rule: any) => {
      const domains = rule?.senderDomains || rule?.domains;
      const subjects = rule?.subjectIncludes || rule?.subjects;
      if (Array.isArray(domains) && domains.length > 0) {
        return domains.join(", ");
      }
      if (Array.isArray(subjects) && subjects.length > 0) {
        return subjects.join(", ");
      }
      return "";
    };

    const renderRulesSection = (title: string, note?: string) => (
      <YStack
        space="$3"
        backgroundColor="$background"
        borderRadius="$8"
        borderWidth={1}
        borderColor="$borderColor"
        padding="$4"
      >
        <Text fontSize="$4" fontWeight="800" color="$color">
          {title}
        </Text>
        <Text fontSize="$3" color="$gray10">
          Para ver movimientos reales debes seleccionar reglas del banco.
        </Text>
        {note ? (
          <Text fontSize="$2" color="$gray9">
            {note}
          </Text>
        ) : null}
        {!hasInstitution && (
          <Text fontSize="$2" color="$gray9">
            Tu cuenta no tiene institución definida. Edita la cuenta para
            asignar el banco y habilitar reglas.
          </Text>
        )}
        {accountInstitution ? (
          <Text fontSize="$2" color="$gray9">
            {`Mostrando reglas de ${accountInstitution}.`}
          </Text>
        ) : null}
        {isRulesFallback && (
          <Text fontSize="$2" color="$gray9">
            No encontramos institución. Mostrando todas las reglas.
          </Text>
        )}
        {rulesNoMatch && accountInstitution && (
          <Text fontSize="$2" color="$gray9">
            {`No hay reglas disponibles para ${accountInstitution}.`}
          </Text>
        )}

        {isRulesLoading ? (
          <XStack justifyContent="center" paddingTop="$2">
            <Spinner size="small" color="$brand" />
          </XStack>
        ) : rules.length === 0 ? (
          <Text fontSize="$3" color="$gray9">
            {accountInstitution
              ? `No encontramos reglas para ${accountInstitution}.`
              : "No encontramos reglas disponibles."}
          </Text>
        ) : (
          <YStack space="$3">
            {rules.map((rule) => {
              const ruleId = getRuleId(rule);
              if (!ruleId) return null;
              const isAttached = attachedRuleIds.includes(ruleId);
              const ruleName = getRuleName(rule);
              const ruleInstitution = getRuleInstitution(rule);
              const ruleMeta = getRuleMeta(rule);
              return (
                <XStack
                  key={ruleId}
                  alignItems="center"
                  justifyContent="space-between"
                  backgroundColor="$color2"
                  padding="$3"
                  borderRadius="$6"
                >
                  <YStack flex={1} paddingRight="$2" space="$1">
                    <Text fontWeight="800">{ruleName}</Text>
                    {ruleInstitution ? (
                      <Text fontSize="$2" color="$gray10">
                        {ruleInstitution}
                      </Text>
                    ) : null}
                    {ruleMeta ? (
                      <Text fontSize="$2" color="$gray9">
                        {ruleMeta}
                      </Text>
                    ) : null}
                  </YStack>
                  <Button
                    size="$3"
                    backgroundColor={isAttached ? "$green10" : "$blue10"}
                    color="white"
                    onPress={() => onToggleRule(ruleId, isAttached)}
                    disabled={isRuleUpdating === ruleId || !hasInstitution}
                    opacity={
                      isRuleUpdating === ruleId || !hasInstitution ? 0.7 : 1
                    }
                    icon={
                      isAttached ? (
                        <CheckCircle2 size={16} color="white" />
                      ) : (
                        <CircleIcon size={16} color="white" />
                      )
                    }
                  >
                    {isAttached ? "Seleccionada" : "Seleccionar"}
                  </Button>
                </XStack>
              );
            })}
          </YStack>
        )}

        {attachedRuleIds.length === 0 && (
          <Text fontSize="$2" color="$gray9">
            Para ver movimientos, selecciona reglas del banco.
          </Text>
        )}
      </YStack>
    );


    return (
      <YStack space="$4">
        {!selectedMethod && (
          <YStack space="$3">
            <Text fontSize="$4" fontWeight="800" color="$color">
              Primero elige un metodo
            </Text>
            <Button
              size="$5"
              backgroundColor="$color2"
              color="$color"
              fontWeight="700"
              onPress={onBackToMethods}
            >
              Volver a metodos
            </Button>
          </YStack>
        )}

        {selectedMethod === AccountSetupMethod.EMAIL_HISTORY && (
          <YStack space="$4">
            <YStack
              space="$2"
              backgroundColor="$background"
              borderRadius="$8"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$4"
            >
              <Text fontSize="$4" fontWeight="800" color="$color">
                Paso 1 · Conecta tu correo
              </Text>
              <Text fontSize="$3" color="$gray10">
                Importaremos movimientos de los ultimos 90 dias.
              </Text>
            </YStack>
            <YStack
              space="$4"
              backgroundColor="$background"
              borderRadius="$8"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$4"
            >
              <XStack space="$2" alignItems="center">
                <Circle size={36} backgroundColor="$blue2">
                  <Mail size={16} color="$blue10" />
                </Circle>
                <YStack>
                  <Text fontSize="$4" fontWeight="800" color="$color">
                    Conecta tu correo
                  </Text>
                  <Text fontSize="$3" color="$gray10">
                    Importaremos movimientos de los ultimos 90 dias.
                  </Text>
                </YStack>
              </XStack>

              <YStack space="$3">
                <Button
                  size="$4"
                  backgroundColor={
                    emailProvider === "GMAIL" ? "$red10" : "$color2"
                  }
                  color={emailProvider === "GMAIL" ? "white" : "$color"}
                  onPress={() => onSelectEmailProvider("GMAIL")}
                  borderRadius="$10"
                  justifyContent="space-between"
                >
                  <XStack alignItems="center" space="$3">
                    <Circle size={28} backgroundColor="#EA4335">
                      <Text color="white" fontWeight="900">
                        G
                      </Text>
                    </Circle>
                    <Text fontWeight="700">Gmail</Text>
                  </XStack>
                  <Text color={emailProvider === "GMAIL" ? "white" : "$gray9"}>
                    Conectar
                  </Text>
                </Button>

                <Button
                  size="$5"
                  backgroundColor={
                    emailProvider === "GOOGLE" ? "$blue10" : "$color2"
                  }
                  color={emailProvider === "GOOGLE" ? "white" : "$color"}
                  onPress={() => onSelectEmailProvider("GOOGLE")}
                  borderRadius="$10"
                  justifyContent="space-between"
                >
                  <XStack alignItems="center" space="$3">
                    <Circle size={28} backgroundColor="#1A73E8">
                      <Text color="white" fontWeight="900">
                        G
                      </Text>
                    </Circle>
                    <Text fontWeight="700">Google Workspace</Text>
                  </XStack>
                  <Text color={emailProvider === "GOOGLE" ? "white" : "$gray9"}>
                    Conectar
                  </Text>
                </Button>
              </YStack>

              {emailConnected && (
                <XStack alignItems="center" space="$2">
                  <CheckCircle size={16} color="$green10" />
                  <Text fontSize="$3" color="$green10" fontWeight="700">
                    {isProviderConnected
                      ? "Cuenta conectada"
                      : "Cuenta seleccionada"}
                  </Text>
                </XStack>
              )}
              {shortSourceId ? (
                <Text fontSize="$2" color="$gray9">
                  {`Fuente activa: ${shortSourceId}`}
                </Text>
              ) : null}
            </YStack>

            {!isProviderConnected && emailProvider && (
              <YStack space="$2">
                <Text fontSize="$3" color="$gray10">
                  Necesitas conectar{" "}
                  {emailProvider === "GMAIL" ? "Gmail" : "Google Workspace"} en
                  Integraciones antes de importar.
                </Text>
                <Button
                  size="$5"
                  backgroundColor="$color2"
                  color="$color"
                  fontWeight="700"
                  onPress={onOpenIntegrations}
                  disabled={isIntegrationsLoading}
                  opacity={isIntegrationsLoading ? 0.7 : 1}
                >
                  {isIntegrationsLoading ? "Cargando..." : "Ir a Integraciones"}
                </Button>
              </YStack>
            )}

            <YStack
              space="$2"
              backgroundColor="$color2"
              borderRadius="$8"
              padding="$3"
            >
              <XStack alignItems="center" space="$2">
                {isProviderConnected ? (
                  <CheckCircle2 size={16} color="$green10" />
                ) : (
                  <CircleIcon size={16} color="$gray8" />
                )}
                <Text fontSize="$3" color="$color">
                  Fuente conectada
                </Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                {attachedRuleIds.length > 0 ? (
                  <CheckCircle2 size={16} color="$green10" />
                ) : (
                  <CircleIcon size={16} color="$gray8" />
                )}
                <Text fontSize="$3" color="$color">
                  {`Reglas seleccionadas (${attachedRuleIds.length})`}
                </Text>
              </XStack>
              <XStack alignItems="center" space="$2">
                {hasPreviewed ? (
                  <CheckCircle2 size={16} color="$green10" />
                ) : (
                  <CircleIcon size={16} color="$gray8" />
                )}
                <Text fontSize="$3" color="$color">
                  Vista previa realizada
                </Text>
              </XStack>
            </YStack>

            {renderRulesSection("Paso 2 · Reglas bancarias")}

            <YStack
              space="$3"
              backgroundColor="$background"
              borderRadius="$8"
              borderWidth={1}
              borderColor="$borderColor"
              padding="$4"
            >
              <Text fontSize="$4" fontWeight="800" color="$color">
                Paso 3 · Vista previa
              </Text>
              <Text fontSize="$3" color="$gray10">
                Revisa algunos movimientos antes de importar.
              </Text>
              <Button
                size="$5"
                backgroundColor="$color2"
                color="$color"
                fontWeight="700"
                onPress={onPreviewEmailHistory}
                disabled={
                  isPreviewLoading ||
                  !isProviderConnected ||
                  attachedRuleIds.length === 0 ||
                  !hasInstitution
                }
                opacity={
                  isPreviewLoading ||
                  !isProviderConnected ||
                  attachedRuleIds.length === 0 ||
                  !hasInstitution
                    ? 0.7
                    : 1
                }
              >
                {isPreviewLoading ? "Cargando..." : "Ver preview"}
              </Button>

              {isPreviewLoading && (
                <XStack justifyContent="center" paddingTop="$2">
                  <Spinner size="small" color="$brand" />
                </XStack>
              )}

              {previewItems.length > 0 && (
                <YStack space="$2">
                  {previewItems.slice(0, 5).map((item) => (
                    <XStack
                      key={item.id}
                      justifyContent="space-between"
                      alignItems="center"
                      backgroundColor="$color2"
                      padding="$3"
                      borderRadius="$6"
                      marginBottom="$2"
                    >
                      <YStack flex={1} paddingRight="$2">
                        <Text fontWeight="700" numberOfLines={1}>
                          {item.description}
                        </Text>
                        {item.detail && item.detail !== item.description && (
                          <Text fontSize="$2" color="$gray9" numberOfLines={1}>
                            {item.detail}
                          </Text>
                        )}
                        {item.date && (
                          <Text fontSize="$2" color="$gray9">
                            {item.date}
                          </Text>
                        )}
                      </YStack>
                      <Text fontWeight="800">
                        {formatAmount(item.amount, item.currency)}
                      </Text>
                    </XStack>
                  ))}
                  {previewItems.length > 5 && (
                    <Text fontSize="$2" color="$gray9">
                      {`Mostrando 5 de ${previewItems.length} movimientos.`}
                    </Text>
                  )}
                  {!hasPreviewMatches && (
                    <Text fontSize="$2" color="$gray9">
                      No se detectaron reglas activas para esta fuente. Se
                      muestran correos sin procesar.
                    </Text>
                  )}
                </YStack>
              )}
            </YStack>

        <Button
          size="$6"
          backgroundColor="$brand"
          color="white"
          fontWeight="800"
          onPress={onImportEmailHistory}
              disabled={
                isSaving ||
                !isProviderConnected ||
                attachedRuleIds.length === 0 ||
                !hasPreviewed ||
                !hasInstitution
              }
          opacity={
            isSaving ||
            !isProviderConnected ||
            attachedRuleIds.length === 0 ||
            !hasPreviewed ||
            !hasInstitution
              ? 0.7
              : 1
          }
        >
          {isSaving ? <WouLoader size={8} color="white" /> : "Importar ahora"}
        </Button>
        <YStack
          space="$1"
          backgroundColor="$color2"
          borderRadius="$8"
          padding="$3"
        >
          <Text fontSize="$3" fontWeight="700" color="$color">
            {syncStateLabel}
          </Text>
          {setupStatus && (
            <Text fontSize="$2" color="$gray9">
              {`Setup: ${setupStatus}`}
            </Text>
          )}
          {formatDate(firstSyncedAt) && (
            <Text fontSize="$2" color="$gray9">
              {`Primer sync: ${formatDate(firstSyncedAt)}`}
            </Text>
          )}
          {formatDate(lastSyncedAt) && (
            <Text fontSize="$2" color="$gray9">
              {`Último sync: ${formatDate(lastSyncedAt)}`}
            </Text>
          )}
        </YStack>
        {(isSyncPolling || syncStartedAt || syncStatus) && (
          <YStack
            space="$2"
            backgroundColor="$color2"
                borderRadius="$8"
                padding="$3"
              >
                <Text fontSize="$3" fontWeight="700" color="$color">
                  Estado de importación
                </Text>
                {syncInfo?.status && (
                  <Text fontSize="$2" color="$gray9">
                    {`Estado: ${String(syncInfo.status)}`}
                  </Text>
                )}
                {syncInfo?.processed && syncInfo?.total ? (
                  <Text fontSize="$2" color="$gray9">
                    {`Progreso: ${syncInfo.processed}/${syncInfo.total}`}
                  </Text>
                ) : null}
                {elapsedText && (
                  <Text fontSize="$2" color="$gray9">
                    {`Tiempo transcurrido: ${elapsedText}`}
                  </Text>
                )}
                {remainingText && (
                  <Text fontSize="$2" color="$gray9">
                    {`Estimado restante: ${remainingText}`}
                  </Text>
                )}
              </YStack>
            )}
            <Text fontSize="$2" color="$gray9">
              Paso 4 · La importacion se procesa en segundo plano.
            </Text>
          </YStack>
        )}

        {selectedMethod === AccountSetupMethod.EMAIL_FORWARD && (
          <YStack space="$5">
            <YStack
              space="$3"
              backgroundColor={forwardPalette.shellBg}
              borderRadius="$12"
              padding="$4"
              borderWidth={1}
              borderColor={forwardPalette.shellBorder}
            >
              <XStack alignItems="center" space="$3">
                <Circle size={44} backgroundColor={forwardPalette.stepAlias.soft}>
                  <Mail size={20} color={forwardPalette.stepAlias.accent} />
                </Circle>
                <YStack flex={1}>
                  <Text fontSize="$5" fontWeight="900" color={forwardPalette.ink}>
                    Reenvío de correos
                  </Text>
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Configura Gmail en 4 pasos claros.
                  </Text>
                </YStack>
                <XStack
                  alignItems="center"
                  space="$2"
                  backgroundColor={forwardPalette.chipBg}
                  borderRadius="$10"
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderWidth={1}
                  borderColor={forwardPalette.shellBorder}
                >
                  <Circle size={8} backgroundColor={forwardStatusColor} />
                  <Text fontSize="$2" color={forwardPalette.ink} fontWeight="700">
                    {forwardStatusLabel}
                  </Text>
                </XStack>
              </XStack>
              <Text fontSize="$2" color={forwardPalette.muted}>
                Sigue el orden. El estado se actualiza cuando detectamos el
                reenvío.
              </Text>
            </YStack>

            <YStack
              space="$3"
              backgroundColor={forwardPalette.stepAlias.bg}
              borderRadius="$12"
              padding="$4"
              borderWidth={1}
              borderColor={forwardPalette.stepAlias.border}
            >
              <XStack alignItems="center" space="$3">
                <Circle size={30} backgroundColor={forwardPalette.stepAlias.accent}>
                  <Text color="white" fontWeight="800">
                    1
                  </Text>
                </Circle>
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="800"
                    color={forwardPalette.stepAlias.accent}
                  >
                    Copia el alias
                  </Text>
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Usa este alias en Gmail para reenviar correos del banco.
                  </Text>
                </YStack>
              </XStack>
              <XStack
                alignItems="center"
                justifyContent="space-between"
                backgroundColor={forwardPalette.chipBg}
                padding="$3"
                borderRadius="$10"
                borderWidth={1}
                borderColor={forwardPalette.chipBorder}
              >
                <Text
                  fontWeight="700"
                  color={forwardPalette.ink}
                  fontFamily="$mono"
                  flex={1}
                  numberOfLines={2}
                >
                  {isAliasLoading ? "Cargando..." : forwardAlias}
                </Text>
                <Button
                  size="$2"
                  chromeless
                  icon={<Copy size={16} color={forwardPalette.stepAlias.accent} />}
                  onPress={onCopyAlias}
                />
              </XStack>
            </YStack>

            <YStack
              space="$3"
              backgroundColor={forwardPalette.stepConfirm.bg}
              borderRadius="$12"
              padding="$4"
              borderWidth={1}
              borderColor={forwardPalette.stepConfirm.border}
            >
              <XStack alignItems="center" space="$3">
                <Circle size={30} backgroundColor={forwardPalette.stepConfirm.accent}>
                  <Text color="white" fontWeight="800">
                    2
                  </Text>
                </Circle>
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="800"
                    color={forwardPalette.stepConfirm.accent}
                  >
                    Confirma el reenvío en Gmail
                  </Text>
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Gmail enviará un correo de confirmación al alias.
                  </Text>
                </YStack>
              </XStack>
              {hasForwardConfirmation ? (
                <YStack space="$2">
                  {forwardConfirmationCode ? (
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      backgroundColor={forwardPalette.chipBg}
                      padding="$3"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={forwardPalette.chipBorder}
                    >
                      <Text
                        fontWeight="800"
                        color={forwardPalette.ink}
                        fontFamily="$mono"
                      >
                        {forwardConfirmationCode}
                      </Text>
                      <Button
                        size="$2"
                        chromeless
                        icon={
                          <Copy size={16} color={forwardPalette.stepConfirm.accent} />
                        }
                        onPress={onCopyForwardConfirmationCode}
                      />
                    </XStack>
                  ) : null}
                  {forwardConfirmationLink ? (
                    <XStack
                      alignItems="center"
                      justifyContent="space-between"
                      backgroundColor={forwardPalette.chipBg}
                      padding="$3"
                      borderRadius="$10"
                      borderWidth={1}
                      borderColor={forwardPalette.chipBorder}
                    >
                      <Text
                        fontSize="$2"
                        color={forwardPalette.ink}
                        flex={1}
                        fontFamily="$mono"
                        numberOfLines={2}
                      >
                        {forwardConfirmationLink}
                      </Text>
                      <Button
                        size="$2"
                        chromeless
                        icon={
                          <Copy size={16} color={forwardPalette.stepConfirm.accent} />
                        }
                        onPress={onCopyForwardConfirmationLink}
                      />
                    </XStack>
                  ) : null}
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Ingresa el código o abre el link en Gmail para confirmar.
                  </Text>
                </YStack>
              ) : (
                <YStack space="$2">
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Estamos esperando el correo de confirmación de Gmail.
                  </Text>
                  {isForwardConfirmPolling && (
                    <XStack alignItems="center" space="$2">
                      <Spinner size="small" color={forwardPalette.stepConfirm.accent} />
                      <Text fontSize="$2" color={forwardPalette.muted}>
                        Revisando...
                      </Text>
                    </XStack>
                  )}
                </YStack>
              )}
            </YStack>

            <YStack
              space="$3"
              backgroundColor={forwardPalette.stepFilter.bg}
              borderRadius="$12"
              padding="$4"
              borderWidth={1}
              borderColor={forwardPalette.stepFilter.border}
            >
              <XStack alignItems="center" space="$3">
                <Circle size={30} backgroundColor={forwardPalette.stepFilter.accent}>
                  <Text color="white" fontWeight="800">
                    3
                  </Text>
                </Circle>
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="800"
                    color={forwardPalette.stepFilter.accent}
                  >
                    Crea el filtro en Gmail
                  </Text>
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Pega los remitentes en “De”. El asunto puede quedar vacío.
                  </Text>
                </YStack>
              </XStack>
              {forwardAlias ? (
                <YStack
                  backgroundColor={forwardPalette.chipBg}
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor={forwardPalette.chipBorder}
                  padding="$3"
                >
                  <AccountSetupInstructions
                    alias={forwardAlias}
                    institution={accountInstitution}
                    rules={rules}
                    isRulesLoading={isRulesLoading}
                    verificationSender={forwardSenderEmail}
                    hideSubjectSuggestions={true}
                    preferSpecificSenders={true}
                  />
                </YStack>
              ) : null}
            </YStack>

            <YStack
              space="$3"
              backgroundColor={forwardPalette.stepVerify.bg}
              borderRadius="$12"
              padding="$4"
              borderWidth={1}
              borderColor={forwardPalette.stepVerify.border}
            >
              <XStack alignItems="center" space="$3">
                <Circle size={30} backgroundColor={forwardPalette.stepVerify.accent}>
                  <Text color="white" fontWeight="800">
                    4
                  </Text>
                </Circle>
                <YStack flex={1}>
                  <Text
                    fontSize="$4"
                    fontWeight="800"
                    color={forwardPalette.stepVerify.accent}
                  >
                    Verifica que el filtro funciona
                  </Text>
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Enviaremos un correo de prueba y confirmaremos el reenvío.
                  </Text>
                </YStack>
              </XStack>
              {forwardSenderEmail ? (
                <YStack space="$2">
                  <Text fontSize="$2" color={forwardPalette.muted}>
                    Agrega este remitente al filtro si no estaba:
                  </Text>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    backgroundColor={forwardPalette.chipBg}
                    padding="$3"
                    borderRadius="$10"
                    borderWidth={1}
                    borderColor={forwardPalette.chipBorder}
                  >
                    <Text
                      fontWeight="700"
                      color={forwardPalette.ink}
                      fontFamily="$mono"
                      flex={1}
                      numberOfLines={2}
                    >
                      {forwardSenderEmail}
                    </Text>
                    <Button
                      size="$2"
                      chromeless
                      icon={
                        <Copy size={16} color={forwardPalette.stepVerify.accent} />
                      }
                      onPress={onCopyForwardSender}
                    />
                  </XStack>
                </YStack>
              ) : null}

              <YStack space="$3">
                <WouButton
                  label="Ya configuré el filtro"
                  variant="soft"
                  tone="success"
                  onPress={onMarkForwardReady}
                  disabled={forwardConfigured || !canConfigureFilter}
                />

                <WouButton
                  label={verifyButtonLabel}
                  variant="solid"
                  tone="success"
                  onPress={onVerifyForward}
                  isLoading={isForwardVerifying}
                  loadingLabel="Enviando..."
                  disabled={
                    !forwardReady ||
                    isSaving ||
                    isForwardVerifying ||
                    forwardConfigured
                  }
                />
              </YStack>
            </YStack>

            {renderRulesSection(
              "Reglas bancarias (obligatorio)",
              "Estas reglas se aplican a la fuente inbound para clasificar correos.",
            )}
          </YStack>
        )}

        {selectedMethod === AccountSetupMethod.STATEMENT && (
          <YStack space="$4">
            <Text fontSize="$4" fontWeight="800" color="$color">
              Subir cartola
            </Text>
            <Input
              placeholder="Nombre del archivo"
              value={statementFile}
              onChangeText={onChangeStatementFile}
              backgroundColor="$color2"
              borderWidth={0}
              borderRadius="$4"
            />
            <XStack space="$2">
              {["PDF", "CSV", "XLSX"].map((format) => {
                const isSelected = statementFormat === format;
                return (
                  <Button
                    key={format}
                    size="$3"
                    backgroundColor={isSelected ? "$brand" : "$color2"}
                    color={isSelected ? "white" : "$color"}
                    onPress={() => onChangeStatementFormat(format)}
                  >
                    {format}
                  </Button>
                );
              })}
            </XStack>
            <Button
              size="$6"
              backgroundColor="$brand"
              color="white"
              fontWeight="800"
              onPress={onImportStatement}
              disabled={isSaving}
              opacity={isSaving ? 0.7 : 1}
            >
              {isSaving ? "Importando..." : "Importar"}
            </Button>
          </YStack>
        )}

        <ContinueButton
          label="Continuar"
          onPress={onContinue}
          disabled={!methodConfigured}
        />
      </YStack>
    );
};
