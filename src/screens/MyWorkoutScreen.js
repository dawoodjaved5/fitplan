import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useWorkout } from "../context/WorkoutContext";

export default function MyWorkoutScreen({ navigation }) {
  const { workout, removeExercise } = useWorkout();

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={workout}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.intro}>
          <Text style={styles.heading}>Your workout</Text>
          <Text style={styles.subtitle}>
            {workout.length} exercises •{" "}
            {workout.reduce((total, item) => total + item.sets, 0)} total sets
          </Text>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.name}>Your workout is empty</Text>
          <Text style={styles.subtitle}>
            Browse exercises and add your favourites.
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => navigation.navigate("Exercises")}
          >
            <Text style={styles.buttonText}>Browse exercises</Text>
          </Pressable>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {item.muscle} • {item.sets} sets × {item.reps}
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name}`}
            onPress={() => removeExercise(item.id)}
            style={styles.remove}
          >
            <Text style={styles.removeText}>Remove</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  list: { padding: 20, paddingBottom: 32 },
  intro: { marginBottom: 22 },
  heading: { fontSize: 25, fontWeight: "800", color: "#111827" },
  subtitle: { color: "#6B7280", marginTop: 8, lineHeight: 21 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: "700", color: "#111827" },
  remove: { padding: 8, marginLeft: 8 },
  removeText: { color: "#DC2626", fontWeight: "600" },
  empty: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#16A34A",
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },
  buttonText: { color: "#FFFFFF", fontWeight: "700" },
});