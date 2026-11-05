import { getAuth } from "firebase/auth";
import { app } from "./firebase";

// Web uses Firebase's browser persistence instead of React Native AsyncStorage.
export const auth = getAuth(app);
