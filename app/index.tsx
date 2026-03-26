import useAuthStore from "@/store/useAuthStore";
import { Redirect } from "expo-router";

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    console.log("User is authenticated, redirecting to home...");
    return <Redirect href="/(tabs)" />; // Go to tabs (home)
  } else {
    return <Redirect href="/(auth)/sign-in" />; // Go to sign-in
  }
}
