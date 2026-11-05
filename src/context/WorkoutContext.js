import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert, View } from "react-native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children, user }) {
  const [workout, setWorkout] = useState([]);
  const [loadedUid, setLoadedUid] = useState(null);
  const uid = user?.uid;

  // Each account loads its own workout from users/{uid}.
  useEffect(() => {
    let isCurrentUser = true;

    async function loadWorkout() {
      setWorkout([]);
      if (!uid) return;

      try {
        const snapshot = await getDoc(doc(db, "users", uid));
        if (isCurrentUser) {
          setWorkout(snapshot.exists() ? snapshot.data().workout ?? [] : []);
        }
      } catch (error) {
        Alert.alert("Could not load workout", error.message);
      } finally {
        if (isCurrentUser) setLoadedUid(uid);
      }
    }

    loadWorkout();
    return () => {
      isCurrentUser = false;
    };
  }, [uid]);

  async function saveWorkout(nextWorkout) {
    setWorkout(nextWorkout);
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), { workout: nextWorkout }, { merge: true });
    } catch (error) {
      Alert.alert("Could not save workout", error.message);
    }
  }

  function addExercise(exercise) {
    if (!workout.some((item) => item.id === exercise.id)) {
      saveWorkout([...workout, exercise]);
    }
  }

  function removeExercise(exerciseId) {
    saveWorkout(workout.filter((item) => item.id !== exerciseId));
  }

  function clearWorkout() {
    saveWorkout([]);
  }

  if (user && loadedUid !== user.uid) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#15803D" />
      </View>
    );
  }

  return (
    <WorkoutContext.Provider value={{ workout, addExercise, removeExercise, clearWorkout }}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkout() {
  const context = useContext(WorkoutContext);
  if (!context) throw new Error("useWorkout must be used inside WorkoutProvider");
  return context;
}
