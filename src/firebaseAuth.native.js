import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { app } from "./firebase";

// Native apps use AsyncStorage so sign-in survives app restarts.
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  if (error.code !== "auth/already-initialized") throw error;
  auth = getAuth(app);
}

export { auth };
