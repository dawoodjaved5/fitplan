import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useWorkout } from "../context/WorkoutContext";

export default function ProgressScreen({ navigation }) {
  const { workout } = useWorkout();
  const totalSets = workout.reduce((total, exercise) => total + exercise.sets, 0);
  const muscleGroups = [...new Set(workout.map((exercise) => exercise.muscle))];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Workout progress</Text>
      <Text style={styles.subtitle}>A quick summary of your current plan.</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.value}>{workout.length}</Text>
          <Text style={styles.label}>Exercises</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.value}>{totalSets}</Text>
          <Text style={styles.label}>Total sets</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Muscle groups</Text>
        {muscleGroups.length ? (
          <View style={styles.chips}>
            {muscleGroups.map((muscle) => (
              <Text key={muscle} style={styles.chip}>{muscle}</Text>
            ))}
          </View>
        ) : (
          <Text style={styles.subtitle}>Add exercises to see your plan here.</Text>
        )}
      </View>

      <Pressable style={styles.button} onPress={() => navigation.navigate("Exercises")}>
        <Text style={styles.buttonText}>Browse exercises</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  content: { padding: 20, paddingBottom: 32 },
  heading: { fontSize: 25, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 8, lineHeight: 21 },
  stats: { flexDirection: "row", gap: 12, marginTop: 24 },
  stat: { flex: 1, backgroundColor: "#DCFCE7", padding: 20, borderRadius: 16 },
  value: { fontSize: 28, fontWeight: "800", color: "#166534" },
  label: { color: "#166534", marginTop: 6, fontWeight: "600" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 16, padding: 20, marginTop: 16 },
  cardTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 14 },
  chip: { overflow: "hidden", color: "#166534", backgroundColor: "#DCFCE7", borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  button: { alignItems: "center", backgroundColor: "#16A34A", borderRadius: 12, padding: 15, marginTop: 20 },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
});
