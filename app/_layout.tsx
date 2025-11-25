// app/_layout.tsx
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { auth, onAuthStateChanged } from "../firebase";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<any>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u: any) => {
      setUser(u);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#111827" },
          headerTintColor: "#f9fafb",
          headerTitleStyle: { fontWeight: "600" },
          animation: "slide_from_right",
        }}
      >
        {/* index tetap ada, tapi auto-redirect di file index.tsx */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Masuk" }} />
        <Stack.Screen name="register" options={{ title: "Daftar" }} />
        <Stack.Screen name="chat" options={{ title: "Chat Room" }} />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
