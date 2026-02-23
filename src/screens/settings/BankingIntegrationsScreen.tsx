import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  Input,
  Separator,
  Spinner,
  ScrollView,
  useThemeName,
} from "tamagui";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Link2Off, Link2 } from "@tamagui/lucide-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { AppState, Image, Linking } from "react-native";
import { BankingActions } from "../../actions/bankingActions";
import { useToastStore } from "../../stores/useToastStore";
import { useUserStore } from "../../stores/useUserStore";

type Provider = "GMAIL" | "GOOGLE";
type ProviderKey = Provider | "OUTLOOK";

const normalizeProvider = (value?: string | null) =>
  (value || "").toString().toUpperCase();

const isConnectedStatus = (value?: string | null) => {
  const status = (value || "").toString().toLowerCase();
  return ["connected", "ready", "linked", "success", "authorized"].includes(
    status,
  );
};

const PROVIDER_THEMES: Record<
  ProviderKey,
  {
    accent: string;
    soft: string;
    badgeBg: string;
    badgeText: string;
    letter: string;
    logo: string;
  }
> = {
  GMAIL: {
    accent: "#EA4335",
    soft: "#FFF3F1",
    badgeBg: "#FDE8E6",
    badgeText: "#C81E1E",
    letter: "G",
    logo: "https://img.icons8.com/color/48/gmail-new.png",
  },
  GOOGLE: {
    accent: "#1A73E8",
    soft: "#F1F6FF",
    badgeBg: "#E8F0FE",
    badgeText: "#1A73E8",
    letter: "GW",
    logo: "https://img.icons8.com/color/48/google-logo.png",
  },
  OUTLOOK: {
    accent: "#6D5BD0",
    soft: "#F5F2FF",
    badgeBg: "#EDE8FF",
    badgeText: "#4C3AAE",
    letter: "O",
    logo: "https://img.icons8.com/color/48/microsoft-outlook-2019.png",
  },
};

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  if ([r, g, b].some((val) => Number.isNaN(val))) return hex;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const getProviderTheme = (provider: ProviderKey, isDark: boolean) => {
  const base = PROVIDER_THEMES[provider];
  if (!isDark) return base;
  return {
    ...base,
    soft: hexToRgba(base.accent, 0.16),
    badgeBg: hexToRgba(base.accent, 0.28),
    badgeText: base.accent,
  };
};

const normalizeEmail = (value?: string | null) =>
  (value || "").toString().trim().toLowerCase();

const isGmailAddress = (email?: string | null) => {
  const value = normalizeEmail(email);
  return value.endsWith("@gmail.com") || value.endsWith("@googlemail.com");
};

const getApiErrorMessage = (error: any) => {
  const data = error?.response?.data;
  const message = data?.message || data?.error || error?.message;
  if (Array.isArray(message)) return message.join(", ");
  return message ? String(message) : "";
};

const getSourceProvider = (source?: any) =>
  normalizeProvider(
    source?.provider ||
      source?.emailProvider ||
      source?.oauthProvider ||
      source?.config?.provider ||
      source?.config?.emailProvider ||
      source?.config?.oauthProvider,
  );

const getSourceEmail = (source?: any) =>
  normalizeEmail(
    source?.email || source?.config?.email || source?.accountEmail,
  );

