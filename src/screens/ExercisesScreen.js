import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { exercises } from "../data/exercises";

export default function ExercisesScreen({ navigation }) {
  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.list}
      data={exercises}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        <View style={styles.intro}>
          <Text style={styles.heading}>Build your next workout</Text>
          <Text style={styles.subtitle}>
            Choose an exercise to view its details.
          </Text>
        </View>
      }
      renderItem={({ item }) => (
        <Pressable
          style={styles.card}
          onPress={() =>
            navigation.navigate("ExerciseDetails", { exercise: item })
          }
        >
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subtitle}>
              {item.muscle} • {item.equipment}
            </Text>
            <Text style={styles.prescription}>
              {item.sets} sets × {item.reps}
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  list: { padding: 20, paddingBottom: 32 },
  intro: { marginBottom: 22 },
  heading: { fontSize: 25, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: "700", color: "#111827" },
  prescription: { color: "#15803D", marginTop: 10, fontWeight: "600" },
  arrow: { fontSize: 30, color: "#16A34A", marginLeft: 12 },
});