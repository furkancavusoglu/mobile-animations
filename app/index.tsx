import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

function HomeScreen(): React.ReactElement {
  return (
    <View className="flex-1 justify-center items-center p-5">
      <Text className="text-3xl font-bold mb-5">Welcome, Spellcaster!</Text>

      <Link href="/encounter" className="text-xl text-blue-500 underline">
        Start Encounter
      </Link>
    </View>
  );
}

export default HomeScreen;
