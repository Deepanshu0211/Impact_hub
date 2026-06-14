import { getApps, initializeApp, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const sanitizeEnvVar = (val: string | undefined) => {
  if (!val) return val;
  return val.replace(/^['"]|['"]$/g, "").trim();
};

const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
const privateKey = rawPrivateKey
  ? rawPrivateKey.replace(/^['"]|['"]$/g, "").replace(/\\n/g, "\n")
  : undefined;
const clientEmail = sanitizeEnvVar(process.env.FIREBASE_CLIENT_EMAIL);
const projectId = sanitizeEnvVar(process.env.FIREBASE_PROJECT_ID);

const isKeyValid = !!(
  privateKey &&
  privateKey.includes("-----BEGIN PRIVATE KEY-----") &&
  !privateKey.includes("...")
);

const app = getApps().length === 0 
  ? initializeApp(
      isKeyValid && clientEmail && projectId
        ? {
            credential: cert({
              projectId: projectId,
              clientEmail: clientEmail,
              privateKey: privateKey,
            }),
          }
        : {
            projectId: projectId || "mock-project-id",
          }
    )
  : getApp();

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth, app as adminApp };

