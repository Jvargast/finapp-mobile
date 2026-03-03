import React, { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { YStack, XStack, Text, Spinner, Input, Circle, useThemeName } from "tamagui";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, Plus, Calendar } from "@tamagui/lucide-icons";
import Svg, { Path, Circle as SvgCircle } from "react-native-svg";
import { MainLayout } from "../../components/layout/MainLayout";
import { AccountService } from "../../services/accountService";
import { WouLoader } from "../../components/ui/WouLoader";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { WouButton } from "../../components/ui/WouButton";
import {
  Account,
  AccountSetupMethod,
  AccountSetupStatus,
} from "../../types/account.types";
import { BankingActions } from "../../actions/bankingActions";
import { useSubscription } from "../../hooks/useSubscription";
import { useToastStore } from "../../stores/useToastStore";

type RouteParams = {
  accountId: string;
};

const getPalette = (isDark: boolean) => ({
  page: isDark ? "#0A1020" : "#F8FAFC",
  border: isDark ? "rgba(148,163,184,0.22)" : "#DCE3EE",
  ink: isDark ? "#F8FAFC" : "#1F2937",
  muted: isDark ? "#94A3B8" : "#6B7280",
  cardBlue: isDark ? "#121C34" : "#F4F8FF",
  cardBlueBorder: isDark ? "#243252" : "#DCE8FF",
  cardLilac: isDark ? "#1B1934" : "#FAF7FF",
  cardLilacBorder: isDark ? "#2F2852" : "#E8DEFF",
  cardPeach: isDark ? "#2A2018" : "#FFF8F0",
  cardPeachBorder: isDark ? "#4B3424" : "#F8E1C8",
  cardMint: isDark ? "#13261F" : "#F3FCF7",
  cardMintBorder: isDark ? "#254236" : "#D7F2E3",
  mintIconBg: isDark ? "rgba(110,231,183,0.17)" : "#E6F8EE",
  mintIcon: isDark ? "#6EE7B7" : "#1F8A59",
  cardRose: isDark ? "#2A1A20" : "#FFF6F7",
  cardRoseBorder: isDark ? "#4A2931" : "#F9D7DB",
  surface: isDark ? "#101A2C" : "#FFFFFF",
  surfaceBorder: isDark ? "rgba(148,163,184,0.22)" : "#E6EBF2",
  inputBg: isDark ? "#0D1728" : "#F8FAFD",
  inputText: isDark ? "#E2E8F0" : "#0F172A",
  inputPlaceholder: isDark ? "#64748B" : "#94A3B8",
  accent: isDark ? "#9AB5FF" : "#5B7EEA",
  peachIconBg: isDark ? "rgba(251,191,36,0.18)" : "#FFEDD9",
  peachIcon: isDark ? "#FCD34D" : "#B45309",
  lilacIconBg: isDark ? "rgba(196,181,253,0.2)" : "#F1EBFF",
  lilacIcon: isDark ? "#DDD6FE" : "#5B34B4",
  roseIconBg: isDark ? "rgba(251,113,133,0.18)" : "#FFECEE",
  roseIcon: isDark ? "#FDA4AF" : "#B42344",
  pill: {
    active: isDark
      ? {
          bg: "rgba(52,211,153,0.18)",
          border: "rgba(52,211,153,0.34)",
          text: "#6EE7B7",
        }
      : { bg: "#ECFDF3", border: "#CFF5E0", text: "#166534" },
    pending: isDark
      ? {
          bg: "rgba(251,191,36,0.18)",
          border: "rgba(251,191,36,0.36)",
          text: "#FCD34D",
        }
      : { bg: "#FFF7E6", border: "#FDE6B3", text: "#9A5B12" },
    manual: isDark
      ? {
          bg: "rgba(148,163,184,0.16)",
          border: "rgba(148,163,184,0.32)",
          text: "#CBD5E1",
        }
      : { bg: "#EEF2F7", border: "#D8E0EC", text: "#5D6B82" },
    method: isDark
      ? {
          bg: "rgba(147,197,253,0.18)",
          border: "rgba(147,197,253,0.33)",
          text: "#BFDBFE",
        }
      : { bg: "#ECF2FF", border: "#D4E1FF", text: "#2D4EA2" },
    synced: isDark
      ? {
          bg: "rgba(196,181,253,0.18)",
          border: "rgba(196,181,253,0.34)",
          text: "#DDD6FE",
        }
      : { bg: "#F2EDFF", border: "#E3D7FF", text: "#5532A5" },
    alert: isDark
      ? {
          bg: "rgba(110,231,183,0.16)",
          border: "rgba(110,231,183,0.31)",
          text: "#6EE7B7",
        }
      : { bg: "#EDFCF5", border: "#CFEFDF", text: "#156947" },
  },
});

