// contexts/AuthContext.tsx
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '@/firebase';

type Profile = {
  id: string;
  full_name?: string;
  avatar_url?: string | null;
  [key: string]: unknown;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile({ id: userDoc.id, ...userDoc.data() } as Profile);
          } else {
            setProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }

      setLoading(false); // ✅ Now only runs after everything is finished
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
