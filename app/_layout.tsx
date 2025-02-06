import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import RotatingIcon from "@/components/ui/RotatingIcon";
import { I18nManager, StyleSheet, Text, View } from "react-native";
import { useUserStore } from "@/store/userStore";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const { fetchBasicUserData, isLogged, fetchUserDetails } = useUserStore();

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    "SansArabic-Bold": require("../assets/fonts/IBMPlexSansArabic-Bold.ttf"),
    "SansArabic-ExtraLight": require("../assets/fonts/IBMPlexSansArabic-ExtraLight.ttf"),
    "SansArabic-Light": require("../assets/fonts/IBMPlexSansArabic-Light.ttf"),
    "SansArabic-Medium": require("../assets/fonts/IBMPlexSansArabic-Medium.ttf"),
    "SansArabic-Regular": require("../assets/fonts/IBMPlexSansArabic-Regular.ttf"),
    "SansArabic-SemiBold": require("../assets/fonts/IBMPlexSansArabic-SemiBold.ttf"),
    "SansArabic-Thin": require("../assets/fonts/IBMPlexSansArabic-Thin.ttf"),
    "Somar-Bold": require("../assets/fonts/Somar-Bold.ttf"),
  });

  useEffect(() => {
    // Force LTR layout for the app
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
    } else {
      I18nManager.forceRTL(false); // Force LTR even if the device is in RTL mode
    }

    fetchBasicUserData();

    SplashScreen.hideAsync();

    if (loaded) {
      setTimeout(() => {
        setShowSplash(false);
      }, 3000); // Adjust the duration as needed
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }

  const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={styles.successToast}
        contentContainerStyle={styles.contentContainer}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={styles.errorToast}
        text1Style={styles.text1}
        text2Style={styles.text2}
      />
    ),
    custom: ({ text1, text2 }: any) => (
      <View style={styles.customToast}>
        <Text style={styles.customText1}>{text1}</Text>
        <Text style={styles.customText2}>{text2}</Text>
      </View>
    ),
  } as any;

  if (showSplash) {
    return <RotatingIcon />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast config={toastConfig} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  successToast: {
    borderLeftColor: "green",
    backgroundColor: "#eaffea",
  },
  errorToast: {
    borderLeftColor: "red",
    backgroundColor: "#ffeaea",
  },
  contentContainer: {
    paddingHorizontal: 15,
  },
  text1: {
    fontSize: 16,
    fontWeight: "bold",
  },
  text2: {
    fontSize: 14,
    color: "gray",
  },
  customToast: {
    height: 60,
    width: "100%",
    backgroundColor: "tomato",
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  customText1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  customText2: {
    fontSize: 14,
    color: "#fff",
  },
});
