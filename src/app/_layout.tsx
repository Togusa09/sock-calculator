import { AnimatedSplashOverlay } from "@/components/animated-icon";
import { palette } from "@/theme/colors";
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
          headerShown: Platform.OS !== "web",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          contentStyle: Platform.select({
            web: {
              flex: 1,
              width: "100%",
              backgroundColor: palette.paper,
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
