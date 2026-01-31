import "dotenv/config";

export default {
  expo: {
    name: "WouFinance",
    slug: "nova-app",
    scheme: "woufinance",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.woulab.nova",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.woulab.nova",
      permissions: ["android.permission.RECORD_AUDIO"],
      googleServicesFile:
        process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-font",
      "@react-native-community/datetimepicker",
    ],
    extra: {
      router: {},
      eas: {
        projectId: "bf56ae86-ed28-4757-8a4e-3a5307f04f5a",
      },
    },
  },
};
