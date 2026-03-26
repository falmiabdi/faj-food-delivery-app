import useAuthStore from "@/store/useAuthStore";
import * as Sentry from "@sentry/react-native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useRef } from "react";
import "./globals.css";

Sentry.init({
  dsn: "https://4430073125a46e45908b5410dd0c63fa@o4511107721920512.ingest.us.sentry.io/4511107779198976",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],
});

export default Sentry.wrap(function RootLayout() {
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  // Get auth store state and actions
  const isLoading = useAuthStore((state) => state.isLoading);
  const fetchAuthenticatedUser = useAuthStore(
    (state) => state.fetchAuthenticatedUser,
  );

  // Use a ref to track if we've already fetched
  const hasFetched = useRef(false);

  // Handle font loading errors
  useEffect(() => {
    if (fontError) throw fontError;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  // Fetch authenticated user when app loads - only once
  useEffect(() => {
    if (!hasFetched.current && fontsLoaded) {
      hasFetched.current = true;
      fetchAuthenticatedUser();
    }
  }, [fontsLoaded, fetchAuthenticatedUser]);

  // Show nothing while loading fonts or checking auth
  if (!fontsLoaded || isLoading) {
    return null;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
});
