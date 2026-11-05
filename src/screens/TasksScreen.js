import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../firebaseAuth";
import { db } from "../firebase";

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const uid = auth.currentUser?.uid;

  // onSnapshot keeps this list synced with Firestore; returning it cleans up the listener.
  useEffect(() => {
    if (!uid) return undefined;

    const tasksQuery = query(
      collection(db, "users", uid, "tasks"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(
      tasksQuery,
      (snapshot) => {
        setTasks(snapshot.docs.map((taskDoc) => ({ id: taskDoc.id, ...taskDoc.data() })));
        setError("");
        setLoading(false);
      },
      (listenerError) => {
        setError(listenerError.message);
        setLoading(false);
      }
    );
  }, [uid]);

  async function addTask() {
    const cleanTitle = title.trim();
    if (!cleanTitle || !uid) return;

    setSaving(true);
    setError("");
    try {
      await addDoc(collection(db, "users", uid, "tasks"), {
        title: cleanTitle,
        done: false,
        createdAt: serverTimestamp(),
      });
      setTitle("");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleTask(task) {
    try {
      await updateDoc(doc(db, "users", uid, "tasks", task.id), {
        done: !task.done,
      });
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  async function removeTask(taskId) {
    try {
      await deleteDoc(doc(db, "users", uid, "tasks", taskId));
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <FlatList
      style={styles.screen}
      contentContainerStyle={styles.content}
      data={tasks}
      keyExtractor={(task) => task.id}
      ListHeaderComponent={
        <View>
          <Text style={styles.heading}>Firebase Task Lab</Text>
          <Text style={styles.subtitle}>
            Tasks are saved to your account and update live across signed-in devices.
          </Text>
          <View style={styles.form}>
            <TextInput
              accessibilityLabel="New task title"
              style={styles.input}
              placeholder="Add a task (up to 100 characters)"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              onSubmitEditing={addTask}
              returnKeyType="done"
            />
            <Pressable
              accessibilityRole="button"
              disabled={!title.trim() || saving}
              onPress={addTask}
              style={[styles.addButton, (!title.trim() || saving) && styles.disabled]}
            >
              <Text style={styles.addButtonText}>{saving ? "Saving…" : "Add"}</Text>
            </Pressable>
          </View>
          {(!uid || error) ? (
            <Text style={styles.error}>{error || "Sign in to view your tasks."}</Text>
          ) : null}
          <Text style={styles.sectionTitle}>Your tasks ({tasks.length})</Text>
        </View>
      }
      ListEmptyComponent={
        loading && uid ? (
          <ActivityIndicator color="#15803D" style={styles.loading} />
        ) : (
          <Text style={styles.empty}>No tasks yet. Add one above.</Text>
        )
      }
      renderItem={({ item }) => (
        <View style={styles.task}>
          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked: item.done }}
            accessibilityLabel={`${item.done ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
            onPress={() => toggleTask(item)}
            style={styles.taskInfo}
          >
            <View style={[styles.checkbox, item.done && styles.checked]}>
              {item.done ? <Text style={styles.checkmark}>✓</Text> : null}
            </View>
            <Text style={[styles.taskTitle, item.done && styles.completed]}>
              {item.title}
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Delete ${item.title}`}
            onPress={() => removeTask(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F3F4F6" },
  content: { padding: 20, paddingBottom: 36, flexGrow: 1 },
  heading: { fontSize: 25, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6B7280", lineHeight: 21, marginTop: 7 },
  form: { flexDirection: "row", gap: 10, marginTop: 20, marginBottom: 18 },
  input: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111827",
  },
  addButton: {
    minWidth: 68,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: "#15803D",
    paddingHorizontal: 14,
  },
  disabled: { opacity: 0.55 },
  addButtonText: { color: "#FFFFFF", fontWeight: "700" },
  error: { color: "#B91C1C", marginBottom: 12, lineHeight: 20 },
  sectionTitle: { fontSize: 18, color: "#111827", fontWeight: "700", marginBottom: 10 },
  task: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  taskInfo: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 23,
    height: 23,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    borderRadius: 7,
    marginRight: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  checked: { backgroundColor: "#15803D", borderColor: "#15803D" },
  checkmark: { color: "#FFFFFF", fontSize: 15, fontWeight: "800", lineHeight: 18 },
  taskTitle: { flex: 1, color: "#111827", fontSize: 15 },
  completed: { color: "#6B7280", textDecorationLine: "line-through" },
  deleteButton: { padding: 7, marginLeft: 8 },
  deleteText: { color: "#B91C1C", fontWeight: "600" },
  loading: { marginTop: 26 },
  empty: { color: "#6B7280", paddingVertical: 18 },
});
