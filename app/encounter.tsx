import React from "react";
import { View, Text } from "react-native";
import Link from "expo-router/link";

function EncounterScreen(): React.ReactElement {
  return (
    <View className="flex-1 items-center justify-center p-5 bg-gray-100">
      <Text className="text-2xl font-bold mb-5 text-gray-800">
        Draw a Spell Shape
      </Text>

      <Link href="/" className="mt-8 text-lg text-blue-600 underline">
        Back to Home
      </Link>
    </View>
  );
}

export default EncounterScreen;
