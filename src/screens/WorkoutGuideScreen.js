import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const tips = [
  {
    title: "1. Choose balanced exercises",
    body: "Include movements for different muscle groups so your plan is not focused on just one area.",
  },
  {
    title: "2. Follow the suggested sets and reps",
    body: "Each exercise includes a simple starting prescription. Adjust it to your experience and comfort.",
  },
  {
    title: "3. Use controlled form",
    body: "Move steadily, follow the instructions on each exercise, and stop if you feel pain.",
  },
  {
    title: "4. Review your plan",
    body: "Use the Progress tab to see the number of exercises, total sets, and muscle groups in your workout.",
  },
];

export default function WorkoutGuideScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Plan a simple workout</Text>
      <Text style={styles.subtitle}>A few reminders to help you use FitPlan.</Text>
      {tips.map((tip) => (
        <View key={tip.title} style={styles.card}>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.body}>{tip.body}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  content: { padding: 20, paddingBottom: 32 },
  heading: { fontSize: 25, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 8, marginBottom: 12 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 18, marginTop: 12 },
  title: { fontSize: 17, fontWeight: "700", color: "#166534" },
  body: { color: "#4B5563", fontSize: 15, lineHeight: 23, marginTop: 8 },
});
