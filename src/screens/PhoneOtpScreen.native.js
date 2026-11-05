import React, { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithPhoneNumber } from "@react-native-firebase/auth";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function PhoneOtpScreen({ onBack }) {
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const requestedPhone = useRef("");
  const requestPending = useRef(false);

  // Android can sometimes verify the SMS automatically; show success in that case too.
  useEffect(() => onAuthStateChanged(getAuth(), (user) => {
    if (requestPending.current && user?.phoneNumber === requestedPhone.current) {
      setVerifiedPhone(user.phoneNumber);
      setError("");
    }
  }), []);

  async function sendCode() {
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError("Enter a valid phone number with country code, e.g. +923001234567.");
      return;
    }

    setBusy(true);
    setError("");
    requestedPhone.current = normalizedPhone;
    requestPending.current = true;
    try {
      const result = await signInWithPhoneNumber(getAuth(), normalizedPhone);
      setConfirmation(result);
      setPhone(normalizedPhone);
    } catch (sendError) {
      requestPending.current = false;
      setError(sendError.message || "Could not send the verification code.");
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the six-digit code from the SMS.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await confirmation.confirm(code.trim());
      setVerifiedPhone(result.user.phoneNumber || phone);
    } catch (verifyError) {
      setError(verifyError.message || "The code could not be verified. Check it and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Phone number verification</Text>
      <Text style={styles.subtitle}>
        Enter your number with its country code. Firebase will send a one-time SMS code.
      </Text>

      {verifiedPhone ? (
        <View style={styles.result}>
          <Text style={styles.successTitle}>Verification successful</Text>
          <Text style={styles.successText}>{verifiedPhone} is verified with Firebase.</Text>
        </View>
      ) : confirmation ? (
        <>
          <Text style={styles.destination}>Code sent to {phone}</Text>
          <TextInput
            accessibilityLabel="Six-digit verification code"
            style={styles.input}
            placeholder="6-digit OTP"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
          <ActionButton title={busy ? "Verifying…" : "Verify OTP"} onPress={verifyCode} disabled={busy} />
          <ActionButton title="Send code again" onPress={sendCode} disabled={busy} secondary />
        </>
      ) : (
        <>
          <TextInput
            accessibilityLabel="Phone number with country code"
            style={styles.input}
            placeholder="+923001234567"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoCapitalize="none"
          />
          <ActionButton title={busy ? "Sending…" : "Send OTP by SMS"} onPress={sendCode} disabled={busy} />
        </>
      )}

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <ActionButton title="Back to email sign-in" onPress={onBack} secondary />
    </View>
  );
}

function ActionButton({ title, onPress, disabled, secondary = false }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, secondary && styles.secondaryButton, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonText, secondary && styles.secondaryText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F3F4F6" },
  title: { color: "#111827", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#6B7280", fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 22 },
  input: { backgroundColor: "#FFFFFF", borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 17 },
  destination: { color: "#374151", marginBottom: 12 },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#15803D",
    borderRadius: 10,
    minHeight: 48,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  secondaryButton: { backgroundColor: "#E5E7EB" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  secondaryText: { color: "#374151" },
  disabled: { opacity: 0.55 },
  error: { color: "#B91C1C", lineHeight: 21, marginTop: 14 },
  result: { padding: 18, borderRadius: 12, backgroundColor: "#DCFCE7", marginBottom: 12 },
  successTitle: { color: "#166534", fontSize: 19, fontWeight: "800" },
  successText: { color: "#166534", marginTop: 6, lineHeight: 21 },
});
