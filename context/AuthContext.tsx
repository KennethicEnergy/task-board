'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@/types';
import {
  registerUser,
  loginUser,
  logoutUser,
  onAuthChange,
  updateUserNotificationSettings,
} from '@/lib/firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateNotificationSettings: (settings: User['notificationSettings']) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((authUser) => {
      setUser(authUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const newUser = await registerUser(email, password, displayName);
    setUser(newUser);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const authUser = await loginUser(email, password);
    setUser(authUser);
    localStorage.setItem('theme', 'light');
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    localStorage.removeItem('theme');
    setUser(null);
  }, []);

  const updateNotificationSettings = useCallback(
    async (settings: User['notificationSettings']) => {
      if (!user) return;
      await updateUserNotificationSettings(user.id, settings);
      setUser({ ...user, notificationSettings: settings });
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateNotificationSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
