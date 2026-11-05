import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseAuth";

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>FitPlan</Text>
        <Text style={styles.tagline}>Plan your workout. Keep it simple.</Text>

        <Text style={styles.description}>
          Browse exercises, learn how to perform them, and build your own
          workout.
        </Text>

        <Text style={styles.details}>
          Developed by Muhammad Dawood Javed{"\n"}
          Roll number: 23i-3038{"\n"}
          Section: SE-7B{"\n"}
          Mobile Application Development — Assignment 2
        </Text>
        <Button
          title="Sign out"
          color="#15803D"
          onPress={() => signOut(auth).catch((error) => Alert.alert("Sign out failed", error.message))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6", padding: 24 },
  card: { backgroundColor: "#FFFFFF", padding: 24, borderRadius: 20 },
  title: { fontSize: 36, fontWeight: "800", color: "#15803D" },
  tagline: { fontSize: 16, color: "#111827", marginTop: 10 },
  description: {
    color: "#4B5563",
    fontSize: 16,
    lineHeight: 26,
    marginTop: 24,
  },
  details: { color: "#6B7280", lineHeight: 25, marginTop: 28 },
});
