import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseAuth";
import PhoneOtpScreen from "./PhoneOtpScreen";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (phoneOtp) {
    return (
      <PhoneOtpScreen
        onBack={() => setPhoneOtp(false)}
        backLabel="Use email/password instead"
      />
    );
  }

  async function submit() {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
    } catch (error) {
      Alert.alert("Authentication failed", error.message);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{isSignUp ? "Create account" : "Sign in"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title={isSignUp ? "Create account" : "Sign in"} onPress={submit} />
      <Button
        title={isSignUp ? "Already have an account? Sign in" : "New here? Create account"}
        onPress={() => setIsSignUp(!isSignUp)}
      />
      <Button title="Use phone number instead" onPress={() => setPhoneOtp(true)} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F3F4F6" },
  title: { color: "#111827", fontSize: 26, fontWeight: "800", marginBottom: 20 },
  input: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 14, marginBottom: 12 },
});
