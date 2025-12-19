
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
    // We only run this effect if auth and app are initialized from the provider.
    if (!auth || !app) {
      // Keep loading if Firebase services are not yet available.
      setLoading(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser: AuthUser | null) => {
      if (authUser) {
        const db = getFirestore(app);
        const userDocRef = doc(db, 'users', authUser.uid);
        
        const unsubDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = { id: doc.id, ...doc.data() } as User;
            setSession(userData);
          } else {
            console.warn(`User document for UID ${authUser.uid} not found in Firestore.`);
            setSession(null);
          }
          setLoading(false);
        }, (error) => {
           console.error("Error fetching user document:", error);
           setSession(null);
           setLoading(false);
        });

        // Return the unsubscribe function for the document listener.
        return () => unsubDoc();
      } else {
        // No authenticated user.
        setSession(null);
        setLoading(false);
      }
    });

    // Return the unsubscribe function for the auth state listener.
    return () => unsubscribe();
  }, [auth, app]); 

  return { session, loading };
}
