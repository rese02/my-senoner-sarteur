'use client';

import { useState, useEffect } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseStorage } from 'firebase/storage';

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
    // This effect runs only once on the client after initial mount.
    // It ensures Firebase is initialized only on the client side.
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  if (!services) {
    // By returning null here, we ensure that child components that depend on the Firebase context
    // (like LoginForm) will not be rendered until Firebase has been initialized.
    // This prevents the race condition and the "Firebase has not been initialized correctly" error.
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
    </FirebaseProvider>
  );
}
