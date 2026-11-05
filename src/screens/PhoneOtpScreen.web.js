import React, { useEffect, useRef, useState } from "react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { auth } from "../firebaseAuth";

export default function PhoneOtpScreen({ onBack }) {
  const captchaContainer = useRef(null);
  const verifier = useRef(null);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [verifiedPhone, setVerifiedPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (confirmation || !captchaContainer.current) return undefined;

    const currentVerifier = new RecaptchaVerifier(auth, captchaContainer.current, {
      size: "normal",
      "expired-callback": () => setError("The reCAPTCHA expired. Complete it again."),
    });
    verifier.current = currentVerifier;

    return () => {
      currentVerifier.clear();
      if (verifier.current === currentVerifier) verifier.current = null;
    };
  }, [confirmation]);

  async function sendCode() {
    const normalizedPhone = phone.replace(/[\s()-]/g, "");
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setError("Enter a phone number with country code, for example +923001234567.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await signInWithPhoneNumber(auth, normalizedPhone, verifier.current);
      setConfirmation(result);
      setPhone(normalizedPhone);
    } catch (sendError) {
      setError(sendError.message || "Could not start phone verification.");
      // A failed attempt can expire the current verifier; create a fresh one.
      verifier.current?.clear();
      verifier.current = new RecaptchaVerifier(auth, captchaContainer.current, {
        size: "normal",
        "expired-callback": () => setError("The reCAPTCHA expired. Complete it again."),
      });
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode() {
    if (!/^\d{6}$/.test(code.trim())) {
      setError("Enter the six-digit verification code.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await confirmation.confirm(code.trim());
      setVerifiedPhone(result.user.phoneNumber || phone);
    } catch (verifyError) {
      setError(verifyError.message || "Verification failed. Check the code and try again.");
    } finally {
      setBusy(false);
    }
  }

  function changePhoneNumber() {
    setConfirmation(null);
    setCode("");
    setError("");
  }

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Phone number verification</Text>
      <Text style={styles.subtitle}>
        Enter a number with its country code. Firebase will verify it using its web flow.
        Test numbers use the preset code and do not receive an SMS.
      </Text>

      {verifiedPhone ? (
        <View style={styles.result}>
          <Text style={styles.successTitle}>Verification successful</Text>
          <Text style={styles.successText}>{verifiedPhone} was verified with Firebase.</Text>
        </View>
      ) : confirmation ? (
        <>
          <Text style={styles.destination}>Verification requested for {phone}</Text>
          <TextInput
            accessibilityLabel="Six-digit verification code"
            style={styles.input}
            placeholder="6-digit code"
            value={code}
            onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Button title={busy ? "Verifying…" : "Verify code"} onPress={verifyCode} disabled={busy} />
          <View style={styles.changeNumber}>
            <Button title="Change phone number" onPress={changePhoneNumber} disabled={busy} />
          </View>
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
          <Button title={busy ? "Requesting…" : "Request verification code"} onPress={sendCode} disabled={busy} />
          <Text style={styles.captchaLabel}>Complete this verification to request the code:</Text>
          <View ref={captchaContainer} style={styles.captcha} />
        </>
      )}

      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <View style={styles.back}>
        <Button title="Back" onPress={onBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: "#F3F4F6", minHeight: "100vh" },
  title: { color: "#111827", fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#6B7280", fontSize: 15, lineHeight: 22, marginTop: 8, marginBottom: 22 },
  input: { backgroundColor: "#FFFFFF", borderColor: "#D1D5DB", borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 12, fontSize: 17 },
  captchaLabel: { color: "#374151", marginTop: 20, marginBottom: 8 },
  captcha: { minHeight: 78, alignSelf: "flex-start" },
  destination: { color: "#374151", marginBottom: 12 },
  back: { marginTop: 16, alignSelf: "flex-start" },
  changeNumber: { marginTop: 12, alignSelf: "flex-start" },
  error: { color: "#B91C1C", lineHeight: 21, marginTop: 14 },
  result: { padding: 18, borderRadius: 12, backgroundColor: "#DCFCE7", marginBottom: 12 },
  successTitle: { color: "#166534", fontSize: 19, fontWeight: "800" },
  successText: { color: "#166534", marginTop: 6, lineHeight: 21 },
});
