import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import { User } from '@/types';

const USERS_COLLECTION = 'users';

export const getUserDocument = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        id: userDoc.id,
        ...data,
        notificationSettings: {
          ...data.notificationSettings,
        },
      } as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
};

export const createUserDocument = async (userData: User): Promise<void> => {
  try {
    await setDoc(doc(db, USERS_COLLECTION, userData.id), {
      email: userData.email,
      displayName: userData.displayName,
      photoURL: userData.photoURL,
      notificationSettings: userData.notificationSettings,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const updateUserDocument = async (
  userId: string,
  updates: Partial<User>
): Promise<void> => {
  try {
    await updateDoc(doc(db, USERS_COLLECTION, userId), {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};
