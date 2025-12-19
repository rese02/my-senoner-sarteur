
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
  const [services, setServices] = useState<FirebaseServices | null>(null);

  useEffect(() => {
    // This effect runs only on the client after the initial render.
    // This is the safe place to initialize client-side libraries.
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  // While services are being initialized (on the very first client render),
  // we render nothing. This guarantees no mismatch with the server's render.
  if (!services) {
    return null;
  }

  // Once Firebase is initialized on the client, we render the full provider tree.
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
