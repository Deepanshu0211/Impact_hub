import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const sanitizeEnvVar = (val: string | undefined) => {
  if (!val) return val;
  return val.replace(/^['"]|['"]$/g, "").trim();
};

const firebaseConfig = {
  apiKey: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: sanitizeEnvVar(process.env.NEXT_PUBLIC_FIREBASE_APP_ID),
};

// Prevent initialization of multiple apps
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
