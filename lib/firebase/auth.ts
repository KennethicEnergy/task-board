import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth';
import { auth } from './config';
import { User } from '@/types';
import { getUserDocument, createUserDocument, updateUserDocument } from './users';

export const registerUser = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }

  const userData: User = {
    id: userCredential.user.uid,
    email: userCredential.user.email || '',
    displayName: userCredential.user.displayName || displayName || null,
    photoURL: userCredential.user.photoURL || null,
    notificationSettings: {
      enabled: true,
      daysBefore: 1,
      hoursBefore: 0,
      methods: ['visual', 'toast'],
    },
  };

  await createUserDocument(userData);
  return userData;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const userDoc = await getUserDocument(userCredential.user.uid);
  
  if (!userDoc) {
    const userData: User = {
      id: userCredential.user.uid,
      email: userCredential.user.email || '',
      displayName: userCredential.user.displayName || null,
      photoURL: userCredential.user.photoURL || null,
      notificationSettings: {
        enabled: true,
        daysBefore: 1,
        hoursBefore: 0,
        methods: ['visual', 'toast'],
      },
    };
    await createUserDocument(userData);
    return userData;
  }

  return userDoc;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void): (() => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      const userDoc = await getUserDocument(firebaseUser.uid);
      callback(userDoc);
    } else {
      callback(null);
    }
  });
};

export const updateUserNotificationSettings = async (
  userId: string,
  settings: User['notificationSettings']
): Promise<void> => {
  await updateUserDocument(userId, { notificationSettings: settings });
};
