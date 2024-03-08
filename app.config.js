import "dotenv/config";

export default {
  expo: {
    owner: "jacksonedc",
    name: "Expo Firebase Starter",
    slug: "bus-app",
    privacy: "public",
    platforms: ["ios", "android"],
    version: "0.15.0",
    orientation: "portrait",
    icon: "./assets/flame.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "cover",
      backgroundColor: "#F57C00",
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
    },
    android: {
      package: "com.busapp.app",
    },
    extra: {
      eas: {
        projectId: "13ae21c6-222c-4f0e-84cb-ea96b35aaef1",
      },
      apiKey: process.env.API_KEY,
      authDomain: process.env.AUTH_DOMAIN,
      projectId: process.env.PROJECT_ID,
      storageBucket: process.env.STORAGE_BUCKET,
      messagingSenderId: process.env.MESSAGING_SENDER_ID,
      appId: process.env.APP_ID,
    },
  },
};
