import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSy_MOCK_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'sixstore-mock.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'sixstore-mock',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'sixstore-mock.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1234567890',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1234567890:web:mockapp'
};

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  try {
    db = initializeFirestore(app, {
      ignoreUndefinedProperties: true
    });
  } catch {
    db = getFirestore(app);
  }
  auth = getAuth(app);
  storage = getStorage(app);
} else {
  console.warn(
    '⚠️ [SixStore] Firebase não configurado nas variáveis de ambiente. O sistema operará em modo de demonstração local (Mock Mode).'
  );
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { app, db, auth, storage };
