import React, { useMemo, useState, useRef } from "react";
import { WebView } from "react-native-webview";
import { YStack, Spinner, Text } from "tamagui";
import {
  StackActions,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { FintocActions } from "../../actions/fintocActions";

const extractExchangeToken = (url: string) => {
  try {
    const query = url.split("?")[1] ?? "";
    const params = new URLSearchParams(query);
    return params.get("exchange_token") || params.get("token") || "";
  } catch {
    return "";
  }
};

export default function FintocWidgetScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { widgetToken } = route.params as { widgetToken: string };

  const FINTOC_PUBLIC_KEY = process.env.EXPO_PUBLIC_FINTOC_PK;

  const webRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(false);

  const widgetUrl = useMemo(() => {
    if (!FINTOC_PUBLIC_KEY || !widgetToken) return "";
    const params = new URLSearchParams({
      public_key: FINTOC_PUBLIC_KEY,
      widget_token: widgetToken,
      _on_event: "true",
    });
    return `https://webview.fintoc.com/widget.html?${params.toString()}`;
  }, [FINTOC_PUBLIC_KEY, widgetToken]);

  const handleNavigation = async (url: string) => {
    if (url.startsWith("fintocwidget://succeeded")) {
      if (finishing) return;

      setFinishing(true);

      const exchangeToken = extractExchangeToken(url);
      console.log("✅ Widget succeeded", { hasExchangeToken: !!exchangeToken });

      try {
        if (exchangeToken) {
          await FintocActions.finishLinking(exchangeToken);
        } else {
          await FintocActions.loadLinks("active");
        }

        navigation.dispatch(StackActions.pop(2));

        return;
      } catch (e) {
        console.error("❌ Error finalizando conexión:", e);
        navigation.goBack();
        return;
      } finally {
        setFinishing(false);
      }
    }

    if (url.startsWith("fintocwidget://exit")) {
      navigation.goBack();
      return;
    }

    if (url.startsWith("fintocwidget://event/")) {
      return;
    }
  };

  if (!widgetUrl) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$6">
        <Text fontSize="$5" fontWeight="800" textAlign="center">
          Falta configuración de Fintoc
        </Text>
        <Text marginTop="$2" color="$gray10" textAlign="center">
          Revisa EXPO_PUBLIC_FINTOC_PK o el widgetToken.
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1}>
      <WebView
        ref={webRef}
        source={{ uri: widgetUrl }}
        javaScriptEnabled
        domStorageEnabled
        javaScriptCanOpenWindowsAutomatically
        setSupportMultipleWindows={false}
        originWhitelist={["*"]}
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(e) => console.error("❌ WebView error:", e.nativeEvent)}
        onHttpError={(e) =>
          console.error("❌ WebView httpError:", e.nativeEvent)
        }
        onShouldStartLoadWithRequest={(req) => {
          if (req.url.startsWith("fintocwidget://")) {
            void handleNavigation(req.url).catch((err) => console.error(err));
            return false;
          }
          return true;
        }}
      />

      {loading && (
        <YStack
          position="absolute"
          fullscreen
          backgroundColor="rgba(0,0,0,0.35)"
          justifyContent="center"
          alignItems="center"
        >
          <Spinner size="large" />
          <Text marginTop="$4" color="white">
            Cargando widget…
          </Text>
        </YStack>
      )}
    </YStack>
  );
}
