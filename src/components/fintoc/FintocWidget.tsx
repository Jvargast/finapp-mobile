import React, { useEffect } from "react";
import { View, Text } from "react-native";
import { WebView } from "react-native-webview";
import * as Linking from "expo-linking";

const PUBLIC_KEY = process.env.EXPO_PUBLIC_FINTOC_PK;
const FINTOC_URL = "https://webview.fintoc.com/widget.html";

const ANDROID_UA =
  "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36";

const INJECTED_CODE = `
(function () {
  function send(data) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: "OPEN_URL", url: data })
      );
    }
  }

  const originalOpen = window.open;
  window.open = function (url) {
    send(url);
    return null;
  };

  function relay(e) {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        typeof e.data === "string" ? e.data : JSON.stringify(e.data)
      );
    }
  }

  window.addEventListener("message", relay);
  document.addEventListener("message", relay);

  true;
})();
`;

export const FintocWidget = ({ onSuccess, onExit }) => {
  if (!PUBLIC_KEY) return <Text>Falta API Key</Text>;

  const widgetUrl =
    `https://webview.fintoc.com/widget.html` +
    `?public_key=${PUBLIC_KEY}` +
    `&holder_type=individual` +
    `&product=movements` +
    `&redirect_uri=miapp://fintoc`;

  useEffect(() => {
    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("🔁 Volvió del banco:", url);
    });

    return () => sub.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <WebView
        source={{ uri: widgetUrl }}
        javaScriptEnabled
        domStorageEnabled
        thirdPartyCookiesEnabled
        sharedCookiesEnabled
        setSupportMultipleWindows={true} // 🔥 DEBE SER TRUE
        originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={INJECTED_CODE}
        onShouldStartLoadWithRequest={(req) => {
          return true;
        }}
        onMessage={(event) => {
          let data = event.nativeEvent.data;

          try {
            data = JSON.parse(data);
          } catch {}

          if (data?.type === "OPEN_URL" && data?.url) {
            Linking.openURL(data.url);
            return;
          }

          console.log("📩 FINTOC:", data);

          if (data?.id) {
            onSuccess(data.id);
          }

          if (data?.type === "exit") {
            onExit();
          }
        }}
      />
    </View>
  );
};
