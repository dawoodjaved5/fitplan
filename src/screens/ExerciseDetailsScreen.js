import React, { useLayoutEffect } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useWorkout } from "../context/WorkoutContext";

export default function ExerciseDetailsScreen({ route, navigation }) {
  // Receive the data passed by ExercisesScreen.
  const { exercise } = route.params;
  const { workout, addExercise } = useWorkout();

  const isAdded = workout.some((item) => item.id === exercise.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: exercise.name,
      headerRight: () => (
        <Pressable
          accessibilityRole="button"
          disabled={isAdded}
          onPress={() => {
            addExercise(exercise);
            Alert.alert(
              "Exercise added",
              `${exercise.name} is now in your workout. Open the My Workout tab to see it.`
            );
          }}
          style={styles.headerButton}
        >
          <Text style={[styles.headerText, isAdded && styles.disabled]}>
            {isAdded ? "Added ✓" : "+ Add"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, exercise, isAdded, addExercise]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.label}>{exercise.muscle.toUpperCase()}</Text>
      <Text style={styles.heading}>{exercise.name}</Text>
      <Text style={styles.subtitle}>{exercise.equipment}</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.value}>{exercise.sets}</Text>
          <Text style={styles.subtitle}>Sets</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.value}>{exercise.reps}</Text>
          <Text style={styles.subtitle}>Reps / duration</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>How to perform</Text>
        <Text style={styles.instructions}>{exercise.instructions}</Text>
      </View>

      <Text style={styles.hint}>
        {isAdded
          ? "This exercise is in your workout."
          : "Tap + Add in the header to add this exercise to your workout."}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  content: { padding: 24 },
  label: { color: "#15803D", fontWeight: "700", letterSpacing: 2 },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginTop: 12,
  },
  subtitle: { color: "#6B7280", fontSize: 15, marginTop: 6 },
  stats: { flexDirection: "row", marginVertical: 28, gap: 12 },
  stat: {
    flex: 1,
    backgroundColor: "#DCFCE7",
    padding: 20,
    borderRadius: 16,
  },
  value: { fontSize: 22, fontWeight: "800", color: "#166534" },
  card: { backgroundColor: "#FFFFFF", padding: 22, borderRadius: 16 },
  sectionTitle: { fontSize: 19, fontWeight: "700", color: "#111827" },
  instructions: {
    fontSize: 16,
    color: "#4B5563",
    lineHeight: 26,
    marginTop: 12,
  },
  hint: { marginTop: 24, color: "#6B7280", lineHeight: 22 },
  headerButton: { paddingVertical: 8, paddingHorizontal: 6 },
  headerText: { color: "#15803D", fontSize: 16, fontWeight: "700" },
  disabled: { color: "#6B7280" },
});