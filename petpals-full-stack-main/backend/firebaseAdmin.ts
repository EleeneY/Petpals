import * as admin from 'firebase-admin';
const PROJECT_ID = "petpals-ab69d";

if (!admin.apps.length) {
  try {
    const serviceAccount = require('./service_account.json'); 

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: PROJECT_ID,
    });
    console.log("Firebase Admin SDK initialized successfully.");

  } catch (e) {
      console.error("Error initializing Firebase Admin SDK with credentials:", e);
      throw new Error("Failed to initialize Firebase Admin SDK. Check service account file path and permissions.");
  }
}
export const adminAuth = admin.auth();