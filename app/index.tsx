import { Link } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

function HomeScreen(): React.ReactElement {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, Spellcaster!</Text>
      <Link href="/encounter" style={styles.link}>
        Start Encounter
      </Link>
      {/* Add other links or content later */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  link: {
    fontSize: 18,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
