import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Get environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;

// Validate that all required environment variables are set
const requiredEnvVars = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// Check if we're using demo/fallback values (indicates missing env vars)
const isUsingDemoValues = 
  !apiKey || 
  apiKey === 'demo-api-key' ||
  !authDomain ||
  authDomain === 'demo-project.firebaseapp.com' ||
  !projectId ||
  projectId === 'demo-project';

if (isUsingDemoValues && typeof window !== 'undefined') {
  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase().replace(/([A-Z])/g, '_$1').replace(/^_/, '')}`)
    .join(', ');
  
  console.error('❌ Firebase Configuration Error:', {
    message: 'Missing or invalid Firebase environment variables',
    missing: missingVars,
    help: 'Please set all NEXT_PUBLIC_FIREBASE_* environment variables in Vercel Settings → Environment Variables',
  });
}

const firebaseConfig = {
  apiKey: apiKey || '',
  authDomain: authDomain || '',
  projectId: projectId || '',
  storageBucket: storageBucket || '',
  messagingSenderId: messagingSenderId || '',
  appId: appId || '',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('❌ Firebase Initialization Error:', error);
    console.error('Current config:', {
      apiKey: firebaseConfig.apiKey ? `${firebaseConfig.apiKey.substring(0, 10)}...` : 'MISSING',
      authDomain: firebaseConfig.authDomain || 'MISSING',
      projectId: firebaseConfig.projectId || 'MISSING',
    });
    throw new Error(
      'Firebase configuration is invalid. Please check your environment variables in Vercel Settings → Environment Variables. ' +
      'All NEXT_PUBLIC_FIREBASE_* variables must be set and you must redeploy after adding them.'
    );
  }
} else {
  app = {} as FirebaseApp;
  auth = {} as Auth;
  db = {} as Firestore;
}

export { app, auth, db };
