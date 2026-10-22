import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform, useColorScheme } from "react-native";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      {/* <AppTabs /> */}
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          // Styles applied directly to the inner page view container
          contentStyle: Platform.select({
            web: {
              maxWidth: 1200, // Restricts screen stretch
              width: "100%",
              marginHorizontal: "auto", // Perfectly centers the container
              borderLeftWidth: 1, // Optional: adds sleek desktop borders
              borderRightWidth: 1,
              borderColor: "#e0e0e0",
            },
            default: {},
          }),
        }}
      >
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="config" options={{ title: "Config" }} />
      </Stack>
    </ThemeProvider>
  );
}
