import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { firebaseConfig } from './config';

// The data model for your Firebase project.
// See the docs for more details: https://firebase.google.com/docs/studio/reference/sdk/nextjs/backend-json-file
import backend from '../../docs/backend.json';

// Initializes and returns a Firebase object.
// This function can be called safely from both client and server components.
export function initializeFirebase(): {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
} {
  if (getApps().length) {
    const app = getApp();
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  } else {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const firestore = getFirestore(app);
    return { app, auth, firestore };
  }
}

// Export the backend data model.
export const AppBackend = backend;