export default function BankingIntegrationsScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { showToast } = useToastStore();
  const user = useUserStore((state) => state.user);
  const themeName = useThemeName();
  const isDark = themeName.startsWith("dark");

  const [sources, setSources] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState<Provider | null>(null);
  const [pendingProvider, setPendingProvider] = useState<Provider | null>(null);
  const [gmailEmail, setGmailEmail] = useState(user?.email || "");
  const [googleEmail, setGoogleEmail] = useState(user?.email || "");

  const getProviderSourceFromList = useCallback(
    (provider: Provider, list: any[]) => {
      return list.find((source) => {
        if (source?.type && source.type !== "EMAIL_API") return false;
        const status = getSourceStatus(source);
        if (status === "deleted") return false;

        const sourceProvider = getSourceProvider(source);
        if (sourceProvider === provider) {
          return true;
        }

        const sourceEmail = getSourceEmail(source);
        if (!sourceEmail) return false;

        if (sourceProvider === "GOOGLE" || sourceProvider === "GMAIL") {
          return provider === "GMAIL"
            ? isGmailAddress(sourceEmail)
            : !isGmailAddress(sourceEmail);
        }

        return false;
      });
    },
    [],
  );

  const isProviderConnectedFromList = useCallback(
    (provider: Provider, list: any[]) => {
      const source = getProviderSourceFromList(provider, list);
      if (!source) return false;
      if (source?.connected === true || source?.isConnected === true)
        return true;
      if (source?.connectedAt || source?.oauthConnectedAt) return true;
      if (source?.config?.connectedAt || source?.config?.oauthConnectedAt) {
        return true;
      }
      if (source?.oauthStatus?.toString().toLowerCase() === "connected") {
        return true;
      }
      if (
        source?.config?.oauthStatus &&
        source?.config?.oauthStatus.toString().toLowerCase() === "connected"
      ) {
        return true;
      }
      const status = getSourceStatus(source);
      if (status === "active") return true;
      return isConnectedStatus(source?.status || source?.state);
    },
    [getProviderSourceFromList],
  );

  const loadSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await BankingActions.listSources();
      const list = Array.isArray(data) ? data : data?.data || [];
      console.log("BankingIntegrations.loadSources", {
        raw: data,
        normalizedCount: list.length,
        normalized: list,
        summary: list.map((source) => ({
          id: source?.id,
          type: source?.type,
          status: getSourceStatus(source),
          provider: getSourceProvider(source),
          email: getSourceEmail(source),
          oauthStatus: source?.config?.oauthStatus || source?.oauthStatus,
          connectedAt:
            source?.config?.oauthConnectedAt ||
            source?.oauthConnectedAt ||
            source?.config?.connectedAt ||
            source?.connectedAt,
        })),
      });
      setSources(list);
      if (pendingProvider) {
        const connectedNow = isProviderConnectedFromList(pendingProvider, list);
        if (connectedNow) {
          showToast("Conexión completada", "success");
          setPendingProvider(null);
        }
      }
    } catch (error) {
      console.error("Error cargando sources", error);
      showToast("No se pudieron cargar las integraciones", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isProviderConnectedFromList, pendingProvider, showToast]);

  useFocusEffect(
    useCallback(() => {
      loadSources();
    }, [loadSources]),
  );

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      const wasBackground =
        appState.current === "background" || appState.current === "inactive";
      if (wasBackground && nextState === "active") {
        loadSources();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [loadSources]);

  const getProviderSource = (provider: Provider) =>
    getProviderSourceFromList(provider, sources);

  const isProviderConnected = (provider: Provider) =>
    isProviderConnectedFromList(provider, sources);

  const getSourceStatus = (source?: any) =>
    (source?.status || source?.state || "").toString().toLowerCase();

  const isSourceInactive = (source?: any) => {
    const status = getSourceStatus(source);
    return Boolean(status) && status !== "active";
  };

  const handleConnect = async (provider: Provider) => {
    setIsConnecting(provider);
    try {
      let source = getProviderSource(provider);
      const email = provider === "GMAIL" ? gmailEmail : googleEmail;
      console.log("BankingIntegrations.handleConnect:start", {
        provider,
        email,
        sourceBefore: source,
      });

      if (!email) {
        showToast("Ingresa tu correo para conectar", "info");
        setIsConnecting(null);
        return;
      }

      if (!source || isSourceInactive(source)) {
        if (source && isSourceInactive(source)) {
          showToast("Fuente inactiva, regenerando…", "info");
        }
        source = await BankingActions.createEmailApi({
          email,
          provider,
          initialSyncMonths: 3,
          syncFrequencyMinutes: 60,
        });
        console.log("BankingIntegrations.createEmailApi:response", {
          provider,
          email,
          source,
        });
      }

      if (!source?.id) {
        showToast("No se pudo crear la fuente", "error");
        setIsConnecting(null);
        return;
      }

      const response = await BankingActions.connect(source.id);
      console.log("BankingIntegrations.connect:response", {
        provider,
        sourceId: source.id,
        response,
      });
      const url =
        response?.authUrl ||
        response?.url ||
        response?.redirectUrl ||
        response?.authUrl ||
        response?.authorizationUrl;

      if (url) {
        await Linking.openURL(url);
        setPendingProvider(provider);
        showToast("Completa la conexión y vuelve a la app", "info");
      } else {
        showToast("Conexión iniciada", "success");
      }

      await loadSources();
    } catch (error) {
      const apiMessage = getApiErrorMessage(error);
      console.error("Error conectando provider", {
        error,
        status: error?.response?.status,
        data: error?.response?.data,
      });
      showToast(apiMessage || "No se pudo iniciar la conexión", "error");
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (provider: Provider) => {
    const source = getProviderSource(provider);
    if (!source?.id) return;
    try {
      await BankingActions.removeSource(source.id);
      showToast("Conexión removida", "success");
      await loadSources();
    } catch (error) {
      console.error("Error removiendo source", error);
      showToast("No se pudo desconectar", "error");
    }
  };

  const renderProviderCard = (
    provider: Provider,
    label: string,
    description: string,
    emailValue: string,
    onEmailChange: (val: string) => void,
  ) => {
    const theme = getProviderTheme(provider, isDark);
    const connected = isProviderConnected(provider);
    const isBusy = isConnecting === provider;
    const primaryBackground = theme.accent;
    const primaryIcon = <Link2 size={16} color="white" />;
    const inputBackground = isDark ? "$gray2" : "$white";
    const inputBorder = isDark
      ? hexToRgba(theme.accent, 0.4)
      : theme.badgeBg;

    return (
      <Card
        bordered
        padding="$5"
        borderColor={theme.accent}
        backgroundColor={theme.soft}
        borderRadius="$10"
        elevation={2}
        marginBottom="$4"
      >
        <XStack alignItems="center" space="$3">
          <YStack
            width={44}
            height={44}
            borderRadius="$6"
            backgroundColor={isDark ? "$gray2" : "$white"}
            alignItems="center"
            justifyContent="center"
          >
            <Image
              source={{ uri: theme.logo }}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
          </YStack>
          <YStack flex={1}>
            <Text fontWeight="800" fontSize="$4">
              {label}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {description}
            </Text>
            <Text fontSize="$2" color="$gray9">
              {provider === "GMAIL"
                ? "Para correos @gmail.com"
                : "Para dominios corporativos"}
            </Text>
          </YStack>
          {connected ? (
            <YStack
              backgroundColor={theme.badgeBg}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$4"
            >
              <Text fontSize="$2" color={theme.badgeText} fontWeight="700">
                Conectado
              </Text>
            </YStack>
          ) : (
            <YStack
              backgroundColor="$gray2"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$4"
            >
              <Text fontSize="$2" color="$gray9">
                No conectado
              </Text>
            </YStack>
          )}
        </XStack>

        <Separator marginVertical="$4" />

        <YStack space="$2" marginBottom="$3">
          <Text fontSize="$3" color="$gray10">
            Email de conexión
          </Text>
          <Input
            placeholder="tu@email.com"
            value={emailValue}
            onChangeText={onEmailChange}
            backgroundColor={inputBackground}
            borderWidth={1}
            borderColor={inputBorder}
            borderRadius="$6"
          />
        </YStack>

        <YStack space="$2">
          <Button
            size="$5"
            width="100%"
            backgroundColor={primaryBackground}
            color="white"
            onPress={() => handleConnect(provider)}
            disabled={isBusy}
            opacity={isBusy ? 0.7 : 1}
            icon={primaryIcon}
            borderRadius="$10"
          >
            {connected ? "Reconectar" : "Conectar"}
          </Button>
          {connected && (
            <Button
              size="$5"
              width="100%"
              backgroundColor="$red2"
              borderColor="$red4"
              borderWidth={1}
              color="$red10"
              onPress={() => handleDisconnect(provider)}
              icon={<Link2Off size={16} color="$red10" />}
              borderRadius="$10"
              disabled={isBusy}
              opacity={isBusy ? 0.7 : 1}
            >
              Desconectar
            </Button>
          )}
        </YStack>
      </Card>
    );
  };

  const renderComingSoonCard = (
    label: string,
    description: string,
    note: string,
  ) => {
    const theme = getProviderTheme("OUTLOOK", isDark);

    return (
      <Card
        bordered
        padding="$5"
        borderColor={theme.accent}
        backgroundColor={theme.soft}
        borderRadius="$10"
        elevation={1}
      >
        <XStack alignItems="center" space="$3">
          <YStack
            width={44}
            height={44}
            borderRadius="$6"
            backgroundColor={theme.accent}
            alignItems="center"
            justifyContent="center"
            opacity={0.6}
          >
            <Image
              source={{ uri: theme.logo }}
              style={{ width: 24, height: 24, resizeMode: "contain" }}
            />
          </YStack>
          <YStack flex={1}>
            <Text fontWeight="800" fontSize="$4">
              {label}
            </Text>
            <Text fontSize="$3" color="$gray10">
              {description}
            </Text>
          </YStack>
          <Text fontSize="$2" color="$gray9">
            Próximamente
          </Text>
        </XStack>

        <Separator marginVertical="$4" />

        <Text fontSize="$3" color="$gray9" marginBottom="$3">
          {note}
        </Text>

        <Button
          size="$5"
          width="100%"
          backgroundColor="$gray3"
          color="$gray9"
          borderRadius="$10"
          disabled
        >
          No disponible aún
        </Button>
      </Card>
    );
  };

  return (
    <YStack flex={1} backgroundColor="$background">
      <YStack
        paddingTop={insets.top + 10}
        paddingHorizontal="$4"
        marginBottom="$4"
      >
        <Button
          unstyled
          icon={ChevronLeft}
          color="$color"
          onPress={() => navigation.goBack()}
          marginBottom="$2"
          alignSelf="flex-start"
        />
        <Text fontSize="$8" fontWeight="900" color="$color">
          Integraciones
        </Text>
        <Text fontSize="$3" color="$gray10">
          Conecta tu correo una sola vez y luego configura reglas por cuenta.
        </Text>
      </YStack>

      <ScrollView
        flex={1}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 4,
          paddingBottom: insets.bottom + 32,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <YStack space="$5">
          {isLoading ? (
            <XStack justifyContent="center" padding="$6">
              <Spinner size="large" color="$brand" />
            </XStack>
          ) : (
            <>
              {renderProviderCard(
                "GMAIL",
                "Gmail",
                "Conexión global para importar movimientos.",
                gmailEmail,
                setGmailEmail,
              )}
              {renderProviderCard(
                "GOOGLE",
                "Google Workspace",
                "Conexión global para importar movimientos.",
                googleEmail,
                setGoogleEmail,
              )}
              {renderComingSoonCard(
                "Outlook",
                "Conexión global para importar movimientos.",
                "Necesita soporte en backend para habilitar Outlook.",
              )}
            </>
          )}
        </YStack>
      </ScrollView>
    </YStack>
  );
}