const RULE_CARD_HEIGHT = 78;
const SECTION_RADIUS = "$8" as const;
const CHIP_RADIUS = "$6" as const;
const ITEM_RADIUS = "$7" as const;
const INPUT_RADIUS = "$6" as const;
const BUTTON_RADIUS = "$8" as const;

const StatusBadgeIcon = ({
  status,
  color,
  size = 12,
}: {
  status: "ACTIVE" | "PENDING" | "MANUAL";
  color: string;
  size?: number;
}) => {
  if (status === "ACTIVE") {
    return (
      <Svg width={size} height={size} viewBox="0 0 12 12">
        <SvgCircle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.5" fill="none" />
        <Path
          d="M3.8 6.2 5.2 7.6 8.2 4.6"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (status === "PENDING") {
    return (
      <Svg width={size} height={size} viewBox="0 0 12 12">
        <SvgCircle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.5" fill="none" />
        <Path
          d="M6 3.4v3l2 1.2"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 12 12">
      <SvgCircle cx="6" cy="6" r="5" stroke={color} strokeWidth="1.5" fill="none" />
      <SvgCircle cx="6" cy="6" r="1.6" fill={color} />
    </Svg>
  );
};

const RulesBadgeIcon = ({ color, size = 12 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20">
    <Path
      d="M10 2.5l1.7 3.6 4 .4-3 2.6.9 3.9-3.6-2.1-3.6 2.1.9-3.9-3-2.6 4-.4z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M3.2 12.2l.6 1.4 1.5.2-1.2.9.4 1.5-1.3-.8-1.3.8.4-1.5-1.2-.9 1.5-.2z"
      stroke={color}
      strokeWidth="1.2"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

const AlertBadgeIcon = ({ color, size = 12 }: { color: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 20 20">
    <Path
      d="M5.2 12.2V8.6a4.8 4.8 0 0 1 9.6 0v3.6l1.6 1.8H3.6z"
      stroke={color}
      strokeWidth="1.4"
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M8.4 15.6a1.6 1.6 0 0 0 3.2 0"
      stroke={color}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </Svg>
);

const getMethodLabel = (method?: AccountSetupMethod | string | null) => {
  const value = String(method || "");
  if (value === AccountSetupMethod.EMAIL_HISTORY || value === "OAUTH_EMAIL") {
    return "Correo";
  }
  if (value === AccountSetupMethod.EMAIL_FORWARD || value === "FORWARD_ALIAS") {
    return "Reenvío";
  }
  if (value === AccountSetupMethod.STATEMENT || value === "STATEMENT_IMPORT") {
    return "Cartola";
  }
  return "Manual";
};

const normalizeSetupMethod = (
  method?: AccountSetupMethod | string | null
) => {
  const value = String(method || "");
  if (value === "OAUTH_EMAIL") return AccountSetupMethod.EMAIL_HISTORY;
  if (value === "FORWARD_ALIAS") return AccountSetupMethod.EMAIL_FORWARD;
  if (value === "STATEMENT_IMPORT") return AccountSetupMethod.STATEMENT;
  return method as AccountSetupMethod | null | undefined;
};

export default function AccountDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const themeName = useThemeName();
  const pastel = getPalette(themeName.startsWith("dark"));
  const showToast = useToastStore((s) => s.showToast);
  const { isPro } = useSubscription();

  const { accountId } = (route.params || {}) as RouteParams;
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allRules, setAllRules] = useState<any[]>([]);
  const [attachedRuleIds, setAttachedRuleIds] = useState<string[]>([]);
  const [inboundAttachedRuleIds, setInboundAttachedRuleIds] = useState<string[]>([]);
  const [isRulesLoading, setIsRulesLoading] = useState(false);
  const [isRuleUpdating, setIsRuleUpdating] = useState<string | null>(null);
  const [ruleSourceId, setRuleSourceId] = useState<string | null>(null);
  const [inboundSourceId, setInboundSourceId] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [showInboundRules, setShowInboundRules] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [isRangeSyncing, setIsRangeSyncing] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    let isMounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await AccountService.getById(accountId);
        if (!isMounted) return;
        setAccount(data);
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
  }, [accountId, showToast]);

  const normalizeText = (value?: string | null) =>
    (value || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "");

  const getRuleId = (rule: any) =>
    rule?.rule?.id || rule?.ruleId || rule?.id || rule?.uuid || rule?.rule_id;

  const getRuleName = (rule: any) =>
    rule?.name || rule?.title || rule?.ruleName || "Regla bancaria";

  const getRuleInstitution = (rule: any) =>
    rule?.institution ||
    rule?.bank ||
    rule?.entity ||
    rule?.name ||
    rule?.title;

  const formatYmd = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const formatReadableDate = (value?: string | Date | null) => {
    if (!value) return null;
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleString("es-CL", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const parseYmd = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const parsed = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const presetDays = useMemo(() => {
    if (!fromDate || !toDate) return null;
    const from = parseYmd(fromDate);
    const to = parseYmd(toDate);
    if (!from || !to) return null;
    const today = new Date();
    if (!isSameDay(to, today)) return null;
    const diffMs = to.getTime() - from.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return [30, 60, 90].includes(diffDays) ? diffDays : null;
  }, [fromDate, toDate]);

  const setQuickRange = (days: number) => {
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - (days - 1));
    setFromDate(formatYmd(from));
    setToDate(formatYmd(today));
    setRangeError(null);
  };


  const filteredRules = useMemo(() => {
    if (!account?.institution) {
      return [];
    }
    const target = normalizeText(account.institution);
    if (!target) return [];
    return allRules.filter((rule) => {
      const institution = normalizeText(
        rule?.institution || rule?.bank || rule?.entity || "",
      );
      if (!institution) return false;
      return institution.includes(target) || target.includes(institution);
    });
  }, [account?.institution, allRules]);

  const dedupedRules = useMemo(() => {
    const unique = new Map<string, any>();
    filteredRules.forEach((rule) => {
      const key = [
        normalizeText(rule?.institution || rule?.bank || rule?.entity || ""),
        normalizeText(rule?.name || rule?.title || rule?.ruleName || ""),
      ].join("|");
      if (!unique.has(key)) {
        unique.set(key, rule);
      }
    });
    return Array.from(unique.values());
  }, [filteredRules]);

  useEffect(() => {
    if (
      !accountId ||
      !account?.institution ||
      account?.type?.toUpperCase() === "CASH"
    ) {
      setAllRules([]);
      setAttachedRuleIds([]);
      setInboundAttachedRuleIds([]);
      setRuleSourceId(null);
      setInboundSourceId(null);
      return;
    }
    let isMounted = true;
    const loadRules = async () => {
      setIsRulesLoading(true);
      try {
        const data = await BankingActions.listSources();
        const list = Array.isArray(data) ? data : data?.data || [];
        const activeSources = list.filter(
          (source: any) =>
            source?.type === "EMAIL_API" && source?.status !== "deleted",
        );
        const inboundSource =
          list.find(
            (source: any) =>
              source?.type === "EMAIL_NOTIFICATION" &&
              source?.status === "active" &&
              source?.accountId === accountId,
          ) || null;
        const source =
          activeSources.find((item: any) => item?.status === "active") ||
          activeSources[0] ||
          null;

        const rulesData = await BankingActions.listRules();
        const rulesList = Array.isArray(rulesData)
          ? rulesData
          : rulesData?.data || [];

        let attachedIds: string[] = [];
        let inboundAttachedIds: string[] = [];
        if (source?.id) {
          const sourceRulesData = await BankingActions.listSourceRules(
            source.id,
          );
          const sourceRules = Array.isArray(sourceRulesData)
            ? sourceRulesData
            : sourceRulesData?.data || [];
          attachedIds = sourceRules
            .map((rule: any) => getRuleId(rule))
            .filter(Boolean) as string[];
        }
        if (inboundSource?.id) {
          const inboundRulesData = await BankingActions.listSourceRules(
            inboundSource.id,
          );
          const inboundRules = Array.isArray(inboundRulesData)
            ? inboundRulesData
            : inboundRulesData?.data || [];
          inboundAttachedIds = inboundRules
            .map((rule: any) => getRuleId(rule))
            .filter(Boolean) as string[];
        }

        if (isMounted) {
          setAllRules(rulesList);
          setAttachedRuleIds(Array.from(new Set(attachedIds)));
          setInboundAttachedRuleIds(Array.from(new Set(inboundAttachedIds)));
          setRuleSourceId(source?.id || null);
          setInboundSourceId(inboundSource?.id || null);
        }
      } catch (error) {
        console.error("Error cargando reglas asociadas", error);
      } finally {
        if (isMounted) setIsRulesLoading(false);
      }
    };

    loadRules();
    return () => {
      isMounted = false;
    };
  }, [accountId, account?.institution, account?.type]);

  const handleToggleRule = async (
    sourceId: string | null,
    ruleId: string,
    isAttached: boolean,
    setRuleIds: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (!sourceId) {
      showToast("No encontramos una fuente activa para esta cuenta", "error");
      return;
    }
    const updateKey = `${sourceId}:${ruleId}`;
    setIsRuleUpdating(updateKey);
    try {
      if (isAttached) {
        await BankingActions.detachRule(sourceId, ruleId);
        setRuleIds((prev) => prev.filter((id) => id !== ruleId));
      } else {
        await BankingActions.attachRule(sourceId, ruleId);
        setRuleIds((prev) => Array.from(new Set([...prev, ruleId])));
      }
    } catch (error) {
      showToast("No pudimos actualizar la regla", "error");
    } finally {
      setIsRuleUpdating(null);
    }
  };

  const setupStatus = account?.setupStatus || null;
  const setupMethod = normalizeSetupMethod(account?.setupMethod) || null;
  const isSetupPending = setupStatus === AccountSetupStatus.PENDING;
  const isSetupActive = setupStatus === AccountSetupStatus.ACTIVE;
  const isCashAccount = account?.type?.toUpperCase() === "CASH";
  const isEmailHistory = setupMethod === AccountSetupMethod.EMAIL_HISTORY;
  const methodLabel = useMemo(() => {
    const baseLabel = getMethodLabel(setupMethod);
    if (baseLabel !== "Manual") return baseLabel;
    if (account?.firstSyncedAt) return "Sincronizada";
    return "Manual";
  }, [setupMethod, account?.firstSyncedAt]);
  const canEmailHistorySync =
    isEmailHistory || Boolean(account?.firstSyncedAt) || Boolean(ruleSourceId);
  const displayStatus = isSetupActive
    ? "ACTIVE"
    : isSetupPending
      ? "PENDING"
      : "MANUAL";
  const canShowRangeSync = isSetupActive && !isCashAccount;
  const showInboundPill =
    Boolean(inboundSourceId) || setupMethod === AccountSetupMethod.EMAIL_FORWARD;
  const firstSyncedLabel = formatReadableDate(account?.firstSyncedAt);
  const lastSyncedLabel = formatReadableDate(account?.lastSyncedAt);
  const statusPill = isSetupActive
    ? pastel.pill.active
    : isSetupPending
      ? pastel.pill.pending
      : pastel.pill.manual;
  const isSyncedLabel = methodLabel === "Sincronizada";
  const methodPill = isSyncedLabel ? pastel.pill.synced : pastel.pill.method;
  const alertPill = pastel.pill.alert;

  useEffect(() => {
    if (!isEmailHistory || !isSetupActive) return;
    if (fromDate || toDate) return;
    const today = new Date();
    const from = new Date();
    from.setDate(today.getDate() - 89);
    setFromDate(formatYmd(from));
    setToDate(formatYmd(today));
    setRangeError(null);
  }, [isEmailHistory, isSetupActive, fromDate, toDate]);

  if (isLoading) {
    return (
      <MainLayout>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color={pastel.accent} />
        </YStack>
      </MainLayout>
    );
  }

  if (!account) {
    return (
      <MainLayout>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Text color="$gray10">Cuenta no encontrada.</Text>
        </YStack>
      </MainLayout>
    );
  }

  const handleRangeSync = async () => {
    if (!accountId) return;
    if (!canEmailHistorySync) {
      showToast("Esta cuenta no tiene Gmail/Google configurado", "info");
      return;
    }
    if (!isPro) {
      showToast("Requiere Wou+ para sincronizar", "info");
      return;
    }
    if (!fromDate || !toDate) {
      setRangeError("Selecciona un rango válido.");
      showToast("Selecciona un rango válido", "info");
      return;
    }
    const from = parseYmd(fromDate);
    const to = parseYmd(toDate);
    if (!from || !to) {
      setRangeError("Formato inválido. Usa YYYY-MM-DD.");
      showToast("Formato de fecha inválido (YYYY-MM-DD)", "error");
      return;
    }
    if (from > to) {
      setRangeError("La fecha de inicio no puede ser mayor.");
      showToast("La fecha de inicio no puede ser mayor", "error");
      return;
    }
    const today = new Date();
    if (to > today) {
      setRangeError("La fecha final no puede ser futura.");
      showToast("La fecha final no puede ser futura", "error");
      return;
    }
    const diffMs = to.getTime() - from.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays > 90) {
      setRangeError("El rango máximo es de 90 días.");
      showToast("El rango máximo es de 90 días", "error");
      return;
    }
    setRangeError(null);

    setIsRangeSyncing(true);
    try {
      await AccountService.syncEmailHistory(accountId, {
        fromDate,
        toDate,
      });
      showToast("Sincronización en curso", "success");
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message || error?.response?.data?.error;
      showToast(
        apiMessage ? String(apiMessage) : "No pudimos iniciar la sincronización",
        "error",
      );
    } finally {
      setIsRangeSyncing(false);
    }
  };

  return (
    <>
      <MainLayout noPadding>
        <YStack
          flex={1}
          backgroundColor={pastel.page}
          paddingTop={insets.top + 10}
          paddingHorizontal="$4"
          paddingBottom="$6"
          space="$4"
        >
          <XStack alignItems="center" space="$3">
            <GoBackButton
              onPress={() => navigation.goBack()}
              backgroundColor={pastel.surface}
              borderColor={pastel.border}
              iconColor={pastel.ink}
              borderRadius={SECTION_RADIUS}
            />
            <Text fontSize="$6" fontWeight="900" color={pastel.ink}>
              Detalle de cuenta
            </Text>
          </XStack>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            <YStack space="$4">
              <YStack
                backgroundColor={pastel.cardBlue}
                borderRadius={SECTION_RADIUS}
                borderWidth={1}
                borderColor={pastel.cardBlueBorder}
                padding="$4"
                space="$2"
              >
                <Text fontSize="$5" fontWeight="800" color={pastel.ink}>
                  {account.name}
                </Text>
                <Text fontSize="$3" color={pastel.muted}>
                  {account.institution || "Sin banco"} · {account.currency}
                </Text>
                {account.last4 && (
                  <Text fontSize="$3" color={pastel.muted}>
                    Terminación {account.last4}
                  </Text>
                )}
              </YStack>

              <XStack space="$2" flexWrap="wrap" rowGap="$2">
                <XStack
                  backgroundColor={statusPill.bg}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius={CHIP_RADIUS}
                  borderWidth={1}
                  borderColor={statusPill.border}
                  alignItems="center"
                  space="$1.5"
                >
                  <StatusBadgeIcon status={displayStatus} color={statusPill.text} />
                  <Text fontWeight="700" color={statusPill.text}>
                    {displayStatus}
                  </Text>
                </XStack>
                <XStack
                  backgroundColor={methodPill.bg}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius={CHIP_RADIUS}
                  borderWidth={1}
                  borderColor={methodPill.border}
                  alignItems="center"
                  space="$1.5"
                >
                  {isSyncedLabel && (
                    <RulesBadgeIcon color={methodPill.text} />
                  )}
                  <Text fontWeight="700" color={methodPill.text}>
                    {methodLabel}
                  </Text>
                </XStack>
                {showInboundPill && (
                  <XStack
                    backgroundColor={alertPill.bg}
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius={CHIP_RADIUS}
                    borderWidth={1}
                    borderColor={alertPill.border}
                    alignItems="center"
                    space="$1.5"
                  >
                    <AlertBadgeIcon color={alertPill.text} />
                    <Text fontWeight="700" color={alertPill.text}>
                      Alertas
                    </Text>
                  </XStack>
                )}
              </XStack>

              {!isCashAccount && (
                <YStack
                  backgroundColor={pastel.cardLilac}
                  borderRadius={SECTION_RADIUS}
                  borderWidth={1}
                  borderColor={pastel.cardLilacBorder}
                  padding="$4"
                  space="$3"
                >
                  <XStack alignItems="center" justifyContent="space-between" space="$3">
                    <XStack alignItems="center" space="$3">
                      <Circle
                        size={32}
                        backgroundColor={pastel.lilacIconBg}
                        borderWidth={1}
                        borderColor={pastel.cardLilacBorder}
                      >
                        <RulesBadgeIcon size={16} color={pastel.lilacIcon} />
                      </Circle>
                      <Text fontSize="$4" fontWeight="800" color={pastel.ink}>
                        Reglas bancarias
                      </Text>
                    </XStack>
                    <WouButton
                      label={showRules ? "Ocultar" : "Ver"}
                      variant="soft"
                      tone="pastel"
                      size="sm"
                      borderRadius={BUTTON_RADIUS}
                      onPress={() => setShowRules((prev) => !prev)}
                    />
                  </XStack>
                  {ruleSourceId ? (
                    <Text fontSize="$2" color={pastel.muted}>
                      {`Fuente: ${ruleSourceId}`}
                    </Text>
                  ) : null}
                  {!account.institution && (
                    <Text fontSize="$2" color={pastel.muted}>
                      Esta cuenta no tiene institución definida. Edítala para
                      mostrar reglas correctas.
                    </Text>
                  )}
                  {!ruleSourceId && account.institution && (
                    <Text fontSize="$2" color={pastel.muted}>
                      Conecta Gmail/Google en Integraciones para activar reglas.
                    </Text>
                  )}
                  {showRules && isRulesLoading ? (
                    <XStack justifyContent="center">
                      <Spinner size="small" color={pastel.accent} />
                    </XStack>
                  ) : showRules && dedupedRules.length === 0 ? (
                    <Text fontSize="$3" color={pastel.muted}>
                      {account.institution
                        ? `No encontramos reglas para ${account.institution}.`
                        : "No encontramos reglas disponibles."}
                    </Text>
                  ) : showRules ? (
                    <YStack space="$2">
                      {dedupedRules.map((rule) => {
                        const ruleId = getRuleId(rule);
                        if (!ruleId) return null;
                        const isAttached = attachedRuleIds.includes(ruleId);
                        const ruleIconColor = isAttached
                          ? pastel.lilacIcon
                          : pastel.muted;
                        const updateKey = ruleSourceId
                          ? `${ruleSourceId}:${ruleId}`
                          : ruleId;
                        return (
                          <XStack
                            key={ruleId}
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={pastel.surface}
                            padding="$3"
                            borderRadius={ITEM_RADIUS}
                            borderWidth={1}
                            borderColor={pastel.surfaceBorder}
                            borderLeftWidth={3}
                            borderLeftColor={
                              isAttached
                                ? pastel.pill.synced.border
                                : pastel.cardLilacBorder
                            }
                            height={RULE_CARD_HEIGHT}
                            space="$3"
                          >
                            <YStack flex={1} space="$1" justifyContent="center">
                              <Text
                                fontWeight="700"
                                fontSize="$3"
                                lineHeight={20}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {getRuleName(rule)}
                              </Text>
                              {getRuleInstitution(rule) && (
                                <Text
                                  fontSize="$2"
                                  color={pastel.muted}
                                  numberOfLines={1}
                                >
                                  {getRuleInstitution(rule)}
                                </Text>
                              )}
                            </YStack>
                            <WouButton
                              size="sm"
                              minWidth={90}
                              borderRadius={BUTTON_RADIUS}
                              icon={
                                isAttached ? (
                                  <Check size={14} color={ruleIconColor} />
                                ) : (
                                  <Plus size={14} color={ruleIconColor} />
                                )
                              }
                              variant={isAttached ? "soft" : "solid"}
                              tone={isAttached ? "success" : "pastel"}
                              label={isAttached ? "Activa" : "Seleccionar"}
                              onPress={() =>
                                handleToggleRule(
                                  ruleSourceId,
                                  ruleId,
                                  isAttached,
                                  setAttachedRuleIds,
                                )
                              }
                              disabled={
                                isRuleUpdating === updateKey ||
                                !account.institution ||
                                !ruleSourceId ||
                                !isPro
                              }
                            />
                          </XStack>
                        );
                      })}
                    </YStack>
                  ) : null}
                </YStack>
              )}

              {!isCashAccount && (
                <YStack
                  backgroundColor={pastel.cardMint}
                  borderRadius={SECTION_RADIUS}
                  borderWidth={1}
                  borderColor={pastel.cardMintBorder}
                  padding="$4"
                  space="$3"
                >
                  <XStack alignItems="center" justifyContent="space-between" space="$3">
                    <XStack alignItems="center" space="$3">
                      <Circle
                        size={32}
                        backgroundColor={pastel.mintIconBg}
                        borderWidth={1}
                        borderColor={pastel.cardMintBorder}
                      >
                        <AlertBadgeIcon size={16} color={pastel.mintIcon} />
                      </Circle>
                      <Text fontSize="$4" fontWeight="800" color={pastel.ink}>
                        Reglas de alertas
                      </Text>
                    </XStack>
                    <WouButton
                      label={showInboundRules ? "Ocultar" : "Ver"}
                      variant="soft"
                      tone="pastel"
                      size="sm"
                      borderRadius={BUTTON_RADIUS}
                      onPress={() => setShowInboundRules((prev) => !prev)}
                    />
                  </XStack>
                  {inboundSourceId ? (
                    <Text fontSize="$2" color={pastel.muted}>
                      {`Fuente: ${inboundSourceId}`}
                    </Text>
                  ) : null}
                  {!account.institution && (
                    <Text fontSize="$2" color={pastel.muted}>
                      Esta cuenta no tiene institución definida. Edítala para
                      mostrar reglas correctas.
                    </Text>
                  )}
                  {!inboundSourceId && account.institution && (
                    <Text fontSize="$2" color={pastel.muted}>
                      Activa Email Notification en Integraciones para gestionar
                      alertas.
                    </Text>
                  )}
                  {showInboundRules && isRulesLoading ? (
                    <XStack justifyContent="center">
                      <Spinner size="small" color={pastel.accent} />
                    </XStack>
                  ) : showInboundRules && inboundSourceId && dedupedRules.length === 0 ? (
                    <Text fontSize="$3" color={pastel.muted}>
                      {account.institution
                        ? `No encontramos reglas para ${account.institution}.`
                        : "No encontramos reglas disponibles."}
                    </Text>
                  ) : showInboundRules && inboundSourceId ? (
                    <YStack space="$2">
                      {dedupedRules.map((rule) => {
                        const ruleId = getRuleId(rule);
                        if (!ruleId) return null;
                        const isAttached = inboundAttachedRuleIds.includes(ruleId);
                        const ruleIconColor = isAttached
                          ? pastel.mintIcon
                          : pastel.muted;
                        const updateKey = inboundSourceId
                          ? `${inboundSourceId}:${ruleId}`
                          : ruleId;
                        return (
                          <XStack
                            key={`${ruleId}-inbound`}
                            justifyContent="space-between"
                            alignItems="center"
                            backgroundColor={pastel.surface}
                            padding="$3"
                            borderRadius={ITEM_RADIUS}
                            borderWidth={1}
                            borderColor={pastel.surfaceBorder}
                            borderLeftWidth={3}
                            borderLeftColor={
                              isAttached
                                ? pastel.pill.alert.border
                                : pastel.cardMintBorder
                            }
                            height={RULE_CARD_HEIGHT}
                            space="$3"
                          >
                            <YStack flex={1} space="$1" justifyContent="center">
                              <Text
                                fontWeight="700"
                                fontSize="$3"
                                lineHeight={20}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                              >
                                {getRuleName(rule)}
                              </Text>
                              {getRuleInstitution(rule) && (
                                <Text
                                  fontSize="$2"
                                  color={pastel.muted}
                                  numberOfLines={1}
                                >
                                  {getRuleInstitution(rule)}
                                </Text>
                              )}
                            </YStack>
                            <WouButton
                              size="sm"
                              minWidth={90}
                              borderRadius={BUTTON_RADIUS}
                              icon={
                                isAttached ? (
                                  <Check size={14} color={ruleIconColor} />
                                ) : (
                                  <Plus size={14} color={ruleIconColor} />
                                )
                              }
                              variant={isAttached ? "soft" : "solid"}
                              tone={isAttached ? "success" : "pastel"}
                              label={isAttached ? "Activa" : "Seleccionar"}
                              onPress={() =>
                                handleToggleRule(
                                  inboundSourceId,
                                  ruleId,
                                  isAttached,
                                  setInboundAttachedRuleIds,
                                )
                              }
                              disabled={
                                isRuleUpdating === updateKey ||
                                !account.institution ||
                                !inboundSourceId ||
                                !isPro
                              }
                            />
                          </XStack>
                        );
                      })}
                    </YStack>
                  ) : null}
                </YStack>
              )}

              {canShowRangeSync && (
                <YStack
                  backgroundColor={pastel.cardPeach}
                  borderRadius={SECTION_RADIUS}
                  borderWidth={1}
                  borderColor={pastel.cardPeachBorder}
                  padding="$4"
                  space="$3"
                >
                  <XStack alignItems="center" space="$3">
                    <Circle
                      size={34}
                      backgroundColor={pastel.peachIconBg}
                      borderWidth={1}
                      borderColor={pastel.cardPeachBorder}
                    >
                      <Calendar size={18} color={pastel.peachIcon} />
                    </Circle>
                    <YStack flex={1} space="$1">
                      <Text fontSize="$4" fontWeight="800" color={pastel.ink}>
                        Sincronizar por período
                      </Text>
                      <Text fontSize="$2" color={pastel.muted}>
                        Elige un rango para traer movimientos.
                      </Text>
                    </YStack>
                    <XStack
                      paddingHorizontal="$3"
                      paddingVertical="$1"
                      borderRadius={CHIP_RADIUS}
                      backgroundColor={pastel.surface}
                      borderWidth={1}
                      borderColor={pastel.surfaceBorder}
                    >
                      <Text fontSize="$2" color={pastel.muted} fontWeight="700">
                        Máx 90 días
                      </Text>
                    </XStack>
                  </XStack>

                  {!canEmailHistorySync && (
                    <Text fontSize="$3" color={pastel.muted}>
                      Disponible solo para Gmail/Google. Cambia el método o
                      reinicia el setup para habilitarlo.
                    </Text>
                  )}

                  <YStack
                    backgroundColor={pastel.surface}
                    borderRadius={ITEM_RADIUS}
                    borderWidth={1}
                    borderColor={pastel.surfaceBorder}
                    padding="$3"
                    space="$2"
                  >
                    <Text fontSize="$3" fontWeight="700" color={pastel.ink}>
                      Rango rápido
                    </Text>
                    <XStack space="$2" flexWrap="wrap" rowGap="$2">
                      {[30, 60, 90].map((days) => {
                        const isSelected = presetDays === days;
                        return (
                          <WouButton
                            key={days}
                            size="sm"
                            variant={isSelected ? "solid" : "soft"}
                            tone="pastel"
                            borderRadius={BUTTON_RADIUS}
                            label={`Últimos ${days} días`}
                            onPress={() => setQuickRange(days)}
                            disabled={!canEmailHistorySync}
                            disableAnimation={true}
                            pressStyle={{ opacity: 0.96 }}
                            shadowColor="transparent"
                            shadowOpacity={0}
                            shadowRadius={0}
                            elevation={0}
                          />
                        );
                      })}
                    </XStack>
                  </YStack>

                  <YStack
                    backgroundColor={pastel.surface}
                    borderRadius={ITEM_RADIUS}
                    borderWidth={1}
                    borderColor={pastel.surfaceBorder}
                    padding="$3"
                    space="$2"
                  >
                    <Text fontSize="$3" fontWeight="700" color={pastel.ink}>
                      Rango personalizado
                    </Text>
                    <XStack space="$2">
                      <YStack flex={1} space="$1">
                        <Text fontSize="$2" color={pastel.muted}>
                          Desde
                        </Text>
                        <Input
                          placeholder="YYYY-MM-DD"
                          value={fromDate}
                          onChangeText={(value) => {
                            setFromDate(value);
                            setRangeError(null);
                          }}
                          backgroundColor={pastel.inputBg}
                          color={pastel.inputText}
                          placeholderTextColor={pastel.inputPlaceholder}
                          borderWidth={1}
                          borderColor={pastel.surfaceBorder}
                          borderRadius={INPUT_RADIUS}
                          editable={canEmailHistorySync}
                        />
                      </YStack>
                      <YStack flex={1} space="$1">
                        <Text fontSize="$2" color={pastel.muted}>
                          Hasta
                        </Text>
                        <Input
                          placeholder="YYYY-MM-DD"
                          value={toDate}
                          onChangeText={(value) => {
                            setToDate(value);
                            setRangeError(null);
                          }}
                          backgroundColor={pastel.inputBg}
                          color={pastel.inputText}
                          placeholderTextColor={pastel.inputPlaceholder}
                          borderWidth={1}
                          borderColor={pastel.surfaceBorder}
                          borderRadius={INPUT_RADIUS}
                          editable={canEmailHistorySync}
                        />
                      </YStack>
                    </XStack>
                    {rangeError && (
                      <Text fontSize="$2" color="$red10">
                        {rangeError}
                      </Text>
                    )}
                  </YStack>

                  <WouButton
                    label="Sincronizar rango"
                    variant="solid"
                    tone="pastel"
                    size="md"
                    borderRadius={BUTTON_RADIUS}
                    onPress={handleRangeSync}
                    isLoading={isRangeSyncing}
                    loadingLabel="Sincronizando..."
                    disabled={isRangeSyncing || !isPro || !canEmailHistorySync}
                  />

                  {!isPro && (
                    <Text fontSize="$2" color={pastel.muted}>
                      Esta acción requiere Wou+.
                    </Text>
                  )}

                  <YStack space="$1">
                    {isRangeSyncing && (
                      <XStack alignItems="center" space="$2">
                        <WouLoader size={5} color={pastel.ink} />
                        <Text fontSize="$2" color={pastel.muted}>
                          Sincronización en curso...
                        </Text>
                      </XStack>
                    )}
                    {!isRangeSyncing && lastSyncedLabel && (
                      <Text fontSize="$2" color={pastel.muted}>
                        Última sincronización: {lastSyncedLabel}
                      </Text>
                    )}
                    {!isRangeSyncing && !lastSyncedLabel && firstSyncedLabel && (
                      <Text fontSize="$2" color={pastel.muted}>
                        Primer sync completado: {firstSyncedLabel}
                      </Text>
                    )}
                    {!isRangeSyncing && !firstSyncedLabel && (
                      <Text fontSize="$2" color={pastel.muted}>
                        Sincronización pendiente.
                      </Text>
                    )}
                  </YStack>
                </YStack>
              )}
            </YStack>
          </ScrollView>
        </YStack>
      </MainLayout>

    </>
  );
}
