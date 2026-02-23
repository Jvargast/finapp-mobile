import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { YStack, Text, Button, ScrollView, Spinner } from "tamagui";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { MainLayout } from "../../components/layout/MainLayout";
import { AccountSetupStepper } from "../../components/accounts/AccountSetupStepper";
import { Paywall } from "../../components/ui/Paywall";
import { AccountService } from "../../services/accountService";
import {
  Account,
  AccountSetupMethod,
  AccountSetupStatus,
} from "../../types/account.types";
import { useSubscription } from "../../hooks/useSubscription";
import { useToastStore } from "../../stores/useToastStore";
import { useAccountStore } from "../../stores/useAccountStore";
import { useUserStore } from "../../stores/useUserStore";
import { BankingActions } from "../../actions/bankingActions";
import { AccountSetupHeader } from "../../components/accounts/setup/AccountSetupHeader";
import { AccountSetupStep2 } from "../../components/accounts/setup/AccountSetupStep2";
import { AccountSetupStep3 } from "../../components/accounts/setup/AccountSetupStep3";
import { AccountSetupStep4 } from "../../components/accounts/setup/AccountSetupStep4";

type RouteParams = {
  accountId: string;
  startAt?: number;
};

export default function AccountSetupWizardScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const showToast = useToastStore((s) => s.showToast);
  const { isPro } = useSubscription();
  const updateAccountInStore = useAccountStore((s) => s.updateAccount);
  const userEmail = useUserStore((s) => s.user?.email || "");

  const { accountId, startAt } = (route.params || {}) as RouteParams;
  const [account, setAccount] = useState<Account | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMethod, setSelectedMethod] =
    useState<AccountSetupMethod | null>(null);
  const [emailProvider, setEmailProvider] = useState<"GMAIL" | "GOOGLE" | null>(
    null,
  );
  const [emailConnected, setEmailConnected] = useState(false);
  const [forwardAlias, setForwardAlias] = useState("");
  const [isAliasLoading, setIsAliasLoading] = useState(false);
  const [forwardReady, setForwardReady] = useState(false);
  const [forwardSourceId, setForwardSourceId] = useState<string | null>(null);
  const [forwardSenderEmail, setForwardSenderEmail] = useState("");
  const [forwardConfirmationCode, setForwardConfirmationCode] = useState("");
  const [forwardConfirmationLink, setForwardConfirmationLink] = useState("");
  const [forwardConfigured, setForwardConfigured] = useState(false);
  const [isForwardVerifying, setIsForwardVerifying] = useState(false);
  const [isForwardPolling, setIsForwardPolling] = useState(false);
  const [isForwardConfirmPolling, setIsForwardConfirmPolling] =
    useState(false);
  const prevForwardConfiguredRef = useRef(false);
  const forwardVerifyRequestedRef = useRef(false);
  const [methodConfigured, setMethodConfigured] = useState(false);
  const [statementFile, setStatementFile] = useState("");
  const [statementFormat, setStatementFormat] = useState("PDF");
  const [emailSources, setEmailSources] = useState<any[]>([]);
  const [isLoadingIntegrations, setIsLoadingIntegrations] = useState(false);
  const [previewItems, setPreviewItems] = useState<
    {
      id: string;
      description: string;
      detail?: string;
      ruleName?: string;
      amount?: number | string;
      currency?: string;
      date?: string;
      matched?: boolean;
    }[]
  >([]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [hasPreviewed, setHasPreviewed] = useState(false);
  const [syncStatus, setSyncStatus] = useState<any | null>(null);
  const [isSyncPolling, setIsSyncPolling] = useState(false);
  const [syncStartedAt, setSyncStartedAt] = useState<number | null>(null);
  const [isAccountSyncPolling, setIsAccountSyncPolling] = useState(false);
  const [rules, setRules] = useState<any[]>([]);
  const [attachedRuleIds, setAttachedRuleIds] = useState<string[]>([]);
  const [isRulesLoading, setIsRulesLoading] = useState(false);
  const [isRuleUpdating, setIsRuleUpdating] = useState<string | null>(null);

  const mergeAccount = useCallback(
    (next: Account) => {
      if (!account) return next;
      const merged: Account = { ...account, ...next };
      Object.keys(account).forEach((key) => {
        const typedKey = key as keyof Account;
        if ((next as any)[typedKey] === undefined) {
          (merged as any)[typedKey] = account[typedKey];
        }
      });
      if (merged.institution == null && account.institution) {
        merged.institution = account.institution;
      }
      return merged;
    },
    [account],
  );

  const steps = ["Metodo", "Configurar", "Finalizar"];
  const normalizeSetupMethod = (method?: string | null) => {
    const raw = (method || "").toUpperCase();
    if (raw === AccountSetupMethod.EMAIL_HISTORY)
      return AccountSetupMethod.EMAIL_HISTORY;
    if (raw === AccountSetupMethod.EMAIL_FORWARD)
      return AccountSetupMethod.EMAIL_FORWARD;
    if (raw === AccountSetupMethod.STATEMENT)
      return AccountSetupMethod.STATEMENT;
    if (raw === "OAUTH_EMAIL") return AccountSetupMethod.EMAIL_HISTORY;
    if (raw === "FORWARD_ALIAS") return AccountSetupMethod.EMAIL_FORWARD;
    if (raw === "STATEMENT_IMPORT") return AccountSetupMethod.STATEMENT;
    return null;
  };

  const normalizeProvider = (value?: string | null) =>
    (value || "").toString().toUpperCase();

  const normalizeEmail = (value?: string | null) =>
    (value || "").toString().trim().toLowerCase();

  const isGmailAddress = (email?: string | null) => {
    const value = normalizeEmail(email);
    return value.endsWith("@gmail.com") || value.endsWith("@googlemail.com");
  };

  const getSourceProvider = (source?: any) => {
    const raw =
      source?.provider ||
      source?.emailProvider ||
      source?.oauthProvider ||
      source?.config?.provider ||
      source?.config?.emailProvider ||
      source?.config?.oauthProvider;
    const normalized = normalizeProvider(raw);
    if (normalized) return normalized;
    const email = getSourceEmail(source);
    if (!email) return "";
    return isGmailAddress(email) ? "GMAIL" : "GOOGLE";
  };

  const getSourceEmail = (source?: any) =>
    normalizeEmail(
      source?.email || source?.config?.email || source?.accountEmail,
    );

  const getRuleId = (rule: any) =>
    rule?.rule?.id ||
    rule?.ruleId ||
    rule?.id ||
    rule?.uuid ||
    rule?.rule_id;

  const normalizeText = (value?: string | null) =>
    (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const toTokens = (value?: string | null) =>
    (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 ]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 3);

  const buildRuleKey = (rule: any) => {
    const tokensToKey = (value?: string | null) => toTokens(value).join("");
    const name = tokensToKey(rule?.name || rule?.title || "");
    const institution = tokensToKey(
      rule?.institution || rule?.bank || rule?.entity || rule?.bankName || "",
    );
    const senderDomains = Array.isArray(rule?.senderDomains)
      ? rule.senderDomains
          .map((value: any) => normalizeText(value))
          .sort()
          .join(",")
      : "";
    const subjectIncludes = Array.isArray(rule?.subjectIncludes)
      ? rule.subjectIncludes
          .map((value: any) => tokensToKey(value))
          .filter(Boolean)
          .sort()
          .join(",")
      : "";
    return [institution, name, senderDomains, subjectIncludes].join("|");
  };

  const getInstitutionName = (data?: Account | null) =>
    data?.institution || (data as any)?.bank || (data as any)?.bankName || null;

  const getRuleInstitutionName = (rule: any) =>
    rule?.institution ||
    rule?.bank ||
    rule?.entity ||
    rule?.bankName ||
    rule?.name ||
    rule?.title ||
    null;

  const getSourceStatus = (source?: any) =>
    (source?.status || source?.state || "").toString().toLowerCase();

  const isForwardConfiguredSource = useCallback(
    (source?: any) =>
      Boolean(
        source?.isForwardConfigured ||
          source?.forwardConfigured ||
          source?.forwardVerifiedAt ||
          source?.forwardVerified,
      ),
    [],
  );

  const extractInboundAlias = (data: any) =>
    data?.alias ||
    data?.address ||
    data?.email ||
    data?.inboundAddress ||
    data?.inboundEmail ||
    data?.data?.alias;

  const isConnectedStatus = (value?: string | null) => {
    const status = (value || "").toString().toLowerCase();
    return ["connected", "active", "ready", "linked", "success"].includes(
      status,
    );
  };

  const getStepFromAccount = (data: Account) => {
    if (data.setupStatus === AccountSetupStatus.ACTIVE) return 3;
    if (data.setupMethod) return 2;
    return 1;
  };

  useEffect(() => {
    if (!accountId) return;
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);
      try {
        const data = await AccountService.getById(accountId);
        if (!isMounted) return;
        setAccount(data);
        setSelectedMethod(normalizeSetupMethod(data.setupMethod));
        const step = startAt
          ? Math.min(3, Math.max(1, startAt))
          : getStepFromAccount(data);
        setCurrentStep(step);
      } catch (error) {
        showToast("No pudimos cargar la cuenta", "error");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [accountId, startAt, showToast]);

  const loadForwardAlias = useCallback(async () => {
    if (!accountId) return;
    setIsAliasLoading(true);
    try {
      let source: any | null = null;
      try {
        const data = await BankingActions.listSources();
        const list = Array.isArray(data) ? data : data?.data || [];
        source = list.find(
          (item) =>
            item?.type === "EMAIL_NOTIFICATION" &&
            item?.accountId === accountId &&
            getSourceStatus(item) !== "deleted",
        );
      } catch (error) {
        console.error("Error cargando fuentes inbound", error);
      }

      if (!source) {
        if (!userEmail) {
          showToast("Necesitamos tu email para configurar el reenvío", "info");
          return;
        }
        source = await BankingActions.createEmailNotification({
          accountId,
          email: userEmail,
        });
      }

      let sourceDetails = source;
      if (source?.id) {
        setForwardSourceId(source.id);
        try {
          sourceDetails = await BankingActions.getSource(source.id);
        } catch (error) {
          console.error("Error obteniendo detalle de fuente inbound", error);
        }
      }

      const configured = isForwardConfiguredSource(sourceDetails || source);
      setForwardConfigured(configured);
      if (configured) {
        setMethodConfigured(true);
        setForwardReady(true);
      }

      const confirmationCode =
        sourceDetails?.forwardConfirmationCode ||
        sourceDetails?.confirmationCode;
      const confirmationLink =
        sourceDetails?.forwardConfirmationLink ||
        sourceDetails?.confirmationLink;
      if (confirmationCode) {
        setForwardConfirmationCode(String(confirmationCode));
      }
      if (confirmationLink) {
        setForwardConfirmationLink(String(confirmationLink));
      }

      let alias =
        extractInboundAlias(sourceDetails) || extractInboundAlias(source);
      if (!alias && source?.id) {
        const aliasResponse = await BankingActions.createInboundAddress(
          source.id,
        );
        alias = extractInboundAlias(aliasResponse);
      }
      if (!alias) {
        showToast("No pudimos obtener el alias", "error");
        return;
      }

      setForwardAlias(alias);
      if (!configured && !confirmationCode && !confirmationLink) {
        setIsForwardConfirmPolling(true);
      }
    } catch (error) {
      console.error("Error obteniendo alias inbound", error);
      showToast("No pudimos obtener el alias", "error");
    } finally {
      setIsAliasLoading(false);
    }
  }, [
    accountId,
    userEmail,
    showToast,
    isForwardConfiguredSource,
  ]);

  useEffect(() => {
    if (
      !accountId ||
      selectedMethod !== AccountSetupMethod.EMAIL_FORWARD ||
      forwardAlias
    )
      return;

    loadForwardAlias();
  }, [accountId, selectedMethod, forwardAlias, loadForwardAlias]);

  useEffect(() => {
    if (selectedMethod !== AccountSetupMethod.EMAIL_FORWARD) return;
    if (!forwardAlias) return;
    if (forwardConfigured) return;
    if (forwardConfirmationCode || forwardConfirmationLink) return;
    setIsForwardConfirmPolling(true);
  }, [
    selectedMethod,
    forwardAlias,
    forwardConfigured,
    forwardConfirmationCode,
    forwardConfirmationLink,
  ]);

  useEffect(() => {
    setMethodConfigured(false);
    setEmailConnected(false);
    setForwardReady(false);
    setForwardAlias("");
    setForwardSourceId(null);
    setForwardSenderEmail("");
    setForwardConfirmationCode("");
    setForwardConfirmationLink("");
    setForwardConfigured(false);
    setIsForwardVerifying(false);
    setIsForwardPolling(false);
    setIsForwardConfirmPolling(false);
    setPreviewItems([]);
    setHasPreviewed(false);
  }, [selectedMethod]);

  const effectiveMethod = useMemo(
    () => selectedMethod || normalizeSetupMethod(account?.setupMethod) || null,
    [selectedMethod, account?.setupMethod],
  );

  const loadIntegrations = useCallback(async () => {
    setIsLoadingIntegrations(true);
    try {
      const data = await BankingActions.listSources();
      const list = Array.isArray(data) ? data : data?.data || [];
      setEmailSources(list);
    } catch (error) {
      console.error("Error cargando integraciones", error);
    } finally {
      setIsLoadingIntegrations(false);
    }
  }, []);

  useEffect(() => {
    if (effectiveMethod === AccountSetupMethod.EMAIL_HISTORY) {
      loadIntegrations();
    }
  }, [effectiveMethod, loadIntegrations]);

  const loadRules = useCallback(async () => {
    setIsRulesLoading(true);
    try {
      const data = await BankingActions.listRules();
      const list = Array.isArray(data) ? data : data?.data || [];
      setRules(list);
    } catch (error) {
      console.error("Error cargando reglas", error);
      showToast("No pudimos cargar las reglas", "error");
    } finally {
      setIsRulesLoading(false);
    }
  }, [showToast]);

  const loadSourceRules = useCallback(async (sourceId: string) => {
    try {
      const data = await BankingActions.listSourceRules(sourceId);
      const list = Array.isArray(data) ? data : data?.data || [];
      const ids = list
        .map((rule: any) => getRuleId(rule))
        .filter(Boolean) as string[];
      setAttachedRuleIds(Array.from(new Set(ids)));
    } catch (error) {
      console.error("Error cargando reglas del source", error);
    }
  }, []);

  useEffect(() => {
    if (
      (effectiveMethod === AccountSetupMethod.EMAIL_HISTORY ||
        effectiveMethod === AccountSetupMethod.EMAIL_FORWARD) &&
      rules.length === 0
    ) {
      loadRules();
    }
  }, [effectiveMethod, loadRules, rules.length]);

  const accountInstitution = useMemo(
    () => getInstitutionName(account),
    [account],
  );

  const inferredInstitution = useMemo(() => {
    const accountName = account?.name;
    if (!accountName) return null;
    const nameTokens = toTokens(accountName);
    if (nameTokens.length === 0) return null;
    const institutions = Array.from(
      new Set(
        rules.map((rule) => getRuleInstitutionName(rule)).filter(Boolean),
      ),
    ) as string[];

    let bestMatch: { name: string; score: number } | null = null;
    institutions.forEach((institution) => {
      const tokens = toTokens(institution);
      if (tokens.length === 0) return;
      const score = tokens.filter((token) => nameTokens.includes(token)).length;
      if (score <= 0) return;
      if (!bestMatch || score > bestMatch.score) {
        bestMatch = { name: institution, score };
      }
    });
    return bestMatch?.name || null;
  }, [account?.name, rules]);

  const effectiveInstitution = useMemo(
    () => accountInstitution || inferredInstitution,
    [accountInstitution, inferredInstitution],
  );

  const hasInstitution = Boolean(effectiveInstitution);

  const rulesFilterResult = useMemo(() => {
    if (!rules.length) {
      return { list: [], isFallback: false, noMatches: false };
    }
    if (!effectiveInstitution) {
      return { list: [], isFallback: false, noMatches: false };
    }
    const target = normalizeText(effectiveInstitution);
    if (!target) {
      return { list: [], isFallback: false, noMatches: false };
    }
    const targetTokens = toTokens(effectiveInstitution);
    const matches = rules.filter((rule) => {
      const institution = getRuleInstitutionName(rule);
      if (!institution) return false;
      const ruleValue = normalizeText(institution);
      if (!ruleValue) return false;
      if (ruleValue.includes(target) || target.includes(ruleValue)) return true;
      const ruleTokens = toTokens(institution);
      return ruleTokens.some((token) => targetTokens.includes(token));
    });

    if (matches.length === 0) {
      return { list: [], isFallback: false, noMatches: true };
    }

    const unique = new Map<string, any>();
    matches.forEach((rule) => {
      const key = buildRuleKey(rule);
      if (!unique.has(key)) {
        unique.set(key, rule);
        return;
      }
      const existing = unique.get(key);
      const existingId = getRuleId(existing);
      const candidateId = getRuleId(rule);
      const existingAttached =
        existingId && attachedRuleIds.includes(existingId);
      const candidateAttached =
        candidateId && attachedRuleIds.includes(candidateId);
      const existingUser = Boolean(existing?.userId);
      const candidateUser = Boolean(rule?.userId);
      if (!existingAttached && candidateAttached) {
        unique.set(key, rule);
        return;
      }
      if (existingAttached && candidateAttached) return;
      if (!existingAttached && !candidateAttached) {
        if (!existingUser && candidateUser) {
          unique.set(key, rule);
        }
      }
    });
    return {
      list: Array.from(unique.values()),
      isFallback: false,
      noMatches: false,
    };
  }, [effectiveInstitution, rules, attachedRuleIds]);

  const filteredRules = rulesFilterResult.list;
  const isRulesFallback = rulesFilterResult.isFallback;

  const rulesNoMatch = rulesFilterResult.noMatches;

  const visibleRuleIds = useMemo(
    () =>
      filteredRules.map((rule) => getRuleId(rule)).filter(Boolean) as string[],
    [filteredRules],
  );

  const attachedVisibleRuleIds = useMemo(
    () => attachedRuleIds.filter((id) => visibleRuleIds.includes(id)),
    [attachedRuleIds, visibleRuleIds],
  );

  useEffect(() => {
    setPreviewItems([]);
    setHasPreviewed(false);
  }, [emailProvider]);

  useEffect(() => {
    setPreviewItems([]);
    setHasPreviewed(false);
  }, [attachedVisibleRuleIds.join("|")]);

  useEffect(() => {
    if (
      effectiveMethod !== AccountSetupMethod.EMAIL_HISTORY &&
      effectiveMethod !== AccountSetupMethod.EMAIL_FORWARD
    )
      return;
    if (!rulesSourceId) {
      if (
        effectiveMethod === AccountSetupMethod.EMAIL_HISTORY &&
        !isLoadingIntegrations &&
        emailSources.length > 0
      ) {
        setAttachedRuleIds([]);
      }
      return;
    }
    loadSourceRules(rulesSourceId);
  }, [
    effectiveMethod,
    rulesSourceId,
    loadSourceRules,
    isLoadingIntegrations,
    emailSources.length,
  ]);

  const getEmailApiSource = useCallback(
    (provider?: "GMAIL" | "GOOGLE" | null) => {
      const candidates = emailSources.filter((source) => {
        if (source?.type && source.type !== "EMAIL_API") return false;
        if (getSourceStatus(source) === "deleted") return false;
        return true;
      });
      if (candidates.length === 0) return null;
      if (!provider) return candidates[0];

      const match = candidates.find((source) => {
        const sourceProvider = getSourceProvider(source);
        if (sourceProvider && sourceProvider === provider) return true;
        if (!sourceProvider) {
          const email = getSourceEmail(source);
          if (!email) return false;
          return provider === "GMAIL"
            ? isGmailAddress(email)
            : !isGmailAddress(email);
        }
        return false;
      });

      return match || candidates[0];
    },
    [emailSources, getSourceProvider, getSourceEmail, isGmailAddress],
  );

  const emailApiSource = useMemo(
    () => getEmailApiSource(emailProvider),
    [getEmailApiSource, emailProvider],
  );
  const emailApiSourceId = emailApiSource?.id as string | undefined;
  const rulesSourceId = useMemo(() => {
    if (effectiveMethod === AccountSetupMethod.EMAIL_FORWARD) {
      return forwardSourceId || undefined;
    }
    return emailApiSourceId;
  }, [effectiveMethod, forwardSourceId, emailApiSourceId]);

  useEffect(() => {
    if (effectiveMethod !== AccountSetupMethod.EMAIL_HISTORY) return;
    if (emailProvider) return;
    const activeSources = emailSources.filter(
      (source) =>
        source?.type === "EMAIL_API" && getSourceStatus(source) !== "deleted",
    );
    if (activeSources.length === 0) return;
    const preferred =
      activeSources.find((source) => isConnectedStatus(source?.status)) ||
      activeSources[0];
    const provider = getSourceProvider(preferred);
    if (provider === "GMAIL" || provider === "GOOGLE") {
      setEmailProvider(provider);
      setEmailConnected(true);
      return;
    }
    const email = getSourceEmail(preferred);
    if (email) {
      setEmailProvider(isGmailAddress(email) ? "GMAIL" : "GOOGLE");
      setEmailConnected(true);
    }
  }, [
    effectiveMethod,
    emailProvider,
    emailSources,
    getSourceProvider,
    getSourceEmail,
    isGmailAddress,
  ]);

  const isProviderConnected = useMemo(() => {
    if (!emailProvider) return false;
    const match = emailApiSource;
    if (!match) return false;
    const status = match?.status || match?.state;
    if (status && !isConnectedStatus(status)) return false;
    if (match?.connected === true || match?.isConnected === true) return true;
    if (match?.connectedAt || match?.oauthConnectedAt) return true;
    if (match?.config?.oauthConnectedAt || match?.config?.connectedAt)
      return true;
    return isConnectedStatus(match?.status || match?.state);
  }, [emailProvider, emailApiSource]);

  const handleSaveMethod = useCallback(async () => {
    if (!accountId || !selectedMethod) return;
    if (selectedMethod === AccountSetupMethod.EMAIL_HISTORY && !emailProvider) {
      setCurrentStep(2);
      return;
    }
    setIsSaving(true);
    try {
      const provider =
        selectedMethod === AccountSetupMethod.EMAIL_HISTORY
          ? emailProvider || undefined
          : undefined;
      const updated = await AccountService.setSetupSource(
        accountId,
        selectedMethod,
        provider,
      );
      const merged = mergeAccount(updated);
      setAccount(merged);
      updateAccountInStore(merged);
      setCurrentStep(2);
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        showToast(String(apiMessage), "error");
      } else {
        showToast("No pudimos guardar el metodo", "error");
      }
      console.error("Error guardando metodo:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    accountId,
    selectedMethod,
    emailProvider,
    updateAccountInStore,
    showToast,
  ]);

  const handleImportEmailHistory = useCallback(async () => {
    if (!accountId) return;
    if (!hasInstitution) {
      showToast("Define la institución de la cuenta antes de importar", "info");
      return;
    }
    if (!emailProvider) {
      showToast("Selecciona Gmail o Google", "info");
      return;
    }
    if (!isProviderConnected) {
      showToast("Conecta Gmail/Google en Integraciones", "info");
      return;
    }
    if (attachedVisibleRuleIds.length === 0) {
      showToast("Selecciona reglas bancarias antes de importar", "info");
      return;
    }
    if (!hasPreviewed) {
      showToast("Realiza el preview antes de importar", "info");
      return;
    }
    setIsSaving(true);
    try {
      const updated = await AccountService.setSetupSource(
        accountId,
        AccountSetupMethod.EMAIL_HISTORY,
        emailProvider,
      );
      const merged = mergeAccount(updated);
      setAccount(merged);
      updateAccountInStore(merged);
      await AccountService.syncEmailHistory(accountId);
      setMethodConfigured(true);
      setSyncStartedAt(Date.now());
      setIsSyncPolling(true);
      setIsAccountSyncPolling(true);
      showToast("Importacion en curso", "success");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        showToast(String(apiMessage), "error");
      } else {
        showToast("No pudimos iniciar la importacion", "error");
      }
      console.error("Error importando email history:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    accountId,
    hasInstitution,
    emailProvider,
    isProviderConnected,
    attachedVisibleRuleIds.length,
    hasPreviewed,
    showToast,
  ]);

  const handleSyncNow = useCallback(async () => {
    if (!accountId) return;
    if (!hasInstitution) {
      showToast(
        "Define la institución de la cuenta antes de sincronizar",
        "info",
      );
      return;
    }
    if (!isProviderConnected) {
      showToast("Conecta Gmail/Google en Integraciones", "info");
      return;
    }
    setIsSaving(true);
    try {
      await AccountService.syncEmailHistory(accountId);
      setSyncStartedAt(Date.now());
      setIsSyncPolling(true);
      showToast("Sincronización iniciada", "success");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        showToast(String(apiMessage), "error");
      } else {
        showToast("No pudimos iniciar la sincronización", "error");
      }
      console.error("Error sincronizando email history:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsSaving(false);
    }
  }, [accountId, hasInstitution, isProviderConnected, showToast]);

  const parseSyncInfo = useCallback((data: any) => {
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
    const isRunning =
      data?.isRunning ?? data?.running ?? data?.inProgress ?? undefined;
    return { status, processed, total, isRunning };
  }, []);

  const isSyncFinished = useCallback(
    (data: any) => {
      const { status, isRunning } = parseSyncInfo(data);
      if (isRunning === false) return true;
      const normalized = (status || "").toString().toLowerCase();
      return ["done", "completed", "success", "finished", "idle"].includes(
        normalized,
      );
    },
    [parseSyncInfo],
  );

  const updateSyncStatus = useCallback(async () => {
    if (!emailApiSourceId) return;
    try {
      const data = await BankingActions.syncStatus(emailApiSourceId);
      setSyncStatus(data);
      if (isSyncFinished(data)) {
        setIsSyncPolling(false);
      }
    } catch (error) {
      console.error("Error consultando sync status", error);
    }
  }, [emailApiSourceId, isSyncFinished]);

  const updateAccountSyncStatus = useCallback(async () => {
    if (!accountId) return;
    try {
      const data = await AccountService.getById(accountId);
      const merged = mergeAccount(data);
      setAccount(merged);
      updateAccountInStore(merged);
      if (merged.firstSyncedAt) {
        setIsAccountSyncPolling(false);
      }
    } catch (error) {
      console.error("Error consultando estado de cuenta", error);
    }
  }, [accountId, mergeAccount, updateAccountInStore]);

  useEffect(() => {
    if (!isSyncPolling) return;
    updateSyncStatus();
    const intervalId = setInterval(() => {
      updateSyncStatus();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [isSyncPolling, updateSyncStatus]);

  useEffect(() => {
    if (!isAccountSyncPolling) return;
    updateAccountSyncStatus();
    const intervalId = setInterval(() => {
      updateAccountSyncStatus();
    }, 8000);
    return () => clearInterval(intervalId);
  }, [isAccountSyncPolling, updateAccountSyncStatus]);

  const normalizePreviewItems = useCallback((data: any) => {
    const list =
      (Array.isArray(data) && data) ||
      data?.items ||
      data?.data ||
      data?.results ||
      data?.transactions ||
      data?.preview ||
      [];
    if (!Array.isArray(list)) return [];
    const toNumber = (value: any) => {
      if (typeof value === "number" && !Number.isNaN(value)) return value;
      if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };

    const getHeaderValue = (headers: any[], name: string) => {
      if (!Array.isArray(headers)) return undefined;
      const found = headers.find((header) => {
        const key = (header?.name || header?.key || "")
          .toString()
          .toLowerCase();
        return key === name.toLowerCase();
      });
      return found?.value || found?.val || found?.content;
    };

    const shorten = (value?: string | null, limit = 80) => {
      if (!value) return undefined;
      const text = value.toString().trim();
      if (!text) return undefined;
      if (text.length <= limit) return text;
      return `${text.slice(0, limit).trim()}…`;
    };

    const mapAmount = (item: any) => {
      const amountValue =
        item?.amount?.value ??
        item?.amount?.amount ??
        item?.amountValue ??
        item?.amount ??
        item?.value ??
        item?.total ??
        item?.transactionAmount ??
        item?.amountCents ??
        item?.amountMinor;

      if (item?.amountCents || item?.amountMinor) {
        const cents = toNumber(amountValue);
        return cents !== undefined ? cents / 100 : undefined;
      }

      return toNumber(amountValue) ?? amountValue;
    };

    const mapCurrency = (item: any) =>
      item?.currency ||
      item?.currencyCode ||
      item?.amount?.currency ||
      item?.amount?.currencyCode ||
      item?.amountCurrency;

    const mapDate = (item: any) =>
      item?.date ||
      item?.postedAt ||
      item?.transactionDate ||
      item?.occurredAt ||
      item?.createdAt ||
      item?.receivedAt ||
      item?.emailDate ||
      item?.email?.date;

    const mapDescription = (item: any) =>
      item?.description ||
      item?.merchant ||
      item?.merchantName ||
      item?.counterparty ||
      item?.name ||
      item?.title ||
      item?.subject ||
      item?.emailSubject ||
      item?.from ||
      item?.sender ||
      item?.institution ||
      "Movimiento";

    const mapped = list.map((rawItem: any, index: number) => {
      const match = rawItem?.match;
      const item =
        match?.transaction ||
        match?.candidate ||
        rawItem?.transaction ||
        rawItem?.candidate ||
        rawItem ||
        {};
      const headers = rawItem?.headers || item?.headers || [];
      const subject = getHeaderValue(headers, "Subject");
      const from = getHeaderValue(headers, "From");
      const snippet = rawItem?.snippet || item?.snippet;
      const ruleName =
        match?.rule?.name ||
        match?.ruleName ||
        item?.ruleName ||
        item?.rule?.name;
      const internalDate =
        rawItem?.internalDate || item?.internalDate || match?.internalDate;
      const parsedDate =
        internalDate && !Number.isNaN(Number(internalDate))
          ? new Date(Number(internalDate)).toISOString().slice(0, 10)
          : undefined;

      const baseDescription =
        subject || mapDescription(item) || from || snippet || "Movimiento";
      const detail =
        ruleName || from || shorten(snippet) || shorten(subject) || undefined;

      return {
        id:
          item?.id ||
          item?.transactionId ||
          item?.externalId ||
          rawItem?.id ||
          `preview-${index}`,
        description: baseDescription,
        detail,
        ruleName,
        amount: mapAmount(item),
        currency: mapCurrency(item),
        date: mapDate(item) || parsedDate,
        matched: Boolean(match),
      };
    });

    if (
      mapped.length > 0 &&
      mapped.every(
        (item) => item.amount === undefined && item.date === undefined,
      )
    ) {
      console.log("Preview sin datos normalizados, muestra raw sample:", {
        sample: list[0],
        keys: list[0] ? Object.keys(list[0]) : [],
      });
    }

    return mapped;
  }, []);

  const handlePreviewEmailHistory = useCallback(async () => {
    if (!accountId) return;
    if (!hasInstitution) {
      showToast("Define la institución de la cuenta antes del preview", "info");
      return;
    }
    if (!emailProvider) {
      showToast("Selecciona Gmail o Google", "info");
      return;
    }
    if (!isProviderConnected) {
      showToast("Conecta Gmail/Google en Integraciones", "info");
      return;
    }
    if (attachedVisibleRuleIds.length === 0) {
      showToast("Selecciona reglas bancarias antes del preview", "info");
      return;
    }
    if (!emailApiSourceId) {
      showToast("No encontramos una fuente activa para preview", "error");
      return;
    }
    setIsPreviewLoading(true);
    try {
      const data = await BankingActions.preview(emailApiSourceId, {
        limit: 50,
      });
      const items = normalizePreviewItems(data);
      setPreviewItems(items);
      setHasPreviewed(true);
      if (items.length === 0) {
        showToast("No se encontraron movimientos para preview", "info");
      }
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        showToast(String(apiMessage), "error");
      } else {
        showToast("No pudimos cargar la vista previa", "error");
      }
      console.error("Error en preview email history:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsPreviewLoading(false);
    }
  }, [
    accountId,
    hasInstitution,
    emailProvider,
    isProviderConnected,
    attachedVisibleRuleIds.length,
    emailApiSourceId,
    normalizePreviewItems,
    showToast,
  ]);

  const handleToggleRule = useCallback(
    async (ruleId: string, isAttached: boolean) => {
      if (!rulesSourceId) {
        const message =
          effectiveMethod === AccountSetupMethod.EMAIL_FORWARD
            ? "Configura el reenvío para activar reglas"
            : "Conecta Gmail/Google en Integraciones";
        showToast(message, "info");
        return;
      }
      setIsRuleUpdating(ruleId);
      try {
        if (isAttached) {
          await BankingActions.detachRule(rulesSourceId, ruleId);
          setAttachedRuleIds((prev) => prev.filter((id) => id !== ruleId));
        } else {
          await BankingActions.attachRule(rulesSourceId, ruleId);
          setAttachedRuleIds((prev) => Array.from(new Set([...prev, ruleId])));
        }
      } catch (error: any) {
        const apiMessage =
          error?.response?.data?.message || error?.response?.data?.error;
        if (apiMessage) {
          showToast(String(apiMessage), "error");
        } else {
          showToast("No pudimos actualizar la regla", "error");
        }
        console.error("Error actualizando regla:", {
          status: error?.response?.status,
          data: error?.response?.data,
        });
      } finally {
        setIsRuleUpdating(null);
      }
    },
    [rulesSourceId, effectiveMethod, showToast],
  );

  const updateForwardStatus = useCallback(async () => {
    if (!forwardSourceId) return;
    try {
      const data = await BankingActions.getSource(forwardSourceId);
      const configured = isForwardConfiguredSource(data);
      const confirmationCode =
        data?.forwardConfirmationCode || data?.confirmationCode;
      const confirmationLink =
        data?.forwardConfirmationLink || data?.confirmationLink;
      const inboundAlias = extractInboundAlias(data);
      if (inboundAlias && !forwardAlias) {
        setForwardAlias(inboundAlias);
      }
      if (confirmationCode) {
        setForwardConfirmationCode(String(confirmationCode));
      }
      if (confirmationLink) {
        setForwardConfirmationLink(String(confirmationLink));
      }
      if (configured) {
        setMethodConfigured(true);
        setForwardReady(true);
        setIsForwardPolling(false);
        setIsForwardConfirmPolling(false);
      }
      setForwardConfigured(configured);
      if (confirmationCode || confirmationLink) {
        setIsForwardConfirmPolling(false);
      }
    } catch (error) {
      console.error("Error consultando estado de reenvío", error);
    }
  }, [forwardAlias, forwardSourceId, isForwardConfiguredSource, showToast]);

  useEffect(() => {
    if (!forwardSourceId) return;
    updateForwardStatus();
  }, [forwardSourceId, updateForwardStatus]);

  useEffect(() => {
    const prev = prevForwardConfiguredRef.current;
    if (!prev && forwardConfigured && forwardVerifyRequestedRef.current) {
      showToast("Reenvío verificado", "success");
      forwardVerifyRequestedRef.current = false;
    }
    prevForwardConfiguredRef.current = forwardConfigured;
  }, [forwardConfigured, showToast]);

  useEffect(() => {
    if (!isForwardPolling) return;
    updateForwardStatus();
    const intervalId = setInterval(() => {
      updateForwardStatus();
    }, 4000);
    return () => clearInterval(intervalId);
  }, [isForwardPolling, updateForwardStatus]);

  useEffect(() => {
    if (!isForwardConfirmPolling) return;
    updateForwardStatus();
    const intervalId = setInterval(() => {
      updateForwardStatus();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [isForwardConfirmPolling, updateForwardStatus]);

  const handleVerifyForward = useCallback(async () => {
    if (!forwardSourceId) {
      showToast("No encontramos la fuente de reenvío", "error");
      return;
    }
    if (!forwardAlias) {
      showToast("Primero copia el alias de reenvío", "info");
      return;
    }
    setIsForwardPolling(false);
    forwardVerifyRequestedRef.current = true;
    setIsForwardVerifying(true);
    try {
      const data = await BankingActions.verifyForward(forwardSourceId);
      const sender =
        data?.senderEmail || data?.sender || data?.from || data?.address;
      if (sender) {
        setForwardSenderEmail(String(sender));
      }
      setIsForwardPolling(true);
      showToast("Correo de prueba enviado", "success");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (!apiMessage) {
        showToast("No pudimos enviar el correo de prueba", "error");
      }
    } finally {
      setIsForwardVerifying(false);
    }
  }, [forwardAlias, forwardSourceId, showToast]);

  const handleImportStatement = useCallback(async () => {
    if (!accountId) return;
    if (!statementFile) {
      showToast("Selecciona un archivo", "info");
      return;
    }
    setIsSaving(true);
    try {
      await AccountService.syncStatement(accountId, {
        filename: statementFile,
        format: statementFormat,
      });
      setMethodConfigured(true);
      showToast("Cartola enviada para importar", "success");
    } catch (error) {
      showToast("No pudimos importar la cartola", "error");
    } finally {
      setIsSaving(false);
    }
  }, [accountId, statementFile, statementFormat, showToast]);

  const handleFinish = useCallback(async () => {
    if (!accountId) return;
    setIsSaving(true);
    try {
      const updated = await AccountService.getById(accountId);
      setAccount(updated);
      updateAccountInStore(updated);
      navigation.reset({
        index: 1,
        routes: [{ name: "HomeDrawer" }, { name: "Accounts" }],
      });
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      if (apiMessage) {
        showToast(String(apiMessage), "error");
      } else {
        showToast("No pudimos finalizar el setup", "error");
      }
      console.error("Error finalizando setup:", {
        status: error?.response?.status,
        data: error?.response?.data,
      });
    } finally {
      setIsSaving(false);
    }
  }, [
    accountId,
    selectedMethod,
    account?.setupMethod,
    updateAccountInStore,
    navigation,
    showToast,
  ]);

  const handleCopyAlias = useCallback(async () => {
    if (!forwardAlias) return;
    await Clipboard.setStringAsync(forwardAlias);
    showToast("Alias copiado", "success");
  }, [forwardAlias, showToast]);

  const handleCopyForwardSender = useCallback(async () => {
    if (!forwardSenderEmail) return;
    await Clipboard.setStringAsync(forwardSenderEmail);
    showToast("Remitente copiado", "success");
  }, [forwardSenderEmail, showToast]);

  const handleCopyForwardConfirmationCode = useCallback(async () => {
    if (!forwardConfirmationCode) return;
    await Clipboard.setStringAsync(forwardConfirmationCode);
    showToast("Código copiado", "success");
  }, [forwardConfirmationCode, showToast]);

  const handleCopyForwardConfirmationLink = useCallback(async () => {
    if (!forwardConfirmationLink) return;
    await Clipboard.setStringAsync(forwardConfirmationLink);
    showToast("Link copiado", "success");
  }, [forwardConfirmationLink, showToast]);

  const handleSelectEmailProvider = useCallback(
    (provider: "GMAIL" | "GOOGLE") => {
      setEmailProvider(provider);
      setEmailConnected(true);
    },
    [],
  );

  const handleMarkForwardReady = useCallback(() => setForwardReady(true), []);
  const handleGoToFinalStep = useCallback(() => setCurrentStep(3), []);
  const handleBackToMethods = useCallback(() => setCurrentStep(1), []);
  const handleOpenIntegrations = useCallback(() => {
    navigation.navigate("BankingIntegrations");
  }, [navigation]);

  const canContinue = useMemo(() => {
    if (effectiveMethod === AccountSetupMethod.EMAIL_FORWARD) {
      return forwardConfigured && attachedVisibleRuleIds.length > 0;
    }
    return methodConfigured;
  }, [
    effectiveMethod,
    forwardConfigured,
    attachedVisibleRuleIds.length,
    methodConfigured,
  ]);

  if (!isPro) {
    return (
      <MainLayout>
        <Paywall
          description="El setup automatico de cuentas es exclusivo de Wou+."
          onUpgrade={() => navigation.navigate("Subscription")}
          onBack={() => navigation.goBack()}
        />
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$brand" />
        </YStack>
      </MainLayout>
    );
  }

  if (!account) {
    return (
      <MainLayout>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text color="$gray10">Cuenta no encontrada.</Text>
          <Button onPress={() => navigation.goBack()}>Volver</Button>
        </YStack>
      </MainLayout>
    );
  }

  return (
    <MainLayout noPadding>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
      >
        <YStack
          flex={1}
          paddingTop={insets.top + 10}
          paddingHorizontal="$4"
          paddingBottom="$6"
          space="$4"
        >
          <AccountSetupHeader onBack={() => navigation.goBack()} />

          <AccountSetupStepper steps={steps} currentStep={currentStep} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 50 }}
          >
            <YStack space="$5">
              {currentStep === 1 && (
                <AccountSetupStep2
                  selectedMethod={effectiveMethod}
                  isSaving={isSaving}
                  onSelectMethod={setSelectedMethod}
                  onContinue={handleSaveMethod}
                  isEmailHistoryLocked={Boolean(account?.firstSyncedAt)}
                />
              )}

              {currentStep === 2 && (
                <AccountSetupStep3
                  selectedMethod={effectiveMethod}
                  emailProvider={emailProvider}
                  emailConnected={emailConnected}
                  isProviderConnected={isProviderConnected}
                  isIntegrationsLoading={isLoadingIntegrations}
                  isSaving={isSaving}
                  onSelectEmailProvider={handleSelectEmailProvider}
                  onImportEmailHistory={handleImportEmailHistory}
                  onPreviewEmailHistory={handlePreviewEmailHistory}
                  isPreviewLoading={isPreviewLoading}
                  previewItems={previewItems}
                  accountCurrency={account?.currency}
                  accountInstitution={effectiveInstitution}
                  firstSyncedAt={account?.firstSyncedAt || null}
                  lastSyncedAt={account?.lastSyncedAt || null}
                  setupStatus={account?.setupStatus || null}
                  isAccountSyncPolling={isAccountSyncPolling}
                  emailSourceId={emailApiSourceId}
                  rules={filteredRules}
                  attachedRuleIds={attachedVisibleRuleIds}
                  isRulesLoading={isRulesLoading}
                  isRuleUpdating={isRuleUpdating}
                  onToggleRule={handleToggleRule}
                  hasPreviewed={hasPreviewed}
                  isRulesFallback={isRulesFallback}
                  rulesNoMatch={rulesNoMatch}
                  hasInstitution={hasInstitution}
                  syncStatus={syncStatus}
                  syncStartedAt={syncStartedAt}
                  isSyncPolling={isSyncPolling}
                  onOpenIntegrations={handleOpenIntegrations}
                  forwardAlias={forwardAlias}
                  isAliasLoading={isAliasLoading}
                  forwardReady={forwardReady}
                  forwardConfigured={forwardConfigured}
                  forwardSenderEmail={forwardSenderEmail}
                  isForwardVerifying={isForwardVerifying}
                  isForwardPolling={isForwardPolling}
                  forwardConfirmationCode={forwardConfirmationCode}
                  forwardConfirmationLink={forwardConfirmationLink}
                  isForwardConfirmPolling={isForwardConfirmPolling}
                  onCopyAlias={handleCopyAlias}
                  onCopyForwardSender={handleCopyForwardSender}
                  onCopyForwardConfirmationCode={
                    handleCopyForwardConfirmationCode
                  }
                  onCopyForwardConfirmationLink={
                    handleCopyForwardConfirmationLink
                  }
                  onMarkForwardReady={handleMarkForwardReady}
                  onVerifyForward={handleVerifyForward}
                  statementFile={statementFile}
                  onChangeStatementFile={setStatementFile}
                  statementFormat={statementFormat}
                  onChangeStatementFormat={setStatementFormat}
                  onImportStatement={handleImportStatement}
                  methodConfigured={canContinue}
                  onContinue={handleGoToFinalStep}
                  onBackToMethods={handleBackToMethods}
                />
              )}

              {currentStep === 3 && (
                <AccountSetupStep4
                  selectedMethod={effectiveMethod}
                  isSaving={isSaving}
                  onFinish={handleFinish}
                />
              )}
            </YStack>
          </ScrollView>
        </YStack>
      </KeyboardAvoidingView>
    </MainLayout>
  );
}
