export default ()=>({
  expo: {
    name: "2025-03-29-figma-to-expo",
    slug: "2025-03-29-figma-to-expo",
    version: "1.0.0",
    extra: {
      EXPO_PUBLIC_API: process.env.EXPO_PUBLIC_API
    },
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-sqlite"
    ]
  }
});