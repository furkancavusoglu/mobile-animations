import { Stack } from "expo-router";
import React from "react";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";

function RootLayout(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack>
        {/* Define screens here later */}
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="encounter" options={{ title: "Encounter" }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

export default RootLayout;
