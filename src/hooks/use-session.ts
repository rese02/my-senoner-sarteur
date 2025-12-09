
'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User as AuthUser } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { useAuth, useFirebaseApp } from '@/firebase/provider';
import type { User } from '@/lib/types';


export function useSession() {
  const auth = useAuth();
  const app = useFirebaseApp();
  const [session, setSession] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser: AuthUser | null) => {
      if (authUser) {
        const db = getFirestore(app);
        const userDocRef = doc(db, 'users', authUser.uid);
        
        const unsubDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = { id: doc.id, ...doc.data() } as User;
            setSession(userData);
          } else {
            setSession(null);
          }
          setLoading(false);
        }, (error) => {
           console.error("Error fetching user document:", error);
           setSession(null);
           setLoading(false);
        });

        // Cleanup doc listener when auth state changes
        return () => unsubDoc();
      } else {
        setSession(null);
        setLoading(false);
      }
    });

    // Cleanup auth listener on unmount
    return () => unsubscribe();
  }, [auth, app]);

  return { session, loading };
}
