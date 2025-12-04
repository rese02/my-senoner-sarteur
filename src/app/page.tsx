'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function HomePage() {
  useEffect(() => {
    // Leitet jeden Besucher sofort zum Login weiter
    redirect('/login');
  }, []);

  // Return a simple loading state or null while redirecting
  return null;
}
