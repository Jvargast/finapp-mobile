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
import { BankingPublicActions } from "../../actions/bankingPublicActions";
import { useToastStore } from "../../stores/useToastStore";
import { useUserStore } from "../../stores/useUserStore";
import { DisplayHeading } from "../../components/ui/DisplayHeading";

type Provider = "GMAIL" | "GOOGLE";
type ProviderKey = Provider | "OUTLOOK";
type PendingOAuthContext = {
  provider: Provider;
  sourceId: string;
  redirectUri?: string;
};

const normalizeProvider = (value?: string | null) =>
  (value || "").toString().toUpperCase();

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

const hasIssValidationError = (error: any) => {
  const data = error?.response?.data;
  const messages: string[] = [];
  if (Array.isArray(data?.message)) {
    messages.push(...data.message.map((item: any) => String(item)));
  } else if (data?.message) {
    messages.push(String(data.message));
  }
  if (data?.error) messages.push(String(data.error));
  if (error?.message) messages.push(String(error.message));

  return messages.some((message) =>
    message.toLowerCase().includes("iss should not exist"),
  );
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

const hasOAuthConnectedState = (source?: any) => {
  if (!source) return false;
  if (source?.connected === true || source?.isConnected === true) return true;
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
  return false;
};

const getUrlParam = (url?: string | null, key?: string) => {
  if (!url || !key) return null;
  const queryIndex = url.indexOf("?");
  if (queryIndex === -1) return null;
  const query = url.slice(queryIndex + 1).split("#")[0];
  const params = new URLSearchParams(query);
  return params.get(key);
};

const parseOAuthReturnUrl = (url?: string | null) => ({
  code: getUrlParam(url, "code"),
  state: getUrlParam(url, "state"),
  error: getUrlParam(url, "error"),
  errorDescription: getUrlParam(url, "error_description"),
  sourceId: getUrlParam(url, "sourceId") || getUrlParam(url, "source_id"),
});

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
  const [pendingOAuth, setPendingOAuth] =
    useState<PendingOAuthContext | null>(null);
  const [gmailEmail, setGmailEmail] = useState(user?.email || "");
  const [googleEmail, setGoogleEmail] = useState(user?.email || "");
  const hasCheckedInitialUrlRef = useRef(false);
  const oauthCallbackInFlightRef = useRef(false);

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
      return hasOAuthConnectedState(source);
    },
    [getProviderSourceFromList],
  );

  const loadSources = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await BankingActions.listSources();
      const list = Array.isArray(data) ? data : data?.data || [];
      const activeList = list.filter(
        (source: any) => getSourceStatus(source) !== "deleted",
      );

      if (__DEV__) {
        console.log("BankingIntegrations.loadSources", {
          total: list.length,
          activeCount: activeList.length,
          summary: activeList.map((source: any) => ({
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
      }

      setSources(activeList);
      if (pendingProvider) {
        const connectedNow = isProviderConnectedFromList(
          pendingProvider,
          activeList,
        );
        if (connectedNow) {
          showToast("Conexión completada", "success");
          setPendingProvider(null);
          setPendingOAuth((current) =>
            current?.provider === pendingProvider ? null : current,
          );
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

  const beginOAuthFlow = useCallback(
    async (provider: Provider, sourceId: string) => {
      const response = await BankingActions.connect(sourceId);
      console.log("BankingIntegrations.connect:response", {
        provider,
        sourceId,
        response,
      });
      const url =
        response?.authUrl ||
        response?.url ||
        response?.redirectUrl ||
        response?.authUrl ||
        response?.authorizationUrl;
      const responseRedirectUri =
        response?.redirectUri ||
        response?.redirect_uri ||
        response?.oauth?.redirectUri ||
        response?.oauth?.redirect_uri ||
        getUrlParam(url, "redirect_uri") ||
        getUrlParam(url, "redirectUri") ||
        undefined;
      const decodedUrl = url ? decodeURIComponent(url) : "";
      const responseType = (getUrlParam(url, "response_type") || "")
        .toLowerCase()
        .split(" ")
        .filter(Boolean);
      const hasIdTokenOnlyResponse =
        responseType.length > 0 &&
        responseType.includes("id_token") &&
        !responseType.includes("code");
      const regexIdTokenOnly =
        /response_type=([^&]*(?:id_token)[^&]*)/i.test(decodedUrl) &&
        !/response_type=([^&]*(?:code)[^&]*)/i.test(decodedUrl);

      if (url && (hasIdTokenOnlyResponse || regexIdTokenOnly)) {
        console.error("OAuth response_type inválido", {
          provider,
          sourceId,
          responseType,
          url,
        });
        showToast("OAuth mal configurado: debe usar authorization code", "error");
        return false;
      }

      setPendingOAuth({
        provider,
        sourceId,
        redirectUri: responseRedirectUri,
      });

      if (url) {
        await Linking.openURL(url);
        setPendingProvider(provider);
        showToast("Completa la conexión y vuelve a la app", "info");
      } else {
        showToast("Conexión iniciada", "success");
      }

      return true;
    },
    [showToast],
  );

  const shouldRecreateSource = (
    source: any,
    provider: Provider,
    email: string,
  ) => {
    if (!source) return true;
    if (isSourceInactive(source)) return true;

    const sourceProvider = getSourceProvider(source);
    if (sourceProvider && sourceProvider !== provider) {
      return true;
    }

    const sourceEmail = getSourceEmail(source);
    const normalizedInputEmail = normalizeEmail(email);
    if (
      sourceEmail &&
      normalizedInputEmail &&
      sourceEmail !== normalizedInputEmail
    ) {
      return true;
    }

    return false;
  };

  const handleOAuthReturn = useCallback(
    async (url: string) => {
      const {
        code,
        state,
        error,
        errorDescription,
        sourceId: sourceIdFromUrl,
      } =
        parseOAuthReturnUrl(url);

      if (!code && !error) return;
      if (oauthCallbackInFlightRef.current) return;

      if (error) {
        let friendly = "La autorización fue cancelada o falló";
        if (errorDescription) {
          try {
            friendly = decodeURIComponent(errorDescription);
          } catch {
            friendly = String(errorDescription);
          }
        }
        showToast(friendly, "error");
        setPendingProvider(null);
        setPendingOAuth(null);
        return;
      }

      const sourceIdFromPendingProvider =
        pendingProvider && sources.length > 0
          ? getProviderSourceFromList(pendingProvider, sources)?.id
          : null;
      const resolvedSourceId =
        pendingOAuth?.sourceId || sourceIdFromUrl || sourceIdFromPendingProvider;
      console.log("OAuth return parsed", {
        hasCode: Boolean(code),
        codeLength: code ? String(code).length : 0,
        hasState: Boolean(state),
        sourceIdFromUrl,
        sourceIdFromPendingProvider,
        resolvedSourceId,
      });

      if (!resolvedSourceId || !code) {
        showToast("No encontramos la fuente para completar OAuth", "error");
        return;
      }

      oauthCallbackInFlightRef.current = true;
      try {
        console.log("OAuth callback by sourceId", {
          resolvedSourceId,
          hasRedirectUri: Boolean(pendingOAuth?.redirectUri),
        });
        await BankingActions.callback(resolvedSourceId, {
          code,
          redirectUri: pendingOAuth?.redirectUri,
        });
        showToast("Conexión completada", "success");
        setPendingProvider(null);
        setPendingOAuth(null);
        await loadSources();
      } catch (error: any) {
        const apiMessage = getApiErrorMessage(error);
        // Fallback: algunos entornos asocian la fuente por `state` en callback público.
        // Si falla el callback por sourceId, intentamos callback público con code/state.
        if (code) {
          try {
            console.log("OAuth callback public fallback", {
              hasState: Boolean(state),
              hasRedirectUri: Boolean(pendingOAuth?.redirectUri),
            });
            await BankingPublicActions.oauthCallback({
              code,
              state,
              redirectUri: pendingOAuth?.redirectUri,
            });
            showToast("Conexión completada", "success");
            setPendingProvider(null);
            setPendingOAuth(null);
            await loadSources();
            return;
          } catch (publicCallbackError) {
            console.warn("Fallback oauth/callback público falló", {
              publicCallbackError,
            });
          }
        }
        if (hasIssValidationError(error)) {
          showToast(
            "El backend respondió 'iss should not exist' en OAuth callback",
            "error",
          );
        } else {
          showToast(apiMessage || "No se pudo completar OAuth", "error");
        }
      } finally {
        oauthCallbackInFlightRef.current = false;
      }
    },
    [
      beginOAuthFlow,
      gmailEmail,
      googleEmail,
      getProviderSourceFromList,
      loadSources,
      pendingOAuth?.redirectUri,
      pendingOAuth?.provider,
      pendingOAuth?.sourceId,
      pendingProvider,
      showToast,
      sources,
    ],
  );

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

      if (shouldRecreateSource(source, provider, email)) {
        if (source && isSourceInactive(source)) {
          showToast("Fuente inactiva, regenerando…", "info");
        } else if (source) {
          showToast("Usando fuente existente para reconectar…", "info");
        }
        if (!source || isSourceInactive(source)) {
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
      }

      if (!source?.id) {
        showToast("No se pudo crear la fuente", "error");
        setIsConnecting(null);
        return;
      }

      await beginOAuthFlow(provider, source.id);

      await loadSources();
    } catch (error: any) {
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

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      void handleOAuthReturn(url);
    });

    if (!hasCheckedInitialUrlRef.current) {
      hasCheckedInitialUrlRef.current = true;
      Linking.getInitialURL()
        .then((url) => {
          if (url) {
            void handleOAuthReturn(url);
          }
        })
        .catch(() => undefined);
    }

    return () => {
      subscription.remove();
    };
  }, [handleOAuthReturn]);

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
        <DisplayHeading
          fontSize="$8"
          fontWeight="400"
          color="$color"
          lineHeight={36}
        >
          Integraciones
        </DisplayHeading>
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
