import { Stack } from "expo-router";
import React from "react";
import "../global.css";

function RootLayout(): React.ReactElement {
  return (
    <Stack>
      {/* Define screens here later */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="encounter" options={{ title: "Encounter" }} />
    </Stack>
  );
}

export default RootLayout;
