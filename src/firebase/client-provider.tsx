
'use client';

import { useState, useEffect, useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';
import { Toaster } from '@/components/ui/toaster';

interface FirebaseServices {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
  storage: FirebaseStorage;
}

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Use useMemo to ensure initializeFirebase is called only once
  const services = useMemo(() => {
    // This check is important because in React's Strict Mode, effects can run twice in development.
    // By initializing here and not in an effect, we ensure it's truly a singleton on the client.
    if (typeof window !== 'undefined') {
      return initializeFirebase();
    }
    return null;
  }, []);

  if (!services) {
    // During server-side rendering, or before the client-side useMemo has run, we can return null
    // or a loading state. Child components should be prepared for this.
    return null;
  }

  return (
    <FirebaseProvider
      app={services.app}
      auth={services.auth}
      firestore={services.firestore}
      storage={services.storage}
    >
      {children}
      <Toaster />
    </FirebaseProvider>
  );
}
